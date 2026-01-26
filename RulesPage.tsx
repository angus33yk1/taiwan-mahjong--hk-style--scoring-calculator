
import React from 'react';

const RulesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <section className="bg-blue-50 dark:bg-slate-900 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
          📌 重要說明 <span className="text-sm font-normal opacity-70">Important Info</span>
        </h2>
        <ul className="space-y-3 text-blue-900 dark:text-slate-300 list-disc ml-5 font-medium">
          <li><strong>有效牌數：</strong> 手牌 + 上/碰組數×3 + 胡牌 = 17張（<span className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-1 rounded">槓和花不計入</span>）</li>
          <li><strong>底番：</strong> 所有胡牌都有 <strong>5番</strong> 基礎底番 (Base)</li>
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
              { title: "缺一門 / 無字", desc: "兩者不可同時計算，僅取其一。" },
              { title: "四同順 / 五同順", desc: "不再計二/三相逢或般高。" },
              { title: "門清自摸", desc: "已包含門清與自摸，不另分開計。" },
              { title: "無字花", desc: "包含無字與無花。" }
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
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-4 mb-6 flex justify-between">
          <span>🔄 遊戲流程</span>
          <span className="text-xs font-normal text-slate-400">Turn Flow</span>
        </h3>
        <ol className="space-y-4">
          {[
            { title: "開局配牌", desc: "莊家17張，閒家16張。發現花牌立即補牌。" },
            { title: "莊家開始", desc: "莊家先打出一張牌。" },
            { title: "輪流抓打", desc: "逆時針輪流，每人抓一張、打一張。" },
            { title: "吃碰槓", desc: "其他玩家可以吃、碰、槓（見下方規則）。" },
            { title: "胡牌判定", desc: "符合胡牌條件者喊「胡」，計算番數結算。" }
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
            <li>• <strong>條件：</strong>只能吃上家（左邊玩家）的牌</li>
            <li>• <strong>組成：</strong>順子（如 123、456）</li>
            <li>• <strong>放置：</strong>吃牌後放在桌前（明牌）</li>
            <li>• <strong>效果：</strong>失去門清資格</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🥟 碰 (Pong)
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• <strong>條件：</strong>可以碰任何家的牌</li>
            <li>• <strong>組成：</strong>刻子（3張相同牌）</li>
            <li>• <strong>放置：</strong>碰牌後放在桌前（明牌）</li>
            <li>• <strong>效果：</strong>失去門清資格</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            🎋 槓 (Kong)
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• <strong>明槓：</strong>用別人打的牌組成（1番）</li>
            <li>• <strong>暗槓：</strong>手中自有4張（2番）</li>
            <li>• <strong>補牌：</strong>槓牌後從牌尾補一張</li>
            <li>• <strong>槓上開花：</strong>補牌後自摸加1番</li>
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
                <p className="font-semibold text-rose-700 dark:text-rose-300 mb-2">🌺 花系列</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">梅(1) 蘭(2) 菊(3) 竹(4)</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">🌿 季系列</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">春(1) 夏(2) 秋(3) 冬(4)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">摸花規則</h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="text-2xl">📥</span>
                <div>
                  <strong>摸到花牌：</strong>立即放在桌前，從牌尾補一張牌
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">💐</span>
                <div>
                  <strong>正花：</strong>花牌數字與座位相同（東=1, 南=2, 西=3, 北=4），每張 +2番
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🥀</span>
                <div>
                  <strong>爛花：</strong>花牌數字與座位不同，每張 +1番
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border-l-4 border-amber-500">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3">🌟 特殊花牌胡法</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">8隻花（兩台花）</p>
                <p className="text-slate-600 dark:text-slate-400">摸齊8張花牌即胡 - <strong className="text-rose-600">100番</strong></p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">1搶7 / 7搶1</p>
                <p className="text-slate-600 dark:text-slate-400">1人有7張花，另1人摸到第8張 - <strong className="text-rose-600">30番</strong></p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">花上食胡</p>
                <p className="text-slate-600 dark:text-slate-400">補花後自摸 - <strong className="text-rose-600">+1番</strong></p>
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
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">面子類型：</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• <strong>順子：</strong>連續3張（如 234萬）</li>
                    <li>• <strong>刻子：</strong>相同3張（如 888筒）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">眼（對子）：</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• 2張相同的牌</li>
                    <li>• 如果是 2, 5, 8 → +2番（將眼）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3">特殊胡牌牌型</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "十三么", desc: "所有么九及字牌各一張+1對", fan: "80番" },
                { name: "七對（嚦咕嚦咕）", desc: "8個對子", fan: "40番" },
                { name: "十六不搭", desc: "16張完全不搭的牌", fan: "40番" },
                { name: "間間胡", desc: "門清自摸對對胡", fan: "100番" }
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
                <p className="font-bold text-green-700 dark:text-green-300 mb-2">🎯 自摸</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  自己抓到胡牌 - 三家各付全額
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎲 放槍（出沖）</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  別人打出的牌能胡 - 該家獨自付款
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
            { name: "追 (Follow)", cost: "1底", detail: "四家打同牌" },
            { name: "一台花 (Flower Set)", cost: "1底", detail: "摸齊同色四花" },
            { name: "圍骰 (Dealer Triple)", cost: "1底x3", detail: "莊家擲圍骰" },
            { name: "詐胡 (False Win)", cost: "30番x3", detail: "賠付全場" }
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
