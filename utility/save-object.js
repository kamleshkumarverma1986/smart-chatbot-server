const saveObject = (object, resolve, reject, processName, successCallback) => {
    object.save( error => {
        if (error) {
            console.log(`Error while saving ${processName} :- ${error}`);
            return reject(422);
        } else {
        	if(successCallback) {
        		successCallback.call(null, object);
        	} else {
        		resolve(200);
        	}
        }
    });
}

module.exports = saveObject;