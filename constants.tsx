
import { ScoringItem, ScoringCategory } from './types';

export const SCORING_DATA: ScoringItem[] = [
  // 1. 🎴 基礎牌型番
  { id: 'b-1', name: '獨獨', nameEn: 'True Solo', fan: 2, description: '單釣或偏章（只能胡一張特定牌）', descriptionEn: 'Strict single wait for one specific tile', category: ScoringCategory.BASIC },
  { id: 'b-2', name: '假獨', nameEn: 'False Solo', fan: 1, description: '可組成單釣但有其他胡法', descriptionEn: 'Single wait but alternative wins possible', category: ScoringCategory.BASIC },
  { id: 'b-11', name: '門清', nameEn: 'Concealed Hand', fan: 3, description: '沒有上、碰、明槓，暗槓亦可', descriptionEn: 'No exposed melds, concealed kongs allowed', category: ScoringCategory.BASIC },
  { id: 'b-12', name: '門清自摸', nameEn: 'Concealed Hand Self-draw', fan: 5, description: '門清且自摸（不另計門清及自摸）', descriptionEn: 'Concealed hand with self-draw win', category: ScoringCategory.BASIC },
  { id: 'b-13', name: '叮(一發)', nameEn: 'Richii (One Shot)', fan: 10, description: '報聽後一巡內胡牌', descriptionEn: 'Win within one turn after declaring Ready', category: ScoringCategory.BASIC },
  { id: 'b-8', name: '對碰', nameEn: 'Pung Wait', fan: 2, description: '等對子變刻子', descriptionEn: 'Waiting to complete a pung with a pair', category: ScoringCategory.BASIC },
  { id: 'b-3', name: '無字', nameEn: 'No Honor Tiles', fan: 1, description: '沒有番子（風牌、三元牌）', descriptionEn: 'No wind or dragon tiles', category: ScoringCategory.BASIC },
  { id: 'b-4', name: '將眼', nameEn: 'Ranked Pair (Eyes)', fan: 2, description: '對子是2、5或8', descriptionEn: 'Pair consists of 2, 5, or 8', category: ScoringCategory.BASIC },
  { id: 'b-5', name: '平胡', nameEn: 'All Chows', fan: 3, description: '5個順子，0個刻子', descriptionEn: 'Hand consists only of chows and a pair', category: ScoringCategory.BASIC },
  { id: 'b-6', name: '無字花', nameEn: 'No Honors No Flowers', fan: 5, description: '沒有番子且沒有花牌', descriptionEn: 'No honor tiles and no flower tiles', category: ScoringCategory.BASIC },
  { id: 'b-7', name: '無字花大平胡', nameEn: 'Grand All Chows', fan: 15, description: '沒有番子、沒有花、且是平胡', descriptionEn: 'No honor/flowers + All Chows', category: ScoringCategory.BASIC },
  { id: 'b-9', name: '莊家', nameEn: 'Dealer', fan: 1, description: '做莊胡牌額外加番', descriptionEn: 'Bonus fan for winning as the dealer', category: ScoringCategory.BASIC },
  { id: 'b-10', name: '連莊', nameEn: 'Consecutive Dealer', fan: '(Nx2)+1', description: '連莊拉莊額外加番', descriptionEn: 'Bonus fan for consecutive wins as dealer', category: ScoringCategory.BASIC },
  { id: 'b-14', name: '叮', nameEn: 'Richii', fan: 5, description: '報聽牌', descriptionEn: 'Declare Ready Hand', category: ScoringCategory.BASIC },

  // 2. 字 / 🌸 花 / 🎋 槓 (Reorganized Order)
  { id: 'f-4', name: '無花', nameEn: 'No Flowers', fan: 1, description: '沒有花牌', descriptionEn: 'Hand contains no flower tiles', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-1', name: '爛花', nameEn: 'Mixed Flower', fan: 1, description: '每張+1番', descriptionEn: '+1 Fan per flower', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-5', name: '正花', nameEn: 'Seat Flower', fan: 2, description: '每張+2番', descriptionEn: '+2 Fan per seat flower', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-2', name: '非正風', nameEn: 'Non-Seat Wind Pung', fan: 1, description: '每個+1番', descriptionEn: '+1 Fan per non-seat wind pung', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-6', name: '正風', nameEn: 'Seat Wind Pung', fan: 2, description: '每個+2番', descriptionEn: '+2 Fan per seat wind pung', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-7', name: '三元', nameEn: 'Dragon Pung', fan: 2, description: '每個+2番', descriptionEn: '+2 Fan per dragon pung', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-8', name: '暗槓', nameEn: 'Concealed Kong', fan: 2, description: '每個+2番', descriptionEn: '+2 Fan per concealed kong', category: ScoringCategory.WORDS_FLOWER_KONG },
  { id: 'f-9', name: '一台花', nameEn: 'Flower Set', fan: 10, description: '4張同系列花牌', descriptionEn: 'Complete set of 4 flowers', category: ScoringCategory.WORDS_FLOWER_KONG },

  // 3. 么九/帶X系列 (Merged)
  { id: 't-1', name: '斷么', nameEn: 'All Simples', fan: 5, description: '無1/9及番子', descriptionEn: 'No terminals or honors', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 't-2', name: '全帶混么', nameEn: 'Mixed Terminals Outside', fan: 10, description: '每組都有1/9或番子', descriptionEn: 'All groups contain a terminal or honor', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 't-3', name: '全帶么', nameEn: 'Pure Terminals Outside', fan: 15, description: '每組都有1/9，無番子', descriptionEn: 'All groups contain a terminal, no honors', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 't-4', name: '混么', nameEn: 'Mixed Terminals', fan: 30, description: '全是1/9和番子', descriptionEn: 'Only terminals and honors', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 't-5', name: '清么', nameEn: 'Pure Terminals', fan: 80, description: '全是1/9', descriptionEn: 'Only terminal tiles', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 'x-1', name: '混帶X', nameEn: 'Mixed Hand With X', fan: 20, description: '每組都有X及番子', descriptionEn: 'Every group contains tile X and honors', category: ScoringCategory.TERMINALS_WITH_X },
  { id: 'x-2', name: '全帶X', nameEn: 'Pure Hand With X', fan: 30, description: '每組都有X，無番子', descriptionEn: 'Every group contains tile X, no honors', category: ScoringCategory.TERMINALS_WITH_X },

  // 4. 🐉 龍系列
  { id: 'dr-1', name: '明雜龍', nameEn: 'Mixed Straight (Exposed)', fan: 8, description: '混合花色1-9，其中有上/碰', descriptionEn: 'Exposed straight 1-9 using mixed suits', category: ScoringCategory.DRAGON_SERIES },
  { id: 'dr-2', name: '明清龍', nameEn: 'Pure Straight (Exposed)', fan: 10, description: '同花色1-9，其中有上/碰', descriptionEn: 'Exposed straight 1-9 in one suit', category: ScoringCategory.DRAGON_SERIES },
  { id: 'dr-3', name: '暗雜龍', nameEn: 'Mixed Straight (Concealed)', fan: 15, description: '混合花色1-9，全部在手牌', descriptionEn: 'Concealed straight 1-9 using mixed suits', category: ScoringCategory.DRAGON_SERIES },
  { id: 'dr-4', name: '暗清龍', nameEn: 'Pure Straight (Concealed)', fan: 20, description: '同花色1-9，全部在手牌', descriptionEn: 'Concealed straight 1-9 in one suit', category: ScoringCategory.DRAGON_SERIES },

  // 5. 🎯 順子相關番
  { id: 's-1', name: '一般高', nameEn: 'Pure Double Chow', fan: 3, description: '2個完全相同的順子', descriptionEn: '2 identical chows', category: ScoringCategory.CHOWS },
  { id: 's-2', name: '三般高', nameEn: 'Pure Triple Chow', fan: 15, description: '3個完全相同的順子', descriptionEn: '3 identical chows', category: ScoringCategory.CHOWS },
  { id: 's-3', name: '四般高', nameEn: 'Pure Quadruple Chow', fan: 30, description: '4個完全相同的順子', descriptionEn: '4 identical chows', category: ScoringCategory.CHOWS },
  { id: 's-4', name: '二相逢', nameEn: 'Double Mixed Chow', fan: 2, description: '2個數字同但色異的順子', descriptionEn: '2 chows with same numbers in different suits', category: ScoringCategory.CHOWS },
  { id: 's-5', name: '三相逢', nameEn: 'Triple Mixed Chow', fan: 10, description: '3個數字同但色異的順子', descriptionEn: '3 chows with same numbers in different suits', category: ScoringCategory.CHOWS },
  { id: 's-6', name: '四同順', nameEn: 'Quadruple Mixed Chow', fan: 20, description: '4個數字相同的順子', descriptionEn: '4 chows with same numbers', category: ScoringCategory.CHOWS },
  { id: 's-7', name: '五同順', nameEn: 'Quintuple Mixed Chow', fan: 40, description: '5個數字相同的順子', descriptionEn: '5 chows with same numbers', category: ScoringCategory.CHOWS },

  // 6. 👨‍👩‍👧‍👦 家人番
  { id: 'h-1', name: '老少(上)', nameEn: 'Linear Chows', fan: 2, description: '同門123+789', descriptionEn: 'Sequence 123 and 789 in same suit', category: ScoringCategory.FAMILY },
  { id: 'h-2', name: '老少(碰)', nameEn: 'Linear Pungs', fan: 3, description: '同門111+999', descriptionEn: 'Pungs of 1 and 9 in same suit', category: ScoringCategory.FAMILY },
  { id: 'h-3', name: '二兄弟', nameEn: 'Double Brothers Pung', fan: 3, description: '2個數字相同的異色刻子', descriptionEn: '2 pungs of same number in different suits', category: ScoringCategory.FAMILY },
  { id: 'h-4', name: '小三兄弟', nameEn: 'Small Triple Brothers', fan: 10, description: '2同數刻+1同數對', descriptionEn: '2 pungs + 1 pair of same number', category: ScoringCategory.FAMILY },
  { id: 'h-5', name: '大三兄弟', nameEn: 'Big Triple Brothers', fan: 15, description: '3個數字相同的異色刻子', descriptionEn: '3 pungs of same number in different suits', category: ScoringCategory.FAMILY },
  { id: 'h-6', name: '小三姊妹', nameEn: 'Small Triple Sisters', fan: 8, description: '同花2連刻+1連對', descriptionEn: '2 consecutive pungs + 1 pair in same suit', category: ScoringCategory.FAMILY },
  { id: 'h-7', name: '大三姊妹', nameEn: 'Big Triple Sisters', fan: 15, description: '同花色3個連續數字的刻子', descriptionEn: '3 consecutive pungs in same suit', category: ScoringCategory.FAMILY },

  // 7. 🌑 暗刻系列
  { id: 'd-1', name: '二暗刻', nameEn: 'Two Concealed Pungs', fan: 3, description: '2個暗刻', descriptionEn: '2 concealed pungs', category: ScoringCategory.CONCEALED_PUNGS },
  { id: 'd-2', name: '三暗刻', nameEn: 'Three Concealed Pungs', fan: 10, description: '3個暗刻', descriptionEn: '3 concealed pungs', category: ScoringCategory.CONCEALED_PUNGS },
  { id: 'd-3', name: '四暗刻', nameEn: 'Four Concealed Pungs', fan: 30, description: '4個暗刻', descriptionEn: '4 concealed pungs', category: ScoringCategory.CONCEALED_PUNGS },
  { id: 'd-4', name: '五暗刻', nameEn: 'Five Concealed Pungs', fan: 80, description: '5個暗刻', descriptionEn: '5 concealed pungs', category: ScoringCategory.CONCEALED_PUNGS },

  // 8. 🎊 三元四喜系列
  { id: 'w-1', name: '小三風', nameEn: 'Small Three Winds', fan: 15, description: '2個風刻+1風對', descriptionEn: '2 wind pungs + 1 wind pair', category: ScoringCategory.TRI_QUAD_WINDS },
  { id: 'w-2', name: '大三風', nameEn: 'Big Three Winds', fan: 30, description: '3個風刻', descriptionEn: '3 wind pungs', category: ScoringCategory.TRI_QUAD_WINDS },
  { id: 'w-3', name: '小四喜', nameEn: 'Small Four Joys', fan: 60, description: '3個風刻+1風對', descriptionEn: '3 wind pungs + 1 wind pair', category: ScoringCategory.TRI_QUAD_WINDS },
  { id: 'w-4', name: '大四喜', nameEn: 'Big Four Joys', fan: 80, description: '4個風刻', descriptionEn: '4 wind pungs', category: ScoringCategory.TRI_QUAD_WINDS },
  { id: 'w-5', name: '小三元', nameEn: 'Small Three Dragons', fan: 20, description: '2個三元刻+1三元對', descriptionEn: '2 dragon pungs + 1 dragon pair', category: ScoringCategory.TRI_QUAD_WINDS },
  { id: 'w-6', name: '大三元', nameEn: 'Big Three Dragons', fan: 40, description: '3個三元刻', descriptionEn: '3 dragon pungs', category: ScoringCategory.TRI_QUAD_WINDS },

  // 9. 🎨 其他組合番
  { id: 'o-1', name: '缺一門', nameEn: 'Missing One Suit', fan: 5, description: '缺萬筒索其中一門', descriptionEn: 'Hand lacks one of the 3 suits', category: ScoringCategory.OTHER_COMBOS },
  { id: 'o-2', name: '五門齊', nameEn: 'Five Genders', fan: 10, description: '萬筒索風三元都有', descriptionEn: 'Contains all 3 suits + winds + dragons', category: ScoringCategory.OTHER_COMBOS },
  { id: 'o-3', name: '對對胡', nameEn: 'All Pungs', fan: 30, description: '5個刻子', descriptionEn: 'Hand consists of 5 pungs and a pair', category: ScoringCategory.OTHER_COMBOS },
  { id: 'o-4', name: '混一色', nameEn: 'Half Flush', fan: 30, description: '一門牌+番子', descriptionEn: 'One suit plus honor tiles', category: ScoringCategory.OTHER_COMBOS },
  { id: 'o-5', name: '清一色', nameEn: 'Full Flush', fan: 80, description: '純一門牌', descriptionEn: 'Only one suit, no honors', category: ScoringCategory.OTHER_COMBOS },

  // 10. 🎭 特殊事件
  { id: 'e-1', name: '花上食胡', nameEn: 'Win on Flower', fan: 1, description: '摸花時自摸', descriptionEn: 'Self-draw after drawing a flower', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-2', name: '槓上食胡', nameEn: 'Win on Kong', fan: 1, description: '開槓時自摸', descriptionEn: 'Self-draw after declaring a kong', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-3', name: '搶槓食胡', nameEn: 'Robbing the Kong', fan: 1, description: '搶別人的槓', descriptionEn: 'Winning on a tile others used for kong', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-4', name: '雙響', nameEn: 'Double Win', fan: 5, description: '兩家同胡', descriptionEn: 'Two players win on the same tile', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-5', name: '三響', nameEn: 'Triple Win', fan: 10, description: '三家同胡', descriptionEn: 'Three players win on the same tile', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-6', name: '七只內', nameEn: 'Seven Tiles Hand', fan: 20, description: '手牌≤7張', descriptionEn: 'Hand contains 7 or fewer tiles', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-7', name: '十只內', nameEn: 'Ten Tiles Hand', fan: 10, description: '手牌≤10張', descriptionEn: 'Hand contains 10 or fewer tiles', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-8', name: '半求人', nameEn: 'Semi-Beggar', fan: 10, description: '全落地但自摸', descriptionEn: 'All groups exposed, win by self-draw', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-9', name: '全求人', nameEn: 'Full Beggar', fan: 15, description: '全落地單釣出沖', descriptionEn: 'All groups exposed, win by discard', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-10', name: '地胡', nameEn: 'Earthly Win', fan: 80, description: '首輪自摸', descriptionEn: 'Self-draw on the very first turn', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-11', name: '人胡', nameEn: 'Human Win', fan: 80, description: '首四巡內胡牌', descriptionEn: 'Win within the first 4 discards', category: ScoringCategory.SPECIAL_EVENTS },
  { id: 'e-12', name: '天胡', nameEn: 'Heavenly Win', fan: 100, description: '莊家配牌即胡', descriptionEn: 'Dealer wins on the initial deal', category: ScoringCategory.SPECIAL_EVENTS },

  // 11. ⭐ 特殊牌型
  { id: 'p-1', name: '大雞胡', nameEn: 'Great Chicken Hu', fan: 30, description: '不計底番，胡出時為30番', descriptionEn: 'Special 30-fan win (Base fan not counted)', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-2', name: '十六不搭', nameEn: 'Sixteen Unrelated', fan: 40, description: '全手不搭', descriptionEn: '16 tiles with no relations', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-3', name: '十三么', nameEn: 'Thirteen Orphans', fan: 80, description: '所有么九及字牌各一', descriptionEn: 'All terminal and honor tiles plus one duplicate', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-4', name: '嚦咕嚦咕', nameEn: 'Seven Pairs Plus One', fan: 40, description: '8個對子', descriptionEn: 'Hand consists of 8 pairs', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-5', name: '嚦咕嚦咕 (8飛)', nameEn: 'Super Eight Pairs', fan: 50, description: '8對聽8張', descriptionEn: '8 pairs waiting on 8 tiles', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-6', name: '間間胡', nameEn: 'All Concealed Pungs', fan: 100, description: '自摸對對胡', descriptionEn: 'Winning All Pungs by self-draw', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-7', name: '花胡 (8隻花)', nameEn: 'Eight Flowers Win', fan: 100, description: '摸齊8張花', descriptionEn: 'Collect all 8 flower tiles instantly', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-8', name: '花胡 (1搶7)', nameEn: 'Flower Win (1 Steals 7)', fan: 30, description: '1搶7', descriptionEn: '1 steals 7', category: ScoringCategory.SPECIAL_PATTERNS },
  { id: 'p-9', name: '花胡 (7搶1)', nameEn: 'Flower Win (7 Steals 1)', fan: 30, description: '7搶1', descriptionEn: '7 steals 1', category: ScoringCategory.SPECIAL_PATTERNS },
];
