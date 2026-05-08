/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Controller for book-related HTTP requests.        */
/*              Handles request parsing, payload validation,      */
/*              delegates persistence to libroModel, and formats  */
/*              the HTTP response with appropriate status codes.  */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   get_libros(req, res)         - Handle GET /libros            */
/*   get_libro_by_isbn(req, res)  - Handle GET /libros/:isbn      */
/*   create_libro(req, res)       - Handle POST /libros           */
/*   update_libro(req, res)       - Handle PUT /libros/:isbn      */
/*   delete_libro(req, res)       - Handle DELETE /libros/:isbn   */
/******************************************************************/

const libro_model = require('../models/libroModel');
const { validate_libro_payload } = require('../utils/validators');

/* PostgreSQL error code for unique constraint violation.         */
/* Used as a defensive fallback for race conditions only; the     */
/* primary duplicate detection happens via libro_model.exists().  */
const PG_UNIQUE_VIOLATION_CODE = '23505';

/******************************************************************/
/* Reuse Instructions                                             */
/* get_libros(req, res)                                           */
/* Purpose: Respond with the full list of books as JSON           */
/* Returns:                                                       */
/*   200 - JSON array of books                                    */
/*   500 - Database error                                         */
/******************************************************************/
const get_libros = async (req, res) => {
    try {
        const query_result = await libro_model.get_all();
        res.status(200).json(query_result.rows);
    }
    catch (db_error) {
        console.error('get_libros error:', db_error);
        res.status(500).json({ error: 'Error al obtener libros' });
    }
};

/******************************************************************/
/* Reuse Instructions                                             */
/* get_libro_by_isbn(req, res)                                    */
/* Purpose: Respond with a single book record by ISBN. Used by    */
/*          the Detalles and Editar screens to load a book.       */
/* Returns:                                                       */
/*   200 - JSON of the book                                       */
/*   404 - Book not found                                         */
/*   500 - Database error                                         */
/******************************************************************/
const get_libro_by_isbn = async (req, res) => {
    try {
        const { isbn } = req.params;
        const query_result = await libro_model.find_by_isbn(isbn);

        if (query_result.rows.length === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.status(200).json(query_result.rows[0]);
    }
    catch (db_error) {
        console.error('get_libro_by_isbn error:', db_error);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
};

/******************************************************************/
/* Reuse Instructions                                             */
/* create_libro(req, res)                                         */
/* Purpose: Insert a new book from request body and return it.    */
/*          Implements transitions T9 (ISBN duplicado), T10       */
/*          (datos invalidos) and T11 (alta exitosa).             */
/*          Duplicate ISBN is detected explicitly via exists()    */
/*          BEFORE attempting the insert. The catch block keeps   */
/*          the unique-violation handler as a defensive fallback  */
/*          for the rare race condition where two requests with   */
/*          the same ISBN arrive simultaneously.                  */
/* Returns:                                                       */
/*   201 - JSON of the new book                                   */
/*   400 - Datos requeridos (with list of missing fields)         */
/*   409 - Libro ya existe (duplicate ISBN)                       */
/*   500 - Database error                                         */
/******************************************************************/
const create_libro = async (req, res) => {
    /* Validation - covers transition T10 */
    const validation = validate_libro_payload(req.body, 'create');
    if (!validation.valid) {
        return res.status(validation.status).json({
            error: validation.message,
            missing_fields: validation.missing_fields
        });
    }

    try {
        const isbn_normalized = String(req.body.isbn).trim();

        /* Transition T9 - check duplicate ISBN before insert */
        const already_exists = await libro_model.exists(isbn_normalized);
        if (already_exists) {
            return res.status(409).json({ error: 'Libro ya existe' });
        }

        const libro_data = { ...req.body, isbn: isbn_normalized };
        const query_result = await libro_model.create(libro_data);
        res.status(201).json(query_result.rows[0]);
    }
    catch (db_error) {
        /* Defensive fallback for race conditions only */
        if (db_error.code === PG_UNIQUE_VIOLATION_CODE) {
            return res.status(409).json({ error: 'Libro ya existe' });
        }

        console.error('create_libro error:', db_error);
        res.status(500).json({ error: 'Error al crear libro' });
    }
};

/******************************************************************/
/* Reuse Instructions                                             */
/* update_libro(req, res)                                         */
/* Purpose: Update an existing book identified by ISBN.           */
/*          ISBN cannot be changed (spec requirement).            */
/*          Implements transitions T17 (datos invalidos) and      */
/*          T19 (edicion exitosa).                                */
/* Returns:                                                       */
/*   200 - JSON of the updated book                               */
/*   400 - Datos requeridos (with list of missing fields)         */
/*   404 - Libro no encontrado                                    */
/*   500 - Database error                                         */
/******************************************************************/
const update_libro = async (req, res) => {
    /* Validation - covers transition T17 */
    const validation = validate_libro_payload(req.body, 'update');
    if (!validation.valid) {
        return res.status(validation.status).json({
            error: validation.message,
            missing_fields: validation.missing_fields
        });
    }

    try {
        const { isbn } = req.params;
        const query_result = await libro_model.update(isbn, req.body);

        if (query_result.rowCount === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.status(200).json(query_result.rows[0]);
    }
    catch (db_error) {
        console.error('update_libro error:', db_error);
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
};

/******************************************************************/
/* Reuse Instructions                                             */
/* delete_libro(req, res)                                         */
/* Purpose: Permanently remove a book record by ISBN.             */
/*          Implements transition T15 (confirmar eliminacion).    */
/* Returns:                                                       */
/*   200 - Success message                                        */
/*   404 - Libro no encontrado                                    */
/*   500 - Database error                                         */
/* Warning: Deletion is irreversible                              */
/******************************************************************/
const delete_libro = async (req, res) => {
    try {
        const { isbn } = req.params;
        const query_result = await libro_model.remove(isbn);

        if (query_result.rowCount === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.status(200).json({ message: 'Libro eliminado' });
    }
    catch (db_error) {
        console.error('delete_libro error:', db_error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
};

module.exports = {
    get_libros,
    get_libro_by_isbn,
    create_libro,
    update_libro,
    delete_libro
};