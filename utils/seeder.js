const colors = require('colors');
const { checkConn, db, generateSqlQueryFile } = require('../config/db');

// Check connection to db
checkConn();

// Create a QueryFile globally, once per file:
const schema = generateSqlQueryFile('../db/schema.sql');

const createTables = async () => {
  try {
    await db.tx(async query => await query.manyOrNone(schema));
    console.log(`Data Imported...`.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err.toString().red);
    process.exit();
  }
};

if (process.argv[2] === '-i') {
  createTables();
}