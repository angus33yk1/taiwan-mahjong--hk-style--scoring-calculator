/**
 * 港式台灣麻雀食糊完整邏輯流程
 * 17張牌制 - 底番5番 - 雞胡30番
 */

// ============================================================================
// 數據結構定義
// ============================================================================

export interface Tile {
  suit: 'wan' | 'tong' | 'suo' | 'zi';
  value?: number;        // 1-9 for wan/tong/suo
  wind?: 'east' | 'south' | 'west' | 'north';
  dragon?: 'zhong' | 'fa' | 'bai';
}

export interface Meld {
  type: 'chow' | 'pung' | 'pair';
  tiles: Tile[];
  suit?: string;
  value?: number;
  concealed: boolean;    // 是否暗（門清）
}

export interface HandPattern {
  chows: Meld[];         // 順子
  pungs: Meld[];         // 刻子
  pair: Meld | null;     // 對子（眼）
  tiles: Tile[];         // 所有牌
}

export interface GameState {
  // 手牌部分
  handTiles: Tile[];           // 手牌（暗牌）
  exposedMelds: Meld[];        // 上/碰的牌組
  concealedKongs: Meld[];      // 暗槓
  exposedKongs: Meld[];        // 明槓
  flowers: Tile[];             // 花牌
  winningTile: Tile;           // 胡牌

  // 座位與風位
  seatWind: 'east' | 'south' | 'west' | 'north';
  roundWind: 'east' | 'south' | 'west' | 'north';

  // 胡牌方式
  selfDraw: boolean;           // 自摸
  lastTile: boolean;           // 海底撈月
  kongDraw: boolean;           // 槓上開花
  flowerDraw: boolean;         // 花上自摸
  robKong: boolean;            // 搶槓
  kongOnKong: boolean;         // 槓上槓
  robKongOnKong: boolean;      // 搶槓上槓

  // 其他狀態
  listening: boolean;          // 是否叫過聽牌（叮）
  listeningOneShot: boolean;   // 叮(一發)
  isDealer: boolean;           // 是否莊家
  dealerStreak: number;        // 連莊數（0=沒連莊）

  // 擴充特殊事件
  heavenlyWin?: boolean;       // 天胡
  earthlyWin?: boolean;        // 地胡
  humanWin?: boolean;          // 人胡
  doubleWin?: boolean;         // 雙響
  tripleWin?: boolean;         // 三響
  isFullBeggar?: boolean;      // 全求人
  isSemiBeggar?: boolean;      // 半求人
  eightImmortals?: boolean;    // 八仙過海
  sevenRobsOne?: boolean;      // 七搶一
  oneRobsSeven?: boolean;      // 一搶七
}

export interface FanResult {
  name: string;
  fan: number;
  description: string;
}

export interface ScoringResult {
  totalFan: number;
  baseFan: number;             // 底番
  chickenWin: boolean;         // 是否雞胡
  results: FanResult[];        // 所有番型列表
  pattern?: HandPattern;       // 最佳組合（如果有多個，這是其中之一）
  patternResults?: Array<{ pattern: HandPattern; totalFan: number; fans: FanResult[] }>; // 所有可能的組合結果
}

// ============================================================================
// 完整計算流程
// ============================================================================

export function calculateScore(state: GameState): ScoringResult {
  /**
   * 完整計算流程：步驟 1-8 (修正版)
   * 1. 牌數驗證
   * 2. 狀態番 (叮, 自摸, 門清, 莊)
   * 3. 特殊事件番 (海底, 花上, 槓上)
   * 4. 特殊牌型檢查 (十三么, 十六不搭, 嚦咕嚦咕, 8飛, 八仙, 搶花)
   * 5. 標準牌型分析
   * 6. 組合番數計算
   * 7. 最高番組合選擇 (列出所有)
   * 8. 底番與雞胡檢查
   */

  // ✅ 第 1 步：牌數驗證 (如果是花胡，可跳過牌數檢查，或者需特殊處理。這裡假設花胡時手牌可能不完整或不重要，但通常狀態會傳入完整手牌。若為"八仙過海", 其實沒手牌也行。我們在 step4 處理)
  // 如果是八仙過海/七搶一/一搶七，可以稍後直接返回，但 step1 驗證目前檢查 17張。
  // 若是花胡特殊牌局，建議由前端傳入 dummy tiles 補足 17 張，或在此放寬。
  // 由於這一步先執行，若我們確定是花胡，可以繞過還是讓它報錯？
  // 假設前端會傳滿17張。

  if (!step1_validateTileCount(state)) {
    throw new Error('牌數驗證失敗');
  }

  // ✅ 第 2 步：狀態番（Status Fan）
  const statusFans = step2_calculateStatusFans(state);

  // ✅ 第 3 步：特殊事件番（Event Fan）
  const eventFans = step3_calculateEventFans(state);

  // ✅ 第 4 步：特殊牌型檢查（最高優先級）
  const specialHandResults = step4_checkSpecialHands(state);

  if (specialHandResults.length > 0) {
    // 特殊牌型直接結算，但也需加上狀態番和事件番
    // 取其中最高分的特殊牌型
    const bestSpecial = specialHandResults.reduce((prev, current) => prev.fan > current.fan ? prev : current);
    const allFans = [...statusFans, ...eventFans, ...bestSpecial.fans];
    const { fans: finalFans, isChickenWin } = step8_checkChickenWin(allFans);

    return {
      totalFan: finalFans.reduce((sum, f) => sum + f.fan, 0),
      baseFan: 5,
      chickenWin: isChickenWin,
      results: finalFans,
      patternResults: [{
        pattern: { chows: [], pungs: [], pair: null, tiles: state.handTiles }, // 虛擬 pattern
        totalFan: finalFans.reduce((sum, f) => sum + f.fan, 0),
        fans: finalFans
      }]
    };
  }

  // ✅ 第 5 步：標準牌型分析
  const patterns = step5_analyzePatterns(state);
  if (patterns.length === 0) {
    throw new Error('無法組成有效牌型');
  }

  // ✅ 第 6 步：組合番數計算
  const patternResults = step6_calculateForEachPattern(state, patterns);

  // ✅ 第 7 步：最高番組合選擇（重要：列出所有）
  // 這裡需要將 狀態番 和 事件番 在此步驟合併進每個 pattern 的結果中
  const finalResults = patternResults.map(pr => {
    let combinedFans = [...statusFans, ...eventFans, ...pr.fans];

    // ✅ 第 8 步：底番與雞胡檢查 (對每個組合單獨做)
    const checked = step8_checkChickenWin(combinedFans);

    return {
      pattern: pr.pattern,
      fans: checked.fans,
      totalFan: checked.fans.reduce((sum, f) => sum + f.fan, 0),
      isChickenWin: checked.isChickenWin
    };
  });

  // 排序並過濾，只回傳最高分的組合們
  const maxFan = Math.max(...finalResults.map(r => r.totalFan));
  const bestResults = finalResults.filter(r => r.totalFan === maxFan);

  return {
    totalFan: maxFan,
    baseFan: 5,
    chickenWin: bestResults[0].isChickenWin,
    results: bestResults[0].fans,
    pattern: bestResults[0].pattern,
    patternResults: bestResults
  };
}

// ============================================================================
// 子步驟實作
// ============================================================================

function step1_validateTileCount(state: GameState): boolean {
  // 如果是花胡，不需檢查牌數
  if (state.flowers.length === 8 || state.sevenRobsOne || state.oneRobsSeven || state.eightImmortals) {
    return true;
  }
  const handCount = state.handTiles.length;
  const exposedCount = state.exposedMelds.reduce((sum, meld) => sum + meld.tiles.length, 0);
  const winCount = 1; // 胡牌
  const totalValidTiles = handCount + exposedCount + winCount;

  // 17張牌制
  return totalValidTiles === 17;
}

function step2_calculateStatusFans(state: GameState): FanResult[] {
  const fans: FanResult[] = [];

  // 叮
  if (state.listening) {
    fans.push({ name: '叮', fan: 5, description: '聽牌' });
  }
  if (state.listeningOneShot) {
    fans.push({ name: '叮(一發)', fan: 10, description: '報聽後一巡內胡牌' });
  }

  // 門清 & 自摸
  const isConcealed = state.exposedMelds.length === 0; // 無上/碰 (暗槓不影響)

  if (isConcealed && state.selfDraw) {
    fans.push({ name: '門清自摸', fan: 5, description: '門清且自摸' });
  } else {
    if (isConcealed) {
      fans.push({ name: '門清', fan: 3, description: '無上/碰，暗槓亦可' });
    }
    if (state.selfDraw) {
      fans.push({ name: '自摸', fan: 1, description: '自己摸到胡牌' });
    }
  }

  // 莊家
  if (state.isDealer) {
    fans.push({ name: '莊家', fan: 1, description: '做莊胡牌' });
    if (state.dealerStreak > 0) {
      const streakFan = state.dealerStreak * 2 + 1;
      fans.push({
        name: `連莊 (連${state.dealerStreak}拉${state.dealerStreak})`,
        fan: streakFan,
        description: `連莊拉莊額外加番（${state.dealerStreak}×2+1）`
      });
    }
  }

  return fans;
}

function step3_calculateEventFans(state: GameState): FanResult[] {
  const fans: FanResult[] = [];

  if (state.lastTile) fans.push({ name: '海底撈月', fan: 20, description: '最後一張牌自摸' });
  if (state.flowerDraw) fans.push({ name: '花上食胡', fan: 1, description: '摸花時自摸' });
  if (state.kongDraw) fans.push({ name: '槓上食胡', fan: 1, description: '開槓時自摸' });
  if (state.robKong) fans.push({ name: '搶槓食胡', fan: 1, description: '搶別人的槓' });
  if (state.kongOnKong) fans.push({ name: '槓上槓食胡', fan: 30, description: '開槓後再開槓時自摸' });
  if (state.robKongOnKong) fans.push({ name: '搶槓上槓食胡', fan: 30, description: '搶槓上槓的槓' });

  // 新增特殊事件
  if (state.heavenlyWin) fans.push({ name: '天胡', fan: 100, description: '莊家配牌即胡' });
  if (state.earthlyWin) fans.push({ name: '地胡', fan: 80, description: '首輪自摸' });
  if (state.humanWin) fans.push({ name: '人胡', fan: 80, description: '首四巡內胡牌' });
  if (state.doubleWin) fans.push({ name: '雙響', fan: 5, description: '兩家同胡' });
  if (state.tripleWin) fans.push({ name: '三響', fan: 10, description: '三家同胡' });

  if (state.isFullBeggar) fans.push({ name: '全求人', fan: 15, description: '全落地單釣出沖' });
  if (state.isSemiBeggar) fans.push({ name: '半求人', fan: 10, description: '全落地但自摸' });

  // 十只內/七只內 (由落地牌組數量判定)
  const exposedCount = state.exposedMelds.length + state.exposedKongs.length;
  if (exposedCount === 3) {
    fans.push({ name: '十只內', fan: 10, description: '手牌剩餘7張(3組落地)' });
  } else if (exposedCount === 4) {
    fans.push({ name: '七只內', fan: 20, description: '手牌剩餘4張(4組落地)' });
  }

  return fans;
}

function step4_checkSpecialHands(state: GameState): { name: string; fan: number; fans: FanResult[] }[] {
  const results: { name: string; fan: number; fans: FanResult[] }[] = [];
  const allTiles = [...state.handTiles, state.winningTile];

  // 0. 花胡 (八仙過海 / 七搶一 / 一搶七)
  if (state.flowers.length === 8 || state.eightImmortals) {
    results.push({
      name: '八仙過海',
      fan: 100,
      fans: [{ name: '八仙過海', fan: 100, description: '摸齊8張花' }]
    });
  } else if (state.sevenRobsOne) {
    results.push({
      name: '七搶一',
      fan: 30,
      fans: [{ name: '七搶一', fan: 30, description: '7隻花搶對方1隻花' }]
    });
  } else if (state.oneRobsSeven) {
    results.push({
      name: '一搶七',
      fan: 30,
      fans: [{ name: '一搶七', fan: 30, description: '1隻花搶對方7隻花' }]
    });
  }

  // 1. 十三么
  if (isThirteenOrphans(allTiles)) {
    results.push({
      name: '十三么',
      fan: 80,
      fans: [{ name: '十三么', fan: 80, description: '19+字牌+1對眼' }]
    });
  }

  // 2. 十六不搭
  if (isSixteenUnmatched(allTiles)) {
    results.push({
      name: '十六不搭',
      fan: 40,
      fans: [{ name: '十六不搭', fan: 40, description: '全手不搭' }]
    });
  }

  // 3. 嚦咕嚦咕 (包含 8 飛)
  const pairResult = checkSevenPairs(state);
  if (pairResult) {
    results.push(pairResult);
  }

  return results;
}

function step5_analyzePatterns(state: GameState): HandPattern[] {
  // 標準分解: 5組面子 + 1對眼
  const allHandTiles = [...state.handTiles, state.winningTile];
  allHandTiles.sort(compareTiles);

  const analyzedPatterns = HandAnalyzer.analyzeHand(allHandTiles);
  const results: HandPattern[] = [];

  analyzedPatterns.forEach(p => {
    results.push({
      chows: [...p.chows, ...state.exposedMelds.filter(m => m.type === 'chow')],
      pungs: [
        ...p.pungs,
        ...state.exposedKongs.map(k => ({ ...k, type: 'pung' as const, concealed: false })),
        ...state.concealedKongs.map(k => ({ ...k, type: 'pung' as const, concealed: true })),
        ...state.exposedMelds.filter(m => m.type === 'pung')
      ],
      pair: p.pair,
      tiles: [...allHandTiles,
      ...state.exposedMelds.flatMap(m => m.tiles),
      ...state.exposedKongs.flatMap(m => m.tiles),
      ...state.concealedKongs.flatMap(m => m.tiles)]
    });
  });

  return results;
}

function step6_calculateForEachPattern(state: GameState, patterns: HandPattern[]) {
  return patterns.map(pattern => {
    const fans: FanResult[] = [];

    // A. 花牌番 (改為此步驟加入)
    fans.push(...calculateFlowerFans(state));

    // B. 槓番
    fans.push(...calculateKongFans(state));

    // C. 組合相關番
    fans.push(...calculateBasicHandFans(state, pattern));
    fans.push(...calculatePungFans(pattern));
    fans.push(...calculateSequenceFans(pattern));
    fans.push(...calculateFamilyFans(pattern));
    fans.push(...calculateFourOfAKindFans(pattern));
    fans.push(...calculateDragonFans(state, pattern));
    fans.push(...calculateOtherCombinationFans(state, pattern));
    fans.push(...calculateDragonsAndWindsFans(pattern));
    fans.push(...calculateTerminalsFans(pattern));

    // D. 等待牌型番
    fans.push(...calculateWaitingFans(state, pattern));

    return { pattern, fans, totalFan: fans.reduce((a, b) => a + b.fan, 0) };
  });
}

function step8_checkChickenWin(fans: FanResult[]): { fans: FanResult[]; isChickenWin: boolean } {
  let totalFan = fans.reduce((sum, f) => sum + f.fan, 0);
  const baseFan = 5;

  const newFans = [...fans, { name: '底番', fan: baseFan, description: '基礎底番' }];
  totalFan += baseFan;

  if (totalFan === 6) {
    return {
      fans: [{ name: '雞胡', fan: 30, description: '胡出時只得底番+1' }],
      isChickenWin: true
    };
  }

  return { fans: newFans, isChickenWin: false };
}

// ============================================================================
// 詳細番種計算函數
// ============================================================================

function calculateFlowerFans(state: GameState): FanResult[] {
  const fans: FanResult[] = [];
  const totalFlowers = state.flowers.length;

  if (totalFlowers === 0) {
    fans.push({ name: '無花', fan: 1, description: '沒有花牌' });
  } else {
    let matchingFlowers = 0;
    let nonMatchingFlowers = 0;
    const seatNumber = getSeatNumber(state.seatWind);

    for (const flower of state.flowers) {
      const flowerNumber = getFlowerNumber(flower);
      // 梅蘭菊竹(1-4), 春夏秋東(5-8)
      // 1,5 -> 東, 2,6 -> 南, 3,7 -> 西, 4,8 -> 北
      if (flowerNumber === seatNumber || flowerNumber === (seatNumber + 4)) {
        matchingFlowers++;
      } else {
        nonMatchingFlowers++;
      }
    }

    if (matchingFlowers > 0) fans.push({ name: `正花 × ${matchingFlowers}`, fan: matchingFlowers * 2, description: `花牌數字與座位相同` });
    if (nonMatchingFlowers > 0) fans.push({ name: `爛花 × ${nonMatchingFlowers}`, fan: nonMatchingFlowers * 1, description: `花牌數字與座位不同` });

    // 一台花
    if (hasOneSetFlowers(state.flowers)) {
      fans.push({ name: '一台花', fan: 10, description: '集齊春夏秋冬或梅蘭菊竹' });
    }
  }
  return fans;
}

function calculateKongFans(state: GameState): FanResult[] {
  const fans: FanResult[] = [];
  if (state.exposedKongs.length > 0) {
    fans.push({ name: `明槓 × ${state.exposedKongs.length}`, fan: state.exposedKongs.length * 1, description: '明槓' });
  }
  if (state.concealedKongs.length > 0) {
    fans.push({ name: `暗槓 × ${state.concealedKongs.length}`, fan: state.concealedKongs.length * 2, description: '暗槓' });
  }
  return fans;
}

function calculateBasicHandFans(state: GameState, pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const allTiles = pattern.tiles;
  const hasZi = allTiles.some(t => t.suit === 'zi');
  const hasFlowers = state.flowers.length > 0;
  const isAllChows = pattern.chows.length === 5 && pattern.pungs.length === 0;

  // 無字花大平胡 / 無字花 / 無字 / 平胡
  if (!hasZi && !hasFlowers && isAllChows) {
    fans.push({ name: '無字花大平胡', fan: 15, description: '沒有番子、沒有花、且是平胡' });
  } else if (!hasZi && !hasFlowers) {
    fans.push({ name: '無字花', fan: 5, description: '沒有番子且沒有花牌' });
  } else {
    if (!hasZi) {
      fans.push({ name: '無字', fan: 1, description: '沒有番子' });
    }
    if (isAllChows) {
      fans.push({ name: '平胡', fan: 3, description: '5個順子' });
    }
  }

  // 將眼
  if (pattern.pair && typeof pattern.pair.tiles[0].value === 'number') {
    const v = pattern.pair.tiles[0].value;
    if ([2, 5, 8].includes(v)) {
      fans.push({ name: '將眼', fan: 2, description: '對子是2、5或8' });
    }
  }

  return fans;
}

function calculatePungFans(pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  // 暗刻計番 (不包含明槓/明刻)
  const concealedPungs = pattern.pungs.filter(p => p.concealed).length;

  if (concealedPungs === 2) fans.push({ name: '二暗刻', fan: 3, description: '2個暗刻' });
  else if (concealedPungs === 3) fans.push({ name: '三暗刻', fan: 10, description: '3個暗刻' });
  else if (concealedPungs === 4) fans.push({ name: '四暗刻', fan: 30, description: '4個暗刻' });
  else if (concealedPungs === 5) fans.push({ name: '五暗刻', fan: 80, description: '5個暗刻' });

  return fans;
}

function calculateSequenceFans(pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const chowKeys = pattern.chows.map(c => `${c.suit}${c.tiles[0].value}`);
  const counts: Record<string, number> = {};
  chowKeys.forEach(k => counts[k] = (counts[k] || 0) + 1);

  for (const count of Object.values(counts)) {
    if (count === 2) fans.push({ name: '一般高', fan: 3, description: '2個相同順子' });
    else if (count === 3) fans.push({ name: '三般高', fan: 15, description: '3個相同順子' });
    else if (count === 4) fans.push({ name: '四般高', fan: 30, description: '4個相同順子' });
  }
  return fans;
}

function calculateFamilyFans(pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const pungs = pattern.pungs;
  const chows = pattern.chows;

  // 老少 (上) - 同門 123 + 789
  const suits = ['wan', 'tong', 'suo'];
  for (const s of suits) {
    const sChows = chows.filter(c => c.suit === s);
    if (sChows.some(c => c.tiles[0].value === 1) && sChows.some(c => c.tiles[0].value === 7)) {
      fans.push({ name: '老少(上)', fan: 2, description: '同門123+789' });
    }
    // 老少 (碰) - 同門 111 + 999
    const sPungs = pungs.filter(p => p.tiles[0].suit === s);
    if (sPungs.some(p => p.tiles[0].value === 1) && sPungs.some(p => p.tiles[0].value === 9)) {
      fans.push({ name: '老少(碰)', fan: 3, description: '同門111+999' });
    }
  }

  // 二兄弟 / 大三兄弟 / 小三兄弟
  const pungValues: Record<number, string[]> = {};
  pungs.forEach(p => {
    const v = p.tiles[0].value;
    if (v) {
      if (!pungValues[v]) pungValues[v] = [];
      pungValues[v].push(p.tiles[0].suit as string);
    }
  });

  for (const [val, suitsAtVal] of Object.entries(pungValues)) {
    if (suitsAtVal.length === 2) fans.push({ name: '二兄弟', fan: 3, description: `2個數字相同的異色刻子(${val})` });
    else if (suitsAtVal.length === 3) fans.push({ name: '大三兄弟', fan: 15, description: `3個數字相同的異色刻子(${val})` });
  }

  return fans;
}

function calculateFourOfAKindFans(_pattern: HandPattern): FanResult[] {
  return [];
}

function calculateDragonFans(_state: GameState, pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const chows = pattern.chows;
  if (chows.length < 3) return [];

  const chowKeys = chows.map(c => ({ suit: c.suit, start: c.tiles[0].value! }));

  // 清龍 (同色 1-9)
  const suits = ['wan', 'tong', 'suo'];
  for (const s of suits) {
    if ([1, 4, 7].every(start => chowKeys.some(k => k.suit === s && k.start === start))) {
      const isConcealed = chows.every(c => c.concealed); // Simplified: check if all involved chows are conceaeld? Or just use pattern structure? Assuming conceaeld property is set correctly
      if (isConcealed) fans.push({ name: '暗清龍', fan: 20, description: '同花色1-9無鳴牌' });
      else fans.push({ name: '明清龍', fan: 10, description: '同花色1-9有鳴牌' });
    }
  }

  // 雜龍 (不同色 1-9)
  const allSuitPerms = [
    ['wan', 'tong', 'suo'], ['wan', 'suo', 'tong'],
    ['tong', 'wan', 'suo'], ['tong', 'suo', 'wan'],
    ['suo', 'wan', 'tong'], ['suo', 'tong', 'wan']
  ];

  for (const perm of allSuitPerms) {
    const ck0 = chowKeys.find(k => k.suit === perm[0] && k.start === 1);
    const ck1 = chowKeys.find(k => k.suit === perm[1] && k.start === 4);
    const ck2 = chowKeys.find(k => k.suit === perm[2] && k.start === 7);

    if (ck0 && ck1 && ck2) {
      if (fans.some(f => f.name.includes('龍'))) continue;
      fans.push({ name: '明雜龍', fan: 8, description: '三色組合1-9' });
      break;
    }
  }

  return fans;
}

function calculateOtherCombinationFans(state: GameState, pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const suits = new Set(pattern.tiles.filter(t => t.suit !== 'zi').map(t => t.suit));
  const hasZi = pattern.tiles.some(t => t.suit === 'zi');

  if (suits.size === 1) {
    if (hasZi) fans.push({ name: '混一色', fan: 30, description: '一門牌+番子' });
    else fans.push({ name: '清一色', fan: 80, description: '純一門牌' });
  } else if (suits.size === 2 && !hasZi) {
    fans.push({ name: '缺一門', fan: 5, description: '缺一門' });
  }

  // 五門齊 / 七門齊
  // 檢查是否擁有 萬、筒、索、風、三元
  // 檢查條件：Pattern 中的組合是否包含這些類別
  const hasWan = checkType(pattern, 'wan');
  const hasTong = checkType(pattern, 'tong');
  const hasSuo = checkType(pattern, 'suo');
  // 風與三元需細分是否為刻子
  const windStatus = checkWindDragonStatus(pattern, 'wind');
  const dragonStatus = checkWindDragonStatus(pattern, 'dragon');

  if (hasWan && hasTong && hasSuo && windStatus !== 'none' && dragonStatus !== 'none') {
    const hasFlower = state.flowers.some(f => getFlowerNumber(f) <= 4); // 花 (1-4)
    const hasSeason = state.flowers.some(f => getFlowerNumber(f) >= 5); // 季 (5-8)
    const isBig = windStatus === 'all_pung' && dragonStatus === 'all_pung';

    if (hasFlower && hasSeason) {
      if (isBig) fans.push({ name: '大七門齊', fan: 20, description: '五門齊+花+季 (風/三元全刻)' });
      else fans.push({ name: '小七門齊', fan: 15, description: '五門齊+花+季 (風/三元非全刻)' });
    } else {
      if (isBig) fans.push({ name: '大五門齊', fan: 10, description: '五門齊 (風/三元全刻)' });
      else fans.push({ name: '小五門齊', fan: 5, description: '五門齊 (風/三元非全刻)' });
    }
  }

  if (pattern.pungs.length === 5) {
    fans.push({ name: '對對胡', fan: 30, description: '5個刻子' });
  }

  // 間間胡 (自摸對對胡)
  if (pattern.pungs.length === 5 && state.selfDraw && state.exposedMelds.length === 0) {
    fans.push({ name: '間間胡', fan: 100, description: '門清自摸對對胡' });
  }

  return fans;
}

function checkType(pattern: HandPattern, suit: string): boolean {
  return pattern.tiles.some(t => t.suit === suit);
}

function checkWindDragonStatus(pattern: HandPattern, type: 'wind' | 'dragon'): 'none' | 'has' | 'all_pung' {
  const tiles = pattern.tiles.filter(t => t.suit === 'zi' && (type === 'wind' ? t.wind : t.dragon));
  if (tiles.length === 0) return 'none';

  // 檢查該類別的所有面子是否都是刻子/槓子
  // 注意：Pattern 中的 pungs 包含 exposedKongs/ConcealedKongs/exposedPungs
  // 但是 pattern.tiles 包含所有牌。我們需檢查屬於該類別的"組"
  // 如果該類別有散牌 (即存在於 Pair 或 Chow? Zi不能組成Chow), 則不是 "Check if all are pungs"
  // 嚴格定義："大"五門齊通常指番子部分必須是刻子。如果有番子做眼，則為小五門齊。

  // 檢查是否有該類別的對子
  const hasPair = pattern.pair && pattern.pair.tiles[0].suit === 'zi' && (type === 'wind' ? pattern.pair.tiles[0].wind : pattern.pair.tiles[0].dragon);
  if (hasPair) return 'has'; // 有眼，不可能是全刻

  // 確認是否有該類別的牌存在，且不在對子裡 -> 必須都在刻子裡 (因為字牌不能吃)
  // 所以只要沒眼，且有牌，就一定是全刻
  return 'all_pung';
}

function calculateDragonsAndWindsFans(pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const pungs = pattern.pungs;
  const pair = pattern.pair;

  // 三元
  const dragonPungsCount = pungs.filter(p => p.tiles[0].dragon).length;
  const dragonPair = pair && pair.tiles[0].dragon;

  if (dragonPungsCount === 3) {
    fans.push({ name: '大三元', fan: 40, description: '3個三元刻' });
  } else if (dragonPungsCount === 2 && dragonPair) {
    fans.push({ name: '小三元', fan: 20, description: '2個三元刻+1三元對' });
    // 其餘的一個三元刻另外計
    pungs.filter(p => p.tiles[0].dragon && p.tiles[0].dragon !== dragonPair).forEach(p => {
      fans.push({ name: `三元牌(${p.tiles[0].dragon === 'zhong' ? '中' : p.tiles[0].dragon === 'fa' ? '發' : '白'})`, fan: 2, description: '三元刻子' });
    });
  } else {
    // 個別三元刻
    pungs.filter(p => p.tiles[0].dragon).forEach(p => {
      fans.push({ name: `三元牌(${p.tiles[0].dragon === 'zhong' ? '中' : p.tiles[0].dragon === 'fa' ? '發' : '白'})`, fan: 2, description: '三元刻子' });
    });
  }

  // 四喜 / 三風
  const windPungs = pungs.filter(p => p.tiles[0].wind);
  const windPair = pair && pair.tiles[0].wind;

  if (windPungs.length === 4) {
    fans.push({ name: '大四喜', fan: 80, description: '4個風刻' });
  } else if (windPungs.length === 3 && windPair) {
    fans.push({ name: '小四喜', fan: 60, description: '3個風刻+1風對' });
  } else if (windPungs.length === 3) {
    fans.push({ name: '大三風', fan: 30, description: '3個風刻' });
  } else if (windPungs.length === 2 && windPair) {
    fans.push({ name: '小三風', fan: 15, description: '2個風刻+1風對' });
  } else {
    // 個別風刻計番 (不符合大三風/小三風等時)
    // 這裡通常還需要判斷 座位風/圈風，但為簡化我們先固定邏輯
    // 正風 2番，非正風 1番
    // 註：這部分在完整規則中需要結合 GameState.seatWind，但此函數目前只接 pattern
    // 如果要精確，可能需要在這裡也傳入 state
    windPungs.forEach(p => {
      fans.push({ name: `風刻(${p.tiles[0].wind})`, fan: 1, description: '風色刻子' });
    });
  }

  return fans;
}

function calculateTerminalsFans(pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  const allTiles = pattern.tiles;
  const isTerminal = (t: Tile) => t.suit !== 'zi' && (t.value === 1 || t.value === 9);
  const isHonor = (t: Tile) => t.suit === 'zi';

  if (allTiles.every(t => isTerminal(t))) {
    fans.push({ name: '清么', fan: 80, description: '全是1/9' });
  } else if (allTiles.every(t => isTerminal(t) || isHonor(t))) {
    fans.push({ name: '混么', fan: 30, description: '全是1/9和番子' });
  }

  return fans;
}

function calculateWaitingFans(state: GameState, pattern: HandPattern): FanResult[] {
  const fans: FanResult[] = [];
  // 簡化判定：若有對子且牌數符合，或有嵌張
  const waitType = analyzeWaitingType(state, pattern);
  if (waitType === 'single') fans.push({ name: '獨獨', fan: 2, description: '單釣' });
  if (waitType === 'fake-single') fans.push({ name: '假獨', fan: 1, description: '假獨' });
  if (waitType === 'pair') fans.push({ name: '對碰', fan: 2, description: '對碰' });
  return fans;
}

function analyzeWaitingType(_state: GameState, pattern: HandPattern): 'single' | 'fake-single' | 'pair' | 'none' {
  const winTile = _state.winningTile;
  if (!pattern.pair) return 'none';

  // 1. 單釣 (Waiting for the eyes)
  // 如果胡的那張牌就是湊成對子的那一張
  if (getTileKey(pattern.pair.tiles[0]) === getTileKey(winTile)) {
    // 確認手牌中沒有其他組合可以產生同樣的胡牌 (簡化處理：主要看這個 pattern)
    return 'single';
  }

  // 2. 嵌張 / 偏章 (Wait for a single tile in a chow)
  for (const chow of pattern.chows) {
    if (chow.suit === winTile.suit) {
      const v = winTile.value!;
      const start = chow.tiles[0].value!;

      // 嵌張 (Middle tile, e.g., 2 [3] 4)
      if (v === start + 1) return 'single';

      // 偏章 (Edge tile, e.g., [3] with 1-2 or [7] with 8-9)
      if (v === 3 && start === 1) return 'single';
      if (v === 7 && start === 7) return 'single';
    }
  }

  // 3. 對碰 (Wait for one of two pairs to become a pung)
  for (const pung of pattern.pungs) {
    if (pung.concealed && getTileKey(pung.tiles[0]) === getTileKey(winTile)) {
      // 如果這個刻子是暗刻且胡牌是這張，可能是對碰
      return 'pair';
    }
  }

  return 'none';
}

// ============================================================================
// Helper Classes & Functions
// ============================================================================

function checkSevenPairs(state: GameState): { name: string; fan: number; fans: FanResult[] } | null {
  const allTiles = [...state.handTiles, state.winningTile];
  if (state.exposedMelds.length > 0 || state.exposedKongs.length > 0) return null;
  if (state.concealedKongs.length > 0) return null;

  const tileCounts = getTileCounts(allTiles);
  let pairCount = 0;
  let pungCount = 0;
  let singleCount = 0;

  for (const count of Object.values(tileCounts)) {
    if (count === 1) singleCount++;
    else if (count === 2) pairCount++;
    else if (count === 3) pungCount++;
    else if (count === 4) pairCount += 2;
  }

  // 8 飛 (1刻 + 7對 = 17)
  if (pungCount === 1 && pairCount === 7 && singleCount === 0) {
    return { name: '嚦咕嚦咕(8飛)', fan: 50, fans: [{ name: '嚦咕嚦咕(8飛)', fan: 50, description: '8對聽8張(含一刻)' }] };
  }

  // 普通嚦咕 (8對 + 1單 = 17)
  if (pairCount === 8 && singleCount === 1 && pungCount === 0) {
    return { name: '嚦咕嚦咕', fan: 40, fans: [{ name: '嚦咕嚦咕', fan: 40, description: '8個對子' }] };
  }

  return null;
}

function getSeatNumber(wind: 'east' | 'south' | 'west' | 'north'): number {
  const mapArr: ('east' | 'south' | 'west' | 'north')[] = ['east', 'south', 'west', 'north'];
  return mapArr.indexOf(wind) + 1;
}

function getFlowerNumber(flower: Tile): number {
  return flower.value || 1;
}

function hasOneSetFlowers(flowers: Tile[]): boolean {
  const values = new Set(flowers.map(f => getFlowerNumber(f)));
  return values.size === 4 && flowers.length === 4;
}

function isThirteenOrphans(tiles: Tile[]): boolean {
  if (tiles.length !== 17) return false;
  const counts = getTileCounts(tiles);
  const orphans = [
    'wan1', 'wan9', 'tong1', 'tong9', 'suo1', 'suo9',
    'east', 'south', 'west', 'north', 'zhong', 'fa', 'bai'
  ];
  let hasPair = false;
  for (const key of orphans) {
    if (!counts[key]) return false;
    if (counts[key] === 2) {
      if (hasPair) return false;
      hasPair = true;
    }
  }
  return true;
}

function isSixteenUnmatched(_tiles: Tile[]): boolean {
  return false; // Placeholder
}

function getTileKey(tile: Tile): string {
  if (tile.suit === 'zi') return tile.wind || tile.dragon || '';
  return `${tile.suit}${tile.value}`;
}

function parseTileKey(key: string): Tile {
  if (['east', 'south', 'west', 'north'].includes(key)) return { suit: 'zi', wind: key as any };
  if (['zhong', 'fa', 'bai'].includes(key)) return { suit: 'zi', dragon: key as any };
  const suit = key.substring(0, key.length - 1) as any;
  const value = parseInt(key.charAt(key.length - 1));
  return { suit, value };
}

function getTileCounts(tiles: Tile[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of tiles) {
    const key = getTileKey(t);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function compareTiles(a: Tile, b: Tile): number {
  if (a.suit !== b.suit) {
    const order = { wan: 1, tong: 2, suo: 3, zi: 4 };
    return (order[a.suit] || 0) - (order[b.suit] || 0);
  }
  if (a.suit === 'zi') {
    const ziOrder: any = { east: 1, south: 2, west: 3, north: 4, zhong: 5, fa: 6, bai: 7 };
    return ziOrder[a.wind || a.dragon || ''] - ziOrder[b.wind || b.dragon || ''];
  }
  return (a.value || 0) - (b.value || 0);
}

function removeTiles(tiles: Tile[], toRemove: Tile[]): Tile[] {
  let result = [...tiles];
  for (const target of toRemove) {
    const index = result.findIndex(t => getTileKey(t) === getTileKey(target));
    if (index !== -1) result.splice(index, 1);
  }
  return result;
}

function countTile(tiles: Tile[], target: Tile): number {
  return tiles.filter(t => getTileKey(t) === getTileKey(target)).length;
}

class HandAnalyzer {
  static analyzeHand(tiles: Tile[]): HandPattern[] {
    const results: HandPattern[] = [];
    const sortedTiles = [...tiles].sort(compareTiles);

    const tileCounts = getTileCounts(sortedTiles);
    for (const key in tileCounts) {
      if (tileCounts[key] >= 2) {
        const remainingTiles = removeTiles(sortedTiles, [parseTileKey(key), parseTileKey(key)]);
        const solutions: { chows: Meld[], pungs: Meld[] }[] = [];
        this.decompose(remainingTiles, [], [], solutions);

        if (solutions.length > 0) {
          for (const sol of solutions) {
            results.push({
              chows: sol.chows,
              pungs: sol.pungs,
              pair: { type: 'pair', tiles: [parseTileKey(key), parseTileKey(key)], concealed: true },
              tiles: sortedTiles
            });
          }
        }
      }
    }
    return results;
  }

  private static decompose(tiles: Tile[], chows: Meld[], pungs: Meld[], solutions: { chows: Meld[], pungs: Meld[] }[]) {
    if (tiles.length === 0) {
      solutions.push({ chows: [...chows], pungs: [...pungs] });
      return;
    }

    const first = tiles[0];

    // Try Pung
    if (countTile(tiles, first) >= 3) {
      const remaining = removeTiles(tiles, [first, first, first]);
      pungs.push({ type: 'pung', tiles: [first, first, first], concealed: true });
      this.decompose(remaining, chows, pungs, solutions);
      pungs.pop();
    }

    // Try Chow
    if (first.suit !== 'zi') {
      const tile2 = tiles.find(t => t.suit === first.suit && t.value === (first.value! + 1));
      const tile3 = tiles.find(t => t.suit === first.suit && t.value === (first.value! + 2));
      if (tile2 && tile3) {
        const remaining = removeTiles(tiles, [first, tile2, tile3]);
        chows.push({ type: 'chow', tiles: [first, tile2, tile3], concealed: true, suit: first.suit });
        this.decompose(remaining, chows, pungs, solutions);
        chows.pop();
      }
    }
  }
}