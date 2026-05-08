/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Model for the usuarios table. Provides query      */
/*              functions for user lookups. Password verification */
/*              against the stored bcrypt hash is done by the     */
/*              controller, never inside an SQL query.            */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   find_by_username(username) - Look up a user by username      */
/******************************************************************/

const pool = require('../db');

/******************************************************************/
/* Reuse Instructions                                             */
/* find_by_username(username)                                     */
/* Purpose: Retrieve a user record by username. Returns the       */
/*          stored bcrypt hash so the controller can verify it    */
/*          against the plain-text password using bcrypt.compare. */
/* Parameters:                                                    */
/*   username - string - the account username to look up          */
/* Returns: Promise - resolves to query result; rows.length === 0 */
/*          means the user does not exist                         */
/******************************************************************/
const find_by_username = (username) =>
    pool.query(
        'SELECT usuario, contrasena, nombre, email FROM usuarios WHERE usuario = $1',
        [username]
    );

module.exports = { find_by_username };
