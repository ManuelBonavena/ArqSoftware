/******************************************************************/
/* Program Assignment: Biblioteca Ducky - Proyecto Final          */
/* Name: Manuel Bonavena (625440)                                 */
/* Date: 2026-05-07                                               */
/* Description: Route definitions for the /login endpoint.        */
/*              Maps the POST method to the authentication        */
/*              controller handler.                               */
/******************************************************************/

/******************************************************************/
/* Listing Contents:                                              */
/*   POST / -> login - Authenticate user credentials              */
/******************************************************************/

const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');

/******************************************************************/
/* Authentication route mapping                                   */
/******************************************************************/
router.post('/', auth_controller.login);

module.exports = router;
