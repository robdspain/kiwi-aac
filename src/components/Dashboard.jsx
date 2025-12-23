import React from 'react';
import { getTopItems, getDailyStats, getTotalStats, exportToCSV } from '../utils/AnalyticsService';

const Dashboard = ({ onClose, progressData }) => {
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

    return (
        <div id="picker-modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div id="picker-content" style={{
                width: '90%', maxWidth: '800px', height: '90vh', overflowY: 'auto',
                padding: '30px', borderRadius: '25px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>📊 Dashboard</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
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

