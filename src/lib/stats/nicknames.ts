export const NICKNAME_DATABASE = {
  negative: [
    'Cone de Trânsito',
    'Chute Fofo',
    'Fantasma em Campo',
    'Fominha Ineficiente',
    'Tartaruga Motorizada',
    'Falso Garçom',
    'Ímã de Demolição',
    'Sem Boost Permanente',
    'Afobado no Double-Commit',
    'Descalibrado da Arena',
  ],
  striker: [
    'Artilheiro Implacável',
    'Sniper da Gaveta',
    'Predador de Área',
    'Carrasco dos Goleiros',
    'Matador Sangue-Frio',
    'Homem-Gol',
    'Canhão de Octane',
    'Terror da Rede',
  ],
  guardian: [
    'Muralha Intransponível',
    'Goleiro de Ferro',
    'Guardião da Trave',
    'Último Homem',
    'Portão Blindado',
    'Salvador da Pátria',
    'Cerberus do Gol',
    'Escudo de Titânio',
  ],
  playmaker: [
    'Maestro do Meio-Campo',
    'Arquiteto das Jogadas',
    'Visão de Raio-X',
    'Garçom de Elite',
    'Motorzinho do Time',
    'Distribuidor de Passes',
    'Cérebro da Dupla',
    'Engenheiro Tático',
  ],
  mechanic: [
    'Mecânico Aéreo',
    'Mago do Air Roll',
    'Acrobata dos Céus',
    'Malabarista de Bola',
    'Rei do Flip Reset',
    'Mestre do Drible',
    'Freestyler Letal',
    'Especialista em Ceiling',
  ],
  speedster: [
    'Relâmpago Supersônico',
    'Foguete Sem Freio',
    'Turbina Ligada',
    'Velocista Noturno',
    'Flash da Arena',
    'Motor V8',
    'Bala Humana',
    'Vento Supersônico',
  ],
  brawler: [
    'Demolidor Implacável',
    'Ladrão de Boost',
    'Trator da Arena',
    'Tanque de Guerra',
    'Aspirador de Big Boost',
    'Predador de Chassi',
    'Derrubador de Paredes',
    'Pesadelo Físico',
  ],
  legend: [
    'Gênio Incontestável',
    'Estrela do Clutch',
    'MVP Indiscutível',
    'Lenda da Arena',
    'O Maestro Supremo',
    'Titã dos Campeonatos',
    'Inabalável',
    'O Senhor do Jogo',
  ],
};

export function selectDeterministicNickname(
  playerName: string,
  data: {
    ovr: number;
    pac: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
    avgG: number;
    avgSv: number;
    avgA: number;
    avgSh: number;
    shootAcc: number;
    recentWinRate: number;
    recentMvps: number;
    dInf: number;
    superPct: number;
    avgScore: number;
    position: 'ATA' | 'DEF';
    isGoat: boolean;
    recentMatchesCount: number;
  }
): { nickname: string; category: string; isNegative: boolean } {
  // Hash function based on player name and rounded stat tiers
  // Rounding stats by step of 4-5 prevents flickering across F5 updates
  const statBracket = `${playerName.toLowerCase()}_ovr${Math.floor(data.ovr / 4)}_p${data.position}_sh${Math.floor(data.sho / 5)}_df${Math.floor(data.def / 5)}_mvp${data.recentMvps}`;
  let hash = 0;
  for (let i = 0; i < statBracket.length; i++) {
    hash = (hash << 5) - hash + statBracket.charCodeAt(i);
    hash |= 0;
  }
  const getIndex = (arrLength: number) => Math.abs(hash) % arrLength;

  // 1. Check for Negative Phase (underperforming)
  const isNegative =
    data.recentMatchesCount >= 3 &&
    ((data.recentWinRate <= 25 && data.ovr <= 72) ||
      (data.avgG === 0 && data.avgA === 0 && data.avgScore < 230) ||
      (data.shootAcc < 15 && data.avgSh >= 2.5) ||
      (data.avgScore < 200 && data.recentMvps === 0));

  if (isNegative) {
    const list = NICKNAME_DATABASE.negative;
    return {
      nickname: list[getIndex(list.length)],
      category: 'Fase Crítica',
      isNegative: true,
    };
  }

  // 2. Legend / GOAT / Elite Tier
  if (data.isGoat || data.ovr >= 92 || data.recentMvps >= 4) {
    const list = NICKNAME_DATABASE.legend;
    return {
      nickname: list[getIndex(list.length)],
      category: 'Lendário',
      isNegative: false,
    };
  }

  // 3. Category based on dominant playstyle & performance
  let categoryKey: keyof typeof NICKNAME_DATABASE = 'playmaker';
  let categoryLabel = 'Criação';

  if (data.position === 'ATA' || data.avgG >= 1.2 || (data.sho >= 84 && data.sho >= data.def + 6)) {
    categoryKey = 'striker';
    categoryLabel = 'Artilharia';
  } else if (data.position === 'DEF' || data.avgSv >= 1.7 || (data.def >= 84 && data.def >= data.sho + 6)) {
    categoryKey = 'guardian';
    categoryLabel = 'Muralha Defensiva';
  } else if (data.avgA >= 1.2 || (data.pas >= 82 && data.pas >= data.sho + 4)) {
    categoryKey = 'playmaker';
    categoryLabel = 'Maestro / Visão';
  } else if (data.dri >= 82 || data.sho >= 80) {
    categoryKey = 'mechanic';
    categoryLabel = 'Mecânica Aérea';
  } else if (data.pac >= 83 || data.superPct >= 17) {
    categoryKey = 'speedster';
    categoryLabel = 'Velocidade / Ritmo';
  } else if (data.dInf >= 1.2 || data.phy >= 82) {
    categoryKey = 'brawler';
    categoryLabel = 'Físico / Demolição';
  } else {
    // Fallback: Pick by highest attribute
    const maxStat = Math.max(data.pac, data.sho, data.pas, data.dri, data.def, data.phy);
    if (maxStat === data.def) {
      categoryKey = 'guardian';
      categoryLabel = 'Defensivo';
    } else if (maxStat === data.sho) {
      categoryKey = 'striker';
      categoryLabel = 'Ofensivo';
    } else if (maxStat === data.pac) {
      categoryKey = 'speedster';
      categoryLabel = 'Velocidade';
    } else if (maxStat === data.dri) {
      categoryKey = 'mechanic';
      categoryLabel = 'Mecânica';
    } else if (maxStat === data.phy) {
      categoryKey = 'brawler';
      categoryLabel = 'Físico';
    } else {
      categoryKey = 'playmaker';
      categoryLabel = 'Armação';
    }
  }

  const list = NICKNAME_DATABASE[categoryKey];
  return {
    nickname: list[getIndex(list.length)],
    category: categoryLabel,
    isNegative: false,
  };
}
