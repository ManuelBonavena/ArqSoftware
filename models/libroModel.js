/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Model for the libros table. Encapsulates all SQL  */
/*              operations related to book records. Controllers   */
/*              must use these functions instead of querying the  */
/*              database directly. Uses ISBN as primary key.      */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   get_all()                  - Fetch every book record         */
/*   find_by_isbn(isbn)         - Fetch a single book by ISBN     */
/*   exists(isbn)               - Check if a book with given      */
/*                                ISBN already exists             */
/*   create(libro_data)         - Insert a new book               */
/*   update(isbn, libro_data)   - Update an existing book         */
/*   remove(isbn)               - Delete a book by ISBN           */
/******************************************************************/

const pool = require('../db');

/******************************************************************/
/* Reuse Instructions                                             */
/* get_all()                                                      */
/* Purpose: Retrieve all book records ordered by registration     */
/*          date (newest first)                                   */
/* Returns: Promise - resolves to query result with all rows      */
/******************************************************************/
const get_all = () =>
    pool.query('SELECT * FROM libros ORDER BY fecha_registro DESC');

/******************************************************************/
/* Reuse Instructions                                             */
/* find_by_isbn(isbn)                                             */
/* Purpose: Retrieve a single book record by its ISBN             */
/* Parameters:                                                    */
/*   isbn - string - book ISBN to look up                         */
/* Returns: Promise - resolves to query result; rows.length === 0 */
/*          means the book does not exist                         */
/******************************************************************/
const find_by_isbn = (isbn) =>
    pool.query('SELECT * FROM libros WHERE isbn = $1', [isbn]);

/******************************************************************/
/* Reuse Instructions                                             */
/* exists(isbn)                                                   */
/* Purpose: Quickly verify whether a book with the given ISBN     */
/*          already exists. Used to detect duplicate ISBN before  */
/*          attempting an insert (transition T9).                 */
/* Parameters:                                                    */
/*   isbn - string - book ISBN to check                           */
/* Returns: Promise - resolves to boolean                         */
/******************************************************************/
const exists = async (isbn) => {
    const query_result = await pool.query(
        'SELECT 1 FROM libros WHERE isbn = $1 LIMIT 1',
        [isbn]
    );
    return query_result.rows.length > 0;
};

/******************************************************************/
/* Reuse Instructions                                             */
/* create(libro_data)                                             */
/* Purpose: Insert a new book record into the database. The       */
/*          estado parameter is cast explicitly to the            */
/*          estado_libro ENUM type because PostgreSQL does not    */
/*          implicitly convert text to a custom enum.             */
/* Parameters:                                                    */
/*   libro_data - object - must contain:                          */
/*     isbn, titulo, autor, editorial, sinopsis,                  */
/*     anio_publicacion, num_paginas, precio, ubicacion,          */
/*     num_copias, categoria, [estado]                            */
/* Returns: Promise - resolves to the newly inserted book row     */
/******************************************************************/
const create = (libro_data) => {
    const {
        isbn, titulo, autor, editorial, sinopsis,
        anio_publicacion, num_paginas, precio, ubicacion,
        num_copias, categoria, estado
    } = libro_data;

    return pool.query(
        `INSERT INTO libros
         (isbn, titulo, autor, editorial, sinopsis,
          anio_publicacion, num_paginas, precio, ubicacion,
          num_copias, categoria, estado)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                 COALESCE($12::estado_libro, 'disponible'::estado_libro))
         RETURNING *`,
        [
            isbn, titulo, autor, editorial, sinopsis,
            Number(anio_publicacion), Number(num_paginas), Number(precio),
            ubicacion, Number(num_copias), categoria,
            estado || null
        ]
    );
};

/******************************************************************/
/* Reuse Instructions                                             */
/* update(isbn, libro_data)                                       */
/* Purpose: Replace all editable fields of an existing book.      */
/*          ISBN is never modified (used as identifier only).     */
/*          Like create(), the estado parameter is cast to the    */
/*          estado_libro ENUM type to satisfy PostgreSQL's        */
/*          strict type matching.                                 */
/* Parameters:                                                    */
/*   isbn       - string - primary key of the book to update      */
/*   libro_data - object - same fields as create() except isbn   */
/* Returns: Promise - resolves to the query result; rowCount === 0*/
/*          means the book does not exist                         */
/******************************************************************/
const update = (isbn, libro_data) => {
    const {
        titulo, autor, editorial, sinopsis,
        anio_publicacion, num_paginas, precio, ubicacion,
        num_copias, categoria, estado
    } = libro_data;

    return pool.query(
        `UPDATE libros SET
            titulo           = $1,
            autor            = $2,
            editorial        = $3,
            sinopsis         = $4,
            anio_publicacion = $5,
            num_paginas      = $6,
            precio           = $7,
            ubicacion        = $8,
            num_copias       = $9,
            categoria        = $10,
            estado           = COALESCE($11::estado_libro, estado)
         WHERE isbn = $12
         RETURNING *`,
        [
            titulo, autor, editorial, sinopsis,
            Number(anio_publicacion), Number(num_paginas), Number(precio),
            ubicacion, Number(num_copias), categoria,
            estado || null,
            isbn
        ]
    );
};

/******************************************************************/
/* Reuse Instructions                                             */
/* remove(isbn)                                                   */
/* Purpose: Permanently delete a book record from the database    */
/* Parameters:                                                    */
/*   isbn - string - primary key of the book to delete            */
/* Returns: Promise - resolves to the query result; rowCount === 0*/
/*          means the book did not exist                          */
/* Warning: This operation is irreversible                        */
/******************************************************************/
const remove = (isbn) =>
    pool.query('DELETE FROM libros WHERE isbn = $1', [isbn]);

module.exports = { get_all, find_by_isbn, exists, create, update, remove };