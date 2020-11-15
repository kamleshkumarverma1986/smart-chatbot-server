/**
 * Created by kaverma on 6/3/16.
 */

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const UserSchema   = new Schema({

    created: { type: Date, required: true, default: Date.now },
    lastActive: { type: Date, required: true, default: Date.now },
    forgotPasswordToken: { type: String, required: false },

    name: { type: String, required: true },
    email: { type: String, unique : true, required : true },
    password: { type: String, required: true },
    contact : { type: Number, required: true },
    role: { type: String, required: true, enum: ['ADMINISTRATOR', 'PROPERTY-OWNER', 'END-USER', 'PROPERTY-AGENT'] },
    description: { type: String, required: false },
    properties: [{ type:Schema.ObjectId, ref:"Property" }],

    isActive: { type: Boolean, required: true, default: true },
    profilePicURL: { type: String, required: false },
    KYC: {
    	id: { type: Number },
    	name: { type: String },
    	type: { type: String }
    }
});

module.exports = mongoose.model('User', UserSchema);