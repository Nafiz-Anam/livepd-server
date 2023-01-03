const Joi = require('joi').extend(require('@joi/date'));
const ServerResponse = require('../response/ServerResponse');
const StatusCode = require('../statuscode/index');
const checkEmpty = require('./emptyChecker');
const idChecker = require('./idchecker');
const checkifrecordexist = require('./checkifrecordexist');
const enc_dec = require("../../utilities/decryptor/decryptor");
const PspValidator = {
    add: async (req, res, next) => {
        const schema = Joi.object().keys({
            name: Joi.string().min(3).max(60).pattern(new RegExp(/^[A-Za-z]+[A-Za-z ]*$/)).required().messages({
                "string.pattern.base": "Name can contain alphabets",
                'string.empty': 'Name should not be an empty',
                'any.required': 'Name required',
                'string.min': 'Name minimum length is 3 characters',
                'string.max': 'Name maximum length is 60 characters'
            }),
            email_to: Joi.string().email().required().error(() => {
                return new Error("Email Required")
            }),
            cc: Joi.string().email({ multiple: true }).allow('').error(() => {
                return new Error("Valid cc email Required")
            }),
            mcc: Joi.string().required().error(() => {
                return new Error("Valid cc email Required")
            }),
            ekyc_required: Joi.string().required().error(() => {
                return new Error("Ekyc Required")
            }),
            threshold_value: Joi.number().required().error(() => {
                return new Error("Threshold value Required")
            }),
            files:Joi.string().optional().allow('').error(()=>{
                return new Error("Valid file required")
            }),
            remark:Joi.string().max(200).optional().allow('').error(()=>{
                return new Error("Valid remark required (max 200 characters)")
            })
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let cc = req.bodyString('cc');
                let cc_error = false;
                if (cc != '') {
                    let cc_array = cc.split(",");
                    if (cc_array.length > 5) {
                        cc_error = true;
                    }
                }
                if (!cc_error) {
                    next();
                } else {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Maximum 5 emails are allowed in cc'));
                }

            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    get: async (req, res, next) => {
        const schema = Joi.object().keys({
            psp_id: Joi.string().required().error(() => {
                return new Error("PSP id Required")
            })
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                if (req.bodyString('psp_id')) {
                    let psp_id = await enc_dec.cjs_decrypt(req.bodyString('psp_id'));
                    let psp_exits = await idChecker(psp_id, 'psp');
                    if (!psp_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Invalid psp id'));
                }
                next();
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    update: async (req, res, next) => {
        const schema = Joi.object().keys({
            psp_id: Joi.string().required().error(() => {
                return new Error("PSP id Required")
            }),
            name: Joi.string().required().error(() => {
                return new Error("Name Required")
            }),
            email_to: Joi.string().email().required().error(() => {
                return new Error("Email Required")
            }),
            cc: Joi.string().email({ multiple: true }).allow('').error(() => {
                return new Error("Valid cc email Required")
            }),
            ekyc_required: Joi.string().required().error(() => {
                return new Error("Ekyc Required")
            }),
            threshold_value: Joi.number().required().error(() => {
                return new Error("Threshold value Required")
            }),
            mcc: Joi.string().required().error(() => {
                return new Error("Valid cc email Required")
            }),
            files:Joi.string().optional().allow('').error(()=>{
                return new Error("Valid file required")
            }),
            remark:Joi.string().max(200).optional().allow('').error(()=>{
                return new Error("Valid remark required (max 200 characters)")
            })
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                if (req.bodyString('psp_id')) {
                    let psp_id =  enc_dec.cjs_decrypt(req.bodyString('psp_id'));
                    let psp_exits = await idChecker(psp_id, 'psp');
                    if (!psp_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Invalid psp id'));
                }
                let cc = req.bodyString('cc');
                let cc_error = false;
                if (cc != '') {
                    let cc_array = cc.split(",");
                    if (cc_array.length > 5) {
                        cc_error = true;
                    }
                }
                if (!cc_error) {
                    next();
                } else {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Maximum 5 emails are allowed in cc'));
                }

            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    deactivate: async (req, res, next) => {
        
        if (checkEmpty(req.body, ["psp_id"])) {
            
            const schema = Joi.object().keys({
                psp_id: Joi.string().min(10).required().error(() => {
                    return new Error("Valid psp ID required")
                }),
            })

            try {
                
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
                } else {
                    
                    record_id = enc_dec.cjs_decrypt(req.bodyString('psp_id'));
                    let record_exist = await checkifrecordexist({'id':record_id,'status':0,'deleted':0}, 'psp');
                    if (record_exist){
                       next();
                    } else {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found or already deactivated.'));
                    }
                }

            } catch (error) {
                res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
            }

        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },
    activate: async (req, res, next) => {
        
        if (checkEmpty(req.body, ["psp_id"])) {
            
            const schema = Joi.object().keys({
                psp_id: Joi.string().min(10).required().error(() => {
                    return new Error("Valid psp ID required")
                }),
            })

            try {
                
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
                } else {
                    
                    record_id = enc_dec.cjs_decrypt(req.bodyString('psp_id'));
                    let record_exist = await checkifrecordexist({'id':record_id,'status':1,'deleted':0}, 'psp');
                    if (record_exist){
                       next();
                    } else {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found or already activated.'));
                    }
                }

            } catch (error) {
                res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
            }

        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },
    delete: async (req, res, next) => {
        
        if (checkEmpty(req.body, ["psp_id"])) {
            
            const schema = Joi.object().keys({
                psp_id: Joi.string().min(10).required().error(() => {
                    return new Error("Valid psp ID required")
                }),
            })

            try {
                
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
                } else {
                    
                    record_id = enc_dec.cjs_decrypt(req.bodyString('psp_id'));
                    let record_exist = await checkifrecordexist({'id':record_id,'deleted':0}, 'psp');
                    if (record_exist){
                       next();
                    } else {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found or already deleted.'));
                    }
                }

            } catch (error) {
                res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
            }

        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },
}
module.exports = PspValidator