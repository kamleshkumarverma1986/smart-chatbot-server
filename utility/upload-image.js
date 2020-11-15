/**
 * Created by kaverma on 6/5/16.
 */
var Q = require('q');
var {Storage} = require('@google-cloud/storage');
var GCP_CONFIG = require('../gcp/gcp_config');

var gcs = new Storage({
  projectId: GCP_CONFIG.get('PROJECT_ID'),
  keyFilename: GCP_CONFIG.get('KEY_FILE_NAME')
});


var UploadImage = {};
module.exports = UploadImage;

UploadImage.imageUploading = function(bucketName, imageName, imgData) {
	var deferred = Q.defer();
	var buffer = new Buffer(imgData.replace(/^data:image\/\w+;base64,/, ""),'base64');
	var bucket = gcs.createBucket(GCP_CONFIG.get(bucketName));

	bucket.acl.default.add({
	  entity: 'allUsers',
	  role: gcs.acl.READER_ROLE
	}, function(err, aclObject) {});
	var file = bucket.file(imageName);
	var stream = file.createWriteStream();
	stream.on('error', function (err) {
	    console.log("Error while uploading image on GCP --> " + JSON.stringify(err));
	    deferred.reject(422);
	});
	stream.on('finish', function () {
		var imageUrl = GCP_CONFIG.get('PUBLIC_IMAGE_URL') + GCP_CONFIG.get(bucketName) + '/' + imageName;
		deferred.resolve(imageUrl);
	});
	stream.end(buffer);
	return deferred.promise;
};

