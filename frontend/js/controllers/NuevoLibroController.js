/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Nuevo Libro screen controller (E3). Orchestrates  */
/*              NuevoLibroView, LibroModel, Session, and          */
/*              Validation. Implements transitions:               */
/*                T9  - ISBN duplicado                            */
/*                T10 - Datos invalidos                           */
/*                T11 - Alta exitosa                              */
/*                T12 - Cancelar alta                             */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   REQUIRED_FIELDS                          - Mandatory inputs  */
/*   NuevoLibroController.init()              - Bootstrap page    */
/*   NuevoLibroController.guardar()           - Submit handler    */
/*   NuevoLibroController.volver()            - Cancel handler    */
/******************************************************************/

const REQUIRED_FIELDS = [
    'isbn', 'titulo', 'autor', 'editorial', 'sinopsis',
    'anio_publicacion', 'num_paginas', 'precio',
    'ubicacion', 'num_copias', 'categoria'
];

const NuevoLibroController =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroController.init()                                */
    /* Purpose: Page entry point. Redirects anonymous users to    */
    /*          login (guards transition T1 access pattern).      */
    /* Called by: inline script at end of nuevo_libro.html        */
    /**************************************************************/
    init: function()
    {
        Session.require_auth('login.html');
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroController.guardar()                             */
    /* Purpose: Validate the form, attempt to create the book,    */
    /*          and react to each backend response. On success    */
    /*          (T11), navigate back to the catalog. On 409 (T9), */
    /*          show "Libro ya existe" and mark the ISBN field.   */
    /*          On 400 (T10), show "Datos requeridos" and mark    */
    /*          all the missing fields returned by the server.    */
    /* Called by: onclick on the "Guardar libro" button           */
    /**************************************************************/
    guardar: async function()
    {
        NuevoLibroView.clear_error();
        NuevoLibroView.clear_invalid();

        const form_data = NuevoLibroView.get_form_data();

        /* Transition T10 - client-side validation */
        const missing_fields = Validation.find_missing(form_data, REQUIRED_FIELDS);

        if (missing_fields.length > 0)
        {
            NuevoLibroView.mark_invalid(missing_fields);
            NuevoLibroView.show_error('Datos requeridos');
            return;
        }

        /* Numeric sanity check before sending - server also validates */
        const numeric_fields = ['anio_publicacion', 'num_paginas', 'num_copias', 'precio'];
        const invalid_numeric = numeric_fields.filter(function(field_name)
        {
            return isNaN(Number(form_data[field_name]));
        });

        if (invalid_numeric.length > 0)
        {
            NuevoLibroView.mark_invalid(invalid_numeric);
            NuevoLibroView.show_error('Datos requeridos');
            return;
        }

        NuevoLibroView.disable_save(true);

        try
        {
            await LibroModel.create(form_data);

            /* Transition T11 - alta exitosa */
            window.location.href = 'catalogo_libros.html';
        }
        catch (api_error)
        {
            NuevoLibroView.disable_save(false);

            /* Transition T9 - ISBN duplicado */
            if (api_error.status === 409)
            {
                NuevoLibroView.mark_invalid(['isbn']);
                NuevoLibroView.show_error('Libro ya existe');
                return;
            }

            /* Transition T10 fallback - server-side rejection */
            if (api_error.status === 400)
            {
                const server_missing = (api_error.body && api_error.body.missing_fields) || [];
                NuevoLibroView.mark_invalid(server_missing);
                NuevoLibroView.show_error('Datos requeridos');
                return;
            }

            /* Generic error */
            NuevoLibroView.show_error('No fue posible guardar el libro. Intenta de nuevo.');
            console.error('guardar error:', api_error);
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroController.volver()                              */
    /* Purpose: Discard the form and return to the catalog        */
    /*          (transition T12)                                  */
    /* Called by: onclick on the "Volver" button                  */
    /**************************************************************/
    volver: function()
    {
        window.location.href = 'catalogo_libros.html';
    }
};
