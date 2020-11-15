/**
 * Created by kamlesh verma on 25/Oct/2019.
 */

const express = require('express');
const router = express.Router();

/* All controllers reference */
const userController = require('../app/components/user/controller');
const propertyController = require('../app/components/property/controller');

/* MIDDLEWARE to use for all requests */
router.use((request, response, next) => {
    if(!request.cookies.authtoken) {
        console.log("You're not Logged in");
    } else {
        console.log("WOW , You're Logged in, go ahead you can access anything here !!!!");
    }
    next();
});

/* USER Signup API */
router.route('/user/signup')
    .post((request, response) => {
        userController.signup(request)
            .then( success => {
                response.status(success.statusCode).send(success);
            }).catch( error => {
                response.status(error.statusCode).send();
            });
    });

/* Property POST API */
router.route('/property')
    .post((request, response) => {
        propertyController.saveProperty(request)
            .then( success => {
                response.status(success.statusCode).send(success);
            }).catch( error => {
                response.status(error.statusCode).send(error);
            });
    });

/* Property GET API */
router.route('/search/:propertyType/:propertyAgreementType/:city')
    .get((request, response) => {
        propertyController.getProperty(request)
            .then( success => {
                response.status(success.statusCode).send(success.object);
            }).catch( error => {
                response.status(error.statusCode).send(error);
            });
    });

module.exports = router;
