/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Controller for authentication requests. Validates */
/*              login payload, looks up the user, and verifies    */
/*              the password against the stored bcrypt hash.      */
/*              Differentiates between empty fields (T3) and      */
/*              invalid credentials (T2).                         */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   login(req, res) - Handle POST /login                         */
/******************************************************************/

const bcrypt        = require('bcryptjs');
const usuario_model = require('../models/usuarioModel');
const { validate_login_payload } = require('../utils/validators');

/******************************************************************/
/* Reuse Instructions                                             */
/* login(req, res)                                                */
/* Purpose: Authenticate a user with username and password.       */
/*          Distinguishes between two failure modes that map to   */
/*          different transitions in the state diagram:           */
/*            T3 - Empty fields  -> 400 Bad Request               */
/*            T2 - Wrong creds   -> 401 Unauthorized              */
/*          On success returns 200 with basic user info.          */
/* Returns:                                                       */
/*   200 - { success: true, usuario: { ... } }                    */
/*   400 - Datos requeridos (transition T3)                       */
/*   401 - Credenciales incorrectas (transition T2)               */
/*   500 - Database error                                         */
/******************************************************************/
const login = async (req, res) =>
{
    /* Validation - covers transition T3 (empty fields) */
    const validation = validate_login_payload(req.body);
    if (!validation.valid)
    {
        return res.status(validation.status).json({
            error: validation.message,
            missing_fields: validation.missing_fields
        });
    }

    try
    {
        const { username, password } = req.body;
        const query_result = await usuario_model.find_by_username(username);

        /* Transition T2 - user does not exist */
        if (query_result.rows.length === 0)
        {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const stored_user = query_result.rows[0];
        const password_matches = await bcrypt.compare(password, stored_user.contrasena);

        /* Transition T2 - password does not match */
        if (!password_matches)
        {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        /* Transition T4 - login valido */
        res.status(200).json({
            success: true,
            usuario:
            {
                username: stored_user.usuario,
                nombre:   stored_user.nombre,
                email:    stored_user.email
            }
        });
    }
    catch (db_error)
    {
        console.error('login error:', db_error);
        res.status(500).json({ error: 'Error en el proceso de login' });
    }
};

module.exports = { login };
