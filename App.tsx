import React, { useState } from 'react';
import ScoreCalculatorPage from './ScoreCalculatorPage';
import ScoreTablePage from './ScoreTablePage';
import RulesPage from './RulesPage';
import { useApp } from './AppContext';

type TabType = 'calculator' | 'table' | 'rules';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('calculator');
    const { language, setLanguage, theme, setTheme } = useApp();

    const tabs = [
        { id: 'calculator' as TabType, icon: '🎲', label: '計番器', labelEn: 'Calculator' },
        { id: 'table' as TabType, icon: '📊', label: '番數表', labelEn: 'Score Table' },
        { id: 'rules' as TabType, icon: '📖', label: '規則', labelEn: 'Rules' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                🀄 {language === 'zh' ? '台灣麻雀計番器' : 'Taiwan Mahjong Calculator'}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Taiwan Mahjong (HK-Style) Scoring Calculator
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold text-sm"
                                title={language === 'zh' ? 'Switch to English' : '切換到中文'}
                            >
                                {language === 'zh' ? 'ENG' : '中文'}
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <nav className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }
                                `}
                            >
                                <span className="text-lg sm:text-xl">{tab.icon}</span>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="font-bold text-xs sm:text-sm md:text-base">{tab.label}</span>
                                    <span className="text-[10px] opacity-70 hidden sm:block">{tab.labelEn}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'calculator' && <ScoreCalculatorPage />}
                {activeTab === 'table' && <ScoreTablePage />}
                {activeTab === 'rules' && <RulesPage />}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 transition-colors">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>台灣麻雀（港式）計番器 © 2026</p>
                    <p className="mt-1 text-xs">Taiwan Mahjong Scoring Calculator</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
