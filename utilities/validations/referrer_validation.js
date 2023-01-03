const Joi = require("joi").extend(require("@joi/date")).extend(require('joi-currency-code'));
const ServerResponse = require("../response/ServerResponse");
const StatusCode = require("../statuscode/index");
const checkRecordExits = require('../validations/checkifrecordexist');
const ReferrerValidator = {
    
    add: async (req, res, next) => {
        console.log(req.body);
        const schema = Joi.object().keys({
            name: Joi.string().required().error(() => {
                return new Error("Name required")
            }),
            email: Joi.string().email().required().error(() => {
                return new Error("Email required")
            }),
            mobile_code: Joi.string().required().error(() => {
                return new Error("Mobile code required")
            }),
            mobile_no: Joi.number().integer().min(10000000).max(99999999999).required().error(() => {
                return new Error("Valid mobile no  required")
            }),
            password: Joi.string().min(5).max(15).required().label('Password'),
            confirm_password: Joi.any().equal(Joi.ref('password'))
                .required()
                .label('Confirm password')
                .options({ messages: { 'any.only': '{{#label}} does not match' } }),
            currency: Joi.string().currency().required().error(() => {
                return new Error("Valid currency  required")
            }),
            bank_name: Joi.string().allow('').error(() => {
                return new Error("Valid bank name required")
            }),
            branch_name: Joi.string().allow('').error(() => {
                return new Error("Valid branch name required")
            }),
            bank_account_no: Joi.string().allow('').error(() => {
                return new Error("Valid bank account no  required")
            }),
            iban: Joi.string().allow('').error(() => {
                return new Error("Valid iban no required")
            }),
            national_id: Joi.string().optional().allow('').error(() => {
                return new Error("Valid national id required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let email_exits = await checkRecordExits({email:req.bodyString('email')},'referrers');
                let mobile_no_exits = await checkRecordExits({mobile_no:req.bodyString('mobile_no'),mobile_code:req.bodyString('mobile_code')},'referrers');
                if(!email_exits && !mobile_no_exits){
                    next();
                }else{
                    if(email_exits){
                        res.status(StatusCode.ok).send(ServerResponse.errormsg('Referrer with email already exits'));
                    }else{
                        res.status(StatusCode.ok).send(ServerResponse.errormsg('Referrer with mobile no already exits'));
                    }
                   
                }
                
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    }
}
module.exports = ReferrerValidator;