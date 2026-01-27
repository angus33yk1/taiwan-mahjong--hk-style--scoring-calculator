import React from 'react';
import { useApp } from './AppContext';

const RulesPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <section className="bg-blue-50 dark:bg-slate-900 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
          📌 {language === 'zh' ? '重要說明' : 'Important Info'}
        </h2>
        <ul className="space-y-3 text-blue-900 dark:text-slate-300 list-disc ml-5 font-medium">
          {language === 'zh' ? (
            <>
              <li><strong>有效牌數：</strong> 手牌 + 上/碰組數×3 + 胡牌 = 17張（<span className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded">槓和花不計入</span>）</li>
              <li><strong>底番：</strong> 所有胡牌都有 <strong>5番</strong> 基礎底番</li>
            </>
          ) : (
            <>
              <li><strong>Valid Tiles:</strong> Hand + Meled Sets×3 + Winning Tile = 17 tiles (<span className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded">Kongs & Flowers excluded</span>)</li>
              <li><strong>Base Fan:</strong> All winning hands have a base of <strong>5 Fan</strong>.</li>
            </>
          )}
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
            <span>📖 {language === 'zh' ? '計算流程' : 'Calculation Flow'}</span>
          </h3>
          <ol className="space-y-4">
            {(language === 'zh' ? [
              "檢查特殊牌型",
              "分析標準組合 (5組面子 + 1對眼)",
              "計算各類組合番 (家/順/刻)",
              "選擇最高番數組合",
              "加上特殊事件番",
              "底番檢查",
              "最後加上莊家番"
            ] : [
              "Check Special Patterns",
              "Analyze Standard Combinations (5 sets + 1 pair)",
              "Calculate Meld/Suit/Family Fans",
              "Select Highest Scoring Combination",
              "Add Special Event Fans",
              "Add Base Fan",
              "Add Dealer Bonus"
            ]).map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <span className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
            <span>⚠️ {language === 'zh' ? '不重複計算' : 'Non-Overlap Rules'}</span>
          </h3>
          <ul className="space-y-4">
            {(language === 'zh' ? [
              { title: "缺一門 / 無字", desc: "兩者不可同時計算，僅取其一。" },
              { title: "四同順 / 五同順", desc: "不再計二/三相逢或般高。" },
              { title: "門清自摸", desc: "已包含門清與自摸，不另分開計。" },
              { title: "無字花", desc: "包含無字與無花。" }
            ] : [
              { title: "One Suit Lacking / No Honors", desc: "Cannot count both, take only one." },
              { title: "Quad/Quint Chow", desc: "Do not count Double/Triple Mixed or Pure Chows separately." },
              { title: "Concealed Self-Draw", desc: "Includes benefits of both Concealed Hand and Self-Draw." },
              { title: "No Honors No Flowers", desc: "Includes No Honors and No Flowers." }
            ]).map((rule, idx) => (
              <li key={idx} className="group">
                <span className="block font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{rule.title}</span>
                <span className="text-sm text-slate-500 dark:text-slate-500">{rule.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* GAMEPLAY RULES SECTIONS */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🎮 {language === 'zh' ? '遊戲概述' : 'Game Overview'}</span>
        </h3>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          {language === 'zh' ? (
            <>
              <p className="leading-relaxed">
                <strong className="text-indigo-600 dark:text-indigo-400">台灣麻雀（港式）</strong>是一種 <strong>4人</strong> 遊戲，
                使用 <strong>144張牌</strong>（包含萬、筒、索、風、三元、花牌）。
              </p>
              <p className="leading-relaxed">
                每位玩家起手 <strong>16張手牌</strong>，輪流 <strong>抓牌</strong> 和 <strong>打牌</strong>，
                目標是組成符合胡牌條件的牌型（通常為 <strong>5組+1對</strong>），共 <strong>17張</strong>。
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border-l-4 border-indigo-500">
                <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                  💡 重要：槓和花不計入17張有效牌數
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="leading-relaxed">
                <strong className="text-indigo-600 dark:text-indigo-400">Taiwan Mahjong (HK Style)</strong> is a <strong>4-player</strong> game using <strong>144 tiles</strong> (Suits, Winds, Dragons, Flowers).
              </p>
              <p className="leading-relaxed">
                Each player starts with <strong>16 tiles</strong>. Players take turns to <strong>draw</strong> and <strong>discard</strong> tiles.
                The goal is to form a winning hand of valid method (usually <strong>5 groups + 1 pair</strong>), totaling <strong>17 tiles</strong>.
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border-l-4 border-indigo-500">
                <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                  💡 Note: Kongs and Flowers do not count towards the 17-tile limit.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🔄 {language === 'zh' ? '遊戲流程' : 'Turn Flow'}</span>
        </h3>
        <ol className="space-y-4">
          {(language === 'zh' ? [
            { title: "開局配牌", desc: "莊家17張，閒家16張。發現花牌立即補牌。" },
            { title: "莊家開始", desc: "莊家先打出一張牌。" },
            { title: "輪流抓打", desc: "逆時針輪流，每人抓一張、打一張。" },
            { title: "吃碰槓", desc: "其他玩家可以吃、碰、槓。" },
            { title: "胡牌判定", desc: "符合胡牌條件者喊「胡」，計算番數結算。" }
          ] : [
            { title: "Initial Deal", desc: "Dealer 17 tiles, others 16. Replenish flowers immediately." },
            { title: "Dealer Starts", desc: "Dealer discards the first tile." },
            { title: "Turn Rotation", desc: "Counter-clockwise. Draw one, discard one." },
            { title: "Melds", desc: "Others can Chow, Pung, or Kong discards." },
            { title: "Winning", desc: "Declare 'Hu' when winning condition is met." }
          ]).map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                {idx + 1}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{step.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🍜 {language === 'zh' ? '吃 (Chow)' : 'Chow'}
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {language === 'zh' ? (
              <>
                <li>• <strong>條件：</strong>只能吃上家（左邊玩家）的牌</li>
                <li>• <strong>組成：</strong>順子（如 123、456）</li>
                <li>• <strong>放置：</strong>吃牌後放在桌前（明牌）</li>
                <li>• <strong>效果：</strong>失去門清資格</li>
              </>
            ) : (
              <>
                <li>• <strong>Condition:</strong> Only from expected provider (left player).</li>
                <li>• <strong>Form:</strong> Sequence (e.g., 123, 456).</li>
                <li>• <strong>Place:</strong> Exposed on table.</li>
                <li>• <strong>Effect:</strong> Lose Concealed status.</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🥟 {language === 'zh' ? '碰 (Pong)' : 'Pung'}
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {language === 'zh' ? (
              <>
                <li>• <strong>條件：</strong>可以碰任何家的牌</li>
                <li>• <strong>組成：</strong>刻子（3張相同牌）</li>
                <li>• <strong>放置：</strong>碰牌後放在桌前（明牌）</li>
                <li>• <strong>效果：</strong>失去門清資格</li>
              </>
            ) : (
              <>
                <li>• <strong>Condition:</strong> From any player's discard.</li>
                <li>• <strong>Form:</strong> Triplet (3 identical tiles).</li>
                <li>• <strong>Place:</strong> Exposed on table.</li>
                <li>• <strong>Effect:</strong> Lose Concealed status.</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🎋 {language === 'zh' ? '槓 (Kong)' : 'Kong'}
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {language === 'zh' ? (
              <>
                <li>• <strong>明槓：</strong>用別人打的牌組成（1番）</li>
                <li>• <strong>暗槓：</strong>手中自有4張（2番）</li>
                <li>• <strong>補牌：</strong>槓牌後從牌尾補一張</li>
                <li>• <strong>槓上開花：</strong>補牌後自摸加1番</li>
              </>
            ) : (
              <>
                <li>• <strong>Exposed Kong:</strong> From discard (1 Fan).</li>
                <li>• <strong>Concealed Kong:</strong> 4 in hand (2 Fans).</li>
                <li>• <strong>Replacement:</strong> Draw one from the back.</li>
                <li>• <strong>Kong Win:</strong> Win on replacement tile (+1 Fan).</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🌸 {language === 'zh' ? '花牌處理規則' : 'Flower Tiles'}</span>
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">{language === 'zh' ? '花牌種類（共8張）' : 'Types (8 Tiles)'}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-lg border border-rose-200 dark:border-rose-900">
                <p className="font-semibold text-rose-700 dark:text-rose-300 mb-2">🌺 {language === 'zh' ? '花系列' : 'Flowers'}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'zh' ? '梅(1) 蘭(2) 菊(3) 竹(4)' : 'Plum(1) Orchid(2) Chrys(3) Bamboo(4)'}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">🌿 {language === 'zh' ? '季系列' : 'Seasons'}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'zh' ? '春(1) 夏(2) 秋(3) 冬(4)' : 'Spring(1) Summer(2) Autumn(3) Winter(4)'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">{language === 'zh' ? '摸花規則' : 'Flower Rules'}</h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="text-2xl">📥</span>
                <div>
                  <strong>{language === 'zh' ? '摸到花牌:' : 'Draw Flower:'}</strong> {language === 'zh' ? '立即放在桌前，從牌尾補一張牌' : 'Reveal immediately, replace from wall'}
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">💐</span>
                <div>
                  <strong>{language === 'zh' ? '正花:' : 'Seat Flower:'}</strong> {language === 'zh' ? '花牌數字與座位相同，每張 +2番' : 'Matches seat number (1-4). Each worth +2 Fans.'}
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🥀</span>
                <div>
                  <strong>{language === 'zh' ? '爛花:' : 'Mixed Flower:'}</strong> {language === 'zh' ? '花牌數字與座位不同，每張 +1番' : 'Non-matching seat number. Each worth +1 Fan.'}
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border-l-4 border-amber-500">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">🌟 {language === 'zh' ? '特殊花牌胡法' : 'Special Flower Wins'}</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">8隻花 (8 Flowers) - <strong className="text-rose-600">100番/Fan</strong></p>
                <p className="text-slate-600 dark:text-slate-400">{language === 'zh' ? '摸齊8張花牌即胡' : 'Collect all 8 flower tiles.'}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">1搶7 / 7搶1 (Stealing) - <strong className="text-rose-600">30番/Fan</strong></p>
                <p className="text-slate-600 dark:text-slate-400">{language === 'zh' ? '1人有7張花，另1人摸到第8張' : 'One player has 7 flowers, another draws the 8th.'}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{language === 'zh' ? '花上食胡' : 'Win on Flower'}</p>
                <p className="text-slate-600 dark:text-slate-400">{language === 'zh' ? '補花後自摸' : 'Self-draw after a flower replacement.'} - <strong className="text-rose-600">+1番/Fan</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>✅ {language === 'zh' ? '胡牌條件' : 'Winning Conditions'}</span>
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">{language === 'zh' ? '標準胡牌組合 (17張)' : 'Standard Hand (17 Tiles)'}</h4>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <p className="text-lg font-mono text-center text-slate-800 dark:text-slate-200 mb-4">
                5 {language === 'zh' ? '組面子' : 'Groups'} + 1 {language === 'zh' ? '對眼' : 'Pair'} = 17 {language === 'zh' ? '張' : 'Tiles'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{language === 'zh' ? '面子類型' : 'Melds'}:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• <strong>{language === 'zh' ? '順子' : 'Sequence'}:</strong> {language === 'zh' ? '連續3張（如 234萬）' : '3 consecutive tiles (e.g., 234)'}</li>
                    <li>• <strong>{language === 'zh' ? '刻子' : 'Triplet'}:</strong> {language === 'zh' ? '相同3張（如 888筒）' : '3 identical tiles (e.g., 888)'}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{language === 'zh' ? '眼' : 'Eyes/Pair'}:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• {language === 'zh' ? '2張相同的牌' : '2 identical tiles'}</li>
                    <li>• {language === 'zh' ? '如果是 2, 5, 8 → +2番（將眼）' : 'Rank 2, 5, 8 = +2 Fan (Officer Pair)'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">{language === 'zh' ? '特殊胡牌牌型' : 'Special Patterns'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: language === 'zh' ? "十三么" : "13 Orphans", desc: language === 'zh' ? "所有么九及字牌各一張+1對" : "All terminals & honors + 1 pair", fan: "80" },
                { name: language === 'zh' ? "七對" : "7 Pairs", desc: language === 'zh' ? "8個對子" : "8 pairs", fan: "40" },
                { name: language === 'zh' ? "十六不搭" : "16 Unrelated", desc: language === 'zh' ? "16張完全不搭的牌" : "16 unrelated tiles", fan: "40" },
                { name: language === 'zh' ? "間間胡" : "All Concealed", desc: language === 'zh' ? "門清自摸對對胡" : "Concealed All Pungs + Self-Draw", fan: "100" }
              ].map((pattern, idx) => (
                <div key={idx} className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-purple-700 dark:text-purple-300">{pattern.name}</p>
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">{pattern.fan} {language === 'zh' ? '番' : 'Fan'}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{pattern.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">{language === 'zh' ? '胡牌方式' : 'Winning Types'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-700 dark:text-green-300 mb-2">🎯 {language === 'zh' ? '自摸 (Self-Draw)' : 'Self-Draw'}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'zh' ? '自己抓到胡牌 - 三家各付全額' : 'Draw winning tile yourself. All 3 players pay.'}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎲 {language === 'zh' ? '放槍 (Discard Win)' : 'Discard Win'}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'zh' ? '別人打出的牌能胡 - 該家獨自付款' : 'Win on someone else\'s discard. That player pays all.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-2xl shadow-xl transition-colors">
        <h3 className="text-xl font-bold mb-8 text-indigo-300">💰 {language === 'zh' ? '經濟規則與制度' : 'Economy & Stakes'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">{language === 'zh' ? '計錢方法' : 'Payment Method'}</h4>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700">
              <p className="font-mono text-indigo-200 mb-2">{language === 'zh' ? '收入 = (番數 × 每番金額) + 底注' : 'Income = (Fan × Rate) + Base Stake'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">{language === 'zh' ? '拉注制度' : 'Pull (Streak) System'}</h4>
            <p className="text-slate-300 leading-relaxed text-sm italic">
              {language === 'zh'
                ? '上一鋪胡出的，今鋪又胡出，上一鋪其他家輸了錢要先乘 1.5 倍，再加上這鋪輸的錢。'
                : 'If a winner wins again in the next round, the previous losers\' debt is multiplied by 1.5x before adding the new debt.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>💵 {language === 'zh' ? '即時付款項目' : 'Instant Payments'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: language === 'zh' ? "追" : "Follow", cost: "1底", detail: language === 'zh' ? "四家打同牌" : "4 identical discards" },
            { name: language === 'zh' ? "一台花" : "Flower Set", cost: "1底", detail: language === 'zh' ? "摸齊同色四花" : "Collect 4 matching flowers" },
            { name: language === 'zh' ? "圍骰" : "Dealer Triples", cost: "1底x3", detail: language === 'zh' ? "莊家擲圍骰" : "Dealer rolls triples" },
            { name: language === 'zh' ? "詐胡" : "False Win", cost: "30番x3", detail: language === 'zh' ? "賠付全場" : "Pay everyone (Severe)" }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{item.cost}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RulesPage;
