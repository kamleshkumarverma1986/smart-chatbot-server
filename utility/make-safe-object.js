const makeSafeObject = (object) => {
	const copiedObject = object.toJSON();
	delete copiedObject.password;
	delete copiedObject.__v;
	delete copiedObject.forgotPasswordToken;
	return copiedObject;
}

module.exports = makeSafeObject;