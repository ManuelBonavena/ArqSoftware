/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Authentication view. Owns the DOM operations of  */
/*              the login screen: reading the input fields,      */
/*              displaying error messages, marking invalid       */
/*              fields, and clearing the form. Performs no        */
/*              network calls and contains no business logic.    */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   AuthView.LOGIN_FIELD_IDS              - Form field ids       */
/*   AuthView.get_credentials()            - Read inputs          */
/*   AuthView.show_error(message)          - Display message      */
/*   AuthView.clear_error()                - Hide message         */
/*   AuthView.mark_invalid(missing_fields) - Highlight bad fields */
/*   AuthView.clear_invalid()              - Reset highlighting   */
/*   AuthView.clear_form()                 - Empty inputs         */
/******************************************************************/

const AuthView =
{
    LOGIN_FIELD_IDS: ['usuario', 'password'],
    ERROR_ELEMENT_ID: 'error',

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.get_credentials()                                 */
    /* Purpose: Read the username and password input values.      */
    /*          Trims whitespace from username; password is       */
    /*          returned untouched (spaces in passwords matter).  */
    /* Returns: object - { username, password }                   */
    /**************************************************************/
    get_credentials: function()
    {
        return {
            username: document.getElementById('usuario').value.trim(),
            password: document.getElementById('password').value
        };
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.show_error(message)                               */
    /* Purpose: Display an error message under the login form     */
    /* Parameters:                                                */
    /*   message - string - error text                            */
    /**************************************************************/
    show_error: function(message)
    {
        Validation.show_error(this.ERROR_ELEMENT_ID, message);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.clear_error()                                     */
    /* Purpose: Hide the form error message                       */
    /**************************************************************/
    clear_error: function()
    {
        Validation.clear_error(this.ERROR_ELEMENT_ID);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.mark_invalid(missing_fields)                      */
    /* Purpose: Add the field-error class to a list of fields.    */
    /*          The argument can use either form ids ('usuario',  */
    /*          'password') or backend names ('username',         */
    /*          'password'); they are translated automatically.   */
    /* Parameters:                                                */
    /*   missing_fields - array - field names to mark             */
    /**************************************************************/
    mark_invalid: function(missing_fields)
    {
        const id_translation_map = { username: 'usuario', password: 'password' };
        const translated_ids = missing_fields.map(function(field_name)
        {
            return id_translation_map[field_name] || field_name;
        });
        Validation.mark_invalid_fields(translated_ids);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.clear_invalid()                                   */
    /* Purpose: Remove the field-error class from all login       */
    /*          inputs. Call before re-validating to avoid stale  */
    /*          error indicators.                                 */
    /**************************************************************/
    clear_invalid: function()
    {
        Validation.clear_field_errors(this.LOGIN_FIELD_IDS);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthView.clear_form()                                      */
    /* Purpose: Reset the login form to its initial state.        */
    /*          Clears values, errors, and field highlighting.    */
    /**************************************************************/
    clear_form: function()
    {
        document.getElementById('usuario').value  = '';
        document.getElementById('password').value = '';
        this.clear_error();
        this.clear_invalid();
    }
};
