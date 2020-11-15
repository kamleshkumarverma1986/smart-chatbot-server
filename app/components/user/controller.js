/**
 * Created by kaverma on 6/3/16.
 */

const userService = require('./service');
const DTO = require('../../../utility/dto');
const CONSTANTS = require('../../../utility/constants');

const userController = {};

userController.signup = (request) => {
    return new Promise( (resolve, reject) => {
        userService.signup(request.body)
            .then( (userId) => {
                DTO.statusCode = 200;
                DTO.message = CONSTANTS.get('SUCCESS');
                DTO.object = userId;
                return resolve(DTO);
            }).catch( (error) => {
                DTO.statusCode = error;
                DTO.message = null;
                DTO.object = null;
                return reject(DTO);
            });
    });
}

module.exports = userController;
