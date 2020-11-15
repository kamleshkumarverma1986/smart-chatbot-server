/**
 * Created by kaverma on 7/1/16.
 */


/* we need to pass distance digit with distance unit , it will convert into meters */

var convertIntoMeters = function(distanceDigit, distanceUnit) {
    var distanceInMeters = 0;
    if ( distanceUnit === 'KM' ) { distanceInMeters = distanceDigit  * 1000 }
    if ( distanceUnit === 'M' ) { distanceInMeters = distanceDigit  }
    return distanceInMeters;
};

module.exports = convertIntoMeters;