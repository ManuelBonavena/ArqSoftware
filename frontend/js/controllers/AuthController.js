/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Authentication controller. Orchestrates AuthView, */
/*              AuthModel, Session, and Validation to handle      */
/*              login submission and exit actions on the login    */
/*              screen. Implements transitions T1 - T4 and T22.  */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   AuthController.login() - Process login form submission       */
/*   AuthController.salir() - Clear form and end session          */
/******************************************************************/

const AuthController =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthController.login()                                     */
    /* Purpose: Validate inputs locally first (transition T3 -    */
    /*          empty fields), then send credentials to the API.  */
    /*          On success (T4) persist the session and redirect  */
    /*          to the catalog. On 401 show "Credenciales         */
    /*          incorrectas" (T2). Any other error shows a        */
    /*          generic message.                                  */
    /* Called by: onclick on the Iniciar sesion button           */
    /**************************************************************/
    login: async function()
    {
        AuthView.clear_error();
        AuthView.clear_invalid();

        const credentials = AuthView.get_credentials();

        /* Transition T3 - empty fields detected client-side */
        const missing_fields = Validation.find_missing(
            credentials,
            ['username', 'password']
        );

        if (missing_fields.length > 0)
        {
            AuthView.mark_invalid(missing_fields);
            AuthView.show_error('Datos requeridos');
            return;
        }

        try
        {
            const login_result = await AuthModel.login(
                credentials.username,
                credentials.password
            );

            /* Transition T4 - login valido */
            Session.set(login_result.usuario);
            window.location.href = 'catalogo_libros.html';
        }
        catch (api_error)
        {
            /* Transition T2 - bad credentials */
            if (api_error.status === 401)
            {
                AuthView.mark_invalid(['username', 'password']);
                AuthView.show_error('Credenciales incorrectas');
                return;
            }

            /* Transition T3 fallback - server-side validation rejected */
            if (api_error.status === 400)
            {
                const server_missing = (api_error.body && api_error.body.missing_fields) || [];
                AuthView.mark_invalid(server_missing);
                AuthView.show_error('Datos requeridos');
                return;
            }

            /* Generic error - server unreachable, etc. */
            AuthView.show_error('No fue posible conectar con el servidor. Intenta de nuevo.');
            console.error('login error:', api_error);
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthController.salir()                                     */
    /* Purpose: Reset the login form and clear any stored         */
    /*          session. Implements transition T22 (salir desde   */
    /*          autenticacion -> estado final).                   */
    /* Called by: onclick on the X button in the login topbar     */
    /**************************************************************/
    salir: function()
    {
        AuthView.clear_form();
        Session.clear();
    }
};
