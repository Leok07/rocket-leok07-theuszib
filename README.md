# Tracker Rocket League - Telemetria & Comparativo 2v2 (Leok07 vs Theuszrib)

Aplicacao web completa para rastreamento de desempenho, analise telemetrica e comparativo em tempo real de partidas de Rocket League em Duplas (2v2), alimentada pela API do Ballchasing.com.

---

## Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Estilizacao:** Tailwind CSS (Dark Mode Preto: `#090a0f`)
- **Icones:** Lucide Icons
- **Graficos:** Recharts (Radar Pentagonal de Estilo de Jogo, Linhas de Evolucao Temporal)
- **Backend / Proxy:** Next.js Route Handlers (`/api/compare`) com controle de taxa de requisicoes (pacing de 550ms, retry em 429 e cache em memoria).

---

## Funcionalidades Principais

### 1. Resumo Geral de Partidas
- Contador de Vitorias/Derrotas (W/L) e Win Rate percentual.
- Media de gols, assistencias, defesas (saves) e chutes por partida.
- Precisao de finalizacao (Shooting Percentage) e pontuacao media.
- Total de MVPs obtidos na sessao.

### 2. Cards EA FC Ultimate Dupla
- Cartoes colecionaveis dinamicos com 10 tiers de raridade (GOAT, Icon TOTW, Icon Hero, Icon, TOTW Hero, Hero, TOTW, Gold, Silver, Bronze).
- Atributos FIFA/EA FC: PAC (Ritmo), SHO (Chute), PAS (Passe), DRI (Drible), DEF (Defesa) e PHY (Fisico).
- Deteccao automatica e dinamica da funcao em campo: ATA (Ataque) vs DEF (Defensor), equilibrando 50% atributos da carta e 50% desempenho em jogo.
- OVR com foco de 65% no atributo primario da posicao.
- Sistema de apelidos estavel baseado na fase atual do jogador.

### 3. Radar de Estilo de Jogo (Playstyle Radar)
- Grafico pentagonal comparando 5 eixos normalizados (0 a 100):
  - Agressividade
  - Contencao Defensiva
  - Eficiencia Mecanica
  - Suporte e Posicionamento
  - Controle de Boost

### 4. Evolucao Temporal & Tendencias (Partida a Partida)
- Graficos interativos para acompanhar a consistencia ao longo dos jogos da dupla:
  - Gols por partida
  - Saves por partida
  - Boost Por Minuto (BPM)
  - Pontuacao (Score)

### 5. Gestao & Economia de Boost
- Boost Por Minuto (BPM) e Boost Coletado Por Minuto (BCPM).
- Quantidade media de boost no tanque.
- Roubo de pads grandes (100) e pequenos do adversario.
- Desperdicio de boost em velocidade supersonica.
- Tempo com boost zerado (0%) e tanque cheio (100%).

### 6. Posicionamento Espacial & Rotacao (2v2)
- Percentual de tempo no terco defensivo, neutro e ofensivo.
- Tempo posicionado atras da linha da bola (Goal-Side) vs a frente da bola.
- Espacamento medio com o parceiro de dupla em unreal units (uu).
- Tempo atuando como Ultimo Homem (Last Man) e Primeiro Homem (1st Man).

### 7. Mecanica, Movimentacao & Fisicalidade
- Velocidade media e tempo em velocidade supersonica.
- Distribuicao por elevacao: Chao/Parede, Ar Baixo e Ar Alto (Aerials).
- Frequencia de powerslides (derrapagens de recuperacao).
- Demos infligidos, sofridos e ratio I/S.

---

## Estrutura do Projeto

```
tracker-rocket/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── compare/route.ts       # Rota principal de comparacao e telemetria 2v2
│   │   │   ├── player/route.ts        # Rota utilitaria de busca individual
│   │   │   ├── ping/route.ts          # Validacao de status da API
│   │   │   └── replays/               # Rotas utilitarias de replays
│   │   ├── layout.tsx                 # Root layout com tema dark
│   │   ├── page.tsx                   # Dashboard principal completo
│   │   └── globals.css                # Estilos globais e tokens
│   ├── components/
│   │   ├── CompareHeader.tsx          # Header de comparacao
│   │   ├── CompareSection.tsx         # Secoes comparativas de telemetria
│   │   ├── FutCardsSection.tsx        # Secao de cartoes EA FC
│   │   ├── PlayerCardFUT.tsx          # Componente visual do cartao FUT
│   │   ├── SharedMatchesList.tsx      # Historico de partidas jogadas em conjunto
│   │   ├── dashboard/
│   │   │   ├── PlaystyleRadar.tsx     # Radar pentagonal
│   │   │   └── TrendChart.tsx         # Graficos de evolucao temporal
│   │   └── ui/                        # Card, StatCard, Badge, Skeleton
│   ├── lib/
│   │   ├── ballchasing.ts             # Cliente HTTP com timeout e AbortController
│   │   ├── replay-fetcher.ts          # Busca sequencial com pacing e retry 429
│   │   ├── constants.ts               # Identificadores e configuracoes dos jogadores
│   │   ├── fut-tiers.ts               # Estilos e gradientes dos tiers dos cards
│   │   ├── mock-data.ts               # Dados simulados para modo demo
│   │   ├── stats/                     # Motor modular de calculos estatisticos
│   │   │   ├── tuning-constants.ts    # Constantes e pesos de calibracao do OVR
│   │   │   ├── player-matching.ts     # Identificacao estrita do jogador nos replays
│   │   │   ├── nicknames.ts           # Banco deterministico de apelidos
│   │   │   ├── radar.ts               # Calculo dos eixos do radar
│   │   │   ├── fut-cards.ts           # Calculo de notas e tier dos cards FUT
│   │   │   └── aggregation.ts         # Agregador geral de telemetria e sessoes
│   │   ├── stats-calculator.ts        # Barrel export para retrocompatibilidade
│   │   └── utils.ts                   # Formatadores de texto, data e numeros
│   └── types/
│       ├── api.ts
│       ├── ballchasing.ts
│       └── dashboard.ts
```

---

## Configuracao e Execucao Local

### 1. Clonar o repositorio e instalar dependencias:
```bash
git clone https://github.com/Leok07/rocket-leok07-theuszib.git
cd tracker-rocket
npm install
```

### 2. Variavel de Ambiente:
Crie um arquivo `.env.local` na raiz com sua chave do Ballchasing:
```env
BALLCHASING_API_KEY=sua_chave_aqui
```

### 3. Rodar em desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000`.

---

## Deploy na Vercel

1. Suba as alteracoes para o GitHub:
```bash
git add .
git commit -m "feat: atualizacao v1.4.0 com graficos de tendencia e motor modular"
git push origin main
```

2. No painel da [Vercel](https://vercel.com):
   - Importe o repositorio `tracker-rocket`.
   - Em **Environment Variables**, adicione `BALLCHASING_API_KEY` com o valor da sua chave.
   - Clique em **Deploy**.
