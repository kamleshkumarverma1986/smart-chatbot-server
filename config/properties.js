/**
 * Created by kaverma on 6/5/16.
 */

const PROPERTIES = (function() {

    const private = {
        'NO_OF_DATA_FOR_INITIAL_PAGE': 8,
        'NO_OF_DATA_PER_PAGE': 4,

        'EMAIL_HOST': 'smtp.gmail.com',
        'ADMIN_EMAIL': 'tendymart@gmail.com',
        'ADMIN_PASS': '123qwe,./',

        'FRONT_END_URL' : 'https://www.tendymart.com/#/',
        'ACTIVE_URL': 'active-my-account/',
        'FORGOT_PASSWORD_URL': 'reset-password/'
    };

    return {
        get: function(name) { return private[name]; }
    };

})();

module.exports = PROPERTIES;