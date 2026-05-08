/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Detalles del Libro screen controller (E4).        */
/*              Implements transitions T7 (entry from catalog)    */
/*              and T21 (return to catalog).                      */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   DetallesLibroController.init()    - Load and render libro    */
/*   DetallesLibroController.volver()  - T21 - return to catalog  */
/*   DetallesLibroController._read_isbn_from_url() - URL parser   */
/******************************************************************/

const DetallesLibroController =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* DetallesLibroController.init()                             */
    /* Purpose: Page entry point. Reads the ISBN from the URL,    */
    /*          fetches the book, and renders it. Redirects to    */
    /*          the catalog if no ISBN is provided or the book    */
    /*          does not exist.                                   */
    /**************************************************************/
    init: async function()
    {
        if (!Session.require_auth('login.html')) return;

        const isbn_param = this._read_isbn_from_url();

        if (!isbn_param)
        {
            window.location.href = 'catalogo_libros.html';
            return;
        }

        try
        {
            const libro = await LibroModel.find_by_isbn(isbn_param);
            DetallesLibroView.render(libro);
        }
        catch (api_error)
        {
            if (api_error.status === 404)
            {
                DetallesLibroView.show_message('El libro no existe en el catálogo.');
                return;
            }

            console.error('detalles init error:', api_error);
            DetallesLibroView.show_message('No fue posible cargar la información del libro.');
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* DetallesLibroController.volver()                           */
    /* Purpose: Return to the catalog (transition T21).           */
    /* Called by: onclick on the Volver button and the topbar X   */
    /**************************************************************/
    volver: function()
    {
        window.location.href = 'catalogo_libros.html';
    },

    /**************************************************************/
    /* Internal: extract the isbn query parameter from the URL    */
    /**************************************************************/
    _read_isbn_from_url: function()
    {
        const params = new URLSearchParams(window.location.search);
        const value  = params.get('isbn');
        return value ? value.trim() : null;
    }
};
