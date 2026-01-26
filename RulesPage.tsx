
import React from 'react';

const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <section className="bg-blue-50 dark:bg-slate-900 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
          📌 重要說明 <span className="text-sm font-normal opacity-70">Important Info</span>
        </h2>
        <ul className="space-y-3 text-blue-900 dark:text-slate-300 list-disc ml-5 font-medium">
          <li><strong>有效牌數 (Valid Tiles)：</strong> 手牌 + 上/碰組數×3 + 胡牌 = 17張（<span className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded">槓和花不計入 Kongs & Flowers excluded</span>）</li>
          <li><strong>底番 (Base Fan)：</strong> 所有胡牌都有 <strong>5番</strong> 基礎底番 (All wins have 5 base fans)</li>
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
            <span>📖 計算流程</span>
            <span className="text-xs font-normal text-slate-400">Calculation Flow</span>
          </h3>
          <ol className="space-y-4">
            {[
              "檢查特殊牌型 (Check Special Patterns)",
              "分析標準組合 (Analyze 5 Groups + 1 Pair)",
              "計算各類組合番 (Calculate Chow/Pung/Family combos)",
              "選擇最高番數組合 (Select highest fan combo)",
              "加上特殊事件番 (Add Special Events)",
              "底番檢查 (Add Base)",
              "最後加上莊家番 (Add Dealer Bonuses)"
            ].map((step, idx) => (
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
            <span>⚠️ 不重複計算</span>
            <span className="text-xs font-normal text-slate-400">Non-Overlap Rules</span>
          </h3>
          <ul className="space-y-4">
            {[
              { title: "缺一門 / 無字 (One Suit Lacking / No Honors)", desc: "兩者不可同時計算，僅取其一。 Cannot count both, take only one." },
              { title: "四同順 / 五同順 (Quad/Quint Chow)", desc: "不再計二/三相逢或般高。 Do not count Double/Triple Mixed or Pure Chows." },
              { title: "門清自摸 (Concealed Self-Draw)", desc: "已包含門清與自摸，不另分開計。 Includes Concealed Hand and Self-Draw." },
              { title: "無字花 (No Honors No Flowers)", desc: "包含無字與無花。 Includes No Honors and No Flowers." }
            ].map((rule, idx) => (
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
          <span>🎮 遊戲概述</span>
          <span className="text-xs font-normal text-slate-400">Game Overview</span>
        </h3>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p className="leading-relaxed">
            <strong className="text-indigo-600 dark:text-indigo-400">台灣麻雀（港式）</strong>是一種 <strong>4人</strong> 遊戲，
            使用 <strong>144張牌</strong>（包含萬、筒、索、風、三元、花牌）。
            <br />
            <span className="text-sm opacity-80">Taiwan Mahjong (HK Style) is a 4-player game using 144 tiles (Suits, Winds, Dragons, Flowers).</span>
          </p>
          <p className="leading-relaxed">
            每位玩家起手 <strong>16張手牌</strong>，輪流 <strong>抓牌</strong> 和 <strong>打牌</strong>，
            目標是組成符合胡牌條件的牌型（通常為 <strong>5組+1對</strong>），共 <strong>17張</strong>。
            <br />
            <span className="text-sm opacity-80">Goal: Form a winning hand of 5 groups + 1 pair (17 tiles total). Start with 16 tiles.</span>
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="font-semibold text-indigo-800 dark:text-indigo-300">
              💡 重要：槓和花不計入17張有效牌數
              <br />
              <span className="text-sm font-normal">Important: Kongs and Flowers do not count towards the 17-tile count.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🔄 遊戲流程</span>
          <span className="text-xs font-normal text-slate-400">Turn Flow</span>
        </h3>
        <ol className="space-y-4">
          {[
            { title: "開局配牌 (Initial Deal)", desc: "莊家17張，閒家16張。發現花牌立即補牌。 Dealer 17, others 16. Replenish flowers immediately." },
            { title: "莊家開始 (Dealer Starts)", desc: "莊家先打出一張牌。 Dealer discards first." },
            { title: "輪流抓打 (Turn Rotation)", desc: "逆時針輪流，每人抓一張、打一張。 Counter-clockwise. Draw one, discard one." },
            { title: "吃碰槓 (Melds)", desc: "其他玩家可以吃、碰、槓。 Others can Chow, Pung, or Kong." },
            { title: "胡牌判定 (Winning)", desc: "符合胡牌條件者喊「胡」，計算番數結算。 Declare 'Hu' when winning condition is met." }
          ].map((step, idx) => (
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
            🍜 吃 (Chow)
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• <strong>條件 (Condition)：</strong>只能吃上家（左邊玩家）的牌 / Only from left player</li>
            <li>• <strong>組成 (Form)：</strong>順子（如 123、456）/ Sequence (e.g. 123)</li>
            <li>• <strong>放置 (Place)：</strong>吃牌後放在桌前（明牌）/ Exposed on table</li>
            <li>• <strong>效果 (Effect)：</strong>失去門清資格 / Lose Concealed status</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🥟 碰 (Pong)
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• <strong>條件 (Condition)：</strong>可以碰任何家的牌 / From any player</li>
            <li>• <strong>組成 (Form)：</strong>刻子（3張相同牌）/ Triplet (3 identical)</li>
            <li>• <strong>放置 (Place)：</strong>碰牌後放在桌前（明牌）/ Exposed on table</li>
            <li>• <strong>效果 (Effect)：</strong>失去門清資格 / Lose Concealed status</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🎋 槓 (Kong)
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• <strong>明槓 (Exposed Kong)：</strong>用別人打的牌組成（1番）/ From discard (1 fan)</li>
            <li>• <strong>暗槓 (Concealed Kong)：</strong>手中自有4張（2番）/ 4 in hand (2 fans)</li>
            <li>• <strong>補牌 (Replacement)：</strong>槓牌後從牌尾補一張 / Draw replacement from back</li>
            <li>• <strong>槓上開花 (Kong Win)：</strong>補牌後自摸加1番 / Win on Kong replacement (+1 fan)</li>
          </ul>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🌸 花牌處理規則</span>
          <span className="text-xs font-normal text-slate-400">Flower Tiles</span>
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">花牌種類（共8張）</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-lg border border-rose-200 dark:border-rose-900">
                <p className="font-semibold text-rose-700 dark:text-rose-300 mb-2">🌺 花系列 (Flowers)</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">梅(1) 蘭(2) 菊(3) 竹(4)<br />Plum Orchid Chrys Bamboo</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">🌿 季系列 (Seasons)</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">春(1) 夏(2) 秋(3) 冬(4)<br />Spring Summer Autumn Winter</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">摸花規則</h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="text-2xl">📥</span>
                <div>
                  <strong>摸到花牌 (Draw):</strong> 立即放在桌前，從牌尾補一張牌 (Reveal & replace)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">💐</span>
                <div>
                  <strong>正花 (Seat Flower):</strong> 花牌數字與座位相同（東=1, 南=2, 西=3, 北=4），每張 +2番 (+2 Fan if matches seat)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🥀</span>
                <div>
                  <strong>爛花 (Mixed Flower):</strong> 花牌數字與座位不同，每張 +1番 (+1 Fan if different)
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border-l-4 border-amber-500">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">🌟 特殊花牌胡法</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">8隻花 (8 Flowers) - <strong className="text-rose-600">100番</strong></p>
                <p className="text-slate-600 dark:text-slate-400">摸齊8張花牌即胡 / Collect all 8 flowers</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">1搶7 / 7搶1 (Stealing)</p>
                <p className="text-slate-600 dark:text-slate-400">1人有7張花，另1人摸到第8張 / 7 flowers vs 1 flower - <strong className="text-rose-600">30番</strong></p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">花上食胡 (Win on Flower)</p>
                <p className="text-slate-600 dark:text-slate-400">補花後自摸 / Self-draw after flower replacement - <strong className="text-rose-600">+1番</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>✅ 胡牌條件</span>
          <span className="text-xs font-normal text-slate-400">Winning Conditions</span>
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">標準胡牌組合（17張）</h4>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <p className="text-lg font-mono text-center text-slate-800 dark:text-slate-200 mb-4">
                5組面子 + 1對眼 = 17張
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">面子類型 (Melds)：</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• <strong>順子 (Sequence)：</strong>連續3張（如 234萬）/ e.g. 234</li>
                    <li>• <strong>刻子 (Triplet)：</strong>相同3張（如 888筒）/ e.g. 888</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">眼 (Eyes/Pair)：</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• 2張相同的牌 / 2 identical tiles</li>
                    <li>• 如果是 2, 5, 8 → +2番（將眼）/ Rank 2,5,8 = +2 Fan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">特殊胡牌牌型</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "十三么 (13 Orphans)", desc: "所有么九及字牌各一張+1對", fan: "80番" },
                { name: "七對 (7 Pairs)", desc: "8個對子 / 8 pairs", fan: "40番" },
                { name: "十六不搭 (16 Unrelated)", desc: "16張完全不搭的牌 / No relations", fan: "40番" },
                { name: "間間胡 (All Concealed)", desc: "門清自摸對對胡 / Concealed All Pungs", fan: "100番" }
              ].map((pattern, idx) => (
                <div key={idx} className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-purple-700 dark:text-purple-300">{pattern.name}</p>
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">{pattern.fan}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{pattern.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">胡牌方式</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-700 dark:text-green-300 mb-2">🎯 自摸 (Self-Draw)</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  自己抓到胡牌 - 三家各付全額 / Draw win - 3 players pay full
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎲 放槍 (Discard Win)</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  別人打出的牌能胡 - 該家獨自付款 / Win on discard - Discarder pays all
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-2xl shadow-xl transition-colors">
        <h3 className="text-xl font-bold mb-8 text-indigo-300">💰 經濟規則與制度 <span className="text-sm font-normal text-slate-500">Economy</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">計錢方法 (Pay Method)</h4>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700">
              <p className="font-mono text-indigo-200 mb-2">收入 = (番數 × 每番金額) + 底注</p>
              <p className="text-slate-400 text-sm">Income = (Fan x Rate) + Base Stake</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-indigo-400 mb-4 uppercase tracking-wider text-sm">拉注制度 (Pull System)</h4>
            <p className="text-slate-300 leading-relaxed text-sm italic">
              上一鋪胡出的，今鋪又胡出，上一鋪其他家輸了錢要先乘 1.5 倍，再加上這鋪輸的錢。
              Winning streaks increase stakes by 1.5x for losers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>💵 即時付款項目</span>
          <span className="text-xs font-normal text-slate-400">Instant Payments</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "追 (Follow)", cost: "1底", detail: "四家打同牌 / 4 discards same tile" },
            { name: "一台花 (Flower Set)", cost: "1底", detail: "摸齊同色四花 / All 4 matching flowers" },
            { name: "圍骰 (Dealer Triple)", cost: "1底x3", detail: "莊家擲圍骰 / Dealer rolls triples" },
            { name: "詐胡 (False Win)", cost: "30番x3", detail: "賠付全場 / Pay everyone" }
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
