import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { AiCoachAnalysis, AiCoachRequestBody, AiCoachApiResponse } from '@/types/ai-coach';

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
    // Cache miss or read error
  }
  return null;
}

async function writeCache(cacheKey: string, data: AiCoachAnalysis): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ cacheKey, updatedAt: new Date().toISOString(), data }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to write AI coach cache to disk:', error);
  }
}

function generateHeuristicAnalysis(body: AiCoachRequestBody): AiCoachAnalysis {
  const p1 = body.player1;
  const p2 = body.player2;
  const summary = body.sharedMatchesSummary;

  const p1Goals = p1.stats?.core?.goals ?? p1.stats?.goals ?? 1.1;
  const p2Goals = p2.stats?.core?.goals ?? p2.stats?.goals ?? 0.9;
  const p1Saves = p1.stats?.core?.saves ?? p1.stats?.saves ?? 1.4;
  const p2Saves = p2.stats?.core?.saves ?? p2.stats?.saves ?? 1.8;
  const p1Demos = p1.stats?.demo?.inflicted ?? p1.stats?.demos ?? 1.2;
  const p2Demos = p2.stats?.demo?.inflicted ?? p2.stats?.demos ?? 0.8;

  const winRate = summary.totalMatches > 0 ? (summary.wins / summary.totalMatches) * 100 : 60;
  const synergyScore = Math.min(96, Math.max(72, Math.round(75 + (winRate - 50) * 0.4 + (p1Saves + p2Saves) * 2.5)));

  return {
    synergy: {
      score: synergyScore,
      verdict: synergyScore >= 85 ? 'Sinergia de Elite Competitiva' : 'Sintonia Solida com Ajuste de Cobertura',
      summary: `A dupla ${p1.name} e ${p2.name} apresenta uma divisao clara de funcoes no 2v2: ${p1Goals >= p2Goals ? p1.name : p2.name} assume maior agressividade no terco final, enquanto ${p2Saves >= p1Saves ? p2.name : p1.name} ancora as rotacoes defensivas.`
    },
    macroOverview: {
      matchCount: summary.totalMatches,
      winRate: Math.round(winRate),
      offensiveDynamics: `Taxa combinada de ${(p1Goals + p2Goals).toFixed(1)} gols por partida na amostra de ${summary.totalMatches} jogos. O volume ofensivo depende de pressoes rapidas no backboard adversario e recuperacao de posse em profundidade.`,
      defensiveAnchor: `Defesa solida com media combinada de ${(p1Saves + p2Saves).toFixed(1)} defesas por jogo. O ponto de maior estabilidade ocorre quando o segundo homem mantem shadow defense paciente em vez de contestar precipitadamente no canto.`,
      boostEconomy: 'A gestao de boost demonstra boa distribuicao de pads pequenos nas transicoes, mas momentos de pressao prolongada ainda geram starvation no terceiro terco do campo.',
      keyStrengths: [
        'Excelente recuperacao em shadow defense e protecao de backboard.',
        'Eficiencia alta em contra-ataques rapidos apos interceptacao no meio-campo.',
        'Pressao fisica consistente com demolicoes taticas que abrem espaco na rotina defensiva rival.'
      ],
      bottlenecks: [
        'Overcommit ocasional em 50/50s ofensivos quando o segundo homem se posiciona muito adiantado.',
        'Hesitacao no desafio aereo imediato na primeira trave, gerando situacoes de save sob pressao extrema.',
        'Consumo de boost de 100 nas alas defensivas sem necessidade imediata de velocidade supersonica.'
      ]
    },
    recentFormMicro: {
      matchCount: summary.recentMatchesCount || 5,
      trend: winRate >= 55 ? 'alta' : 'estavel',
      keyShift: `Nas ultimas ${summary.recentMatchesCount || 5} partidas, houve uma aceleracao no ritmo de transicao e maior rigor na marcacao de 2º homem.`,
      hotPlayer: `${p1Goals >= p2Goals ? p1.name : p2.name} destacou-se pela precisao nas finalizacoes e interceptacoes aereas decisivas.`,
      criticalNotice: 'Manter a comunicacao de reset de boost para evitar duplos recuos ao mesmo corner.'
    },
    leakageDiagnosis: [
      {
        title: 'Vazamento em Double Commit no Corner Defensivo',
        severity: 'critica',
        metricTrigger: 'Indices de proximidade defensiva inferiores a 1000 unidades em bolas de canto.',
        impact: 'Deixa a baliza totalmente desprotegida para rebotes centrais fáceis.',
        correction: 'Regra estrita de 2v2: o primeiro homem contesta na parede e o segundo homem protege obrigatoriamente a trave posterior.'
      },
      {
        title: 'Starvation em Transicao Agressiva',
        severity: 'moderada',
        metricTrigger: 'Frequencia de tempo em zero boost durante contra-ataques.',
        impact: 'Perda de momentum e incapacidade de recuperar posicao supersonica.',
        correction: 'Traçar rota ativa pelos pads de 12 centrais ao rotacionar de volta a defesa.'
      },
      {
        title: 'Hesitacao na Leitura de Backboard',
        severity: 'leve',
        metricTrigger: 'Contestacoes tardias em bolas altas no proprio backboard.',
        impact: 'Permite que o atacante rival arme double touch ou passe livre no ar.',
        correction: 'O defensor na trave posterior deve subir antecipadamente para afastar antes do quique.'
      }
    ],
    roadToGc: [
      {
        step: 'Fase 1: Consolidacao de Champion II para Champion III',
        priority: 'Dominio de 50/50s e recuperacao rapida ao chao',
        drill: 'Treino personalizado de Shadow Defense & Saves Reversos',
        targetMetric: 'Reduzir media de gols sofridos para menos de 1.8 por partida.'
      },
      {
        step: 'Fase 2: Transicao para Grand Champion I',
        priority: 'Velocidade de tomada de decisao sem desperdicio de boost',
        drill: 'Rotacao de Backboard e Passes Diretos em Paredes Laterais',
        targetMetric: 'Aumentar a conversao de remates no alvo para acima de 48%.'
      }
    ],
    gameplanRules: [
      {
        number: 1,
        title: 'Nenhum Desafio em Canto Ofensivo pelo 2º Homem',
        trigger: 'Quando a bola for dividida no corner de ataque do adversario.',
        action: 'O segundo jogador deve estagnar no circulo central para cortar o rebote longo.'
      },
      {
        number: 2,
        title: 'Primeiro Toque com Intencao de Posse',
        trigger: 'Apos interceptacao no meio-campo sem pressao imediata.',
        action: 'Evitar dar chutao para frente; controlar com drible de chao ou bounce dribble.'
      },
      {
        number: 3,
        title: 'Cobertura de Backboard na Trave Longe',
        trigger: 'Pressao adversaria com cruzamentos aéreos.',
        action: 'O goleiro deve manter posicao na trave contraria para ter visao panoramica do corte.'
      }
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      cacheKey: body.cacheKey,
      totalMatchesAnalyzed: summary.totalMatches,
      source: 'heuristic',
      modelUsed: 'Motor Heuristico Tatico de 2v2'
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: AiCoachRequestBody = await req.json();

    if (!body || !body.cacheKey) {
      return NextResponse.json(
        { success: false, error: 'Chave de cache obrigatoria ausente' },
        { status: 400 }
      );
    }

    // 1. Verificar cache persistente em disco
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

    // 2. Chamar Gemini API se houver chave configurada
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY nao encontrada. Usando motor tatico heuristico.');
      const fallback = generateHeuristicAnalysis(body);
      await writeCache(body.cacheKey, fallback);
      return NextResponse.json<AiCoachApiResponse>({
        success: true,
        cached: false,
        data: fallback
      });
    }

    const p1 = body.player1;
    const p2 = body.player2;
    const summary = body.sharedMatchesSummary;

    const systemPrompt = `Voce e o treinador tatico de elite de Rocket League (especialista em 2v2 no rank Champion / Grand Champion).
Sua missao e analisar com rigor analitico as estatisticas da dupla ${p1.name} e ${p2.name}.
Amostra geral: ${summary.totalMatches} partidas conjuntas (Vitorias: ${summary.wins}, Derrotas: ${summary.losses}).
Recorte recente: ${summary.recentMatchesCount} ultimas partidas.

Estatisticas de ${p1.name}:
${JSON.stringify(p1.stats, null, 2)}

Estatisticas de ${p2.name}:
${JSON.stringify(p2.stats, null, 2)}

DIRETRIZES FUNDAMENTAIS:
1. Nao utilize NENHUM emoji em todo o texto (proibicao estrita de emojis).
2. Forneca analise tecnica, fria e altamente aplicavel ao 2v2 moderno (rotacao de 1o/2o homem, shadow defense, boost economy, 50/50s, backboard defense).
3. Divida a analise claramente entre a visao MACRO (amostra de 20 partidas) e a visao MICRO (partidas mais recentes / trend imediata).
4. Forneca um diagnostico de vazamentos (onde a dupla leva gols bobos), um roteiro realista para alcancar Grand Champion e 3 regras de ouro taticas.
5. Retorne OBRIGATORIAMENTE um objeto JSON estritamente compativel com o seguinte formato:

{
  "synergy": {
    "score": 88,
    "verdict": "Sintonia Ofensiva Alta com Cobertura Segura",
    "summary": "Analise sintetica de 2 frases sobre o encaixe da dupla."
  },
  "macroOverview": {
    "matchCount": 20,
    "winRate": 60,
    "offensiveDynamics": "Descricao aprofundada da construcao ofensiva nos 20 jogos.",
    "defensiveAnchor": "Descricao da protecao de gol e rotacoes defensivas.",
    "boostEconomy": "Descricao da disciplina com pads pequenos e starvation.",
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
    "criticalNotice": "Alerta de atencao imediato para o proximo jogo."
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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini API returned error:', response.status, errText);
        const fallback = generateHeuristicAnalysis(body);
        await writeCache(body.cacheKey, fallback);
        return NextResponse.json<AiCoachApiResponse>({
          success: true,
          cached: false,
          data: fallback
        });
      }

      const jsonResponse = await response.json();
      const generatedText = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('Gemini response missing text');
      }

      const parsedData = JSON.parse(generatedText);

      // Injetar metadados
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

      // Salvar em cache de disco persistente
      await writeCache(body.cacheKey, finalAnalysis);

      return NextResponse.json<AiCoachApiResponse>({
        success: true,
        cached: false,
        data: finalAnalysis
      });
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.error('Erro na chamada da API Gemini, usando motor de contingencia:', apiError?.message || apiError);
      const fallback = generateHeuristicAnalysis(body);
      await writeCache(body.cacheKey, fallback);
      return NextResponse.json<AiCoachApiResponse>({
        success: true,
        cached: false,
        data: fallback
      });
    }
  } catch (error: any) {
    console.error('Erro no handler da rota AI Coach:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
