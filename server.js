/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Application entry point. Configures the Express  */
/*              server, registers middleware and routes, and      */
/*              starts listening on port 3000.                    */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   Middleware setup  - cors, json body parser                   */
/*   Route mounting    - /libros, /login                          */
/*   Server startup    - listen on PORT_NUMBER                    */
/*   DB health check   - verifies connection on startup           */
/******************************************************************/

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const pool    = require('./db');

const libro_routes = require('./routes/libroRoutes');
const auth_routes  = require('./routes/authRoutes');

/******************************************************************/
/* Express application setup and middleware registration          */
/******************************************************************/
const PORT_NUMBER = 3000;
const app = express();

app.use(cors());
app.use(express.json());

/******************************************************************/
/* Route mounting                                                 */
/******************************************************************/
app.use('/libros', libro_routes);
app.use('/login',  auth_routes);

/******************************************************************/
/* Generic error handler for unexpected failures                  */
/******************************************************************/
app.use((err, req, res, next) =>
{
    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

/******************************************************************/
/* Server startup and database connectivity verification          */
/******************************************************************/
app.listen(PORT_NUMBER, () => console.log('Servidor corriendo en puerto ' + PORT_NUMBER));

/* Validate DB connection at startup so errors surface immediately */
pool.query('SELECT NOW()', (db_error, db_result) =>
{
    if (db_error) console.log('Error al conectar a la BD:', db_error);
    else          console.log('Conectado a la BD:', db_result.rows[0].now);
});
