/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Book model for the frontend. Wraps every /libros  */
/*              endpoint of the REST API. Used by the Catalogo,   */
/*              NuevoLibro, DetallesLibro, and EditarLibro        */
/*              screens. All HTTP calls go through the shared Api */
/*              wrapper so error handling stays consistent.       */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   LibroModel.get_all()              - GET  /libros             */
/*   LibroModel.find_by_isbn(isbn)     - GET  /libros/:isbn       */
/*   LibroModel.create(libro_data)     - POST /libros             */
/*   LibroModel.update(isbn, data)     - PUT  /libros/:isbn       */
/*   LibroModel.remove(isbn)           - DEL  /libros/:isbn       */
/******************************************************************/

const LibroModel =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* LibroModel.get_all()                                       */
    /* Purpose: Retrieve the full list of books from the API.     */
    /*          Used by the Catalogo screen on initial load and   */
    /*          on every filter change.                           */
    /* Returns: Promise resolving to array of book objects         */
    /**************************************************************/
    get_all: function()
    {
        return Api.get('/libros');
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* LibroModel.find_by_isbn(isbn)                              */
    /* Purpose: Retrieve a single book by ISBN. Used by Detalles  */
    /*          and Editar screens to pre-populate the view.      */
    /* Parameters:                                                */
    /*   isbn - string - book ISBN to fetch                       */
    /* Returns: Promise resolving to a book object                */
    /* Throws : ApiError 404 if the book does not exist           */
    /**************************************************************/
    find_by_isbn: function(isbn)
    {
        return Api.get('/libros/' + encodeURIComponent(isbn));
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* LibroModel.create(libro_data)                              */
    /* Purpose: Insert a new book record via the API. Used by     */
    /*          the Nuevo Libro screen.                           */
    /* Parameters:                                                */
    /*   libro_data - object - must contain isbn, titulo, autor,  */
    /*                editorial, sinopsis, anio_publicacion,      */
    /*                num_paginas, precio, ubicacion, num_copias, */
    /*                categoria                                   */
    /* Returns: Promise resolving to the created book             */
    /* Throws : ApiError 400 (Datos requeridos), 409 (Libro ya    */
    /*          existe), or 500                                   */
    /**************************************************************/
    create: function(libro_data)
    {
        return Api.post('/libros', libro_data);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* LibroModel.update(isbn, libro_data)                        */
    /* Purpose: Update an existing book identified by ISBN. Used  */
    /*          by the Editar Libro screen.                       */
    /* Parameters:                                                */
    /*   isbn       - string - identifier of the book to update   */
    /*   libro_data - object - same fields as create() except     */
    /*                isbn (the URL identifies the record)        */
    /* Returns: Promise resolving to the updated book             */
    /* Throws : ApiError 400 (Datos requeridos), 404, or 500      */
    /**************************************************************/
    update: function(isbn, libro_data)
    {
        return Api.put('/libros/' + encodeURIComponent(isbn), libro_data);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* LibroModel.remove(isbn)                                    */
    /* Purpose: Permanently delete a book by ISBN. Used by the    */
    /*          delete confirmation modal in the Catalogo screen. */
    /* Parameters:                                                */
    /*   isbn - string - identifier of the book to delete         */
    /* Returns: Promise resolving to { message }                  */
    /* Throws : ApiError 404 or 500                                */
    /* Warning: Deletion is irreversible                          */
    /**************************************************************/
    remove: function(isbn)
    {
        return Api.del('/libros/' + encodeURIComponent(isbn));
    }
};
