/**
 * Created by kaverma on 6/3/16.
 */

const model = require('./model');
const Property = model.property;
const schemaObj = model.schemaObj;
const PROPERTIES = require('../../../config/properties');
const convertIntoMeters = require('../../../utility/convert-into-meters');
const User = require('../user/model');

const propertyService = {};

propertyService.saveProperty = (requestBody) => {
    return new Promise((resolve, reject) => {
        let propertyObject = new Property(requestBody);
        propertyObject.save((error) => {
          if (error) {
            return reject({statusCode: 422, message: error});
          } else {
            resolve(propertyObject);
          }          
        });
    });
}

propertyService.getProperty = (params, query) => {
    return new Promise((resolve, reject) => {
        if (!params.propertyType || !params.propertyAgreementType || !params.city ||
                !query.distanceRange || !query.distanceUnit || !query.longitude || !query.latitude || !query.pageNo) {
            return reject({statusCode: 422, message: 'Params (propertyType, propertyAgreementType, city) and query parameters (distanceRange, distanceUnit, longitude, latitude, pageNo) are mandatory fields.'});
        }
        const searchObject = {...params};
        searchObject.longitudeAndLatitude = {
            '$near': {
                '$maxDistance': convertIntoMeters( query.distanceRange, query.distanceUnit ),
                '$geometry': { type: 'Point', coordinates: [ query.longitude, query.latitude ] }
            }
        };

        /* start pagination */
        let perPage = 0;
        let skipPage = 0;
        const FIRST_PAGE = PROPERTIES.get('NO_OF_DATA_FOR_INITIAL_PAGE'); /* first time user will get 8 records by defaults */
        const PER_PAGE = PROPERTIES.get('NO_OF_DATA_PER_PAGE'); /* after that user will have only 4 records for each page */
        if (query.pageNo === 1) {
            perPage = FIRST_PAGE;
            skipPage = 0;
        } else {
            perPage = PER_PAGE;
            skipPage = FIRST_PAGE + (PER_PAGE * (query.pageNo-2));
        }
        /* end pagination */

        /* Sorting */
        let sortBy = {};
        if (query.sortBy) {
            sortBy[query.sortBy] = -1;
        } else {
            sortBy.created = -1 // Sort by Created Date DESC by default
        }

        /* Applying all filters */
        applyFilters(searchObject, {...query}, params.propertyType, reject);

        console.log("searchObject ======> ", searchObject);
        Property.find(searchObject).limit(perPage).skip(skipPage).sort(sortBy).exec( (error, properties) => {
            if (error) {
                return reject({statusCode: 422, message: error});
            } else {
                Property.count(searchObject, (error, count) => {
                    if(!error) {
                        resolve({totalProperty: count, properties: properties});
                    }
                });
            }
        });
    });
}

const deleteUsedFilters = (query) => {
    delete query.distanceRange;
    delete query.distanceUnit;
    delete query.longitude;
    delete query.latitude;
    delete query.pageNo;
    delete query.rentLowerRange;
    delete query.rentHigherRange;
}

const splitAndAssign = (query, key, fieldName, andArray) => {
    andArray.push({ $or: String(query[key]).split(',').reduce((acc, data) => {
        acc.push({ [fieldName]: isNaN(parseInt(data)) ? data : parseInt(data) });
        return acc;
    },[])});
}

const applyFilters = (searchObject, query, propertyType, reject) => {
    if(query.rentLowerRange || query.rentHigherRange) {
        const rentSearchObj = {};
        if(query.rentLowerRange) rentSearchObj['$gte'] = query.rentLowerRange;
        if(query.rentHigherRange) rentSearchObj['$lte'] = query.rentHigherRange;
        searchObject.monthlyRent = rentSearchObj;
    }
    deleteUsedFilters(query);
    if(Object.keys(query).length) {
        const andArray = [];
        try {
            for(const key in query) {
                if(schemaObj[`${propertyType}Feature`][key]) {
                    splitAndAssign(query, key, `${propertyType}Feature.${key}`, andArray);
                } else if (schemaObj[key]) {
                    splitAndAssign(query, key, key, andArray);
                } else {
                    return reject({statusCode: 422, message: 'Your filters are not correct'});
                }
            }
            Object.assign(searchObject, { $and: andArray });
        } catch(error) {
            return reject({statusCode: 422, message: error});
        }
    }
}

module.exports = propertyService;
