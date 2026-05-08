/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Pure validation helper functions used by          */
/*              controllers to verify HTTP request payloads       */
/*              before delegating to models. Keeps validation     */
/*              logic out of routing and persistence layers.      */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   REQUIRED_LIBRO_FIELDS              - List of required fields */
/*   ESTADOS_VALIDOS                    - List of valid book states*/
/*   find_missing_fields(payload, list) - Find missing field names*/
/*   validate_libro_payload(body, mode) - Validate libro create   */
/*                                        or update payload       */
/*   validate_login_payload(body)       - Validate login payload  */
/******************************************************************/

/******************************************************************/
/* Required fields for a complete libro record (matches spec)     */
/******************************************************************/
const REQUIRED_LIBRO_FIELDS =
[
    'titulo',
    'autor',
    'editorial',
    'sinopsis',
    'anio_publicacion',
    'num_paginas',
    'precio',
    'ubicacion',
    'num_copias',
    'categoria'
];

/******************************************************************/
/* Valid values for the estado_libro ENUM (matches spec)          */
/******************************************************************/
const ESTADOS_VALIDOS = ['disponible', 'prestado', 'mantenimiento', 'perdido'];

/******************************************************************/
/* Reuse Instructions                                             */
/* find_missing_fields(payload, required_fields)                  */
/* Purpose: Return the list of required field names that are      */
/*          missing, null, undefined, or empty strings            */
/* Parameters:                                                    */
/*   payload         - object - request body to inspect           */
/*   required_fields - array  - list of required field names      */
/* Returns: array - missing field names (empty if all present)    */
/******************************************************************/
const find_missing_fields = (payload, required_fields) =>
{
    if (!payload || typeof payload !== 'object')
    {
        return [...required_fields];
    }

    return required_fields.filter(field_name =>
    {
        const value = payload[field_name];

        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.trim() === '') return true;

        return false;
    });
};

/******************************************************************/
/* Reuse Instructions                                             */
/* validate_libro_payload(body, mode)                             */
/* Purpose: Validate the request body for libro creation or       */
/*          update. Checks required fields, numeric types, and    */
/*          state enum membership. ISBN is required only on       */
/*          create (mode === 'create').                           */
/* Parameters:                                                    */
/*   body - object - the request body                             */
/*   mode - string - 'create' or 'update'                         */
/* Returns: object                                                */
/*   { valid: true }                                              */
/*   { valid: false, status: 400, message, missing_fields }       */
/******************************************************************/
const validate_libro_payload = (body, mode) =>
{
    /* Build full required list depending on mode */
    const required_for_mode = mode === 'create'
        ? ['isbn', ...REQUIRED_LIBRO_FIELDS]
        : REQUIRED_LIBRO_FIELDS;

    const missing_fields = find_missing_fields(body, required_for_mode);

    if (missing_fields.length > 0)
    {
        return {
            valid: false,
            status: 400,
            message: 'Datos requeridos',
            missing_fields: missing_fields
        };
    }

    /* Validate numeric fields can be parsed as numbers */
    const numeric_fields = ['anio_publicacion', 'num_paginas', 'num_copias', 'precio'];
    const invalid_numeric = numeric_fields.filter(field_name =>
    {
        return isNaN(Number(body[field_name]));
    });

    if (invalid_numeric.length > 0)
    {
        return {
            valid: false,
            status: 400,
            message: 'Datos requeridos',
            missing_fields: invalid_numeric
        };
    }

    /* Validate estado if provided (optional, defaults to disponible) */
    if (body.estado !== undefined && body.estado !== null && body.estado !== '')
    {
        if (!ESTADOS_VALIDOS.includes(body.estado))
        {
            return {
                valid: false,
                status: 400,
                message: 'Estado invalido. Valores permitidos: ' + ESTADOS_VALIDOS.join(', '),
                missing_fields: ['estado']
            };
        }
    }

    return { valid: true };
};

/******************************************************************/
/* Reuse Instructions                                             */
/* validate_login_payload(body)                                   */
/* Purpose: Validate that login request contains both username    */
/*          and password as non-empty strings. Used to            */
/*          differentiate transition T3 (empty fields) from       */
/*          transition T2 (invalid credentials).                  */
/* Parameters:                                                    */
/*   body - object - the request body                             */
/* Returns: object                                                */
/*   { valid: true }                                              */
/*   { valid: false, status: 400, message, missing_fields }       */
/******************************************************************/
const validate_login_payload = (body) =>
{
    const missing_fields = find_missing_fields(body, ['username', 'password']);

    if (missing_fields.length > 0)
    {
        return {
            valid: false,
            status: 400,
            message: 'Datos requeridos',
            missing_fields: missing_fields
        };
    }

    return { valid: true };
};

module.exports = {
    REQUIRED_LIBRO_FIELDS,
    ESTADOS_VALIDOS,
    find_missing_fields,
    validate_libro_payload,
    validate_login_payload
};
