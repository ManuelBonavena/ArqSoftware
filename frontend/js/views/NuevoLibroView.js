/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Nuevo Libro screen view (E3). Owns DOM operations:*/
/*              reading the form fields, marking invalid fields   */
/*              with the field-error class, displaying error      */
/*              messages, and clearing the form. Performs no      */
/*              network calls and contains no business logic.    */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   FORM_FIELD_IDS                       - All form field ids    */
/*   ERROR_ELEMENT_ID                     - Top message container */
/*   NuevoLibroView.get_form_data()       - Read all values       */
/*   NuevoLibroView.show_error(message)   - Display top error     */
/*   NuevoLibroView.clear_error()         - Hide top error        */
/*   NuevoLibroView.mark_invalid(fields)  - Highlight bad fields  */
/*   NuevoLibroView.clear_invalid()       - Reset highlighting    */
/*   NuevoLibroView.disable_save(disabled)- Lock the save button  */
/******************************************************************/

const NuevoLibroView =
{
    FORM_FIELD_IDS: [
        'isbn', 'titulo', 'autor', 'editorial', 'sinopsis',
        'anio_publicacion', 'num_paginas', 'precio',
        'ubicacion', 'num_copias', 'categoria', 'estado'
    ],
    ERROR_ELEMENT_ID: 'form-error',

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.get_form_data()                             */
    /* Purpose: Read every form field and return a plain object   */
    /*          ready to send to LibroModel.create. String fields */
    /*          are trimmed; numeric fields are NOT parsed here   */
    /*          (the controller and backend handle conversion).   */
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

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.show_error(message)                         */
    /* Purpose: Display a global error message at the top of the  */
    /*          form (for "Datos requeridos" and "Libro ya        */
    /*          existe").                                         */
    /* Parameters:                                                */
    /*   message - string                                         */
    /**************************************************************/
    show_error: function(message)
    {
        Validation.show_error(this.ERROR_ELEMENT_ID, message);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.clear_error()                               */
    /* Purpose: Hide the global error message                     */
    /**************************************************************/
    clear_error: function()
    {
        Validation.clear_error(this.ERROR_ELEMENT_ID);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.mark_invalid(field_names)                   */
    /* Purpose: Add the field-error class to the listed inputs    */
    /* Parameters:                                                */
    /*   field_names - array - names matching form ids            */
    /**************************************************************/
    mark_invalid: function(field_names)
    {
        Validation.mark_invalid_fields(field_names);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.clear_invalid()                             */
    /* Purpose: Remove field-error class from every form field    */
    /**************************************************************/
    clear_invalid: function()
    {
        Validation.clear_field_errors(this.FORM_FIELD_IDS);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* NuevoLibroView.disable_save(is_disabled)                   */
    /* Purpose: Toggle the disabled state of the save button to   */
    /*          prevent double submission while the request is    */
    /*          in flight                                         */
    /* Parameters:                                                */
    /*   is_disabled - boolean                                    */
    /**************************************************************/
    disable_save: function(is_disabled)
    {
        document.getElementById('btn-guardar').disabled = is_disabled;
    }
};
