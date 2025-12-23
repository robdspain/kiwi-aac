import React from 'react';
import { getTopItems, getDailyStats, getTotalStats, exportToCSV } from '../utils/AnalyticsService';

const Dashboard = ({ onClose, progressData, currentPhase, rootItems = [] }) => {
    const stats = progressData?.essentialStats || {
        fcr_attempts: 0,
        denial_presented: 0,
        tolerance_success: 0
    };

    const trials = progressData?.trials || [];
    const independentTrials = trials.filter(t => !t.isPrompted).length;
    const promptedTrials = trials.filter(t => t.isPrompted).length;
    const totalTrials = trials.length;
    const independenceRate = totalTrials > 0
        ? Math.round((independentTrials / totalTrials) * 100)
        : 0;

    // Analytics data
    const topItems = getTopItems(5);
    const dailyStats = getDailyStats(7);
    const totalStats = getTotalStats();
    const maxDaily = Math.max(...dailyStats.map(d => d.clicks), 1);

    // Get favorite usage stats
    const favorites = rootItems
        .filter(item => item.bgColor === '#FFF3E0' && item.usageCount > 0)
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 10);
    const totalFavoriteUses = favorites.reduce((sum, f) => sum + (f.usageCount || 0), 0);

    const handleShare = async () => {
        const report = `
📊 Kiwi AAC Progress Report
---------------------------
📍 Current Phase: Level ${currentPhase}
📈 Total Interactions: ${totalStats.totalClicks}
🧠 Independence Rate: ${independenceRate}%
🔥 Current Streak: ${progressData.currentStreak} trials
🏆 Top Words: ${topItems.slice(0, 3).map(i => i.word).join(', ')}

Communication is growing! 🥝
        `.trim();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kiwi AAC Progress Report',
                    text: report,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(report);
            alert("Report copied to clipboard!");
        }
    };

    return (
        <div id="picker-modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div id="picker-content" style={{
                width: '90%', maxWidth: '800px', height: '90vh', overflowY: 'auto',
                padding: '30px', borderRadius: '25px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>📊 Dashboard</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleShare} style={{ padding: '10px 20px', borderRadius: '10px', background: '#007AFF', color: 'white', border: 'none', cursor: 'pointer' }}>📤 Share Progress</button>
                        <button onClick={exportToCSV} style={{ padding: '10px 20px', borderRadius: '10px', background: '#34C759', color: 'white', border: 'none', cursor: 'pointer' }}>📥 Export CSV</button>
                        <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', background: '#E5E5EA', border: 'none', cursor: 'pointer' }}>Close</button>
                    </div>
                </div>

                {/* Usage Overview */}
                <h2 style={{ borderBottom: '2px solid #EEE', paddingBottom: '10px' }}>📈 Usage Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ background: '#E3F2FD', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976D2' }}>{totalStats.totalClicks}</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Total Clicks</div>
                    </div>
                    <div style={{ background: '#E8F5E9', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388E3C' }}>{totalStats.uniqueItems}</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Items Used</div>
                    </div>
                    <div style={{ background: '#FFF3E0', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F57C00' }}>{totalStats.totalSessions}</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Sessions</div>
                    </div>
                    <div style={{ background: '#FCE4EC', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#C2185B' }}>{totalStats.avgSessionTime}m</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Avg Session</div>
                    </div>
                </div>

                {/* Weekly Activity Chart */}
                <div style={{ marginBottom: '30px', background: '#f8f8f8', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ margin: '0 0 15px 0' }}>Weekly Activity</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
                        {dailyStats.map((day, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(day.clicks / maxDaily) * 80}px`,
                                    background: 'linear-gradient(180deg, #007AFF, #5856D6)',
                                    borderRadius: '5px 5px 0 0',
                                    minHeight: '4px'
                                }} />
                                <span style={{ fontSize: '0.7rem', marginTop: '5px' }}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Independence Trend Chart */}
                {trials.length > 5 && (
                    <div style={{ marginBottom: '30px', background: '#fff', border: '1px solid #eee', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📈 Independence Trend (Last 7 Days)</h3>
                        {(() => {
                            // Calculate daily independence rates
                            const days = [];
                            const today = new Date();
                            for (let i = 6; i >= 0; i--) {
                                const d = new Date(today);
                                d.setDate(d.getDate() - i);
                                const dateStr = d.toISOString().split('T')[0];
                                const dayTrials = trials.filter(t => t.date === dateStr);
                                const total = dayTrials.length;
                                const independent = dayTrials.filter(t => !t.isPrompted).length;
                                const rate = total > 0 ? (independent / total) * 100 : 0;
                                days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), rate, hasData: total > 0 });
                            }

                            // Generate SVG points
                            const points = days.map((d, i) => {
                                const x = (i / 6) * 100;
                                const y = 100 - d.rate; // Invert for SVG coords
                                return `${x},${y}`;
                            }).join(' ');

                            return (
                                <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        {/* Grid lines */}
                                        <line x1="0" y1="0" x2="100" y2="0" stroke="#eee" strokeWidth="0.5" />
                                        <line x1="0" y1="50" x2="100" y2="50" stroke="#eee" strokeWidth="0.5" />
                                        <line x1="0" y1="100" x2="100" y2="100" stroke="#eee" strokeWidth="0.5" />
                                        
                                        {/* Trend Line */}
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="#34C759"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        
                                        {/* Data Points */}
                                        {days.map((d, i) => (
                                            <circle
                                                key={i}
                                                cx={(i / 6) * 100}
                                                cy={100 - d.rate}
                                                r={d.hasData ? "2" : "1"}
                                                fill={d.hasData ? "#34C759" : "#ddd"}
                                            />
                                        ))}
                                    </svg>
                                    
                                    {/* Labels */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.7rem', color: '#666' }}>
                                        {days.map((d, i) => (
                                            <span key={i}>{d.label}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Top Items */}
                {topItems.length > 0 && (
                    <div style={{ marginBottom: '30px', background: '#f0f0ff', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>🏆 Most Used Items</h3>
                        {topItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ width: '24px', fontWeight: 'bold', color: '#666' }}>#{i + 1}</span>
                                <span style={{ flex: 1 }}>{item.word}</span>
                                <span style={{ background: '#007AFF', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.9rem' }}>{item.count}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Favorites Usage */}
                {favorites.length > 0 && (
                    <div style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #FFF5E1, #FFE4B5)', padding: '20px', borderRadius: '15px', border: '2px solid #FFD700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>⭐ Favorite Usage</h3>
                            <span style={{ background: '#FFD700', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {totalFavoriteUses} total uses
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                            {favorites.map((fav, i) => {
                                const usagePercent = totalFavoriteUses > 0 ? ((fav.usageCount || 0) / totalFavoriteUses * 100).toFixed(0) : 0;
                                const lastUsedDate = fav.lastUsed ? new Date(fav.lastUsed).toLocaleDateString() : 'Never';
                                return (
                                    <div key={i} style={{
                                        background: 'white',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '2rem' }}>{fav.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{fav.word}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>Last: {lastUsedDate}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                flex: 1,
                                                height: '8px',
                                                background: '#E5E5EA',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${usagePercent}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                color: '#FF8C00',
                                                minWidth: '40px',
                                                textAlign: 'right'
                                            }}>
                                                {fav.usageCount}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {favorites.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#666', margin: '20px 0', fontStyle: 'italic' }}>
                                No favorites used yet. Tap ⭐ Add More Favorites in Adult Settings!
                            </p>
                        )}
                    </div>
                )}

                <h2 style={{ borderBottom: '2px solid #EEE', paddingBottom: '10px' }}>🏃 Communication Progress</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ background: '#F3E5F5', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9C27B0' }}>{independentTrials}</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Independent</div>
                    </div>
                    <div style={{ background: '#FFFDE7', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FBC02D' }}>{promptedTrials}</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Prompted</div>
                    </div>
                    <div style={{ background: '#E0F2F1', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00897B' }}>{independenceRate}%</div>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>Independence</div>
                    </div>
                </div>

                {trials.length > 0 && (
                    <div style={{ marginBottom: '30px', background: '#f0efff', padding: '20px', borderRadius: '15px' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Trial History</h3>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {trials.slice(-20).map((t, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '12px',
                                        height: '24px',
                                        background: t.isPrompted ? '#FBC02D' : '#9C27B0',
                                        borderRadius: '3px'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

