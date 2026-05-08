/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Authentication model. Wraps the /login endpoint   */
/*              of the REST API. The view and controller must     */
/*              never call fetch directly; they go through this   */
/*              object, which delegates to the shared Api wrapper.*/
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   AuthModel.login(username, password) - POST /login            */
/******************************************************************/

const AuthModel =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* AuthModel.login(username, password)                        */
    /* Purpose: Send credentials to the API. The Api wrapper      */
    /*          throws an ApiError with .status on non-2xx, which */
    /*          lets the controller distinguish T3 (status 400 -  */
    /*          empty fields) from T2 (status 401 - bad creds).   */
    /* Parameters:                                                */
    /*   username - string - the account username                 */
    /*   password - string - the account password                 */
    /* Returns: Promise resolving to { success, usuario }          */
    /* Throws : ApiError on rejection or network error             */
    /**************************************************************/
    login: function(username, password)
    {
        return Api.post('/login', { username: username, password: password });
    }
};
