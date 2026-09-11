# Plano de Implementação — Tracker Rocket League (Leok07/rocket-leok07-theuszib)

**Objetivo geral:** eliminar o único dado fabricado do dashboard (a simulação de MMR/rank), substituir por dados 100% reais já disponíveis ou capturáveis, remover débito técnico encontrado na auditoria e corrigir uma falha de segurança crítica.

**Como usar este documento:** cada fase é independente e sequencial. Execute na ordem. Ao final de cada fase, rode `npm run lint` e `npm run build` antes de avançar. Não pule a Fase 0.

---

## FASE 0 — Segurança crítica (bloqueante, fazer antes de qualquer outra coisa)

### 0.1 Revogar a chave exposta
- Arquivo: `src/lib/rapidapi-rank.ts`, linha 11.
- Existe uma chave RapidAPI real hardcoded como fallback: `DEFAULT_API_KEY = '9d9bc21862mshd4b1f1e6a0295b3p187138jsn20f40dd8a929'`.
- **Ação fora do código:** acessar o painel da RapidAPI e revogar/regenerar essa chave imediatamente. Ela está pública no histórico do Git desde o primeiro commit e deve ser tratada como comprometida, independente do que for feito no passo seguinte.

### 0.2 Remover o hardcode do código
- Editar `src/lib/rapidapi-rank.ts`:
  - Remover a constante `DEFAULT_API_KEY` inteiramente.
  - Alterar `const apiKey = process.env.RAPIDAPI_KEY || DEFAULT_API_KEY;` para `const apiKey = process.env.RAPIDAPI_KEY;`.
  - Se `apiKey` for `undefined`, a função já tem um caminho de retorno gracioso (`return cached?.data || null;`) — manter esse comportamento, apenas sem fallback para chave fixa.
- Confirmar que `.env.local` está no `.gitignore` (já está) e que `RAPIDAPI_KEY` está documentada em `.env.example` (já está).
- Adicionar a variável `RAPIDAPI_KEY` como secret no GitHub Actions (`.github/workflows/ci.yml`) e na Vercel, do mesmo jeito que `BALLCHASING_API_KEY` já está configurada no workflow.

### Critério de aceite da Fase 0
- `grep -rn "rapidapi" src/ | grep -i "msh"` não retorna nada.
- Build local sem `RAPIDAPI_KEY` no ambiente não quebra (apenas desativa a busca de rank ao vivo, graciosamente).

---

## FASE 1 — Remover débito técnico encontrado na auditoria

### 1.1 Deletar o arquivo órfão da raiz
- Deletar `stats-calculator.ts` (raiz do projeto, 1067 linhas).
- Esse arquivo é uma versão monolítica antiga e duplicada da lógica que já vive, de forma organizada, em `src/lib/stats/*` (re-exportada pelo barrel `src/lib/stats-calculator.ts`, de 11 linhas).
- Antes de deletar, rodar `grep -rn "from '\.\./stats-calculator'\|from '\.\./\.\./stats-calculator'" src/` para confirmar que nada importa esse arquivo pelo caminho relativo (checagem já feita na auditoria: nada importa).
- Depois de deletar, rodar `tsc --noEmit` para confirmar que o projeto ainda type-checa limpo.

### 1.2 Corrigir o launcher quebrado
- `iniciar-auto-uploader.bat` chama `node scripts/uploader.mjs`, mas a pasta `scripts/` não existe no repositório.
- Duas opções, escolher uma:
  - **(a)** Se o script de auto-upload de replays ainda é útil: recriar `scripts/uploader.mjs` com a lógica de upload automático para o Ballchasing (ou recuperar de uma cópia local caso o usuário ainda a tenha).
  - **(b)** Se não é mais necessário: remover `iniciar-auto-uploader.bat` do repositório.
- Decisão a confirmar com o autor do projeto antes de executar este item.

### Critério de aceite da Fase 1
- `git ls-files | grep -c "^stats-calculator.ts$"` retorna `0`.
- `npm run build` passa sem erros de tipo relacionados ao arquivo removido.

---

## FASE 2 — Capturar o dado real de patente que já chega e é descartado

### Contexto técnico
Cada replay do Ballchasing já retorna, por jogador, um campo `rank` (`PlayerRank`: `tier`, `division`, `name`, `id`) — a patente real gravada pelo próprio jogo no momento daquela partida. Esse campo está tipado em `src/types/ballchasing.ts` (linha 141, dentro de `PlayerInReplay`) mas **nunca é lido** em nenhum lugar do código atual.

### 2.1 Criar mapa de tiers do Ballchasing
- Novo arquivo: `src/lib/stats/rank-tiers.ts`.
- Exportar uma função `getBallchasingTierLabel(tier?: number, division?: number): { name: string; color: string } | null` que mapeia o `tier` numérico do Ballchasing (0 = Sem Rank, ..., Grand Champion, Supersonic Legend) para nome de exibição e uma cor (reaproveitar a paleta já usada em `RankEvolutionChart.tsx`, ex.: `RANK_THRESHOLDS`).
- Se o `rank.name` já vier preenchido diretamente do payload do Ballchasing, priorizar esse valor (mais confiável que recalcular a partir do `tier` numérico) e usar o mapa apenas como fallback.

### 2.2 Estender o tipo `SharedMatchItem`
- Arquivo: `src/types/dashboard.ts`.
- Adicionar campos opcionais:
```ts
p1RankName?: string;
p1RankTier?: number;
p1RankDivision?: number;
p2RankName?: string;
p2RankTier?: number;
p2RankDivision?: number;
```
- Opcionais porque nem toda partida (ex.: casual, ou replays antigos) necessariamente tem `rank` preenchido pelo Ballchasing.

### 2.3 Popular os campos ao montar `sharedMatches`
- Arquivo: `src/app/api/compare/route.ts`, dentro do loop que constrói `sharedMatches.push({...})` (por volta da linha 159-180).
- Adicionar, usando `p1Data.player.rank` e `p2Data.player.rank`:
```ts
p1RankName: p1Data.player.rank?.name,
p1RankTier: p1Data.player.rank?.tier,
p1RankDivision: p1Data.player.rank?.division,
p2RankName: p2Data.player.rank?.name,
p2RankTier: p2Data.player.rank?.tier,
p2RankDivision: p2Data.player.rank?.division,
```

### Critério de aceite da Fase 2
- Ao chamar `/api/compare`, o JSON de resposta contém `p1RankName`/`p2RankName` preenchidos para replays que tinham esse dado no Ballchasing (validar manualmente com 2-3 replays reais).

---

## FASE 3 — Reescrever o gráfico de evolução (o "elo")

### O que remover de `src/components/dashboard/RankEvolutionChart.tsx`
- Remover por completo o loop de simulação:
```ts
let p1RunningMmr = p1BaseMmr;
let p2RunningMmr = p2BaseMmr;
const chartData = chronoMatches.map((m, idx) => {
  const delta = isWin ? 9 : -9;
  p1RunningMmr += delta;
  ...
});
```
- Remover os textos gerados a partir dessa simulação: `resultText: 'Vitoria (+9 MMR)'` / `'Derrota (-9 MMR)'`.
- Remover a suposição de que o histórico inteiro pode ser reconstruído a partir de um único ponto (o MMR atual).

### O que construir no lugar

**3.1 — Card "MMR ao vivo" (dado real, já existente, só precisa virar destaque)**
- Usar `careerData?.player1?.rank2v2?.mmr` / `player2?.rank2v2?.mmr` diretamente (sem simulação).
- Manter a matemática de "pontos até a próxima divisão/patente" (`getRankDetailsFromMmr`) — essa parte já é honesta, pois parte de um número real. Apenas renomear labels para deixar claro que é uma estimativa baseada no MMR **atual ao vivo**, não uma projeção histórica.
- Rotular visualmente como **"MMR ao vivo • RapidAPI"**.

**3.2 — Timeline de progressão real de patente (novo, substitui o gráfico de linha fabricado)**
- Fonte: os novos campos `p1RankName`/`p1RankTier`/`p1RankDivision` por partida (Fase 2).
- Filtrar apenas partidas em que o campo de rank existe (`p1RankName` definido); partidas sem esse dado ficam de fora do gráfico (não inventar valor para elas).
- Renderizar como um gráfico de **degraus** (step chart) ou uma lista cronológica de "marcos de patente": cada vez que o tier/divisão muda entre uma partida e a seguinte, plotar um ponto de transição real (promoção ou rebaixamento efetivamente registrado pelo Ballchasing).
- Tooltip mostrando apenas dados reais: data da partida, patente registrada naquele momento, resultado (vitória/derrota) — sem inventar delta numérico de MMR por partida, porque essa informação não existe publicamente.
- Rotular visualmente como **"Patente real por partida • Ballchasing"**.

**3.3 — Limpeza dos limiares de patente**
- Os `ReferenceLine` fixos (995, 1075, 1111, 1146, 1181, 1216 MMR) valem apenas para a temporada competitiva atual. Mover `RANK_THRESHOLDS` para uma constante compartilhada (`src/lib/constants.ts` ou o novo `rank-tiers.ts`) com um comentário explícito indicando a partir de qual season os valores são válidos, para facilitar atualização quando a Psyonix mudar os brackets.

**3.4 — Estado vazio**
- Se não houver nenhuma partida com `rank` real capturado, mostrar apenas o card de MMR ao vivo (3.1) com uma mensagem explicando que o histórico de patente aparecerá conforme novas partidas com esse dado forem processadas — nunca preencher com dado inventado.

### Critério de aceite da Fase 3
- Busca por `+9` ou `-9` ou qualquer delta fixo de MMR não existe mais em `RankEvolutionChart.tsx`.
- O componente não realiza nenhuma soma acumulada (`+=`) sobre MMR.
- Toda vez que um número de MMR aparece na tela, ele vem diretamente de `rank2v2.mmr` (RapidAPI) e nunca de um cálculo derivado de partidas antigas.

---

## FASE 4 — Transformar em medição real ao longo do tempo (Firebase)

Isso resolve, de forma definitiva, a limitação de que não existe MMR numérico histórico público: passamos a registrar nós mesmos, a partir de agora, e o gráfico de linha real nasce organicamente com o uso.

### 4.1 Inicializar Firebase no projeto
- Novo arquivo: `src/lib/firebase.ts` — inicialização do app Firebase (Firestore) usando variáveis de ambiente (`NEXT_PUBLIC_FIREBASE_*` ou credenciais de servidor via `FIREBASE_*`, dependendo se a escrita será client-side ou em uma Route Handler — recomendado: escrita **apenas server-side**, dentro da própria API route, para não expor credenciais de escrita no client).
- Adicionar as novas variáveis necessárias ao `.env.example`.

### 4.2 Modelo de dados no Firestore
- Coleção: `mmr_snapshots`.
- Documento por leitura: `{ playerId, playerName, playlist: '2v2', rank: string, mmr: number, capturedAt: Timestamp }`.
- Um documento por jogador a cada vez que uma leitura **fresca** (não vinda do cache de 30 min) da RapidAPI acontecer — evita poluir a coleção com leituras repetidas de cache.

### 4.3 Gravar o snapshot
- Arquivo: `src/lib/rapidapi-rank.ts`, dentro de `fetchRapidApi2v2Rank`, no ponto em que um resultado novo (não vindo do cache) é obtido com sucesso (`rankCache.set(cacheKey, ...)`).
- Logo após popular o cache em memória, disparar (sem bloquear a resposta ao usuário) uma gravação no Firestore com o snapshot descrito em 4.2.

### 4.4 Novo endpoint de leitura do histórico real
- Novo arquivo: `src/app/api/mmr-history/route.ts`.
- `GET` que recebe `playerId` e retorna os últimos N snapshots ordenados por `capturedAt`.

### 4.5 Novo componente de gráfico real
- Novo componente: `src/components/dashboard/RealMmrHistoryChart.tsx`.
- Consome `/api/mmr-history` e desenha uma linha real de MMR ao longo do tempo (eixo X = datas reais de captura, eixo Y = MMR real).
- Enquanto houver poucos pontos (ex.: menos de 3), mostrar mensagem "Histórico real sendo construído — volte em alguns dias" em vez de um gráfico vazio ou enganoso.
- Este componente convive com o de patente por partida (3.2) e o card de MMR ao vivo (3.1); nenhum dos três inventa dado.

### Critério de aceite da Fase 4
- Após alguns dias de uso normal do app, a coleção `mmr_snapshots` no Firestore acumula documentos reais.
- `RealMmrHistoryChart` renderiza uma linha crescente/decrescente de MMR baseada inteiramente em leituras reais e datadas.

---

## Resumo de arquivos afetados

| Fase | Arquivo | Ação |
|---|---|---|
| 0 | `src/lib/rapidapi-rank.ts` | Remover chave hardcoded |
| 0 | `.github/workflows/ci.yml` | Adicionar secret `RAPIDAPI_KEY` |
| 1 | `stats-calculator.ts` (raiz) | Deletar |
| 1 | `iniciar-auto-uploader.bat` | Corrigir ou remover |
| 2 | `src/lib/stats/rank-tiers.ts` | Criar |
| 2 | `src/types/dashboard.ts` | Estender `SharedMatchItem` |
| 2 | `src/app/api/compare/route.ts` | Popular campos de rank real |
| 3 | `src/components/dashboard/RankEvolutionChart.tsx` | Reescrever (remover simulação) |
| 3 | `src/lib/constants.ts` | Centralizar `RANK_THRESHOLDS` |
| 4 | `src/lib/firebase.ts` | Criar |
| 4 | `src/app/api/mmr-history/route.ts` | Criar |
| 4 | `src/components/dashboard/RealMmrHistoryChart.tsx` | Criar |
| 4 | `.env.example` | Adicionar variáveis do Firebase |

## Notas para o agente que executar este plano
- Seguir as fases em ordem; a Fase 0 é bloqueante e deve ser feita antes de qualquer commit novo.
- Rodar `npm run lint && npm run build` ao final de cada fase antes de avançar para a próxima.
- Nunca commitar chaves reais — usar apenas `.env.local` (já no `.gitignore`) e secrets do provedor de deploy.
- Não inventar dados em nenhum componente novo: onde o dado real não existir, mostrar estado vazio/"aguardando dados" em vez de preencher com valor calculado por suposição.
