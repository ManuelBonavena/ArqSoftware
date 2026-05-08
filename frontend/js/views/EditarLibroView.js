/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Editar Libro screen view (E6). Owns DOM operations*/
/*              of the edit form: pre-populating fields with the */
/*              current libro data, reading the form values for  */
/*              submission, marking invalid fields, and showing  */
/*              top-level error messages. Performs no network    */
/*              calls and contains no business logic.            */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   FORM_FIELD_IDS                          - All form ids       */
/*   ERROR_ELEMENT_ID                        - Top message id     */
/*   EditarLibroView.fill_form(libro)        - Pre-load values    */
/*   EditarLibroView.get_form_data()         - Read values out    */
/*   EditarLibroView.show_error(message)     - Show top message   */
/*   EditarLibroView.clear_error()                                */
/*   EditarLibroView.mark_invalid(field_ids)                      */
/*   EditarLibroView.clear_invalid()                              */
/*   EditarLibroView.disable_save(disabled)                       */
/*   EditarLibroView.show_loading_state(visible)                  */
/******************************************************************/

const EditarLibroView =
{
    /* ISBN is intentionally read-only on this screen but still   */
    /* listed here so error highlighting can reach it if needed.  */
    FORM_FIELD_IDS: [
        'isbn', 'titulo', 'autor', 'editorial', 'sinopsis',
        'anio_publicacion', 'num_paginas', 'precio',
        'ubicacion', 'num_copias', 'categoria', 'estado'
    ],
    ERROR_ELEMENT_ID: 'form-error',

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroView.fill_form(libro)                           */
    /* Purpose: Pre-populate every form field with the values     */
    /*          from the libro object loaded from the API. The    */
    /*          ISBN input remains disabled so the user cannot    */
    /*          change it (spec requirement).                     */
    /* Parameters:                                                */
    /*   libro - object - book record returned by the API         */
    /**************************************************************/
    fill_form: function(libro)
    {
        document.getElementById('isbn').value             = libro.isbn;
        document.getElementById('titulo').value           = libro.titulo;
        document.getElementById('autor').value            = libro.autor;
        document.getElementById('editorial').value        = libro.editorial;
        document.getElementById('sinopsis').value         = libro.sinopsis;
        document.getElementById('anio_publicacion').value = libro.anio_publicacion;
        document.getElementById('num_paginas').value      = libro.num_paginas;
        document.getElementById('precio').value           = libro.precio;
        document.getElementById('ubicacion').value        = libro.ubicacion;
        document.getElementById('num_copias').value       = libro.num_copias;
        document.getElementById('categoria').value        = libro.categoria;
        document.getElementById('estado').value           = libro.estado;
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroView.get_form_data()                            */
    /* Purpose: Read every editable field. ISBN is included for   */
    /*          completeness but the controller does not send it  */
    /*          in the payload (the URL identifies the record).   */
    /* Returns: object with the 12 libro fields                   */
    /**************************************************************/
    get_form_data: function()
    {
        return {
            isbn:             document.getElementById('isbn').value.trim(),
            titulo:           document.getElementById('titulo').value.trim(),
            autor:            document.getElementById('autor').value.trim(),
            editorial:        document.getElementById('editorial').value.trim(),
            sinopsis:         document.getElementById('sinopsis').value.trim(),
            anio_publicacion: document.getElementById('anio_publicacion').value.trim(),
            num_paginas:      document.getElementById('num_paginas').value.trim(),
            precio:           document.getElementById('precio').value.trim(),
            ubicacion:        document.getElementById('ubicacion').value.trim(),
            num_copias:       document.getElementById('num_copias').value.trim(),
            categoria:        document.getElementById('categoria').value.trim(),
            estado:           document.getElementById('estado').value
        };
    },

    show_error: function(message)
    {
        Validation.show_error(this.ERROR_ELEMENT_ID, message);
    },

    clear_error: function()
    {
        Validation.clear_error(this.ERROR_ELEMENT_ID);
    },

    mark_invalid: function(field_names)
    {
        Validation.mark_invalid_fields(field_names);
    },

    clear_invalid: function()
    {
        Validation.clear_field_errors(this.FORM_FIELD_IDS);
    },

    disable_save: function(is_disabled)
    {
        document.getElementById('btn-guardar').disabled = is_disabled;
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* EditarLibroView.show_loading_state(is_visible)             */
    /* Purpose: Toggle the loading placeholder shown while the    */
    /*          libro is fetched from the API on page load.       */
    /* Parameters:                                                */
    /*   is_visible - boolean                                     */
    /**************************************************************/
    show_loading_state: function(is_visible)
    {
        const loading_element = document.getElementById('loading-state');
        const form_element    = document.getElementById('edit-form');

        if (is_visible)
        {
            loading_element.classList.remove('hidden');
            form_element.classList.add('hidden');
        }
        else
        {
            loading_element.classList.add('hidden');
            form_element.classList.remove('hidden');
        }
    }
};
