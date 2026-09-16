import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { AiCoachAnalysis, AiCoachRequestBody, AiCoachApiResponse } from '@/types/ai-coach';
import { GEMINI_CONFIG } from '@/lib/constants';

// Eleva o teto de execução da function na Vercel (default é 10-15s dependendo do plano,
// menor que o timeout interno abaixo — sem isso a plataforma mata a função antes do controller).
export const maxDuration = 60;

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'ai-coach-cache.json');

async function readCache(cacheKey: string): Promise<AiCoachAnalysis | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.cacheKey === cacheKey && parsed.data) {
      return parsed.data;
    }
  } catch {
    // Cache miss or file doesn't exist yet
  }
  return null;
}

async function writeCache(cacheKey: string, data: AiCoachAnalysis): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ cacheKey, updatedAt: data.metadata.generatedAt, data }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Falha ao gravar cache da IA em disco:', error);
  }
}

async function resolveApiKey(): Promise<string> {
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }

  // Fallback seguro: ler do .env.local ou .env diretamente do disco no servidor
  const envFiles = ['.env.local', '.env'];
  for (const envFile of envFiles) {
    try {
      const filePath = path.join(process.cwd(), envFile);
      const content = await fs.readFile(filePath, 'utf-8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
      if (match && match[1]) {
        const val = match[1].trim().replace(/^["']|["']$/g, '');
        if (val) {
          process.env.GEMINI_API_KEY = val;
          return val;
        }
      }
    } catch {
      // Arquivo nao encontrado, tenta o proximo
    }
  }

  return (GEMINI_CONFIG.apiKey || '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body: AiCoachRequestBody = await req.json();

    if (!body || !body.cacheKey) {
      return NextResponse.json(
        { success: false, error: 'Chave de cache obrigatoria ausente.' },
        { status: 400 }
      );
    }

    // 1. Verificar cache persistente em disco (recupera analise anterior se as partidas forem as mesmas)
    if (!body.forceRefresh) {
      const cachedData = await readCache(body.cacheKey);
      if (cachedData) {
        return NextResponse.json<AiCoachApiResponse>({
          success: true,
          cached: true,
          data: cachedData
        });
      }
    }

    // 2. Validar presenca da chave de API
    const apiKey = await resolveApiKey();
    if (!apiKey) {
      return NextResponse.json<AiCoachApiResponse>(
        {
          success: false,
          cached: false,
          error: 'Chave GEMINI_API_KEY nao configurada no servidor (.env ou .env.local). Nao ha presets alternativos.'
        },
        { status: 500 }
      );
    }

    const p1 = body.player1;
    const p2 = body.player2;
    const summary = body.sharedMatchesSummary;

    // Prompt estrito de analise de telemetria espacial e tática para 2v2
    const systemPrompt = `Voce e o treinador tatico de inteligencia artificial de Rocket League (especialista em 2v2 Champion/Grand Champion).
Sua missao e analisar com rigor matematico e tatico as estatisticas reais e a telemetria de campo da dupla ${p1.name} e ${p2.name}.
Amostra geral: ${summary.totalMatches} partidas conjuntas (Vitorias: ${summary.wins}, Derrotas: ${summary.losses}).
Recorte recente: ${summary.recentMatchesCount} partidas imediatas.

Telemetria de ${p1.name}:
${JSON.stringify(p1.stats, null, 2)}

Telemetria de ${p2.name}:
${JSON.stringify(p2.stats, null, 2)}

DIRETRIZES FUNDAMENTAIS DE RESPOSTA:
1. NAO UTILIZE NENHUM EMOJI em todo o texto (proibicao absoluta de emojis).
2. Sem frases genericas ou textos prontos: interprete exatamente as porcentagens de terco defensivo/neutro/ofensivo, behind_ball, zero_boost e distance_to_mates de cada um.
3. Analise o campinho tatico 2D apontando explicitamente ACERTOS e ERROS de posicionamento no campo:
   - Coordenadas x e y de 0 a 100 no campo (onde x: 0 = lado esquerdo, 100 = lado direito; y: 0 = gol proprio defensivo, 50 = meio campo, 100 = gol adversario ofensivo).
   - Indique acertos taticos comprovados pelos numeros (ex: cobertura na trave longe, shadow defense solida, pressao em 50/50).
   - Indique erros taticos comprovados pelos numeros (ex: double commit em corner ofensivo, demora no reset para pegar boost, vacuo defensivo no centro).
4. Retorne OBRIGATORIAMENTE um JSON estritamente compativel com esta estrutura:

{
  "synergy": {
    "score": 88,
    "verdict": "Sintonia Ofensiva Alta com Cobertura Segura",
    "summary": "Analise sintetica de 2 frases sobre o encaixe da dupla."
  },
  "macroOverview": {
    "matchCount": 20,
    "winRate": 60,
    "offensiveDynamics": "Descricao da construcao ofensiva nos 20 jogos.",
    "defensiveAnchor": "Descricao da protecao de gol e rotacoes defensivas.",
    "boostEconomy": "Descricao da gestao de boost, pads pequenos e starvation.",
    "keyStrengths": [
      "Ponto forte 1",
      "Ponto forte 2",
      "Ponto forte 3"
    ],
    "bottlenecks": [
      "Gargalo 1",
      "Gargalo 2",
      "Gargalo 3"
    ]
  },
  "recentFormMicro": {
    "matchCount": 5,
    "trend": "alta",
    "keyShift": "Mudanca tatica notada nas partidas mais recentes.",
    "hotPlayer": "Quem esta performando melhor recentemente e por que.",
    "criticalNotice": "Alerta imediato para o proximo jogo."
  },
  "pitchAnalysis": {
    "spatialVerdict": "Diagnostico executivo da ocupacao do campo e distribuicao espacial da dupla.",
    "p1SpatialSummary": "Como ${p1.name} se posiciona (terco prioritario, proximidade da bola e papel na rotacao).",
    "p2SpatialSummary": "Como ${p2.name} se posiciona (terco prioritario, proximidade da bola e papel na rotacao).",
    "tacticalSuccesses": [
      {
        "id": "hit-1",
        "type": "acerto",
        "title": "Titulo do acerto",
        "zone": "Zona no campo (ex: Corner Defensivo, Meio-Campo)",
        "description": "Explicacao tatica do acerto",
        "x": 30,
        "y": 15,
        "player": "${p1.name}"
      },
      {
        "id": "hit-2",
        "type": "acerto",
        "title": "Titulo do segundo acerto",
        "zone": "Zona no campo",
        "description": "Explicacao tatica do acerto",
        "x": 50,
        "y": 75,
        "player": "${p2.name}"
      }
    ],
    "tacticalErrors": [
      {
        "id": "err-1",
        "type": "erro",
        "title": "Titulo do erro de posicionamento",
        "zone": "Zona no campo (ex: Corner Ofensivo, Centro do Gol)",
        "description": "Explicacao tatica do erro e como consertar",
        "severity": "critica",
        "x": 85,
        "y": 90,
        "player": "Dupla"
      },
      {
        "id": "err-2",
        "type": "erro",
        "title": "Titulo do segundo erro",
        "zone": "Zona no campo",
        "description": "Explicacao tatica do erro",
        "severity": "moderada",
        "x": 50,
        "y": 45,
        "player": "${p1.name}"
      }
    ],
    "zones": [
      {
        "id": "def-third",
        "name": "Terco Defensivo",
        "p1Presence": 38,
        "p2Presence": 45,
        "status": "equilibrado",
        "tacticalAdvice": "Orientacao tatica para a zona defensiva."
      },
      {
        "id": "mid-third",
        "name": "Meio-Campo & Transicao",
        "p1Presence": 35,
        "p2Presence": 32,
        "status": "dominado",
        "tacticalAdvice": "Orientacao tatica para o meio campo."
      },
      {
        "id": "off-third",
        "name": "Terco Ofensivo",
        "p1Presence": 27,
        "p2Presence": 23,
        "status": "vazio",
        "tacticalAdvice": "Orientacao tatica para a finalizacao."
      }
    ]
  },
  "leakageDiagnosis": [
    {
      "title": "Titulo do vazamento",
      "severity": "critica",
      "metricTrigger": "Qual estatistica denuncia esse erro",
      "impact": "O que acontece em jogo",
      "correction": "Como corrigir imediatamente"
    }
  ],
  "roadToGc": [
    {
      "step": "Etapa do Rank",
      "priority": "Foco prioritario",
      "drill": "Exercicio ou treino recomendado",
      "targetMetric": "Meta quantitativa"
    }
  ],
  "gameplanRules": [
    {
      "number": 1,
      "title": "Nome da Regra",
      "trigger": "Quando isso acontecer em campo",
      "action": "Faca esta acao imediata"
    }
  ]
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.3
      }
    };

    const controller = new AbortController();
    // 55s: deixa margem dentro do maxDuration=60 da function, mas dá tempo real
    // para o Gemini gerar o JSON extenso com "thinking" habilitado (na prática
    // esse payload passa fácil dos 20s antigos).
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google Gemini API error:', response.status, errText);
      return NextResponse.json<AiCoachApiResponse>(
        {
          success: false,
          cached: false,
          error: `Falha na conexao com a IA do Google Gemini (Status ${response.status}). Nao ha dados substitutos.`
        },
        { status: 502 }
      );
    }

    const jsonResponse = await response.json();
    const generatedText = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json<AiCoachApiResponse>(
        {
          success: false,
          cached: false,
          error: 'A IA nao retornou conteudo textual valido. Tente novamente.'
        },
        { status: 502 }
      );
    }

    const parsedData = JSON.parse(generatedText);

    // Salvar data estrita de geracao (congelada no tempo)
    const finalAnalysis: AiCoachAnalysis = {
      ...parsedData,
      metadata: {
        generatedAt: new Date().toISOString(),
        cacheKey: body.cacheKey,
        totalMatchesAnalyzed: summary.totalMatches,
        source: 'gemini',
        modelUsed: 'Google Gemini 3.6 Flash'
      }
    };

    // Gravar no cache em disco
    await writeCache(body.cacheKey, finalAnalysis);

    return NextResponse.json<AiCoachApiResponse>({
      success: true,
      cached: false,
      data: finalAnalysis
    });
  } catch (error: any) {
    console.error('Erro no processamento da rota AI Coach:', error);

    // O abort do controller acima chega aqui como AbortError/"This operation was
    // aborted" — tratar explicitamente em vez de vazar a mensagem técnica crua.
    if (error?.name === 'AbortError') {
      return NextResponse.json<AiCoachApiResponse>(
        {
          success: false,
          cached: false,
          error: 'A IA demorou mais que o esperado para responder. Tente novamente em instantes.'
        },
        { status: 504 }
      );
    }

    return NextResponse.json<AiCoachApiResponse>(
      {
        success: false,
        cached: false,
        error: error?.message || 'Erro interno ao processar a analise de IA.'
      },
      { status: 500 }
    );
  }
}
