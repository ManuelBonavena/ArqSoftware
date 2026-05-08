/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Form validation helpers shared by the Login,      */
/*              Nuevo Libro, and Editar Libro screens. Mirrors    */
/*              the backend validators so the frontend can detect */
/*              missing fields client-side BEFORE hitting the     */
/*              server, providing immediate UX feedback           */
/*              (transitions T3, T10, T17).                       */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   Validation.find_missing(values, required_keys)               */
/*   Validation.mark_invalid_fields(field_ids)                    */
/*   Validation.clear_field_errors(field_ids)                     */
/*   Validation.show_error(element_id, message)                   */
/*   Validation.clear_error(element_id)                           */
/******************************************************************/

const Validation =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Validation.find_missing(values, required_keys)             */
    /* Purpose: Return the list of required keys whose values are */
    /*          null, undefined, or empty/whitespace-only strings */
    /* Parameters:                                                */
    /*   values        - object - the values to inspect           */
    /*   required_keys - array  - the keys that must be present   */
    /* Returns: array of missing key names (empty if all present) */
    /**************************************************************/
    find_missing: function(values, required_keys)
    {
        if (!values || typeof values !== 'object')
        {
            return required_keys.slice();
        }

        return required_keys.filter(function(key_name)
        {
            const current_value = values[key_name];

            if (current_value === null || current_value === undefined) return true;
            if (typeof current_value === 'string' && current_value.trim() === '') return true;

            return false;
        });
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Validation.mark_invalid_fields(field_ids)                  */
    /* Purpose: Add the 'field-error' CSS class to the given      */
    /*          input elements so the user can see which fields   */
    /*          are missing or invalid                            */
    /* Parameters:                                                */
    /*   field_ids - array of element IDs to mark                 */
    /**************************************************************/
    mark_invalid_fields: function(field_ids)
    {
        field_ids.forEach(function(field_id)
        {
            const field_element = document.getElementById(field_id);
            if (field_element)
            {
                field_element.classList.add('field-error');
            }
        });
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Validation.clear_field_errors(field_ids)                   */
    /* Purpose: Remove the 'field-error' CSS class from the given */
    /*          input elements. Call this before re-validating to */
    /*          clear stale error indicators.                     */
    /* Parameters:                                                */
    /*   field_ids - array of element IDs to clean                */
    /**************************************************************/
    clear_field_errors: function(field_ids)
    {
        field_ids.forEach(function(field_id)
        {
            const field_element = document.getElementById(field_id);
            if (field_element)
            {
                field_element.classList.remove('field-error');
            }
        });
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Validation.show_error(element_id, message)                 */
    /* Purpose: Display a user-facing error message inside the    */
    /*          designated message container of a form            */
    /* Parameters:                                                */
    /*   element_id - string - id of the message container        */
    /*   message    - string - message to display                 */
    /**************************************************************/
    show_error: function(element_id, message)
    {
        const message_element = document.getElementById(element_id);
        if (message_element)
        {
            message_element.textContent = message;
            message_element.classList.add('visible');
        }
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Validation.clear_error(element_id)                         */
    /* Purpose: Hide the error message of a form                  */
    /* Parameters:                                                */
    /*   element_id - string - id of the message container        */
    /**************************************************************/
    clear_error: function(element_id)
    {
        const message_element = document.getElementById(element_id);
        if (message_element)
        {
            message_element.textContent = '';
            message_element.classList.remove('visible');
        }
    }
};
