import React, { useState } from 'react';
import { useApp } from './AppContext';
import { SCORING_DATA } from './constants';
import { ScoringCategory } from './types';
import { calculateScore as calculateMahjongScore, GameState, Tile as EngineTile, FanResult as EngineFanResult } from './mahjong_scoring_logic';

interface Tile {
    suit: 'wan' | 'tong' | 'suo' | 'wind' | 'dragon';
    value: number | string;
    displayChar: string;
}

interface ScoringBreakdown {
    name: string;
    nameEn: string;
    fan: number;
}

const ScoreCalculatorPage: React.FC = () => {
    const { language } = useApp();
    const [handTiles, setHandTiles] = useState<Tile[]>([]);
    const [isSelfDraw, setIsSelfDraw] = useState(true);
    const [isDealer, setIsDealer] = useState(false);
    const [dealerStreak, setDealerStreak] = useState(0);
    const [seatWind, setSeatWind] = useState<'east' | 'south' | 'west' | 'north'>('east');
    const [isConcealed, setIsConcealed] = useState(false);
    const [exposedKongs, setExposedKongs] = useState(0);
    const [concealedKongs, setConcealedKongs] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [isListeningOneShot, setIsListeningOneShot] = useState(false);

    // Flowers
    const [flowers, setFlowers] = useState<number[]>([]);

    // Special Events
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const [showFlowerModal, setShowFlowerModal] = useState(false);

    const [scoringResult, setScoringResult] = useState<{
        totalFan: number;
        breakdown: ScoringBreakdown[];
    } | null>(null);

    // Get special events from constants
    const specialEvents = SCORING_DATA.filter(item => item.category === ScoringCategory.SPECIAL_EVENTS);
    // Add the new events to the specialEvents array for UI display if they are not already in SCORING_DATA
    const newEvents = [
        { id: 'e-13', name: '海底撈月', nameEn: 'Last Tile Win', fan: 20, description: '最後一張牌自摸', descriptionEn: 'Self-draw on the very last tile', category: ScoringCategory.SPECIAL_EVENTS },
        { id: 'e-1', name: '花上食胡', nameEn: 'Win on Flower', fan: 1, description: '摸花時自摸', descriptionEn: 'Self-draw after drawing a flower', category: ScoringCategory.SPECIAL_EVENTS },
        { id: 'e-14', name: '八仙過海', nameEn: 'Eight Immortals', fan: 100, description: '摸齊8張花', descriptionEn: 'Collect all 8 flower tiles', category: ScoringCategory.SPECIAL_EVENTS },
        { id: 'e-15', name: '一搶七', nameEn: 'One Robs Seven', fan: 30, description: '1隻花搶對方7隻花', descriptionEn: 'Rob 7 flowers with 1', category: ScoringCategory.SPECIAL_EVENTS },
        { id: 'e-16', name: '七搶一', nameEn: 'Seven Robs One', fan: 30, description: '7隻花搶對方1隻花', descriptionEn: 'Rob 1 flower with 7', category: ScoringCategory.SPECIAL_EVENTS },
    ];
    newEvents.forEach(newEvent => {
        if (!specialEvents.some(event => event.id === newEvent.id)) {
            specialEvents.push(newEvent);
        }
    });

    // Define all tiles
    const allTiles: { category: string; tiles: Tile[] }[] = [
        {
            category: language === 'zh' ? '🟤 萬子' : '🟤 Characters',
            tiles: Array.from({ length: 9 }, (_, i) => ({
                suit: 'wan' as const,
                value: i + 1,
                displayChar: `${i + 1}萬`
            }))
        },
        {
            category: language === 'zh' ? '🔵 筒子' : '🔵 Dots',
            tiles: Array.from({ length: 9 }, (_, i) => ({
                suit: 'tong' as const,
                value: i + 1,
                displayChar: `${i + 1}筒`
            }))
        },
        {
            category: language === 'zh' ? '🟢 索子' : '🟢 Bamboo',
            tiles: Array.from({ length: 9 }, (_, i) => ({
                suit: 'suo' as const,
                value: i + 1,
                displayChar: `${i + 1}索`
            }))
        }
    ];

    const honorTiles: Tile[] = [
        ...[
            { suit: 'wind' as const, value: 'east', displayChar: '東' },
            { suit: 'wind' as const, value: 'south', displayChar: '南' },
            { suit: 'wind' as const, value: 'west', displayChar: '西' },
            { suit: 'wind' as const, value: 'north', displayChar: '北' }
        ],
        ...[
            { suit: 'dragon' as const, value: 'zhong', displayChar: '中' },
            { suit: 'dragon' as const, value: 'fa', displayChar: '發' },
            { suit: 'dragon' as const, value: 'bai', displayChar: '白' }
        ]
    ];

    const addTile = (tile: Tile) => {
        if (handTiles.length < 17) {
            const count = handTiles.filter(t => t.suit === tile.suit && t.value === tile.value).length;
            if (count >= 4) {
                alert(language === 'zh' ? '同一種牌最多只能有4張！' : 'Maximum 4 tiles of the same type allowed!');
                return;
            }
            setHandTiles([...handTiles, tile]);
        }
    };

    const removeTile = (index: number) => {
        const newHand = handTiles.filter((_, i) => i !== index);
        setHandTiles(newHand);
        setWinnerIndex(null);
    };

    const clearAll = () => {
        setHandTiles([]);
        setWinnerIndex(null);
        setFlowers([]);
        setSelectedEvents([]);
        setScoringResult(null);
        setIsConcealed(false);
        setExposedKongs(0);
        setConcealedKongs(0);
        setIsListening(false);
        setIsListeningOneShot(false);
    };

    const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

    const toggleFlower = (flowerNum: number) => {
        if (flowers.includes(flowerNum)) {
            setFlowers(flowers.filter(f => f !== flowerNum));
        } else {
            setFlowers([...flowers, flowerNum]);
        }
    };

    const toggleEvent = (eventId: string) => {
        let newEvents = [...selectedEvents];
        const isSelected = newEvents.includes(eventId);

        if (isSelected) {
            newEvents = newEvents.filter(e => e !== eventId);
        } else {
            // Mutual Exclusivity Groups
            const groups = [
                ['e-12', 'e-10', 'e-11'], // 天、地、人胡 (3選1)
                ['e-6', 'e-7'],           // 七、十只內 (2選1)
                ['e-4', 'e-5'],           // 雙、三響 (2選1)
                ['e-8', 'e-9'],           // 半、全求人 (2選1)
                ['e-2', 'e-3'],           // 槓上、搶槓 (2選1)
                ['e-14', 'e-15', 'e-16'], // 花胡 (3選1)
            ];

            for (const group of groups) {
                if (group.includes(eventId)) {
                    newEvents = newEvents.filter(e => !group.includes(e));
                }
            }
            newEvents.push(eventId);
        }
        setSelectedEvents(newEvents);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const calculateScore = (flowerOverride?: 'e-14' | 'e-15' | 'e-16') => {
        // Check for 8 flowers special handling
        if (flowers.length === 8 && !flowerOverride) {
            setShowFlowerModal(true);
            return;
        }

        if (winnerIndex === null) {
            alert(language === 'zh' ? '請點擊手牌中的一張作為糊牌!' : 'Please select a winning tile from your hand!');
            return;
        }

        // Map UI Tiles to Engine Tiles
        const mapToEngineTile = (tile: Tile): EngineTile => {
            if (tile.suit === 'wind') {
                return { suit: 'zi' as const, wind: tile.value as any };
            }
            if (tile.suit === 'dragon') {
                return { suit: 'zi' as const, dragon: tile.value as any };
            }
            return { suit: tile.suit as any, value: Number(tile.value) };
        };

        const engineHand = handTiles.filter((_, i) => i !== winnerIndex).map(mapToEngineTile);
        const engineWin = mapToEngineTile(handTiles[winnerIndex]);

        // Prepare GameState
        const gameState: GameState = {
            handTiles: engineHand,
            exposedMelds: [],
            concealedKongs: Array(concealedKongs).fill(0).map(() => ({ type: 'pung', tiles: [], concealed: true })),
            exposedKongs: Array(exposedKongs).fill(0).map(() => ({ type: 'pung', tiles: [], concealed: false })),
            flowers: flowers.map(f => ({ suit: 'zi' as const, value: f })),
            winningTile: engineWin,
            seatWind: seatWind,
            roundWind: 'east',
            selfDraw: isSelfDraw,
            lastTile: selectedEvents.includes('e-13'),
            kongDraw: selectedEvents.includes('e-2'),
            flowerDraw: selectedEvents.includes('e-1'),
            robKong: selectedEvents.includes('e-3'),
            kongOnKong: false,
            robKongOnKong: false,
            listening: isListening,
            listeningOneShot: isListeningOneShot,
            isDealer: isDealer,
            dealerStreak: dealerStreak,

            // 新增映射
            heavenlyWin: selectedEvents.includes('e-12'),
            earthlyWin: selectedEvents.includes('e-10'),
            humanWin: selectedEvents.includes('e-11'),
            doubleWin: selectedEvents.includes('e-4'),
            tripleWin: selectedEvents.includes('e-5'),
            isFullBeggar: selectedEvents.includes('e-9'),
            isSemiBeggar: selectedEvents.includes('e-8'),
            eightImmortals: flowerOverride === 'e-14',
            oneRobsSeven: flowerOverride === 'e-15',
            sevenRobsOne: flowerOverride === 'e-16',
            isConcealedParam: isConcealed
        };

        try {
            const result = calculateMahjongScore(gameState);

            const breakdown: ScoringBreakdown[] = [];

            if (result.patternResults && result.patternResults.length > 0) {
                result.patternResults.forEach((pr, idx) => {
                    if (idx > 0) breakdown.push({ name: '===', nameEn: '===', fan: 0 }); // Separator based on visual
                    pr.fans.forEach((r: EngineFanResult) => {
                        breakdown.push({
                            name: r.name,
                            nameEn: r.name,
                            fan: r.fan
                        });
                    });
                });
            } else {
                result.results.forEach((r: EngineFanResult) => {
                    breakdown.push({
                        name: r.name,
                        nameEn: r.name,
                        fan: r.fan
                    });
                });
            }

            setScoringResult({
                totalFan: result.totalFan,
                breakdown
            });
        } catch (error: any) {
            alert(language === 'zh' ? `計算失敗: ${error.message}` : `Calculation failed: ${error.message}`);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-2 py-4 transition-all duration-300">
            <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        🎲 {language === 'zh' ? '計番器使用說明' : 'Calculator Instructions'}
                    </h2>
                    <ul className="space-y-1 text-sm opacity-90">
                        <li>• {language === 'zh' ? '選擇牌型組成手牌 (16張)' : 'Select tiles to build hand (16 tiles)'}</li>
                        <li>• {language === 'zh' ? '選擇糊牌 (第17張)' : 'Select winning tile (17th tile)'}</li>
                        <li>• {language === 'zh' ? '設定花牌、特殊事件等選項' : 'Configure flowers, special events, etc.'}</li>
                    </ul>
                </div>

                {/* Current Hand Display */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {language === 'zh' ? '當前手牌' : 'Current Hand'} ({handTiles.length}/16)
                        </h3>
                    </div>

                    {/* Status/Hand Type Controls - Mobile Optimized */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        {/* 叮 */}
                        <label className="flex items-center gap-1 cursor-pointer group bg-slate-50 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={isListening}
                                onChange={(e) => {
                                    setIsListening(e.target.checked);
                                    if (e.target.checked) setIsListeningOneShot(false);
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-amber-500 transition-colors">
                                {language === 'zh' ? '叮' : 'Listen'}
                            </span>
                        </label>

                        {/* 叮(一發) */}
                        <label className="flex items-center gap-1 cursor-pointer group bg-slate-50 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={isListeningOneShot}
                                onChange={(e) => {
                                    setIsListeningOneShot(e.target.checked);
                                    if (e.target.checked) setIsListening(false);
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-amber-600 transition-colors">
                                {language === 'zh' ? '叮(一發)' : 'One Shot'}
                            </span>
                        </label>

                        {/* 自摸 */}
                        <label className="flex items-center gap-1 cursor-pointer group bg-slate-50 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={isSelfDraw}
                                onChange={(e) => setIsSelfDraw(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors">
                                {language === 'zh' ? '自摸' : 'Self-draw'}
                            </span>
                        </label>

                        {/* 門清 */}
                        <label className="flex items-center gap-1 cursor-pointer group bg-slate-50 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={isConcealed}
                                onChange={(e) => setIsConcealed(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                                {language === 'zh' ? '門清' : 'Concealed'}
                            </span>
                        </label>

                        {/* 莊家 */}
                        <label className="flex items-center gap-1 cursor-pointer group bg-slate-50 dark:bg-slate-800 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={isDealer}
                                onChange={(e) => setIsDealer(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">
                                {language === 'zh' ? '莊家' : 'Dealer'}
                            </span>
                        </label>

                        <button
                            onClick={clearAll}
                            className="px-2 sm:px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shadow-sm ml-auto text-[10px] sm:text-sm whitespace-nowrap"
                        >
                            🗑️ {language === 'zh' ? '清空' : 'Clear'}
                        </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 grid grid-cols-9 gap-2 transition-all mt-4">
                        {handTiles.length === 0 ? (
                            <div className="col-span-9 text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                                {language === 'zh' ? '點擊下方按鈕加入牌型 (共需17張)' : 'Click buttons below to add 17 tiles'}
                            </div>
                        ) : (
                            handTiles.map((tile, index) => {
                                const isWinner = winnerIndex === index;
                                return (
                                    <div key={index} className="relative">
                                        <button
                                            onClick={() => {
                                                if (handTiles.length === 17) {
                                                    setWinnerIndex(isWinner ? null : index);
                                                } else {
                                                    removeTile(index);
                                                }
                                            }}
                                            className={`relative w-full aspect-[3/4] flex items-center justify-center bg-white dark:bg-slate-700 border-2 rounded-lg font-bold text-base sm:text-lg transition-all shadow-sm group
                                                ${isWinner
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 z-10 scale-105'
                                                    : handTiles.length === 17 && winnerIndex === null
                                                        ? 'border-emerald-300 animate-pulse hover:scale-110'
                                                        : 'border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400'}
                                        `}
                                        >
                                            {tile.displayChar}
                                            {isWinner && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] sm:text-[10px] px-1 sm:px-2 py-0.5 rounded-full font-bold shadow-md z-20">
                                                    胡
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {handTiles.length === 17 && winnerIndex === null && (
                        <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold text-center animate-bounce">
                            💡 {language === 'zh' ? '請點擊上方其中一張牌作為「胡牌」' : 'Please click one of the tiles above as the Winning Tile'}
                        </div>
                    )}
                </div>

                {/* Tile Selector */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        🀄 {language === 'zh' ? '選擇牌型' : 'Select Tiles'}
                    </h3>

                    <div className="space-y-6">
                        {allTiles.map((category) => (
                            <div key={category.category}>
                                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                                    {category.category}
                                </h4>
                                <div className="grid grid-cols-9 gap-2">
                                    {category.tiles.map((tile, index) => (
                                        <div key={index} className="relative group">
                                            <button
                                                onClick={() => addTile(tile)}
                                                disabled={handTiles.length >= 17 || handTiles.filter(t => t.suit === tile.suit && t.value === tile.value).length >= 4}
                                                className={`w-full aspect-[3/4] flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 rounded-lg font-bold text-base sm:text-lg transition-all shadow-sm ${handTiles.length >= 17 || handTiles.filter(t => t.suit === tile.suit && t.value === tile.value).length >= 4 ? 'border-slate-200 opacity-30 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-600'
                                                    }`}
                                            >
                                                {tile.displayChar}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Honor tiles */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                                {language === 'zh' ? '🌪️ 風牌 & 🐉 三元牌' : '🌪️ Winds & 🐉 Dragons'}
                            </h4>
                            <div className="grid grid-cols-9 gap-2">
                                {honorTiles.map((tile, index) => (
                                    <div key={index} className="relative group">
                                        <button
                                            onClick={() => addTile(tile)}
                                            disabled={handTiles.length >= 17 || handTiles.filter(t => t.suit === tile.suit && t.value === tile.value).length >= 4}
                                            className={`w-full aspect-[3/4] flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 rounded-lg font-bold text-base sm:text-lg transition-all shadow-sm ${handTiles.length >= 17 || handTiles.filter(t => t.suit === tile.suit && t.value === tile.value).length >= 4 ? 'border-slate-200 opacity-30 cursor-not-allowed' : 'border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-600'
                                                }`}
                                        >
                                            {tile.displayChar}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Options */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        ⚙️ {language === 'zh' ? '遊戲設定' : 'Game Settings'}
                    </h3>

                    <div className="space-y-6">
                        {/* Flowers */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                🌸 {language === 'zh' ? '花牌' : 'Flowers'} ({language === 'zh' ? '正花+2番, 爛花+1番' : 'Seat Flower +2, Others +1'})
                            </label>
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => toggleFlower(num)}
                                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${flowers.includes(num)
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        {num <= 4 ? ['梅', '蘭', '菊', '竹'][num - 1] : ['春', '夏', '秋', '冬'][num - 5]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kongs */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                🎋 {language === 'zh' ? '槓子' : 'Kongs'} ({language === 'zh' ? '明槓+1, 暗槓+2' : 'Exposed +1, Concealed +2'})
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(() => {
                                    // Calculate how many 4-of-a-kinds are in the hand
                                    const mapToEngineTile = (tile: Tile): EngineTile => {
                                        if (tile.suit === 'wind') return { suit: 'zi' as const, wind: tile.value as any };
                                        if (tile.suit === 'dragon') return { suit: 'zi' as const, dragon: tile.value as any };
                                        return { suit: tile.suit as any, value: Number(tile.value) };
                                    };
                                    const allTilesInHand = handTiles.map(mapToEngineTile);
                                    const counts: Record<string, number> = {};
                                    allTilesInHand.forEach(t => {
                                        const key = t.suit === 'zi' ? (t.wind || t.dragon || '') : `${t.suit}${t.value}`;
                                        counts[key] = (counts[key] || 0) + 1;
                                    });
                                    const possibleKongs = Object.values(counts).filter(c => c >= 4).length;
                                    const currentTotalKongs = exposedKongs + concealedKongs;
                                    const canAddKong = currentTotalKongs < possibleKongs;

                                    return (
                                        <>
                                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 sm:p-2 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-700 gap-1">
                                                <span className="font-semibold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 truncate">{language === 'zh' ? '明槓' : 'Exp.'}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setExposedKongs(Math.max(0, exposedKongs - 1))} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">-</button>
                                                    <span className="w-3 text-center font-bold text-indigo-600 text-xs">{exposedKongs}</span>
                                                    <button
                                                        onClick={() => canAddKong && setExposedKongs(exposedKongs + 1)}
                                                        disabled={!canAddKong}
                                                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm font-bold transition-colors ${!canAddKong ? 'opacity-30 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800 p-1.5 sm:p-2 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-700 gap-1">
                                                <span className="font-semibold text-[10px] sm:text-xs md:text-sm text-slate-700 dark:text-slate-300 truncate">{language === 'zh' ? '暗槓' : 'Con.'}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setConcealedKongs(Math.max(0, concealedKongs - 1))} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">-</button>
                                                    <span className="w-3 text-center font-bold text-indigo-600 text-xs">{concealedKongs}</span>
                                                    <button
                                                        onClick={() => canAddKong && setConcealedKongs(concealedKongs + 1)}
                                                        disabled={!canAddKong}
                                                        className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm font-bold transition-colors ${!canAddKong ? 'opacity-30 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Special Events */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                🎭 {language === 'zh' ? '特殊事件' : 'Special Events'}
                            </label>
                            {(() => {
                                // Calculate possible kongs for grey-out logic
                                const mapToEngineTile = (tile: Tile): EngineTile => {
                                    if (tile.suit === 'wind') return { suit: 'zi' as const, wind: tile.value as any };
                                    if (tile.suit === 'dragon') return { suit: 'zi' as const, dragon: tile.value as any };
                                    return { suit: tile.suit as any, value: Number(tile.value) };
                                };
                                const allTilesInHand = handTiles.map(mapToEngineTile);
                                const counts: Record<string, number> = {};
                                allTilesInHand.forEach(t => {
                                    const key = t.suit === 'zi' ? (t.wind || t.dragon || '') : `${t.suit}${t.value}`;
                                    counts[key] = (counts[key] || 0) + 1;
                                });
                                const has4 = Object.values(counts).some(c => c >= 4);

                                // Auto de-select kong events if no longer valid
                                if (!has4 && (selectedEvents.includes('e-2') || selectedEvents.includes('e-3'))) {
                                    setTimeout(() => {
                                        setSelectedEvents(selectedEvents.filter(id => id !== 'e-2' && id !== 'e-3'));
                                    }, 0);
                                }

                                // Rows for UI
                                const rows = [
                                    { ids: ['e-12', 'e-10', 'e-11'], title: '天地人' },
                                    { ids: ['e-13', 'e-1'], title: '海底/花上', independent: true },
                                    { ids: ['e-2', 'e-3'], title: '槓相關', kongRequired: true },
                                    { ids: ['e-4', 'e-5'], title: '雙三響' },
                                    { ids: ['e-9', 'e-8'], title: '全半求人' },
                                    { ids: ['e-7', 'e-6'], title: '剩餘牌數' }
                                ];

                                return (
                                    <div className="space-y-3">
                                        {rows.map((row, rowIdx) => (
                                            <div key={rowIdx} className={`grid ${rowIdx === 0 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'} gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800`}>
                                                {row.ids.map(id => {
                                                    const event = specialEvents.find(e => e.id === id);
                                                    if (!event) return null;
                                                    const isSelected = selectedEvents.includes(id);
                                                    let disabled = false;
                                                    if (row.kongRequired && !has4) disabled = true;

                                                    return (
                                                        <button
                                                            key={id}
                                                            onClick={() => !disabled && toggleEvent(id)}
                                                            disabled={disabled}
                                                            className={`px-3 py-2 rounded-lg font-semibold transition-all text-xs md:text-sm text-center border
                                                                ${isSelected
                                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                                                    : disabled
                                                                        ? 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                                                                }`}
                                                        >
                                                            {language === 'zh' ? event.name : event.nameEn}
                                                            <div className={`text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'}`}>+{event.fan}番</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Basic Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-slate-700">

                            {/* Dealer Streak */}
                            {isDealer && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        {language === 'zh' ? '連莊數' : 'Dealer Streak'}: {dealerStreak}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={dealerStreak}
                                        onChange={(e) => setDealerStreak(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            {/* Seat Wind */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    {language === 'zh' ? '座位風' : 'Seat Wind'}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['east', 'south', 'west', 'north'] as const).map((wind) => (
                                        <button
                                            key={wind}
                                            onClick={() => setSeatWind(wind)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${seatWind === wind
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                }`}
                                        >
                                            {wind === 'east' ? '東' : wind === 'south' ? '南' : wind === 'west' ? '西' : '北'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={() => calculateScore()}
                    disabled={handTiles.length !== 17 || winnerIndex === null}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    🎯 {language === 'zh' ? '計算番數' : 'Calculate Score'}
                </button>

                {/* Result Display */}
                {scoringResult && (
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-2xl animate-fadeIn">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            ✨ {language === 'zh' ? '計算結果' : 'Result'}
                        </h3>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-4">
                            <div className="text-center">
                                <div className="text-6xl font-bold mb-2">{scoringResult.totalFan}</div>
                                <div className="text-xl opacity-90">{language === 'zh' ? '番' : 'Fan'}</div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="font-bold text-lg mb-3">{language === 'zh' ? '番數明細' : 'Scoring Breakdown'}</h4>
                            <div className="space-y-2">
                                {scoringResult.breakdown.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg">
                                        <span>{language === 'zh' ? item.name : item.nameEn}</span>
                                        <span className="font-bold">+{item.fan}番</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Modal for 8 Flowers Selection */}
            {showFlowerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
                            🌺 {language === 'zh' ? '花胡選擇' : 'Flower Win Type'}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => { setShowFlowerModal(false); calculateScore('e-14'); }}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-rose-400 transition-all group"
                            >
                                <div className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-rose-600 transition-colors">
                                    {language === 'zh' ? '八仙過海' : 'Eight Immortals'}
                                </div>
                                <div className="text-sm text-rose-600 dark:text-rose-400 font-bold mt-1">100 {language === 'zh' ? '番' : 'Fan'}</div>
                            </button>
                            <button
                                onClick={() => { setShowFlowerModal(false); calculateScore('e-15'); }}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-400 transition-all group"
                            >
                                <div className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-indigo-600 transition-colors">
                                    {language === 'zh' ? '一搶七' : 'One Robs Seven'}
                                </div>
                                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-1">30 {language === 'zh' ? '番' : 'Fan'}</div>
                            </button>
                            <button
                                onClick={() => { setShowFlowerModal(false); calculateScore('e-16'); }}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-400 transition-all group"
                            >
                                <div className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-indigo-600 transition-colors">
                                    {language === 'zh' ? '七搶一' : 'Seven Robs One'}
                                </div>
                                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-1">30 {language === 'zh' ? '番' : 'Fan'}</div>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowFlowerModal(false)}
                            className="mt-6 w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-medium"
                        >
                            {language === 'zh' ? '取消' : 'Cancel'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreCalculatorPage;
