var commonMethods =  {
    getApiResponse: function apiResponse(res, statusCode, message, resultData = null){
        console.log(message, 'message');
        if(statusCode == 500) {
            res.status(statusCode).json({
                status: statusCode,
                message: 'Interval Server Error'
            })
        }
        else if(statusCode == 200){
            res.status(statusCode).json({
                status: statusCode,
                message: message,
                data: resultData
            })
        }
        else if(statusCode == 300){
            res.status(statusCode).json({
                status: statusCode,
                message: message
            })
        }
    },


    // get missing fields in api
    mandatoryFields: function checkMandatoryFields(reqBody, fieldsRequired){
        console.log('fields');
        let missingFields = [];
        for(let val of fieldsRequired){
            if(!reqBody.hasOwnProperty(val)){
                missingFields.push(val+ ' is missing in request');
            }
        };
        if(missingFields.length){
            return {
                status: false,
                fieldsMandatory: missingFields
            }
        }else {
            return {
                status: true
            }
        }
    }
    // get missing fields in api end
}

module.exports = commonMethods;


// we can do with class

// class commonMethods {
//     apiResponse(res, statusCode, message, resultData = null){
//         if(statusCode == 500) {
//             res.status(statusCode).json({
//                 status: statusCode,
//                 message: 'Interval Server Error'
//             })
//         }
//         else if(statusCode == 200){
//             res.status(statusCode).json({
//                 status: statusCode,
//                 message: message,
//                 data: resultData
//             })
//         }
//         else if(statusCode == 300){
//             res.status(statusCode).json({
//                 status: statusCode,
//                 message: message
//             })
//         }
//     }

//     checkMandatoryFields(){
//         console.log('fields')
//     }
// }



// module.exports = new commonMethods();
