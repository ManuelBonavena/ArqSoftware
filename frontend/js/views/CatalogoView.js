/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Catalogo screen view (E2). Owns DOM operations:   */
/*              rendering the books table, the stats summary,     */
/*              numeric pagination, the active state chip, and    */
/*              the delete confirmation modal. Performs no        */
/*              network calls and contains no business logic.    */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   CatalogoView.render_table(book_list, page_index, page_size)  */
/*   CatalogoView.render_stats(stats)                             */
/*   CatalogoView.render_pagination(page_index, total_pages,      */
/*                                  total_items, page_size)       */
/*   CatalogoView.set_active_state_chip(state_filter)             */
/*   CatalogoView.get_search_text()                               */
/*   CatalogoView.get_filter_field()                              */
/*   CatalogoView.get_page_size()                                 */
/*   CatalogoView.open_delete_modal(libro)                        */
/*   CatalogoView.close_delete_modal()                            */
/*   CatalogoView.get_modal_isbn()                                */
/*   CatalogoView.show_empty_state()                              */
/******************************************************************/

const CatalogoView =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* render_table(book_list, page_index, page_size)             */
    /* Purpose: Replace the table body with the slice for the     */
    /*          given page. Each row carries data-isbn so action  */
    /*          buttons can identify their target.                */
    /**************************************************************/
    render_table: function(book_list, page_index, page_size)
    {
        const table_body = document.getElementById('tabla');
        table_body.innerHTML = '';

        if (!book_list || book_list.length === 0)
        {
            this.show_empty_state();
            return;
        }

        const start_index = page_index * page_size;
        const end_index   = start_index + page_size;
        const page_slice  = book_list.slice(start_index, end_index);

        page_slice.forEach(function(libro)
        {
            const row_element = document.createElement('tr');
            row_element.setAttribute('data-isbn', libro.isbn);

            row_element.innerHTML =
                '<td>' + CatalogoView._escape(libro.titulo) + '</td>' +
                '<td>' + CatalogoView._escape(libro.autor)  + '</td>' +
                '<td>' + CatalogoView._escape(libro.isbn)   + '</td>' +
                '<td><span class="badge">' + CatalogoView._escape(libro.categoria) + '</span></td>' +
                '<td>' + libro.num_copias + '</td>' +
                '<td><span class="badge badge-state-' + libro.estado + '">' + libro.estado + '</span></td>' +
                '<td class="row-actions">' +
                    '<button class="icon-btn icon-btn-view"   title="Ver detalles" onclick="CatalogoController.ver_detalles(\'' + libro.isbn + '\')">👁</button>' +
                    '<button class="icon-btn icon-btn-edit"   title="Editar"        onclick="CatalogoController.ir_a_editar(\'' + libro.isbn + '\')">✎</button>' +
                    '<button class="icon-btn icon-btn-delete" title="Eliminar"      onclick="CatalogoController.solicitar_eliminacion(\'' + libro.isbn + '\')">🗑</button>' +
                '</td>';

            table_body.appendChild(row_element);
        });
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* render_stats(stats)                                        */
    /* Purpose: Update the four stats cards above the filter bar  */
    /* Parameters:                                                */
    /*   stats - object - { total, disponible, prestado,          */
    /*                       mantenimiento }                      */
    /**************************************************************/
    render_stats: function(stats)
    {
        document.getElementById('stat-total').textContent         = stats.total         || 0;
        document.getElementById('stat-disponible').textContent    = stats.disponible    || 0;
        document.getElementById('stat-prestado').textContent      = stats.prestado      || 0;
        document.getElementById('stat-mantenimiento').textContent = stats.mantenimiento || 0;
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* render_pagination(page_index, total_pages, total_items,    */
    /*                   page_size)                               */
    /* Purpose: Render numeric pagination controls and the        */
    /*          "Mostrando X-Y de Z" info line.                   */
    /* Parameters:                                                */
    /*   page_index  - integer - zero-based current page          */
    /*   total_pages - integer - total pages (>= 1)               */
    /*   total_items - integer - total items in the filtered set  */
    /*   page_size   - integer - rows per page                    */
    /**************************************************************/
    render_pagination: function(page_index, total_pages, total_items, page_size)
    {
        /* Info line - "Mostrando X-Y de Z libros" */
        const info_element = document.getElementById('pagination-info');

        if (total_items === 0)
        {
            info_element.textContent = 'Sin resultados';
        }
        else
        {
            const start_number = (page_index * page_size) + 1;
            const end_number   = Math.min(start_number + page_size - 1, total_items);
            info_element.textContent = 'Mostrando ' + start_number + '-' + end_number + ' de ' + total_items + ' libros';
        }

        /* Numeric controls */
        const controls_element = document.getElementById('pagination-controls');
        controls_element.innerHTML = '';

        if (total_pages <= 1) return;

        /* Previous button */
        controls_element.appendChild(this._build_page_button(
            '«', page_index - 1, page_index === 0, false
        ));

        /* Build the list of pages to show: always 1, ..., neighbors, ..., last */
        const page_indices_to_show = this._compute_visible_pages(page_index, total_pages);

        let last_shown = -1;
        page_indices_to_show.forEach(function(target_index)
        {
            /* Insert ellipsis if there's a gap */
            if (target_index - last_shown > 1)
            {
                const ellipsis = document.createElement('span');
                ellipsis.className   = 'page-btn-ellipsis';
                ellipsis.textContent = '…';
                controls_element.appendChild(ellipsis);
            }
            controls_element.appendChild(CatalogoView._build_page_button(
                String(target_index + 1),
                target_index,
                false,
                target_index === page_index
            ));
            last_shown = target_index;
        });

        /* Next button */
        controls_element.appendChild(this._build_page_button(
            '»', page_index + 1, page_index >= total_pages - 1, false
        ));
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* set_active_state_chip(state_filter)                        */
    /* Purpose: Mark the chip matching the current state filter   */
    /*          as active and unmark the others. The filter value */
    /*          'todos' means no filter applied.                  */
    /* Parameters:                                                */
    /*   state_filter - string - 'todos' | 'disponible' | etc.    */
    /**************************************************************/
    set_active_state_chip: function(state_filter)
    {
        const chip_elements = document.querySelectorAll('#filter-chips .filter-chip');
        chip_elements.forEach(function(chip_element)
        {
            if (chip_element.getAttribute('data-state') === state_filter)
            {
                chip_element.classList.add('active');
            }
            else
            {
                chip_element.classList.remove('active');
            }
        });
    },

    get_search_text: function()
    {
        return document.getElementById('buscador').value.toLowerCase().trim();
    },

    get_filter_field: function()
    {
        const select_element = document.getElementById('filter-field');
        return select_element ? select_element.value : 'titulo';
    },

    get_page_size: function()
    {
        const select_element = document.getElementById('page-size-select');
        return select_element ? parseInt(select_element.value, 10) : 20;
    },

    /**************************************************************/
    /* Modal helpers                                              */
    /**************************************************************/

    open_delete_modal: function(libro)
    {
        const overlay_element = document.getElementById('delete-modal');
        const message_element = document.getElementById('delete-modal-message');

        message_element.textContent = '¿Estás seguro(a) que quieres eliminar el libro ' + libro.titulo + '?';
        overlay_element.setAttribute('data-isbn', libro.isbn);
        overlay_element.classList.add('visible');
    },

    close_delete_modal: function()
    {
        const overlay_element = document.getElementById('delete-modal');
        overlay_element.classList.remove('visible');
        overlay_element.removeAttribute('data-isbn');
    },

    get_modal_isbn: function()
    {
        return document.getElementById('delete-modal').getAttribute('data-isbn');
    },

    show_empty_state: function()
    {
        const table_body = document.getElementById('tabla');
        table_body.innerHTML =
            '<tr><td colspan="7" class="text-muted" style="text-align:center; padding:32px;">' +
                'No hay libros que coincidan con los filtros.' +
            '</td></tr>';
    },

    /**************************************************************/
    /* Internal helpers                                           */
    /**************************************************************/

    _build_page_button: function(label_text, target_page_index, is_disabled, is_active)
    {
        const button_element = document.createElement('button');
        button_element.className   = 'page-btn' + (is_active ? ' active' : '');
        button_element.textContent = label_text;
        button_element.disabled    = is_disabled;

        if (!is_disabled && !is_active)
        {
            button_element.onclick = function()
            {
                CatalogoController.ir_a_pagina(target_page_index);
            };
        }
        return button_element;
    },

    /**************************************************************/
    /* _compute_visible_pages(page_index, total_pages)            */
    /* Purpose: Decide which page indices to render in the        */
    /*          numeric pagination control. Strategy:             */
    /*            - if total_pages <= 7, show them all            */
    /*            - else show: 0, current-1, current, current+1,  */
    /*                         total-1                            */
    /* Returns: array of zero-based page indices, sorted asc      */
    /**************************************************************/
    _compute_visible_pages: function(page_index, total_pages)
    {
        if (total_pages <= 7)
        {
            const all_pages = [];
            for (let i = 0; i < total_pages; i++) all_pages.push(i);
            return all_pages;
        }

        const visible_set = new Set();
        visible_set.add(0);
        visible_set.add(total_pages - 1);

        for (let offset = -1; offset <= 1; offset++)
        {
            const candidate = page_index + offset;
            if (candidate >= 0 && candidate < total_pages)
            {
                visible_set.add(candidate);
            }
        }

        return Array.from(visible_set).sort(function(a, b) { return a - b; });
    },

    _escape: function(text)
    {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
};
