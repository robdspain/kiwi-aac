import { getTopItems, getDailyStats, getTotalStats, exportToCSV, getRecentSentences } from '../utils/AnalyticsService';
import { getLevel, getStage } from '../data/levelDefinitions';

const Dashboard = ({ onClose, progressData, currentLevel, rootItems = [] }) => {

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
        const levelDef = currentLevel ? getLevel(currentLevel) : null;
        const stageDef = currentLevel ? getStage(currentLevel) : null;
        const recentSentences = getRecentSentences(1);
        const report = `
📊 Kiwi Voice Progress Report
---------------------------
📍 Current Level: ${currentLevel || 'Not set'} ${levelDef?.name || ''}
${stageDef ? `🎯 Stage ${Math.floor(currentLevel)}: ${stageDef.name}` : ''}
📈 Total Interactions: ${totalStats.totalClicks}
🧠 Independence Rate: ${independenceRate}%
🔥 Current Streak: ${progressData.currentStreak} trials
🏆 Top Words: ${topItems.slice(0, 3).map(i => i.word).join(', ')}
💬 Last Sentence: "${recentSentences[0]?.text || 'None'}"

Communication is growing! 🥝
        `.trim();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kiwi Voice Progress Report',
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
        <div className="dashboard-modal">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>📊 Dashboard</h1>
                    <div className="dashboard-actions">
                        <button onClick={handleShare} className="dashboard-btn primary">📤 Share Progress</button>
                        <button onClick={async () => {
                            try {
                                const { checkExportAnalytics } = await import('../utils/paywall');
                                const hasAccess = await checkExportAnalytics();
                                if (hasAccess) {
                                    exportToCSV();
                                }
                            } catch (error) {
                                console.error('Failed to check export access:', error);
                                exportToCSV(); // Continue anyway
                            }
                        }} className="dashboard-btn success">📥 Export CSV</button>
                        <button onClick={onClose} className="dashboard-btn secondary">Close</button>
                    </div>
                </div>

                {/* Level Progress Section */}
                <h2 className="dashboard-section-title">🎯 Level Progress</h2>
                {(() => {
                    // Calculate progress per level from trials
                    const levelProgress = {};
                    const trials = progressData?.trials || [];

                    // Group trials by level
                    trials.forEach(t => {
                        const lvl = t.level || t.phase; // Support old phase or new level
                        if (!levelProgress[lvl]) {
                            levelProgress[lvl] = {
                                attempts: 0,
                                independent: 0,
                                prompted: 0,
                                firstAttempt: t.timestamp,
                                lastAttempt: t.timestamp
                            };
                        }
                        levelProgress[lvl].attempts++;
                        if (t.isPrompted) {
                            levelProgress[lvl].prompted++;
                        } else {
                            levelProgress[lvl].independent++;
                        }
                        if (t.timestamp < levelProgress[lvl].firstAttempt) {
                            levelProgress[lvl].firstAttempt = t.timestamp;
                        }
                        if (t.timestamp > levelProgress[lvl].lastAttempt) {
                            levelProgress[lvl].lastAttempt = t.timestamp;
                        }
                    });

                    // Get sorted levels
                    const sortedLevels = Object.keys(levelProgress)
                        .map(l => parseFloat(l))
                        .filter(l => !isNaN(l))
                        .sort((a, b) => a - b);

                    if (sortedLevels.length === 0) {
                        return (
                            <div className="dashboard-card" style={{
                                textAlign: 'center',
                                background: 'var(--gray-light)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No level progress data yet. Complete some trials to see progress here!</p>
                            </div>
                        );
                    }

                    return (
                        <div style={{ marginBottom: '1.875rem' }}>
                            {/* Current Level Card */}
                            {currentLevel && (
                                <div className="dashboard-card" style={{
                                    background: `linear-gradient(135deg, ${getStage(currentLevel).color}15, ${getStage(currentLevel).color}30)`,
                                    border: `0.125rem solid ${getStage(currentLevel).color}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current Level</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStage(currentLevel).color }}>
                                                {getStage(currentLevel).icon} Level {currentLevel}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#555' }}>{getLevel(currentLevel)?.name}</div>
                                        </div>
                                        {levelProgress[currentLevel] && (
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getStage(currentLevel).color }}>
                                                    {levelProgress[currentLevel].attempts}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>attempts</div>
                                            </div>
                                        )}
                                    </div>
                                    {levelProgress[currentLevel] && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.9375rem',
                                            marginTop: '0.9375rem',
                                            background: 'white',
                                            padding: '0.75rem',
                                            borderRadius: '0.625rem'
                                        }}>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                                    {levelProgress[currentLevel].independent}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Independent</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                                    {levelProgress[currentLevel].prompted}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Prompted</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                    {levelProgress[currentLevel].attempts > 0
                                                        ? Math.round((levelProgress[currentLevel].independent / levelProgress[currentLevel].attempts) * 100)
                                                        : 0}%
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accuracy</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* All Levels Progress */}
                            <div className="dashboard-card" style={{ background: 'var(--gray-light)' }}>
                                <h3 style={{ margin: '0 0 0.9375rem 0', fontSize: '1rem' }}>Level History</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                    {sortedLevels.map(lvl => {
                                        const progress = levelProgress[lvl];
                                        const levelDef = getLevel(lvl);
                                        const stageDef = getStage(lvl);
                                        const accuracy = progress.attempts > 0
                                            ? Math.round((progress.independent / progress.attempts) * 100)
                                            : 0;
                                        const timeSpent = progress.lastAttempt && progress.firstAttempt
                                            ? Math.round((progress.lastAttempt - progress.firstAttempt) / (1000 * 60 * 60 * 24))
                                            : 0;
                                        const isPassed = levelDef && progress.attempts >= (levelDef.threshold || 20) &&
                                            (!levelDef.accuracy || accuracy >= levelDef.accuracy);
                                        const isCurrent = lvl === currentLevel;

                                        return (
                                            <div
                                                key={lvl}
                                                style={{
                                                    background: 'white',
                                                    padding: '0.75rem 0.9375rem',
                                                    borderRadius: '0.625rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    border: isCurrent ? `0.125rem solid ${stageDef?.color || '#007AFF'}` : '0.0625rem solid #eee'
                                                }}
                                            >
                                                <div style={{
                                                    width: '2.25rem',
                                                    height: '2.25rem',
                                                    borderRadius: '50%',
                                                    background: isPassed ? 'var(--success)' : (stageDef?.color || '#E5E5EA') + '30',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: isPassed ? '1rem' : '0.9rem',
                                                    color: isPassed ? 'white' : stageDef?.color || '#666'
                                                }}>
                                                    {isPassed ? '✓' : stageDef?.icon || '📍'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                        Level {lvl} {levelDef?.name && `– ${levelDef.name}`}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                                        {progress.attempts} attempts • {accuracy}% accuracy
                                                        {timeSpent > 0 && ` • ${timeSpent} day${timeSpent !== 1 ? 's' : ''}`}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    {isPassed ? (
                                                        <span style={{
                                                            background: 'var(--success)',
                                                            color: 'white',
                                                            padding: '0.25rem 0.625rem',
                                                            borderRadius: '0.75rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>Passed</span>
                                                    ) : isCurrent ? (
                                                        <span style={{
                                                            background: stageDef?.color || 'var(--primary)',
                                                            color: 'white',
                                                            padding: '0.25rem 0.625rem',
                                                            borderRadius: '0.75rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>Current</span>
                                                    ) : (
                                                        <span style={{
                                                            background: '#E5E5EA',
                                                            color: '#666',
                                                            padding: '0.25rem 0.625rem',
                                                            borderRadius: '0.75rem',
                                                            fontSize: '0.75rem'
                                                        }}>In Progress</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Usage Overview */}
                <h2 className="dashboard-section-title">📈 Usage Overview</h2>
                <div className="dashboard-stat-grid">
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-value">{totalStats.totalClicks}</div>
                        <div className="dashboard-stat-label">Total Clicks</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-value">{totalStats.uniqueItems}</div>
                        <div className="dashboard-stat-label">Items Used</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-value">{totalStats.totalSessions}</div>
                        <div className="dashboard-stat-label">Sessions</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-value">{totalStats.avgSessionTime}m</div>
                        <div className="dashboard-stat-label">Avg Session</div>
                    </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="dashboard-card" style={{ background: 'var(--gray-light)' }}>
                    <h3 style={{ margin: '0 0 0.9375rem 0', fontSize: '1rem' }}>Weekly Activity</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '6.25rem' }}>
                        {dailyStats.map((day, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(day.clicks / maxDaily) * 5}rem`,
                                    background: 'linear-gradient(180deg, var(--primary), var(--primary-dark))',
                                    borderRadius: '0.3125rem 0.3125rem 0 0',
                                    minHeight: '0.25rem'
                                }} />
                                <span style={{ fontSize: '0.7rem', marginTop: '0.3125rem' }}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Independence Trend Chart */}
                {trials.length > 5 && (
                    <div className="dashboard-card" style={{ background: 'white', border: '0.0625rem solid #eee' }}>
                        <h3 style={{ margin: '0 0 0.9375rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>📈 Independence Trend (Last 7 Days)</h3>
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
                                <div style={{ position: 'relative', height: '7.5rem', width: '100%' }}>
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        {/* Grid lines */}
                                        <line x1="0" y1="0" x2="100" y2="0" stroke="#eee" strokeWidth="0.5" />
                                        <line x1="0" y1="50" x2="100" y2="50" stroke="#eee" strokeWidth="0.5" />
                                        <line x1="0" y1="100" x2="100" y2="100" stroke="#eee" strokeWidth="0.5" />

                                        {/* Trend Line */}
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="var(--success)"
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
                                                fill={d.hasData ? "var(--success)" : "#ddd"}
                                            />
                                        ))}
                                    </svg>

                                    {/* Labels */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3125rem', fontSize: '0.7rem', color: '#666' }}>
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
                    <div className="dashboard-card" style={{ background: '#f0f0ff' }}>
                        <h3 style={{ margin: '0 0 0.625rem 0', fontSize: '1rem' }}>🏆 Most Used Items</h3>
                        {topItems.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                                <span style={{ width: '1.5rem', fontWeight: 'bold', color: '#666' }}>#{i + 1}</span>
                                <span style={{ flex: 1 }}>{item.word}</span>
                                <span style={{ background: 'var(--primary)', color: 'var(--primary-text)', padding: '0.25rem 0.75rem', borderRadius: '0.625rem', fontSize: '0.9rem' }}>{item.count}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Favorites Usage */}
                {favorites.length > 0 && (
                    <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #FFF5E1, #FFE4B5)', border: '0.125rem solid #FFD700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.9375rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>⭐ Favorite Usage</h3>
                            <span style={{ background: '#FFD700', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {totalFavoriteUses} total uses
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(11.25rem, 1fr))', gap: '0.75rem' }}>
                            {favorites.map((fav, i) => {
                                const usagePercent = totalFavoriteUses > 0 ? ((fav.usageCount || 0) / totalFavoriteUses * 100).toFixed(0) : 0;
                                const lastUsedDate = fav.lastUsed ? new Date(fav.lastUsed).toLocaleDateString() : 'Never';
                                return (
                                    <div key={i} style={{
                                        background: 'white',
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '2rem' }}>{fav.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{fav.word}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>Last: {lastUsedDate}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                flex: 1,
                                                height: '0.5rem',
                                                background: '#E5E5EA',
                                                borderRadius: '0.25rem',
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
                                                minWidth: '2.5rem',
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
                            <p style={{ textAlign: 'center', color: '#666', margin: '1.25rem 0', fontStyle: 'italic', fontSize: '0.875rem' }}>
                                No favorites used yet. Tap ⭐ Add More Favorites in Adult Settings!
                            </p>
                        )}
                    </div>
                )}

                <h2 className="dashboard-section-title">🏃 Communication Progress</h2>
                <div className="dashboard-stat-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                    <div className="dashboard-stat-card" style={{ background: '#F3E5F5' }}>
                        <div className="dashboard-stat-value" style={{ color: '#9C27B0' }}>{independentTrials}</div>
                        <div className="dashboard-stat-label">Independent</div>
                    </div>
                    <div className="dashboard-stat-card" style={{ background: '#FFFDE7' }}>
                        <div className="dashboard-stat-value" style={{ color: '#FBC02D' }}>{promptedTrials}</div>
                        <div className="dashboard-stat-label">Prompted</div>
                    </div>
                    <div className="dashboard-stat-card" style={{ background: '#E0F2F1' }}>
                        <div className="dashboard-stat-value" style={{ color: '#00897B' }}>{independenceRate}%</div>
                        <div className="dashboard-stat-label">Independence</div>
                    </div>
                </div>

                {trials.length > 0 && (
                    <div className="dashboard-card" style={{ background: '#f0efff' }}>
                        <h3 style={{ margin: '0 0 0.625rem 0', fontSize: '1rem' }}>Trial History</h3>
                        <div style={{ display: 'flex', gap: '0.3125rem', flexWrap: 'wrap' }}>
                            {trials.slice(-20).map((t, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '0.75rem',
                                        height: '1.5rem',
                                        background: t.isPrompted ? '#FBC02D' : '#9C27B0',
                                        borderRadius: '0.1875rem'
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

