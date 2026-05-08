/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Editar Libro screen controller (E6). Orchestrates */
/*              EditarLibroView, LibroModel, Session, and         */
/*              Validation. Implements transitions:               */
/*                T13 - Entry from catalog (page load)            */
/*                T17 - Datos invalidos                           */
/*                T18 - Cancelar edicion                          */
/*                T19 - Edicion exitosa                           */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   REQUIRED_FIELDS                              - Mandatory     */
/*   EditarLibroController.init()                 - Load data     */
/*   EditarLibroController.guardar()              - Submit        */
/*   EditarLibroController.volver()               - Cancel        */
/*   EditarLibroController._read_isbn_from_url()  - URL helper    */
/******************************************************************/

/* ISBN is excluded because the spec forbids changing it on edit  */
const REQUIRED_FIELDS = [
    'titulo', 'autor', 'editorial', 'sinopsis',
    'anio_publicacion', 'num_paginas', 'precio',
    'ubicacion', 'num_copias', 'categoria'
];

const EditarLibroController =
{
    target_isbn: null,

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroController.init()                               */
    /* Purpose: Page entry point (transition T13). Reads the      */
    /*          ISBN from the URL, fetches the libro, and         */
    /*          pre-populates the form. Redirects to catalog if   */
    /*          no ISBN is provided or the libro does not exist.  */
    /**************************************************************/
    init: async function()
    {
        if (!Session.require_auth('login.html')) return;

        this.target_isbn = this._read_isbn_from_url();

        if (!this.target_isbn)
        {
            window.location.href = 'catalogo_libros.html';
            return;
        }

        EditarLibroView.show_loading_state(true);

        try
        {
            const libro = await LibroModel.find_by_isbn(this.target_isbn);
            EditarLibroView.fill_form(libro);
            EditarLibroView.show_loading_state(false);
        }
        catch (api_error)
        {
            console.error('editar init error:', api_error);

            if (api_error.status === 404)
            {
                alert('El libro ya no existe en el catálogo.');
            }
            else
            {
                alert('No fue posible cargar la información del libro.');
            }
            window.location.href = 'catalogo_libros.html';
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroController.guardar()                            */
    /* Purpose: Validate the form locally (T17), send the update  */
    /*          to the API, and on success navigate back to the   */
    /*          catalog (T19). On 400, mark the missing fields    */
    /*          returned by the server.                            */
    /* Called by: onclick on the Guardar button                   */
    /**************************************************************/
    guardar: async function()
    {
        EditarLibroView.clear_error();
        EditarLibroView.clear_invalid();

        const form_data = EditarLibroView.get_form_data();

        /* Transition T17 - client-side validation */
        const missing_fields = Validation.find_missing(form_data, REQUIRED_FIELDS);

        if (missing_fields.length > 0)
        {
            EditarLibroView.mark_invalid(missing_fields);
            EditarLibroView.show_error('Datos requeridos');
            return;
        }

        /* Numeric sanity check */
        const numeric_fields = ['anio_publicacion', 'num_paginas', 'num_copias', 'precio'];
        const invalid_numeric = numeric_fields.filter(function(field_name)
        {
            return isNaN(Number(form_data[field_name]));
        });

        if (invalid_numeric.length > 0)
        {
            EditarLibroView.mark_invalid(invalid_numeric);
            EditarLibroView.show_error('Datos requeridos');
            return;
        }

        EditarLibroView.disable_save(true);

        try
        {
            /* The server ignores body.isbn; only the URL identifies */
            await LibroModel.update(this.target_isbn, form_data);

            /* Transition T19 - edicion exitosa */
            window.location.href = 'catalogo_libros.html';
        }
        catch (api_error)
        {
            EditarLibroView.disable_save(false);

            /* Transition T17 fallback - server rejected */
            if (api_error.status === 400)
            {
                const server_missing = (api_error.body && api_error.body.missing_fields) || [];
                EditarLibroView.mark_invalid(server_missing);
                EditarLibroView.show_error('Datos requeridos');
                return;
            }

            if (api_error.status === 404)
            {
                EditarLibroView.show_error('El libro ya no existe en el catálogo.');
                return;
            }

            EditarLibroView.show_error('No fue posible guardar los cambios. Intenta de nuevo.');
            console.error('guardar editar error:', api_error);
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroController.volver()                             */
    /* Purpose: Discard changes and return to catalog (T18)       */
    /**************************************************************/
    volver: function()
    {
        window.location.href = 'catalogo_libros.html';
    },

    /**************************************************************/
    /* Internal: extract ?isbn=... from URL                       */
    /**************************************************************/
    _read_isbn_from_url: function()
    {
        const params = new URLSearchParams(window.location.search);
        const value  = params.get('isbn');
        return value ? value.trim() : null;
    }
};
