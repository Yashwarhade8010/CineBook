const validateRequestBody =  (body,requiredFields)=>{
    for(const field of requiredFields){
        if(!body[field]){
            return `Missing ${field} field`
        }
    }
}

module.exports = validateRequestBody