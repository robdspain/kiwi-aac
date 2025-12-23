// Analytics Service for tracking usage metrics

const STORAGE_KEY = 'kiwi-analytics';

const getAnalytics = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
        sessions: [],
        itemClicks: {},
        dailyUsage: {},
        favorites: []
    };
};

const saveAnalytics = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const trackItemClick = (itemId, itemWord) => {
    const analytics = getAnalytics();
    const today = new Date().toISOString().split('T')[0];

    // Track item clicks
    if (!analytics.itemClicks[itemId]) {
        analytics.itemClicks[itemId] = { word: itemWord, count: 0, dates: {} };
    }
    analytics.itemClicks[itemId].count += 1;
    analytics.itemClicks[itemId].dates[today] = (analytics.itemClicks[itemId].dates[today] || 0) + 1;

    // Track daily usage
    if (!analytics.dailyUsage[today]) {
        analytics.dailyUsage[today] = { clicks: 0, uniqueItems: new Set() };
    }
    analytics.dailyUsage[today].clicks += 1;

    saveAnalytics(analytics);
};

export const startSession = () => {
    const analytics = getAnalytics();
    const session = {
        id: Date.now(),
        start: new Date().toISOString(),
        end: null,
        duration: 0
    };
    analytics.sessions.push(session);
    saveAnalytics(analytics);
    return session.id;
};

export const endSession = (sessionId) => {
    const analytics = getAnalytics();
    const session = analytics.sessions.find(s => s.id === sessionId);
    if (session) {
        session.end = new Date().toISOString();
        session.duration = (new Date(session.end) - new Date(session.start)) / 1000 / 60; // minutes
        saveAnalytics(analytics);
    }
};

export const getTopItems = (limit = 10) => {
    const analytics = getAnalytics();
    return Object.entries(analytics.itemClicks)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};

export const getDailyStats = (days = 7) => {
    const analytics = getAnalytics();
    const stats = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        stats.push({
            date: dateStr,
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            clicks: analytics.dailyUsage[dateStr]?.clicks || 0
        });
    }

    return stats;
};

export const getTotalStats = () => {
    const analytics = getAnalytics();
    const totalClicks = Object.values(analytics.itemClicks).reduce((sum, item) => sum + item.count, 0);
    const uniqueItems = Object.keys(analytics.itemClicks).length;
    const totalSessions = analytics.sessions.length;
    const avgSessionTime = analytics.sessions.length > 0
        ? analytics.sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / analytics.sessions.length
        : 0;

    return {
        totalClicks,
        uniqueItems,
        totalSessions,
        avgSessionTime: Math.round(avgSessionTime * 10) / 10
    };
};

export const exportToCSV = () => {
    const analytics = getAnalytics();
    const rows = [['Item', 'Word', 'Total Clicks']];

    Object.entries(analytics.itemClicks).forEach(([id, data]) => {
        rows.push([id, data.word, data.count]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiwi-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

export default {
    trackItemClick,
    startSession,
    endSession,
    getTopItems,
    getDailyStats,
    getTotalStats,
    exportToCSV
};
