/**
 * Created by kaverma on 6/3/16.
 */

const User = require('./model');
const md5 = require('../../../utility/md5');
const generateSalt = require('../../../utility/salt');
const saveObject = require('../../../utility/save-object');

const userService = {};

userService.signup = (requestBody) => {
    return new Promise( (resolve, reject) => {
        if (!requestBody.name || !requestBody.email || !requestBody.password || !requestBody.contact || !requestBody.role) {
            return reject(422);
        }
        User.findOne({email: requestBody.email}, (error, userObj) => {
            if(userObj) {
                return reject(409);
            }
            const salt = generateSalt();
            const user = new User();
            user.created = new Date();
            user.name = requestBody.name;
            user.email = requestBody.email;
            user.password = salt + md5( requestBody.password + salt );
            user.contact = requestBody.contact;
            user.role = requestBody.role;
            saveObject(user, resolve, reject, "signup", function(object) {
                resolve(object._id)
            });
        });

    });
}

module.exports = userService;
