import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL;

// Create SQL function only if configured
export const sql = databaseUrl ? neon(databaseUrl) : null;

export const isNeonConfigured = () => !!sql;

/**
 * Execute a query with error handling
 * @param {string} query - SQL query with placeholders
 * @param {any[]} params - Query parameters
 * @returns {Promise<any[]>} Query results
 */
export async function query(queryString, params = []) {
    if (!sql) {
        console.warn('Neon database not configured');
        return null;
    }

    try {
        const result = await sql(queryString, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
