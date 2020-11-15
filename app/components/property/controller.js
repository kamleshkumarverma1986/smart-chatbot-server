/**
 * Created by kaverma on 6/3/16.
 */

const propertyService = require('./service');
const DTO = require('../../../utility/dto');
const CONSTANTS = require('../../../utility/constants');

const propertyController = {};

propertyController.saveProperty = (request) => {
    return new Promise((resolve, reject) => {
        propertyService.saveProperty(request.body)
            .then( (success) => {
                DTO.statusCode = 200;
                DTO.message = CONSTANTS.get('SUCCESS');
                DTO.object = success;
                return resolve(DTO);
            }).catch( (errorObj) => {
                DTO.statusCode = errorObj.statusCode;
                DTO.message = errorObj.message;
                DTO.object = null;
                return reject(DTO);
            });
    });
}

propertyController.getProperty = (request) => {
    return new Promise((resolve, reject) => {
        propertyService.getProperty(request.params, request.query)
            .then( (success) => {
                DTO.statusCode = 200;
                DTO.message = CONSTANTS.get('SUCCESS');
                DTO.object = success;
                return resolve(DTO);
            }).catch( (errorObj) => {
                DTO.statusCode = errorObj.statusCode;
                DTO.message = errorObj.message;
                DTO.object = null;
                return reject(DTO);
            });
    });
}

module.exports = propertyController;
