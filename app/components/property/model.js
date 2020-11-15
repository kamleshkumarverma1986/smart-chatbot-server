/**
 * Created by kaverma on 6/3/16.
 */

const mongoose     = require('mongoose');
const relationship = require('mongoose-relationship');
const Schema       = mongoose.Schema;

const schemaObj = {
    created: { type: Date, required: true, default: Date.now },
    lastUpdated: { type: Date },
    owner: { type:Schema.ObjectId, ref:"User", childPath:"properties", required: true },

    propertyType: { type: String, required: true, enum: ['house', 'commercial', 'pg'] },
    propertyAgreementType: { type: String, required: true, enum: ['rent'] },

    propertyTitle: { type: String, required: true },
    propertyAge: { type: Number, required: true, default: 0, min: 0, max: 50 },
    availability: { type: String, required: true, default: 'IMMEDIATE', enum: ['IMMEDIATE', 'WITHIN-15-DAYS', 'WITHIN-30-DAYS', 'AFTER-30-DAYS'] },
    isNegotiable: { type: Boolean, required: true, default: false },
    isDisabled: { type: Boolean, required: true, default: false },
    propertyValidity: { type: Date, required: false },
    preferredTenant: { type: String, required: true, default: 'ANYONE', enum: ['FAMILY', 'BACHELORS', 'COMPANY', 'ANYONE'] },
    preferredTenantGender: { type: String, enum: ['MALE', 'FEMALE', 'BOTH'] },
    parking: { type: String, required: true, default: 'NONE', enum: ['WHEELER2', 'WHEELER4', 'NONE'] },
    furnishedStatus: { type: String, required: true, enum: ['FURNISHED', 'UN-FURNISHED', 'SEMI-FURNISHED'] },

    /* Rent related fields */
    monthlyRent: { type: Number, required: true, default: 0 },
    deposit: { type: Number, required: true, default: 0 },
    maintenanceCharges: { type: Number, required: true, default: 0 },
    isElectricityChargesExcluded: { type: Boolean, required: true, default: false },
    isWaterChargesExcluded: { type: Boolean, required: true, default: false },

    /* Location related fields */
    city: { type: String, required: true },
    longitudeAndLatitude: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    locality: { type: String, required: true },

    dimensions: {
        area: { type: Number, required: true },
        unit: { type: String, required: true, default: 'SQ-FT', enum: ['SQ-FT', 'SQ-YRD', 'SQ-M', 'ACRE', 'BIGHA'] }
    },

    photos: [{
        isDefaultImage: { type: Boolean, required: true, default: false },
        imageURL: { type: String, required: true },
        description: { type: String, required: false }
    }],

    houseFeature: {
        BHKType: { type: String, required: requiredCheckForHouse, enum: ['RK1', 'BHK1', 'BHK2', 'BHK3', 'BHK4', 'BHK4-PLUS'] },
        balconies: { type: Number, required: requiredCheckForHouse, min: 0, max: 10 },
        floorNo: { type: Number, required: requiredCheckForHouse, min: 0, max: 200 },
        totalFloors: { type: Number, required: requiredCheckForHouse, min: 0, max: 200 },
        bathrooms: { type: Number, required: requiredCheckForHouse, min: 0, max: 10 },
        amenities: [{ type: String, enum: ['GYM', 'SWIMMING-POOL', 'LIFT'] }]
    },

    pgFeature: {
        sharing: { type: String, required: requiredCheckForPG, enum: ['SINGLE', 'DOUBLE', 'TRIPLE', 'FOUR', 'FOUR-PLUS'] },
        floorNo: { type: Number, required: requiredCheckForPG, min: 0, max: 200 },
        totalFloors: { type: Number, required: requiredCheckForPG, min: 0, max: 200 },
        noOfRooms: { type: Number, required: requiredCheckForPG, min: 1, max: 30 },
        haveAttachedBathroom: { type: Boolean, required: requiredCheckForPG },
        haveAttachedBalcony: { type: Boolean, required: requiredCheckForPG },
        haveCommonArea: { type: Boolean, required: requiredCheckForPG },
        facilities: {
            cupboards: { type: Boolean },
            studyTable: { type: Boolean },
            AC: { type: Boolean },
            geyser: { type: Boolean },
            washingMachine: { type: Boolean },
            wifi: { type: Boolean },
            fridge: { type: Boolean },
            cooler: { type: Boolean },
            TV: { type: Boolean }
        }
    },

    commercialFeature: {
        usedFor: { type: String, required: requiredCheckForCommercial, enum: ['OFFICE', 'CO-WORKING', 'SHOP', 'SHOWROOM', 'INDUSTRIAL-BUILDING', 'GOWDOWN-WAREHOUSE'] },
        floorNo: { type: Number, required: requiredCheckForCommercial, min: 0, max: 200 },
        totalFloors: { type: Number, required: requiredCheckForCommercial, min: 0, max: 200 },
        washrooms: { type: Number, required: requiredCheckForCommercial, min: 0, max: 100 },
        pantryOrCafeteria: { type: String, required: requiredCheckForCommercial, enum: ['DRY', 'WET', 'NOT-AVAILABLE'] },
        personalWashroom: { type: Boolean, required: requiredCheckForCommercial, default: false }
    }
}

const PropertySchema   = new Schema(schemaObj);

PropertySchema.index({ longitudeAndLatitude : '2dsphere' });
PropertySchema.plugin(relationship, { relationshipPathName:'owner' });
module.exports = {
    property: mongoose.model('Property', PropertySchema),
    schemaObj: schemaObj
}

function requiredCheckForHouse() { return this.propertyType === 'house'; };
function requiredCheckForCommercial() { return this.propertyType === 'commercial'; };
function requiredCheckForPG() { return this.propertyType === 'pg'; };


