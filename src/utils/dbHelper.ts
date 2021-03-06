import path from 'path';
import { get } from 'lodash';
import { db, pgp } from '../database/db';

// Helper to remove undefined values in JSON object
// Used for parsing request body in insert and update of db entries
export const cleanseData = async (data) => {
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
};

export const checkConn = async () => {
    const dbConnection = await db.connect();
    const cp = get(dbConnection, 'client.connectionParameters', {});
    console.log(`Connected to database: ${cp.database} on ${cp.host}:${cp.port} as user ${cp.user}`.cyan.underline.bold);
    dbConnection.done();
};

// Helper for linking to external query files:
export const generateSqlQueryFile = (file) => {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, { minify: true });
};

/**
 * Helper for creating String SQL update statement
 * Sample: parseSqlUpdateStmt(data, 'listings', 'WHERE listing_id = $1 RETURNING *', [req.params.id]);
 * @param {Object} jsonData
 * @param {String} tableString SQL table to be queried
 * @param {String} conditionString SQL string to be appended to update statement (usually WHERE clause and 'RETURNING *')
 * @param {String or Array} conditionDataArray data to be formatted into the WHERE clause
 */
export const parseSqlUpdateStmt = (jsonData, tableString, conditionString, conditionDataArray) => {
    const condition = pgp.as.format(' ' + conditionString, conditionDataArray);
    return pgp.helpers.update(jsonData, null, tableString) + condition;
};
