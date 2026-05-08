/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: HTTP client wrapper used by all frontend Models   */
/*              to talk to the REST API. Centralizes the base     */
/*              URL, JSON serialization, and error normalization. */
/*              Models should never call fetch() directly; they   */
/*              must go through this Api object.                  */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   API_BASE_URL                  - Backend base URL constant    */
/*   ApiError                      - Custom error type carrying   */
/*                                   HTTP status and parsed body  */
/*   Api.get(path)                 - GET request returning JSON   */
/*   Api.post(path, body)          - POST request with JSON body  */
/*   Api.put(path, body)           - PUT request with JSON body   */
/*   Api.del(path)                 - DELETE request                */
/******************************************************************/

const API_BASE_URL = 'http://localhost:3000';

/******************************************************************/
/* Custom error class so callers can branch on HTTP status        */
/* without having to inspect the response twice. The body is      */
/* always the parsed JSON payload (or null if the response was    */
/* empty), so callers can read err.body.missing_fields, etc.      */
/******************************************************************/
class ApiError extends Error
{
    constructor(status, body, message)
    {
        super(message || ('HTTP ' + status));
        this.name   = 'ApiError';
        this.status = status;
        this.body   = body;
    }
}

/******************************************************************/
/* Internal request helper used by all public verbs               */
/******************************************************************/

/******************************************************************/
/* Reuse Instructions                                             */
/* request(method, path, body)                                    */
/* Purpose: Send an HTTP request and return the parsed response.  */
/*          Throws ApiError on non-2xx responses so callers can   */
/*          use try/catch with a consistent error shape.          */
/* Parameters:                                                    */
/*   method - string - HTTP verb ('GET', 'POST', 'PUT', 'DELETE') */
/*   path   - string - path relative to API_BASE_URL              */
/*   body   - object - optional payload (will be JSON-encoded)    */
/* Returns: Promise resolving to parsed JSON response             */
/* Throws : ApiError on non-2xx; Error on network failure         */
/******************************************************************/
const request = async (method, path, body) =>
{
    const request_options =
    {
        method:  method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body !== undefined && body !== null)
    {
        request_options.body = JSON.stringify(body);
    }

    const server_response = await fetch(API_BASE_URL + path, request_options);

    /* Try to parse JSON regardless of status; some error responses
       include useful payloads like missing_fields. */
    let parsed_body = null;
    const response_text = await server_response.text();

    if (response_text.length > 0)
    {
        try
        {
            parsed_body = JSON.parse(response_text);
        }
        catch (parse_error)
        {
            parsed_body = { raw: response_text };
        }
    }

    if (!server_response.ok)
    {
        throw new ApiError(
            server_response.status,
            parsed_body,
            (parsed_body && parsed_body.error) || ('HTTP ' + server_response.status)
        );
    }

    return parsed_body;
};

/******************************************************************/
/* Public API surface                                             */
/******************************************************************/
const Api =
{
    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Api.get(path)                                              */
    /* Purpose: Send a GET request                                */
    /* Returns: Promise resolving to parsed JSON response         */
    /**************************************************************/
    get: function(path)
    {
        return request('GET', path);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Api.post(path, body)                                       */
    /* Purpose: Send a POST request with a JSON body              */
    /* Returns: Promise resolving to parsed JSON response         */
    /**************************************************************/
    post: function(path, body)
    {
        return request('POST', path, body);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Api.put(path, body)                                        */
    /* Purpose: Send a PUT request with a JSON body               */
    /* Returns: Promise resolving to parsed JSON response         */
    /**************************************************************/
    put: function(path, body)
    {
        return request('PUT', path, body);
    },

    /**************************************************************/
    /* Reuse Instructions                                         */
    /* Api.del(path)                                              */
    /* Purpose: Send a DELETE request                             */
    /* Returns: Promise resolving to parsed JSON response         */
    /**************************************************************/
    del: function(path)
    {
        return request('DELETE', path);
    }
};
