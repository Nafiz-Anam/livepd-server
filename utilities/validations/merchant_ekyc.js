const Joi = require('joi').extend(require('@joi/date'));
const ServerResponse = require('../response/ServerResponse');
const StatusCode = require('../statuscode/index');
const checkEmpty = require('./emptyChecker');
const idChecker = require('./idchecker');
const checkifrecordexist = require('./checkifrecordexist');
const enc_dec = require("../decryptor/decryptor");
const encrypt_decrypt = require('../decryptor/encrypt_decrypt');
const checkifrecordexistandexpiration = require('./checkifrecordexistandexpiration');
const helpers = require('../helper/general_helper');
const MerchantEkyc = {
    login: async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required().error(() => {
                return new Error("Valid email required")
            }),
            password: Joi.string().required().error(() => {
                return new Error("Password Required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let email_exits = await checkifrecordexist({ email: req.bodyString('email') }, 'master_super_merchant');
                let password_is_blank = await checkifrecordexist({ email: req.bodyString('email'), password: '' }, 'master_super_merchant');
                if (!email_exits || password_is_blank) {
                    if (!email_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Account is not registered`));
                    else
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Password is not set for account.`));
                } else {
                    next()
                }
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    psp_by_mcc: async (req, res, next) => {
        const schema = Joi.object().keys({
            mcc_code: Joi.string().required().error(() => {
                return new Error("Valid Mcc code required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let mcc_code_id = enc_dec.cjs_decrypt(req.bodyString('mcc_code'));
                let mcc_exits = await checkifrecordexist({ id: mcc_code_id }, 'mcc_codes');
                if (!mcc_exits) {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Mcc code is not valid`));
                } else {
                    next()
                }
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    business_type: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            register_country: Joi.string().required().error(() => {
                return new Error("Register country required")
            }),
            entity_type: Joi.string().required().error(() => {
                return new Error("Entity type required")
            }),
            is_business_register_in_free_zone: Joi.any().valid(0, 1, "1", "0").required().error(() => {
                return new Error("Is business register in free zone required")
            }),
            data_id_1: Joi.string().optional().allow('').error(() => {
                return new Error("Data-1 ID required")
            }),
            data_id_2: Joi.string().optional().allow('').error(() => {
                return new Error("Data-2 ID required")
            }),
            data_id_3: Joi.string().optional().allow('').error(() => {
                return new Error("Data-3 ID required")
            }),
            data_id_4: Joi.string().optional().allow('').error(() => {
                return new Error("Data-4 ID required")
            }),
            data_id_5: Joi.string().optional().allow('').error(() => {
                return new Error("Data-5 ID required")
            }),

            document_1: Joi.string().optional().allow('').error(() => {
                return new Error("Document-1 required")
            }),
            document_2: Joi.string().optional().allow('').error(() => {
                return new Error("Document-2 required")
            }),
            document_3: Joi.string().optional().allow('').error(() => {
                return new Error("Document-3 required")
            }),
            document_4: Joi.string().optional().allow('').error(() => {
                return new Error("Document-4 required")
            }),
            document_5: Joi.string().optional().allow('').error(() => {
                return new Error("Document-5 required")
            }),

            document_1_id: Joi.string().optional().allow('').error(() => {
                return new Error("Document-1 ID required")
            }),
            document_2_id: Joi.string().optional().allow('').error(() => {
                return new Error("Document-2 ID required")
            }),
            document_3_id: Joi.string().optional().allow('').error(() => {
                return new Error("Document-3 ID required")
            }),
            document_4_id: Joi.string().optional().allow('').error(() => {
                return new Error("Document-4 ID required")
            }),
            document_5_id: Joi.string().optional().allow('').error(() => {
                return new Error("Document-5 ID required")
            }),

            document_1_is_required: Joi.string().optional().allow('').error(() => {
                return new Error("Document-1 is required")
            }),
            document_2_is_required: Joi.string().optional().allow('').error(() => {
                return new Error("Document-2 is required")
            }),
            document_3_is_required: Joi.string().optional().allow('').error(() => {
                return new Error("Document-3 is required")
            }),
            document_4_is_required: Joi.string().optional().allow('').error(() => {
                return new Error("Document-4 is required")
            }),
            document_5_is_required: Joi.string().optional().allow('').error(() => {
                return new Error("Document-5 is required")
            }),

            document_1_number: Joi.string().optional().allow('').error(() => {
                return new Error("Document-1 number required")
            }),
            document_2_number: Joi.string().optional().allow('').error(() => {
                return new Error("Document-2 number required")
            }),
            document_3_number: Joi.string().optional().allow('').error(() => {
                return new Error("Document-3 number required")
            }),
            document_4_number: Joi.string().optional().allow('').error(() => {
                return new Error("Document-4 number required")
            }),
            document_5_number: Joi.string().optional().allow('').error(() => {
                return new Error("Document-5 number required")
            }),

            document_1_issue_date: Joi.date().format('YYYY-MM-DD').max('now').optional().allow('').error(() => {
                return new Error("Valid Document-1 issue date required")
            }),
            document_2_issue_date: Joi.date().format('YYYY-MM-DD').max('now').optional().allow('').error(() => {
                return new Error("Valid Document-2 issue date required")
            }),
            document_3_issue_date: Joi.date().format('YYYY-MM-DD').max('now').optional().allow('').error(() => {
                return new Error("Valid Document-3 issue date required")
            }),
            document_4_issue_date: Joi.date().format('YYYY-MM-DD').max('now').optional().allow('').error(() => {
                return new Error("Valid Document-4 issue date required")
            }),
            document_5_issue_date: Joi.date().format('YYYY-MM-DD').max('now').optional().allow('').error(() => {
                return new Error("Valid Document-5 issue date required")
            }),

            document_1_expiry_date: Joi.date().format('YYYY-MM-DD').min('now').optional().allow('').error(() => {
                return new Error("Valid Document-1 expiry date required")
            }),
            document_2_expiry_date: Joi.date().format('YYYY-MM-DD').min('now').optional().allow('').error(() => {
                return new Error("Valid Document-2 expiry date required")
            }),
            document_3_expiry_date: Joi.date().format('YYYY-MM-DD').min('now').optional().allow('').error(() => {
                return new Error("Valid Document-3 expiry date required")
            }),
            document_4_expiry_date: Joi.date().format('YYYY-MM-DD').min('now').optional().allow('').error(() => {
                return new Error("Valid Document-4 expiry date required")
            }),
            document_5_expiry_date: Joi.date().format('YYYY-MM-DD').min('now').optional().allow('').error(() => {
                return new Error("Valid Document-5 expiry date required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let country_id = enc_dec.cjs_decrypt(req.bodyString('register_country'));
                let entity_type_id = enc_dec.cjs_decrypt(req.bodyString('entity_type'));

                let country_exits = await checkifrecordexist({ id: country_id }, 'country');
                let entity_type_exits = await checkifrecordexist({ id: entity_type_id }, 'master_entity_type')

                if (!country_exits || !entity_type_exits) {
                    if (!country_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Country id is not valid`));
                    else
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Entity type id is not valid`));
                } else {
                    let entity_type_doc_exits = await helpers.get_data_list("*", 'master_entity_document', { entity_id: entity_type_id, deleted: 0 })
                    if (entity_type_doc_exits[0]) {
                        let doc_arr = []
                        for (let val of entity_type_doc_exits) {
                            doc_arr['document_' + val.document] = val.required;
                           // doc_arr['document_' + val.document + '_is_required']= val.required;
                            doc_arr['document_' + val.document + '_number']= val.document_num_required;
                            doc_arr['document_' + val.document + '_issue_date']= val.issue_date_required;
                            doc_arr['document_' + val.document + '_expiry_date']= val.expiry_date_required;
                                
                            
                        }
                        let doc_error = ""
                        for (const [key, value] of Object.entries(doc_arr)) {
                            if(value == 1 && (key == "document_1" || key == "document_2"|| key == "document_3"||key == "document_4"||key == "document_5")){
                                let data_id = [];
                                if(key == "document_1" && req.bodyString('data_id_1')){
                                    data_id['document_1'] = encrypt_decrypt('decrypt',req.bodyString('data_id_1'));
                                }
                                if(key == "document_2" && req.bodyString('data_id_2')){
                                    data_id['document_2'] = encrypt_decrypt('decrypt',req.bodyString('data_id_2'));
                                }
                                if(key == "document_3" && req.bodyString('data_id_3')){
                                    data_id['document_3'] = encrypt_decrypt('decrypt',req.bodyString('data_id_3'));
                                }
                                if(key == "document_4" && req.bodyString('data_id_4')){
                                    data_id['document_4'] = encrypt_decrypt('decrypt',req.bodyString('data_id_4'));
                                }
                                if(key == "document_5" && req.bodyString('data_id_5')){
                                    data_id['document_5'] = encrypt_decrypt('decrypt',req.bodyString('data_id_5'));
                                }

                                if (req.all_files) {
                                    if (!req.all_files[key] && !data_id[key]) {
                                        doc_error = "Error: " + key.replace(/_|_/g,' ')+" field required"
                                        break;
                                    }

                                }else if(!data_id[key]){
                                    doc_error = "Error: " + key.replace(/_|_/g,' ')+" field required"
                                    break;
                                }
                                    
                                
                            }else if(value == 1){
                                if(!req.bodyString(key)){
                                    doc_error = "Error:" + key.replace(/_|_/g,' ')+" field required"
                                    break;
                                }
                            }

                        }
                        
                        if(doc_error){
                            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(doc_error));
                        }else{
                            next()
                        }
                       
                    } else {
                        next()
                    }
                }
            }
        } catch (error) {
            console.log(error)
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    business_details: async (req, res, next) => {
        var url_regex = /^(?:(?:(?:https?|ftp):)?(\/\/|www\.))(?:\+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[\/?#]\S*)?$/
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            legal_business_name: Joi.string().required().error(() => {
                return new Error("Legal business name required")
            }),
            company_registration_number: Joi.string().required().error(() => {
                return new Error("Company registration number required")
            }),
            vat_number: Joi.string().allow('').error(() => {
                return new Error("Vat number required")
            }),
            doing_business_as: Joi.string().allow('').error(() => {
                return new Error("Valid doing business as field required")
            }),
            // register_business_address_country: Joi.string().required().error(() => {
            //     return new Error("Valid country required")
            // }),
            business_address_line1: Joi.string().required().error(() => {
                return new Error("Valid address line1 required")
            }),
            business_address_line2: Joi.string().allow('').error(() => {
                return new Error("Valid address line2 required")
            }),
            province: Joi.string().required().error(() => {
                return new Error("Province required")
            }),
            business_phone_code: Joi.string().required().error(() => {
                return new Error("Business phone code required")
            }),
            business_phone_number: Joi.string().required().error(() => {
                return new Error("Business phone number required")
            }),
            industry_type: Joi.string().required().error(() => {
                return new Error("Industry type required")
            }),
            
            business_website: Joi.string().regex(url_regex).required().error(() => {
                return new Error("Business website required")
            }),
            product_description: Joi.string().required().error(() => {
                return new Error("Product description required")
            }),

            poc_name:Joi.string().required().error(() => {
                return new Error("Point of contact name required")
            }),
            poc_email:Joi.string().email().max(100).required().error(() => {
                return new Error("Point of contact email required")
            }),
            poc_mobile_code:Joi.string().required().max(3).error(() => {
                return new Error("Point of contact mobile code required")
            }),
            poc_mobile:Joi.string().required().max(15).error(() => {
                return new Error("Point of contact mobile required")
            }),

            cro_name:Joi.string().required().error(() => {
                return new Error("Compliance & risk officer name required")
            }),
            cro_email:Joi.string().email().max(100).required().error(() => {
                return new Error("Compliance & risk officer email required")
            }),
            cro_mobile_code:Joi.string().required().max(3).error(() => {
                return new Error("Compliance & risk officer mobile code required")
            }),
            cro_mobile:Joi.string().required().max(15).error(() => {
                return new Error("Compliance & risk officer mobile required")
            }),

            co_name:Joi.string().required().error(() => {
                return new Error("Customer support name required")
            }),
            co_email:Joi.string().email().max(100).required().error(() => {
                return new Error("Customer support email required")
            }),
            co_mobile_code:Joi.string().required().max(3).error(() => {
                return new Error("Customer support mobile code required")
            }),
            co_mobile:Joi.string().required().max(15).error(() => {
                return new Error("Customer support mobile required")
            }),

            link_tc:Joi.string().regex(url_regex).required().error(() => {
                return new Error("Valid terms and conditions link required")
            }),
            link_pp:Joi.string().regex(url_regex).required().error(() => {
                return new Error("Valid privacy policy link required")
            }),

            link_refund:Joi.string().regex(url_regex).required().error(() => {
                return new Error("Valid refund link required")
            }),
            link_cancellation :Joi.string().regex(url_regex).required().error(() => {
                return new Error("Valid cancellation link required")
            }),
            link_dp:Joi.string().regex(url_regex).required().error(() => {
                return new Error("Valid delivery policy link required")
            }),
            

        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {

                //let country_id = enc_dec.cjs_decrypt( req.bodyString('register_business_address_country'));

                let state_id = enc_dec.cjs_decrypt(req.bodyString('province'));
                let industry_type_id = enc_dec.cjs_decrypt(req.bodyString('industry_type'))

                

                

                //let country_exits = await checkifrecordexist({ id: country_id }, 'country');
                let state_exits = await checkifrecordexist({ id: state_id }, 'states')
                let industry_type_exits = await checkifrecordexist({ id: industry_type_id }, 'mcc_codes')

                if (!state_exits || !industry_type_exits) {
                    // if (!country_exits){
                    //     res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Country id is not valid`));
                    // }else 
                    if (!state_exits) {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Province id is not valid`));
                    } else if (!industry_type_exits) {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Industry type id is not valid`));
                    } 

                } else {
                    
                    next()
                }
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }


    },
    representative_update: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            legal_person_first_name: Joi.string().required().error(() => {
                return new Error("Legal person first name required")
            }),
            legal_person_last_name: Joi.string().required().error(() => {
                return new Error("Legal person last name required")
            }),
            email_address: Joi.string().email().required().error(() => {
                return new Error("Valid email address required")
            }),
            job_title: Joi.string().required().error(() => {
                return new Error("Job title required")
            }),
            nationality: Joi.string().required().error(() => {
                return new Error("Nationality required")
            }),
            home_address_country: Joi.string().required().error(() => {
                return new Error("Country required")
            }),
            date_of_birth: Joi.date().format('YYYY-MM-DD').max('now').required().error(() => {
                return new Error("Valid date of birth required")
            }),
            home_address_line1: Joi.string().required().error(() => {
                return new Error("Home address line1 required")
            }),
            home_address_line2: Joi.string().optional().allow('').error(() => {
                return new Error("Home address line2 required")
            }),
            home_address_state: Joi.string().required().error(() => {
                return new Error("Home address state required")
            }),
            home_address_phone_code: Joi.string().required().error(() => {
                return new Error("Home address phone code required")
            }),
            home_address_phone_number: Joi.string().required().error(() => {
                return new Error("Home address phone number required")
            }),
            personal_id_number: Joi.string().required().error(() => {
                return new Error("Personal id number required")
            })
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let nationality_id = enc_dec.cjs_decrypt(req.bodyString('nationality'));
                let country_id = enc_dec.cjs_decrypt(req.bodyString('home_address_country'));
                let state_id = enc_dec.cjs_decrypt(req.bodyString('home_address_state'));

                let country_exits = await checkifrecordexist({ id: country_id }, 'country');
                let nationality = await checkifrecordexist({ id: nationality_id }, 'country');
                let state_exits = await checkifrecordexist({ id: state_id }, 'states')
                if (!country_exits || !nationality || !state_exits) {
                    if (!nationality)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Nationality id is not valid`));
                    if (!country_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Invalid country id`))
                    if (!state_exits)
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Invalid state id`))

                } else {
                    next()
                }
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    add_business_owner: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            first_name: Joi.string().required().error(() => {
                return new Error("Legal person first name required")
            }),
            last_name: Joi.string().required().error(() => {
                return new Error("Legal person last name required")
            }),
            email_address: Joi.string().email().required().error(() => {
                return new Error("Valid email address required")
            }),
            document: Joi.optional().allow('').error(() => {
                return new Error("Valid document required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                if (req.all_files) {
                    if (req.all_files.document) {
                        fs.unlink('public/files/' + req.all_files.document, function (err) {
                            if (err) console.log(err);
                        });
                    }
                }
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                var error1 = '';
                if (req.all_files) {

                    if (!req.all_files.document) {
                        error1 = "Please upload valid document file. Only .jpg,.png file accepted (size: upto 1MB)";

                    }
                }
                let email_exits = await checkifrecordexist({ email: req.bodyString('email_address'), deleted: 0 }, 'merchant_business_owners');
                if (email_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Business owner with email address already exits.`))
                else
                    next()
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    owners_copy: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().optional().allow('').error(() => {
                return new Error("Sub-merchant ID required")
            }),
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let submerchant_id = enc_dec.cjs_decrypt(req.bodyString('submerchant_id'));
                let merchant_id = await checkifrecordexist({ merchant_id: submerchant_id}, 'merchant_business_owners');
                if (!merchant_id){
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Please add owners first`))
                }  else{
              
                    next()
                }
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    add_executives: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            first_name: Joi.string().required().error(() => {
                return new Error("Legal person first name required")
            }),
            last_name: Joi.string().required().error(() => {
                return new Error("Legal person last name required")
            }),
            email_address: Joi.string().email().required().error(() => {
                return new Error("Valid email address required")
            })
        })

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let email_exits = await checkifrecordexist({ email: req.bodyString('email_address'), deleted: 0 }, 'merchant_business_executives');
                if (email_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Executive with email address already exits.`))
                else
                    next()
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    update_public: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            statement_descriptor: Joi.string().required().error(() => {
                return new Error("Statement descriptor required")
            }),
            shortened_descriptor: Joi.string().required().error(() => {
                return new Error("Shortened descriptor required")
            }),
            customer_support_phone_code: Joi.string().required().error(() => {
                return new Error("Customer support phone code required")
            }),
            customer_support_phone_number: Joi.string().required().error(() => {
                return new Error("Customer support phone number required")
            }),
            psp_id: Joi.string().required().error(() => {
                return new Error("PSP required")
            }),
        })
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let psp_ids = req.bodyString('psp_id').split(",");
                let psp_exits = true;
                for (let i = 0; i < psp_ids.length; i++) {
                    if (psp_exits) {
                        psp_exits = await checkifrecordexist({ id: enc_dec.cjs_decrypt(psp_ids[i]) }, 'psp')
                    }
                }

                if (!psp_exits) {
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`PSP  id is not valid`));
                }else{
                    next()
                }
               
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    add_bank: async (req, res, next) => {
        const schema = Joi.object().keys({
            submerchant_id: Joi.string().required().error(() => {
                return new Error("Sub-merchant ID required")
            }),
            bank_name: Joi.string().required().min(1).max(200).error(() => {
                return new Error("Bank name required")
            }),
            branch_name: Joi.string().min(1).max(200).required().error(() => {
                return new Error("Branch name required")
            }),
            
            iban_no: Joi.string().required().error(() => {
                return new Error("Iban no. required")
            }),
            confirm_iban_no: Joi.required().valid(Joi.ref('iban_no')).error(() => {
                return new Error("Iban no. must be same")
            }),
            ifsc: Joi.string().optional().allow('').error(() => {
                return new Error("IFSC no. required")
            }),

        })
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                next()
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    remove_business_owner: async (req, res, next) => {
        const schema = Joi.object().keys({
            
            business_owner_id: Joi.string().required().error(() => {
                return new Error("Business owner id required")
            }),
        })
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let business_owner_id = enc_dec.cjs_decrypt(req.bodyString('business_owner_id'));
                let business_owner_exits = await checkifrecordexist({ id: business_owner_id, deleted: 0 }, 'merchant_business_owners');
                if (!business_owner_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Business orwner with id not exits or already deleted.`))
                else
                    next()
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    remove_business_executive: async (req, res, next) => {
        const schema = Joi.object().keys({
            business_executive_id: Joi.string().required().error(() => {
                return new Error("Business executive id required")
            }),
        })
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let business_executive_id = enc_dec.cjs_decrypt(req.bodyString('business_executive_id'));
                let business_executive_exits = await checkifrecordexist({ id: business_executive_id, deleted: 0 }, 'merchant_business_executives');
                console.log(business_executive_exits);
                if (!business_executive_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Business executive with id not exits or already deleted.`))
                else
                    next()
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    checkMerchant: async (req, res,next) => {
        const schema = Joi.object().keys({
            merchant_id: Joi.string().required().error(() => {
                return new Error("Merchant id required")
            }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let merchant_id = enc_dec.cjs_decrypt(req.bodyString('merchant_id'));
                let merchant_exits = await checkifrecordexist({ id: merchant_id, deleted: 0 ,status:0}, 'master_merchant');
                if (!merchant_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Merchant with id not exits or account deleted or account is not active.`))
                else
                    next()
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    update_merchant_ekyc: async (req, res,next) => {
        const schema = Joi.object().keys({
            merchant_id: Joi.string().required().error(() => {
                return new Error("Merchant id required")
            }),
            ekyc_status: Joi.string().required().error(() => {
                return new Error("Ekyc status  required")
            }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let merchant_id = enc_dec.cjs_decrypt(req.bodyString('merchant_id'));
                let merchant_exits = await checkifrecordexist({ id: merchant_id, deleted: 0 ,status:0}, 'master_merchant');
                if (!merchant_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Merchant with id not exits or account deleted or account is not active.`))
                else
                    next()
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    psp_mail: async (req, res,next) => {
        const schema = Joi.object().keys({
            merchant_id: Joi.string().required().error(() => {
                return new Error("Merchant id required")
            }),
            ekyc_status: Joi.string().required().error(() => {
                return new Error("Ekyc status  required")
            }),
        });
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.ok).send(ServerResponse.errormsg(result.error.message));
            } else {
                let merchant_id = enc_dec.cjs_decrypt(req.bodyString('merchant_id'));
                let merchant_exits = await checkifrecordexist({ id: merchant_id, deleted: 0 ,status:0}, 'master_merchant');
                if (!merchant_exits)
                    res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Merchant with id not exits or account deleted or account is not active.`))
                else
                    next()
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }
    },
    update_owners_status: async (req, res, next) => {
      
        const schema = Joi.object().keys({
            owner_id: Joi.string().required().error(() => {
                return new Error("Valid Owner Id required")
            }),
            status: Joi.number().min(0).max(3).required().error(() => {
                return new Error("Status required")
            }),
        })
        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {
                let owner_id =  enc_dec.cjs_decrypt(req.bodyString('owner_id'));
                let owner_id_exist = await checkifrecordexist({id: owner_id,deleted:0}, 'merchant_business_owners');
          
                if (!owner_id_exist) {
                        res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(`Owner not found`)); 
                } else {
                    next();
                }
            }
        } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
        }

    } ,
}
module.exports = MerchantEkyc