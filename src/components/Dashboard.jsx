import { useState } from 'react';
import { getTopItems, getDailyStats, getTotalStats, exportToCSV, getRecentSentences, getTalkHistory } from '../utils/AnalyticsService';
import { getLevel, getStage } from '../data/levelDefinitions';
import { FREE_TIER_LIMITS } from '../utils/paywall';

const Dashboard = ({ onClose, progressData, currentLevel, rootItems = [] }) => {

    const trials = progressData?.trials || [];
    const independentTrials = trials.filter(t => !t.isPrompted).length;
    const promptedTrials = trials.filter(t => t.isPrompted).length;
    const totalTrials = trials.length;
    const independenceRate = totalTrials > 0
        ? Math.round((independentTrials / totalTrials) * 100)
        : 0;

    const [analyticsDays, setAnalyticsDays] = useState(FREE_TIER_LIMITS.ANALYTICS_HISTORY_DAYS);

    // Analytics data
    const topItems = getTopItems(5);
    const dailyStats = getDailyStats(analyticsDays);
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

    const handleSetAnalyticsRange = async (days) => {
        if (days === analyticsDays) return;
        if (days <= FREE_TIER_LIMITS.ANALYTICS_HISTORY_DAYS) {
            setAnalyticsDays(days);
            return;
        }

        try {
            const { checkAdvancedAnalytics } = await import('../utils/paywall');
            const hasAccess = await checkAdvancedAnalytics();
            if (hasAccess) setAnalyticsDays(days);
        } catch (error) {
            console.error('Failed to check advanced analytics access:', error);
            setAnalyticsDays(days);
        }
    };

    const analyticsRanges = [
        { label: `${FREE_TIER_LIMITS.ANALYTICS_HISTORY_DAYS} Days`, value: FREE_TIER_LIMITS.ANALYTICS_HISTORY_DAYS, premium: false },
        { label: '30 Days', value: 30, premium: true }
    ];

    const formatTrendLabel = (date) => {
        const labelFormat = analyticsDays > 7
            ? { month: 'numeric', day: 'numeric' }
            : { weekday: 'short' };
        return date.toLocaleDateString('en-US', labelFormat);
    };

    return (
        <div className="dashboard-modal" style={{
            background: 'rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
        }}>
            <div className="dashboard-content" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242,242,247,0.7))',
                backdropFilter: 'blur(25px) saturate(180%)',
                WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                <button className="ios-close-button" onClick={onClose} aria-label="Close" style={{ background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(5px)' }}>✕</button>
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
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
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📝</div>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>No progress data yet.</p>
                            </div>
                        );
                    }

                    return (
                        <div style={{ marginBottom: '1rem' }}>
                            {/* Current Level Card */}
                            {currentLevel && (
                                <div className="dashboard-card" style={{
                                    background: `linear-gradient(135deg, ${getStage(currentLevel).color}10, ${getStage(currentLevel).color}20)`,
                                    border: `0.125rem solid ${getStage(currentLevel).color}`,
                                    padding: '0.75rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.125rem', fontWeight: 600 }}>Current Level</div>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: getStage(currentLevel).color }}>
                                                {getStage(currentLevel).icon} Level {currentLevel}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{getLevel(currentLevel)?.name}</div>
                                        </div>
                                        {levelProgress[currentLevel] && (
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStage(currentLevel).color }}>
                                                    {levelProgress[currentLevel].attempts}
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>att.</div>
                                            </div>
                                        )}
                                    </div>
                                    {levelProgress[currentLevel] && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            marginTop: '0.75rem',
                                            background: 'var(--card-bg)',
                                            padding: '0.5rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--gray-border)'
                                        }}>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                                    {levelProgress[currentLevel].independent}
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Indep.</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                                    {levelProgress[currentLevel].prompted}
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Prompt</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                                                    {levelProgress[currentLevel].attempts > 0
                                                        ? Math.round((levelProgress[currentLevel].independent / levelProgress[currentLevel].attempts) * 100)
                                                        : 0}%
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Acc.</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* All Levels Progress */}
                            <div className="dashboard-card" style={{ background: 'var(--gray-light)', padding: '0.75rem' }}>
                                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 800 }}>Level History</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                                                    background: 'var(--card-bg)',
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    border: isCurrent ? `0.125rem solid ${stageDef?.color || 'var(--primary-dark)'}` : '1px solid var(--gray-border)'
                                                }}
                                            >
                                                <div style={{
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    borderRadius: '50%',
                                                    background: isPassed ? 'var(--success)' : (stageDef?.color || 'var(--gray-border)') + '20',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: isPassed ? '0.85rem' : '0.75rem',
                                                    color: isPassed ? 'white' : stageDef?.color || 'var(--text-muted)'
                                                }}>
                                                    {isPassed ? '✓' : stageDef?.icon || '📍'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                                        Level {lvl}
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                                        {progress.attempts} att • {accuracy}% acc
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    {isPassed ? (
                                                        <span style={{ color: 'var(--success)', fontSize: '0.65rem', fontWeight: '800' }}>PASSED</span>
                                                    ) : isCurrent ? (
                                                        <span style={{ color: stageDef?.color || 'var(--primary-dark)', fontSize: '0.65rem', fontWeight: '800' }}>CURRENT</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: '600' }}>IN PROGRESS</span>
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

                {/* Usage Overview Grid (Compact) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="dashboard-stat-card" style={{ padding: '0.5rem' }}>
                        <div className="dashboard-stat-value" style={{ fontSize: '1rem' }}>{totalStats.totalClicks}</div>
                        <div className="dashboard-stat-label" style={{ fontSize: '0.6rem' }}>Taps</div>
                    </div>
                    <div className="dashboard-stat-card" style={{ padding: '0.5rem' }}>
                        <div className="dashboard-stat-value" style={{ fontSize: '1rem' }}>{totalStats.uniqueItems}</div>
                        <div className="dashboard-stat-label" style={{ fontSize: '0.6rem' }}>Words</div>
                    </div>
                    <div className="dashboard-stat-card" style={{ padding: '0.5rem' }}>
                        <div className="dashboard-stat-value" style={{ fontSize: '1rem' }}>{totalStats.totalSessions}</div>
                        <div className="dashboard-stat-label" style={{ fontSize: '0.6rem' }}>Sess.</div>
                    </div>
                    <div className="dashboard-stat-card" style={{ padding: '0.5rem' }}>
                        <div className="dashboard-stat-value" style={{ fontSize: '1rem' }}>{totalStats.avgSessionTime}m</div>
                        <div className="dashboard-stat-label" style={{ fontSize: '0.6rem' }}>Avg</div>
                    </div>
                </div>

                {/* Activity & Trend Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="dashboard-card" style={{ background: 'var(--gray-light)', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800 }}>Activity</h3>
                            <button onClick={() => handleSetAnalyticsRange(analyticsDays === 7 ? 30 : 7)} style={{ padding: '2px 6px', borderRadius: '4px', border: 'none', background: 'white', fontSize: '0.6rem', fontWeight: 700 }}>{analyticsDays}d</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '3.5rem' }}>
                            {dailyStats.map((day, i) => (
                                <div key={i} style={{ flex: 1, height: `${(day.clicks / maxDaily) * 100}%`, background: 'var(--btn-primary-bg)', borderRadius: '2px 2px 0 0' }} />
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ padding: '0.75rem', background: 'var(--gray-light)' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 800 }}>Rate</h3>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--fitz-verb)' }}>{independenceRate}%</div>
                            <div style={{ fontSize: '0.6rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>Independence</div>
                        </div>
                    </div>
                </div>

                {/* Compact Favorites Row */}
                {favorites.length > 0 && (
                    <div className="dashboard-card" style={{ padding: '0.75rem', background: 'var(--bg-color)', border: '1px solid var(--fitz-noun)', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {favorites.slice(0, 3).map((f, i) => (
                                <div key={i} style={{ textAlign: 'center', background: 'white', padding: '0.4rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '1.25rem' }}>{f.icon}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{f.usageCount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Progress Tape (Compact Trial History) */}
                {trials.length > 0 && (
                    <div style={{ display: 'flex', gap: '3px', height: '12px', marginBottom: '1.25rem', overflow: 'hidden', borderRadius: '6px' }}>
                        {trials.slice(-40).map((t, i) => (
                            <div key={i} style={{ flex: 1, background: t.isPrompted ? 'var(--warning)' : 'var(--fitz-social)' }} />
                        ))}
                    </div>
                )}

                <div className="dashboard-actions" style={{ padding: '0 0.5rem' }}>
                    <button onClick={handleShare} className="dashboard-btn primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '14px', fontWeight: 800 }}>📤 Share Progress Report</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
