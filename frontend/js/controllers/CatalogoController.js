/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Catalogo screen controller (E2). Orchestrates     */
/*              CatalogoView and LibroModel. Handles loading,     */
/*              filtering by state and search, paginating with    */
/*              configurable page size, and the entry points to   */
/*              every action that leaves this screen: Nuevo (T6), */
/*              Ver detalles (T7), Editar (T13), Eliminar (T8 ->  */
/*              T14/T15), Salir (T20). Pagination is T16.         */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   CatalogoController.init()                                    */
/*   CatalogoController.cargar()                                  */
/*   CatalogoController.filtrar()                       - T5      */
/*   CatalogoController.cambiar_filtro_estado(estado)             */
/*   CatalogoController.cambiar_page_size()                       */
/*   CatalogoController.ir_a_pagina(page_index)         - T16     */
/*   CatalogoController.siguiente()                     - T16     */
/*   CatalogoController.anterior()                      - T16     */
/*   CatalogoController.ir_a_nuevo()                    - T6      */
/*   CatalogoController.ver_detalles(isbn)              - T7      */
/*   CatalogoController.ir_a_editar(isbn)               - T13     */
/*   CatalogoController.solicitar_eliminacion(isbn)     - T8      */
/*   CatalogoController.cancelar_eliminacion()          - T14     */
/*   CatalogoController.confirmar_eliminacion()         - T15     */
/*   CatalogoController.logout()                        - T20     */
/******************************************************************/

const CatalogoController =
{
    full_list:    [],         /* Untouched cache from the API          */
    filtered_list: [],        /* Result of applying all active filters */
    current_page: 0,          /* Zero-based page index                 */
    state_filter: 'todos',    /* Active state chip                     */

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* CatalogoController.init()                                  */
    /* Purpose: Page entry point. Verifies authentication, then   */
    /*          loads books and renders.                          */
    /**************************************************************/
    init: function()
    {
        if (!Session.require_auth('login.html')) return;
        this.cargar();
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* cargar()                                                   */
    /* Purpose: Fetch every book and render the first page,       */
    /*          stats, and pagination from scratch.               */
    /**************************************************************/
    cargar: async function()
    {
        try
        {
            const fetched_books = await LibroModel.get_all();
            this.full_list      = fetched_books;
            this.current_page   = 0;
            this._apply_filters_and_render();
        }
        catch (api_error)
        {
            console.error('cargar error:', api_error);
            alert('No fue posible cargar el catálogo. Verifica que el servidor esté corriendo.');
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* filtrar()                                                  */
    /* Purpose: Re-apply filters (state + search). Implements T5. */
    /* Called by: oninput on the search input, onchange on field  */
    /*            selector                                        */
    /**************************************************************/
    filtrar: function()
    {
        this.current_page = 0;
        this._apply_filters_and_render();
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* cambiar_filtro_estado(estado)                              */
    /* Purpose: Change the active state filter chip and re-render.*/
    /*          Toggling the same chip has no effect.             */
    /* Parameters:                                                */
    /*   estado - string - 'todos'|'disponible'|'prestado'|       */
    /*                     'mantenimiento'|'perdido'              */
    /* Called by: onclick on filter chips                         */
    /**************************************************************/
    cambiar_filtro_estado: function(estado)
    {
        this.state_filter = estado;
        this.current_page = 0;
        CatalogoView.set_active_state_chip(estado);
        this._apply_filters_and_render();
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* cambiar_page_size()                                        */
    /* Purpose: React to the page size selector change. Resets    */
    /*          the current page to keep the user near where they */
    /*          were: tries to keep the same first item visible.  */
    /* Called by: onchange on the page size selector              */
    /**************************************************************/
    cambiar_page_size: function()
    {
        const previous_size       = this._previous_page_size || 20;
        const new_size            = CatalogoView.get_page_size();
        const first_visible_index = this.current_page * previous_size;

        this.current_page = Math.floor(first_visible_index / new_size);
        this._previous_page_size = new_size;

        this._render_filtered();
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* ir_a_pagina(page_index)                                    */
    /* Purpose: Jump directly to a given page (T16)               */
    /* Parameters:                                                */
    /*   page_index - integer - zero-based page                   */
    /**************************************************************/
    ir_a_pagina: function(page_index)
    {
        this.current_page = page_index;
        this._render_filtered();
    },

    siguiente: function()
    {
        const page_size   = CatalogoView.get_page_size();
        const total_pages = Math.ceil(this.filtered_list.length / page_size);
        if (this.current_page + 1 < total_pages)
        {
            this.current_page++;
            this._render_filtered();
        }
    },

    anterior: function()
    {
        if (this.current_page > 0)
        {
            this.current_page--;
            this._render_filtered();
        }
    },

    ir_a_nuevo:    function() { window.location.href = 'nuevo_libro.html'; },
    ver_detalles:  function(isbn) { window.location.href = 'detalles_libro.html?isbn=' + encodeURIComponent(isbn); },
    ir_a_editar:   function(isbn) { window.location.href = 'editar_libro.html?isbn='  + encodeURIComponent(isbn); },

    solicitar_eliminacion: function(isbn)
    {
        const target_book = this.full_list.find(function(libro)
        {
            return libro.isbn === isbn;
        });
        if (!target_book) return;
        CatalogoView.open_delete_modal(target_book);
    },

    cancelar_eliminacion: function()
    {
        CatalogoView.close_delete_modal();
    },

    confirmar_eliminacion: async function()
    {
        const target_isbn = CatalogoView.get_modal_isbn();
        if (!target_isbn) return;

        try
        {
            await LibroModel.remove(target_isbn);
            CatalogoView.close_delete_modal();
            this.cargar();
        }
        catch (api_error)
        {
            console.error('confirmar_eliminacion error:', api_error);
            alert('No fue posible eliminar el libro. Intenta de nuevo.');
        }
    },

    logout: function()
    {
        Session.clear();
        window.location.href = 'login.html';
    },

    /**************************************************************/
    /* Internal: stats computation                                */
    /**************************************************************/

    /**************************************************************/
    /* _compute_stats(book_list)                                  */
    /* Purpose: Count books by state. Used to feed the stats bar. */
    /* Returns: object - { total, disponible, prestado,           */
    /*                     mantenimiento, perdido }               */
    /**************************************************************/
    _compute_stats: function(book_list)
    {
        const counts =
        {
            total: book_list.length,
            disponible: 0,
            prestado: 0,
            mantenimiento: 0,
            perdido: 0
        };

        book_list.forEach(function(libro)
        {
            if (counts.hasOwnProperty(libro.estado))
            {
                counts[libro.estado]++;
            }
        });

        return counts;
    },

    /**************************************************************/
    /* Internal: filter pipeline                                  */
    /**************************************************************/
    _apply_filters_and_render: function()
    {
        const search_text  = CatalogoView.get_search_text();
        const filter_field = CatalogoView.get_filter_field();
        const state_filter = this.state_filter;

        /* Apply state chip filter */
        let working_list = this.full_list;
        if (state_filter !== 'todos')
        {
            working_list = working_list.filter(function(libro)
            {
                return libro.estado === state_filter;
            });
        }

        /* Apply search text filter (selected field) */
        if (search_text !== '')
        {
            working_list = working_list.filter(function(libro)
            {
                const target_value = String(libro[filter_field] || '').toLowerCase();
                return target_value.includes(search_text);
            });
        }

        this.filtered_list = working_list;
        this._render_filtered();
    },

    /**************************************************************/
    /* Internal: paint table + stats + pagination based on state  */
    /**************************************************************/
    _render_filtered: function()
    {
        const page_size   = CatalogoView.get_page_size();
        const total_items = this.filtered_list.length;
        const total_pages = Math.max(1, Math.ceil(total_items / page_size));

        /* Clamp page index in case the size or filter changed */
        if (this.current_page >= total_pages)
        {
            this.current_page = total_pages - 1;
        }
        if (this.current_page < 0) this.current_page = 0;

        /* Stats reflect the FILTERED set, not the global one */
        const stats = this._compute_stats(this.filtered_list);
        CatalogoView.render_stats(stats);

        CatalogoView.render_table(this.filtered_list, this.current_page, page_size);
        CatalogoView.render_pagination(this.current_page, total_pages, total_items, page_size);
    }
};
