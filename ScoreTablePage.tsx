import React, { useState, useMemo } from 'react';
import { SCORING_DATA } from './constants';
import { ScoringCategory, ScoringItem, CATEGORY_TRANSLATIONS } from './types';
import { useApp } from './AppContext';

const ScoreTablePage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<ScoringCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { language } = useApp();

    // Get unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(SCORING_DATA.map(item => item.category)));
        return cats;
    }, []);

    // Filter scoring data
    const filteredData = useMemo(() => {
        let data = SCORING_DATA;

        // Filter by category
        if (selectedCategory !== 'all') {
            data = data.filter(item => item.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.nameEn.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.descriptionEn.toLowerCase().includes(query)
            );
        }

        return data;
    }, [selectedCategory, searchQuery]);

    // Group data by category
    const groupedData = useMemo(() => {
        if (selectedCategory !== 'all') {
            return [{ category: selectedCategory, items: filteredData }];
        }

        const groups: { category: ScoringCategory; items: ScoringItem[] }[] = [];
        categories.forEach(category => {
            const items = filteredData.filter(item => item.category === category);
            if (items.length > 0) {
                groups.push({ category, items });
            }
        });
        return groups;
    }, [filteredData, selectedCategory, categories]);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            📊 {language === 'zh' ? '番數表' : 'Score Table'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {language === 'zh' ? `${SCORING_DATA.length} 種牌型` : `${SCORING_DATA.length} Patterns`}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder={language === 'zh' ? '搜尋牌型...' : 'Search patterns...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                >
                    📋 {language === 'zh' ? '全部' : 'All'}
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                            }`}
                    >
                        {language === 'zh' ? category : CATEGORY_TRANSLATIONS[category]}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-500 dark:text-slate-400">
                {language === 'zh' ? `顯示 ${filteredData.length} 個牌型` : `Showing ${filteredData.length} patterns`}
            </div>

            {/* Scoring Tables by Category */}
            {groupedData.map(group => (
                <ScoringTable key={group.category} title={group.category} items={group.items} />
            ))}

            {/* No Results */}
            {filteredData.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">
                        {language === 'zh' ? '找不到符合的牌型' : 'No patterns found'}
                    </p>
                </div>
            )}
        </div>
    );
};

// Scoring Table Component
const ScoringTable: React.FC<{ title: ScoringCategory; items: ScoringItem[] }> = ({ title, items }) => {
    const { language } = useApp();
    const titleEn = CATEGORY_TRANSLATIONS[title];

    return (
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-slate-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white tracking-wide">
                    {language === 'zh' ? title : titleEn}
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-3 sm:px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-16 sm:w-20 text-center">
                                {language === 'zh' ? '番數' : 'Fan'}<br />
                                <span className="text-[10px] font-normal">{language === 'zh' ? 'Fan' : '番數'}</span>
                            </th>
                            <th className="px-3 sm:px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-24 sm:w-32">
                                {language === 'zh' ? '名稱' : 'Name'}<br />
                                <span className="text-[10px] font-normal">{language === 'zh' ? 'Name' : '名稱'}</span>
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {language === 'zh' ? '說明' : 'Description'}<br />
                                <span className="text-[10px] font-normal">{language === 'zh' ? 'Description' : '說明'}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors group">
                                <td className="px-3 sm:px-6 py-4">
                                    <div className={`text-center font-bold text-base sm:text-lg ${Number(item.fan) >= 40 ? 'text-rose-600 dark:text-rose-500' : 'text-indigo-600 dark:text-indigo-400'
                                        }`}>
                                        {item.fan}
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                                            {language === 'zh' ? item.name : item.nameEn}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-medium">
                                            {language === 'zh' ? item.nameEn : item.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            {language === 'zh' ? item.description : item.descriptionEn}
                                        </span>
                                        <span className="text-slate-400 dark:text-slate-600 text-xs italic">
                                            {language === 'zh' ? item.descriptionEn : item.description}
                                        </span>
                                        {item.example && (
                                            <span className="text-slate-400 dark:text-slate-500 text-xs mt-1 italic">
                                                {language === 'zh' ? '例' : 'Example'}: {item.example}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ScoreTablePage;
