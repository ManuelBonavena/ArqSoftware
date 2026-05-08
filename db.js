/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Database connection module. Creates and exports   */
/*              a shared PostgreSQL connection pool used by all   */
/*              model modules to execute queries.                 */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   pool - Shared PostgreSQL connection pool instance            */
/******************************************************************/

require('dotenv').config();
const { Pool } = require('pg');

/******************************************************************/
/* A single pool is shared across all models to avoid opening     */
/* a new connection per query, which would exhaust DB resources.  */
/******************************************************************/
const pool = new Pool(
{
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
