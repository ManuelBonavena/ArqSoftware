/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Detalles del Libro screen view (E4). Owns the    */
/*              DOM operations to render a single book in a      */
/*              read-only layout. Performs no network calls and  */
/*              contains no business logic.                       */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   DetallesLibroView.render(libro)        - Paint the libro     */
/*   DetallesLibroView.show_message(text)   - Show empty/error    */
/*   DetallesLibroView._format_currency(n)  - MXN formatter       */
/*   DetallesLibroView._format_date(iso)    - Readable date       */
/*   DetallesLibroView._escape(text)        - HTML escape helper  */
/******************************************************************/

const DetallesLibroView =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* DetallesLibroView.render(libro)                            */
    /* Purpose: Render every field of the book into the page.     */
    /*          Renders the title prominently, the category and   */
    /*          state as badges, the synopsis as a wide block,    */
    /*          and the remaining fields in a two-column grid.    */
    /* Parameters:                                                */
    /*   libro - object - book record from the API                */
    /**************************************************************/
    render: function(libro)
    {
        const escape           = this._escape;
        const formatted_price  = this._format_currency(libro.precio);
        const formatted_date   = this._format_date(libro.fecha_registro);

        document.getElementById('detalle-titulo').textContent    = libro.titulo;
        document.getElementById('detalle-autor').textContent     = libro.autor;
        document.getElementById('detalle-anio').textContent      = libro.anio_publicacion;
        document.getElementById('detalle-editorial').textContent = libro.editorial;
        document.getElementById('detalle-sinopsis').textContent  = libro.sinopsis;

        document.getElementById('detalle-categoria').textContent = libro.categoria;
        document.getElementById('detalle-isbn').textContent      = libro.isbn;
        document.getElementById('detalle-paginas').textContent   = libro.num_paginas;
        document.getElementById('detalle-precio').textContent    = formatted_price;
        document.getElementById('detalle-ubicacion').textContent = libro.ubicacion;
        document.getElementById('detalle-copias').textContent    = libro.num_copias;
        document.getElementById('detalle-fecha').textContent     = formatted_date;

        const state_badge = document.getElementById('detalle-estado');
        state_badge.textContent = libro.estado;
        state_badge.className   = 'badge badge-state-' + libro.estado;

        document.getElementById('detalle-content').classList.remove('hidden');
        document.getElementById('detalle-message').classList.add('hidden');
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* DetallesLibroView.show_message(text)                       */
    /* Purpose: Replace the detail content with an informational  */
    /*          message (used on load failure or 404)             */
    /* Parameters:                                                */
    /*   text - string                                            */
    /**************************************************************/
    show_message: function(text)
    {
        document.getElementById('detalle-content').classList.add('hidden');
        const message_element = document.getElementById('detalle-message');
        message_element.textContent = text;
        message_element.classList.remove('hidden');
    },

    /**************************************************************/
    /* Internal helpers                                           */
    /**************************************************************/

    _format_currency: function(amount)
    {
        const numeric_amount = Number(amount);
        if (isNaN(numeric_amount)) return String(amount);
        return '$' + numeric_amount.toFixed(2) + ' MXN';
    },

    _format_date: function(iso_string)
    {
        if (!iso_string) return '';
        const date_object = new Date(iso_string);
        if (isNaN(date_object.getTime())) return iso_string;
        return date_object.toLocaleDateString('es-MX', {
            year:  'numeric',
            month: 'long',
            day:   'numeric'
        });
    },

    _escape: function(text)
    {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
};
