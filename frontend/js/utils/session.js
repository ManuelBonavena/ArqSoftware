/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Session management wrapper around localStorage.   */
/*              Used by the Auth flow to persist the logged-in    */
/*              user across page navigation, and by protected     */
/*              screens to redirect anonymous users back to the   */
/*              login page (transition T1).                       */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   SESSION_STORAGE_KEY                - localStorage key name   */
/*   Session.set(usuario)               - Store user info         */
/*   Session.get()                      - Retrieve user info      */
/*   Session.clear()                    - Wipe session            */
/*   Session.is_logged_in()             - Boolean check            */
/*   Session.require_auth(login_url)    - Redirect if anonymous   */
/******************************************************************/

const SESSION_STORAGE_KEY = 'biblioteca_ducky_session';

/******************************************************************/
/* Session API                                                    */
/******************************************************************/
const Session =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Session.set(usuario)                                       */
    /* Purpose: Store the logged-in user object as JSON in        */
    /*          localStorage. Should be called after a successful */
    /*          login (transition T4).                            */
    /* Parameters:                                                */
    /*   usuario - object - { username, nombre, email }           */
    /**************************************************************/
    set: function(usuario)
    {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(usuario));
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Session.get()                                              */
    /* Purpose: Retrieve the current session user, if any         */
    /* Returns: object | null - the stored user or null if none   */
    /**************************************************************/
    get: function()
    {
        const stored_value = localStorage.getItem(SESSION_STORAGE_KEY);

        if (!stored_value) return null;

        try
        {
            return JSON.parse(stored_value);
        }
        catch (parse_error)
        {
            /* Corrupted storage - treat as no session */
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Session.clear()                                            */
    /* Purpose: Remove the session from storage. Used by logout   */
    /*          (transitions T20, T22, T23).                      */
    /**************************************************************/
    clear: function()
    {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Session.is_logged_in()                                     */
    /* Purpose: Quick boolean check for the presence of a session */
    /* Returns: boolean                                           */
    /**************************************************************/
    is_logged_in: function()
    {
        return this.get() !== null;
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Session.require_auth(login_url)                            */
    /* Purpose: Guard for protected pages. If the user is not     */
    /*          logged in, redirect to the login page. Should be  */
    /*          called at the top of init() in protected screens. */
    /* Parameters:                                                */
    /*   login_url - string - URL to redirect to (default         */
    /*               'login.html')                                */
    /* Returns: boolean - true if user is authenticated, false    */
    /*          if redirect occurred                              */
    /**************************************************************/
    require_auth: function(login_url)
    {
        if (!this.is_logged_in())
        {
            window.location.href = login_url || 'login.html';
            return false;
        }
        return true;
    }
};
