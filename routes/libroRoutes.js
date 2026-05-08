/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Route definitions for the /libros endpoint.       */
/*              Maps HTTP methods and paths to their respective   */
/*              controller handlers. Uses ISBN as identifier.     */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   GET    /          -> get_libros        - List all books      */
/*   GET    /:isbn     -> get_libro_by_isbn - Read one book       */
/*   POST   /          -> create_libro      - Create a book       */
/*   PUT    /:isbn     -> update_libro      - Update a book       */
/*   DELETE /:isbn     -> delete_libro      - Delete a book       */
/******************************************************************/

const express = require('express');
const router = express.Router();
const libro_controller = require('../controllers/libroController');

/******************************************************************/
/* Book route mappings                                            */
/******************************************************************/
router.get(   '/',       libro_controller.get_libros);
router.get(   '/:isbn',  libro_controller.get_libro_by_isbn);
router.post(  '/',       libro_controller.create_libro);
router.put(   '/:isbn',  libro_controller.update_libro);
router.delete('/:isbn',  libro_controller.delete_libro);

module.exports = router;
