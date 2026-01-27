
export interface ScoringItem {
  id: string;
  name: string;
  nameEn: string;
  fan: number | string;
  description: string;
  descriptionEn: string;
  example?: string;
  category: ScoringCategory;
}

export enum ScoringCategory {
  BASIC = '🎴 基礎牌型番',
  WORDS_FLOWER_KONG = '字 / 🌸 花 / 🎋 槓',
  TERMINALS_WITH_X = '🎭么九/帶X系列',
  DRAGON_SERIES = '🐉 龍系列',
  CHOWS = '🎯 順子系列',
  FAMILY = '👨‍👩‍👧‍👦 家人系列',
  CONCEALED_PUNGS = '🌑 暗刻系列',
  TRI_QUAD_WINDS = '🎊 三元四喜系列',
  OTHER_COMBOS = '🎨 其他組合番',
  SPECIAL_EVENTS = '🪅 特殊事件',
  SPECIAL_PATTERNS = '⭐ 特殊牌型'
}

export const CATEGORY_TRANSLATIONS: Record<ScoringCategory, string> = {
  [ScoringCategory.BASIC]: 'Basic Patterns',
  [ScoringCategory.WORDS_FLOWER_KONG]: 'Honors / Flowers / Kongs',
  [ScoringCategory.TERMINALS_WITH_X]: 'Terminal & X Series',
  [ScoringCategory.DRAGON_SERIES]: 'Dragon Series',
  [ScoringCategory.CHOWS]: 'Chow Series',
  [ScoringCategory.FAMILY]: 'Family Series',
  [ScoringCategory.CONCEALED_PUNGS]: 'Concealed Pung Series',
  [ScoringCategory.TRI_QUAD_WINDS]: 'Dragons & Winds',
  [ScoringCategory.OTHER_COMBOS]: 'Other Combinations',
  [ScoringCategory.SPECIAL_EVENTS]: 'Special Events',
  [ScoringCategory.SPECIAL_PATTERNS]: 'Special Patterns'
};
