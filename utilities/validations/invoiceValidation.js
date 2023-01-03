const Joi = require('joi').extend(require('@joi/date'));
const ServerResponse = require('../response/ServerResponse');
const StatusCode = require('../statuscode/index');
const checkEmpty = require('./emptyChecker');
const validate_mobile = require('./validate_mobile');
const checkwithcolumn = require('./checkerwithcolumn');
const checkifrecordexist = require('./checkifrecordexist')
const enc_dec = require("../decryptor/decryptor");
const multer = require('multer');
const helpers = require('../helper/general_helper');
const fs = require('fs');
const encrypt_decrypt = require("../../utilities/decryptor/encrypt_decrypt");
const { join } = require('path');
const invModel = require("../../models/invoiceModel");
const moment = require('moment');



// .pattern(new RegExp(/^[A-Za-z]+[A-Za-z ]*$/))
const validation = {
   add: async (req, res, next) => {
      const schema = Joi.object().keys({
         name_prefix: Joi.string().valid("M/S", "Mr.", "Miss").optional().allow("").error(() => {
            return new Error("Name prefix required.")
         }),
         name: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Name required.")
         }),
         country_code: Joi.number().min(1).max(999).required().error(() => {
            return new Error("Country code required")
         }),
         mobile: Joi.string().min(10).max(10).trim().required().error(() => {
            return new Error("Mobile number required")
         }),
         email: Joi.string().min(1).max(100).email().trim().required().error(() => {
            return new Error("Email required")
         }),
         ship_address: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Shipping address required.")
         }),
         ship_country: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship country required")
         }),
         ship_state: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship state required")
         }),
         ship_city: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship city required")
         }),
         ship_zip_code: Joi.string().min(5).max(6).required().messages({
            "any.required": "{{#label}} is required",
            "string.min": "{{#label}} should be min 5 length",
            "string.max": "{{#label}} should be max 6 length"
         }),


         bill_address: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Billing address required.")
         }),
         bill_country: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill country required")
         }),
         bill_state: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill state required")
         }),
         bill_city: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill city required")
         }),
         bill_zip_code: Joi.string().min(5).max(6).required().messages({
            "any.required": "{{#label}} is required",
            "string.min": "{{#label}} should be min 5 length",
            "string.max": "{{#label}} should be max 6 length"
         }),
         logo: Joi.optional().allow('').error(() => {
            return new Error("logo required")
         }),


      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            if (req.all_files) {
               if (req.all_files.logo) {
                  fs.unlink('public/logo/' + req.all_files.logo, function (err) {
                     if (err) console.log(err);
                  });
               }
            }
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            // let language_exist = await checkifrecordexist({ 'name': req.bodyString('language'), 'deleted': 0 }, 'master_language');
            var error = ""
            if (req.all_files) {
               if (!req.all_files.logo) {
                  error = 'Please upload valid flag file. Only .jpg,.png file accepted (size: upto 1MB)';
               }

            } else if (!req.all_files) {
               error = 'Please upload valid file.(size: upto 1MB)';
            }

            // if (req.bodyString('direction') != 'ltr' && req.bodyString('direction') != 'rtl') {
            //    error = 'Please add valid direction ltr or rlt';
            // }

            if (error == "") {
               next();
            } else {
               if (req.all_files) {
                  if (req.all_files.logo) {
                     fs.unlink('public/logo/' + req.all_files.logo, function (err) {
                        if (err) console.log(err);
                     });
                  }
               }
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error ? error : "Error in data."));
            }
         }

      } catch (error) {

         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
      }


   },

   update: async (req, res, next) => {
      const schema = Joi.object().keys({
         customer_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Customer id required.")
         }),
         name_prefix: Joi.string().valid("M/S", "Mr.", "Miss").optional().allow("").error(() => {
            return new Error("Name prefix required.")
         }),
         name: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Name required.")
         }),
         country_code: Joi.number().min(1).max(999).required().error(() => {
            return new Error("Country code required")
         }),
         mobile: Joi.string().min(10).max(10).trim().required().error(() => {
            return new Error("Mobile number required")
         }),
         email: Joi.string().min(1).max(100).email().trim().required().error(() => {
            return new Error("Email required")
         }),

         ship_address: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Ship address required.")
         }),
         ship_country: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship country required")
         }),
         ship_state: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship state required")
         }),
         ship_city: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Ship city required")
         }),
         ship_zip_code: Joi.string().min(1).max(6).required().error(() => {
            return new Error("Ship zip code required")
         }),
         bill_address: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Bill address required.")
         }),
         bill_country: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill country required")
         }),
         bill_state: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill state required")
         }),
         bill_city: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Bill city required")
         }),
         bill_zip_code: Joi.string().min(1).max(6).required().error(() => {
            return new Error("Bill zip code required")
         }),


      })

      try {
         const result = schema.validate(req.body);
         if (result.error) {
            if (req.all_files) {
               if (req.all_files.logo) {
                  fs.unlink('public/logo/' + req.all_files.logo, function (err) {
                     if (err) console.log(err);
                  });
               }
            }
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            record_id = enc_dec.cjs_decrypt(req.bodyString('customer_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id }, 'inv_customer');
            // let language_exist = await checkifrecordexist({ 'name': req.bodyString('language'), 'id !=': record_id, 'deleted': 0 }, 'master_language');
            if (record_exist) {
               next();
            } else {
               if (req.all_files) {
                  if (req.all_files.logo) {
                     fs.unlink('public/logo/' + req.all_files.logo, function (err) {
                        if (err) console.log(err);
                     });
                  }
               }
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found.'));
            }
         }

      } catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
      }


   },

   details: async (req, res, next) => {
      if (checkEmpty(req.body, ["customer_id"])) {

         const schema = Joi.object().keys({
            customer_id: Joi.string().min(2).max(200).required().error(() => {
               return new Error("Customer id Required")
            })
         })
         try {
            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {
               let record_exist = await checkifrecordexist({ 'id': enc_dec.cjs_decrypt(req.bodyString('customer_id')) }, 'inv_customer');
               if (record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found.'));
               }
            }
         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }
      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },

   deactivate: async (req, res, next) => {

      if (checkEmpty(req.body, ["customer_id"])) {

         const schema = Joi.object().keys({
            customer_id: Joi.string().min(10).required().error(() => {
               return new Error("Customer id required")
            }),
         })

         try {

            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {

               record_id = enc_dec.cjs_decrypt(req.bodyString('customer_id'));
               let customer_exist = await checkifrecordexist({ 'id': record_id }, 'inv_customer');
               let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'inv_customer');
               if (customer_exist && record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found.' : !record_exist ? "Record already deactivated." : ""));
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

      if (checkEmpty(req.body, ["customer_id"])) {

         const schema = Joi.object().keys({
            customer_id: Joi.string().min(10).required().error(() => {
               return new Error("Customer id required")
            }),
         })

         try {

            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {

               record_id = enc_dec.cjs_decrypt(req.bodyString('customer_id'));
               let customer_exist = await checkifrecordexist({ 'id': record_id }, 'inv_customer');
               let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 1 }, 'inv_customer');
               if (customer_exist && record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found' : !record_exist ? 'Record already activated.' : " "));
               }
            }
         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }

      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },

   inv_add: async (req, res, next) => {
      const schema = Joi.object().keys({
         customer_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Customer id required.")
         }),
         sub_merchant_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Sub_merchant id required.")
         }),
         currency: Joi.string().min(1).max(3).trim().required().error(() => {
            return new Error("Currency required.")
         }),

         issue_date: Joi.date().iso().required().error(() => {
            return new Error("Issue date required.")
         }),
         expiry_date: Joi.date().iso().min(Joi.ref('issue_date')).required().error(() => {
            return new Error("Expiry date required.")
         }),
         merchant_invoice_no:Joi.string().required(()=>{
            return new Error("Merchant invoice no")
         }),
         payment_terms: Joi.string().allow(''),
         description: Joi.string().allow(''),
         note: Joi.string().allow(''),
         items: Joi.array().items({
            item: Joi.string().required().error(() => {
               return new Error("Item  required.")
            }),
            item_rate: Joi.string().required().error(() => {
               return new Error("Item rate required.")
            }),
            quantity: Joi.string().required().error(() => {
               return new Error("Quantity required.")
            }),
            tax_per: Joi.string().required().error(() => {
               return new Error("Tax required.")
            }),
            discount_per: Joi.string().required().error(() => {
               return new Error("Discount required.")
            }),

         })
      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let sub_merchant_id = enc_dec.cjs_decrypt(req.bodyString('sub_merchant_id'));
            let customer_id = enc_dec.cjs_decrypt(req.bodyString('customer_id'));
            let merchant_id_exits = await checkifrecordexist({ id: sub_merchant_id, super_merchant_id: req.user.id }, 'master_merchant');
            let customer_exits = await checkifrecordexist({ id: customer_id, merchant_id: req.user.id }, 'inv_customer')
            if (merchant_id_exits && customer_exits) {
               next();
            } else {
               if (!merchant_id_exits) {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Sub merchant  not exits'));
               } else if (!customer_exits) {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Customer  not exits'));
               }
            }

         }
      } catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
      }
   },

   inv_details: async (req, res, next) => {
      if (checkEmpty(req.body, ["invoice_master_id"])) {

         const schema = Joi.object().keys({
            invoice_master_id: Joi.string().min(1).max(50).required().error(() => {
               return new Error("Invoice master id Required")
            })
         })
         try {
            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {
               let record_exist = await checkifrecordexist({ 'id': enc_dec.cjs_decrypt(req.bodyString('invoice_master_id')) }, 'inv_invoice_master');
               if (record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found.'));
               }
            }
         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }
      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },
   inv_update: async (req, res, next) => {
      const schema = Joi.object().keys({
         invoice_id: Joi.string().required().error(() => {
            return new Error("Invoice id required.")
         }),
         customer_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Customer id required.")
         }),
         sub_merchant_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Sub_merchant id required.")
         }),
         currency: Joi.string().min(1).max(3).trim().required().error(() => {
            return new Error("Currency required.")
         }),

         issue_date: Joi.date().iso().required().error(() => {
            return new Error("Issue date required.")
         }),
         expiry_date: Joi.date().iso().min(Joi.ref('issue_date')).required().error(() => {
            return new Error("Expiry date required.")
         }),
         merchant_invoice_no:Joi.string().required().error(()=>{
            return new Error("Merchant invoice no required")
         }),
         payment_terms: Joi.string().allow(''),
         description: Joi.string().allow(''),
         note: Joi.string().allow(''),
         items: Joi.array().items({
            item: Joi.string().required().error(() => {
               return new Error("Item  required.")
            }),
            item_rate: Joi.string().required().error(() => {
               return new Error("Item rate required.")
            }),
            quantity: Joi.string().required().error(() => {
               return new Error("Quantity required.")
            }),
            tax_per: Joi.string().required().error(() => {
               return new Error("Tax required.")
            }),
            discount_per: Joi.string().required().error(() => {
               return new Error("Discount required.")
            }),

         })

      })

      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let sub_merchant_id = enc_dec.cjs_decrypt(req.bodyString('sub_merchant_id'));
            let customer_id = enc_dec.cjs_decrypt(req.bodyString('customer_id'));
            let invoice_id = enc_dec.cjs_decrypt(req.bodyString('invoice_id'));
            let merchant_id_exits = await checkifrecordexist({ id: sub_merchant_id, super_merchant_id: req.user.id }, 'master_merchant');
            let customer_exits = await checkifrecordexist({ id: customer_id, merchant_id: req.user.id }, 'inv_customer')
            let invoice_exits = await checkifrecordexist({ id: invoice_id }, 'inv_invoice_master');
            if (merchant_id_exits && customer_exits && invoice_exits) {
               next();
            } else {
               if (!merchant_id_exits) {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Sub merchant not exits'));
               } else if (!customer_exits) {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Customer not exits'));
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Invoice not exits'));
               }
            }

         }
      } catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
      }


   },

   inv_deactivate: async (req, res, next) => {

      if (checkEmpty(req.body, ["invoice_master_id"])) {

         const schema = Joi.object().keys({
            invoice_master_id: Joi.string().min(1).max(50).required().error(() => {
               return new Error("Invoice master id required")
            }),
         })

         try {

            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {

               record_id = enc_dec.cjs_decrypt(req.bodyString('invoice_master_id'));
               let customer_exist = await checkifrecordexist({ 'id': record_id }, 'inv_invoice_master');
               let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'inv_invoice_master');
               if (customer_exist && record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found.' : !record_exist ? "Record already deactivated." : ""));
               }
            }

         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }

      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },

   inv_activate: async (req, res, next) => {

      if (checkEmpty(req.body, ["invoice_master_id"])) {

         const schema = Joi.object().keys({
            invoice_master_id: Joi.string().min(10).required().error(() => {
               return new Error("Invoice master id required")
            }),
         })

         try {

            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {

               record_id = enc_dec.cjs_decrypt(req.bodyString('invoice_master_id'));
               let customer_exist = await checkifrecordexist({ 'id': record_id }, 'inv_invoice_master');
               let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 1 }, 'inv_invoice_master');
               if (customer_exist && record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found' : !record_exist ? 'Record already activated.' : " "));
               }
            }
         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
         }

      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },

   item_add: async (req, res, next) => {
      const schema = Joi.object().keys({
         invoice_master_id: Joi.string().min(1).max(50).trim().required().error(() => {
            return new Error("Invoice master id required")
         }),
         item: Joi.array().items({
            item_rate: Joi.string().min(1).max(7).required().error(() => {
               return new Error("Item rate required")
            }),
            quantity: Joi.number().greater(0).less(9999999).required().error(() => {
               return new Error("Quantity required")
            }),
            tax_per: Joi.number().greater(0).less(100).required().error(() => {
               return new Error("Tax required")
            }),
            discount_per: Joi.number().greater(0).less(100).required().error(() => {
               return new Error("Discount required")
            }),
            total_amount: Joi.string().min(1).max(10).error(() => {
               return new Error("Total amount required")
            })
         })
      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         }
         else {
            next();
         }

      }
      catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error.message));
      }
   },
   item_details: async (req, res, next) => {
      if (checkEmpty(req.body, ["invoice_master_id"])) {

         const schema = Joi.object().keys({
            invoice_master_id: Joi.string().min(1).max(50).required().error(() => {
               return new Error("Invoice master id Required")
            })
         })
         try {
            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {
               let record_exist = await checkifrecordexist({ 'invoice_master_id': enc_dec.cjs_decrypt(req.bodyString('invoice_master_id')) }, 'inv_invoice_items');
               if (record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found.'));
               }
            }
         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }
      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },
   item_delete: async (req, res, next) => {

      if (checkEmpty(req.body, ["item_id"])) {

         const schema = Joi.object().keys({
            item_id: Joi.string().min(1).max(50).required().error(() => {
               return new Error("Item id required")
            }),
         })

         try {

            const result = schema.validate(req.body);
            if (result.error) {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
            } else {

               record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
               let customer_exist = await checkifrecordexist({ 'id': record_id }, 'inv_invoice_items');
               let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'inv_invoice_items');
               if (customer_exist && record_exist) {
                  next();
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found.' : !record_exist ? "Record already deleted." : ""));
               }
            }

         } catch (error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
         }

      } else {
         res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
      }
   },
   item_master_add: async (req, res, next) => {


      const schema = Joi.object().keys({
         item_name: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Item name required")
         }),
         item_rate: Joi.string().min(1).max(50).required().error(() => {
            return new Error("Item rate required")
         }),
         item_description: Joi.string().allow('')
      })

      try {

         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            next();
         }

      } catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }


   },
   item_master_details: async (req, res, next) => {
      const schema = Joi.object().keys({
         item_id: Joi.string().required().error(() => {
            return new Error("Item id required")
         })
      })
      try {

         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'master_items');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found.' : !record_exist ? "Record already deleted." : ""));
            }
         }

      } catch (error) {
         console.log(error);
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }
   },
   item_master_update: async (req, res, next) => {
      const schema = Joi.object().keys({
         item_id: Joi.string().required().error(() => {
            return new Error("Item id required")
         }),
         item_rate: Joi.string().required().error(() => {
            return new Error("Item rate required")
         }),
         item_name: Joi.string().required().error(() => {
            return new Error("Item name required")
         }),
         item_description: Joi.string().allow('')

      })

      try {

         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'master_items');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!customer_exist ? 'Record not found.' : !record_exist ? "Record already deleted." : ""));
            }
         }

      } catch (error) {
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }


   },
   item_master_activate: async (req, res, next) => {
      const schema = Joi.object().keys({
         item_id: Joi.string().required().error(() => {
            return new Error("Item id required")
         })
      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 1 }, 'master_items');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!record_exist ? "Record not exits or already activated." : ""));
            }
         }
      } catch (error) {
         console.log(error);
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }
   },
   item_master_deactivated: async (req, res, next) => {
      const schema = Joi.object().keys({
         item_id: Joi.string().required().error(() => {
            return new Error("Item id required")
         })
      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id, 'status': 0 }, 'master_items');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!record_exist ? "Record not exits or already deactivated." : ""));
            }
         }
      } catch (error) {
         console.log(error);
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }
   },
   item_master_delete: async (req, res, next) => {
      const schema = Joi.object().keys({
         item_id: Joi.string().required().error(() => {
            return new Error("Item id required")
         })
      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_id = enc_dec.cjs_decrypt(req.bodyString('item_id'));
            let record_exist = await checkifrecordexist({ 'id': record_id, 'is_deleted': 0 }, 'master_items');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(!record_exist ? "Record not exits or already deleted." : ""));
            }
         }
      } catch (error) {
         console.log(error);
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }
   },
   inv_send: async (req, res, next) => {
     
      console.log(`after validation rules`);
      const schema = Joi.object().keys({
         invoice_id: Joi.string().required().error(() => {
            return new Error("Invoice  id Required")
         }),
         email_to: Joi.string().email().required().error(() => {
            return new Error("Email to Required")
         }),
         cc_email:Joi.string().email({multiple:true}),
         subject: Joi.string().required().error(() => {
            return new Error("Subject Required")
         }),


      })
      try {
         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {
            let record_exist = await checkifrecordexist({ 'id': enc_dec.cjs_decrypt(req.bodyString('invoice_id')) }, 'inv_invoice_master');
            if (record_exist) {
               next();
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not found.'));
            }
         }
      } catch (error) {
         
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }

   },
   invoiceStatus: async (req, res, next) => {
      const schema = Joi.object().keys({
         invoice_id: Joi.string().min(10).required().error(() => {
            return new Error("Invoice id required")
         }),
      })

      try {

         const result = schema.validate(req.body);
         if (result.error) {
            res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(result.error.message));
         } else {

            let invoice_id = enc_dec.cjs_decrypt(req.bodyString('invoice_id'));
            var invoice_data = await invModel.FetchExpiryAndStatus(invoice_id, 'inv_invoice_master');
            if (invoice_data) {
               if (invoice_data.status == 'Issued') {
                  var now = moment();
                  var date = moment(invoice_data.expiry_date);
                  let dif = date.diff(now, 'day');
                  let is_today = date.isSame(moment(), 'day');
                  if (dif >= 0 || is_today) {
                     res.status(StatusCode.ok).send(ServerResponse.successmsg(""));
                  } else {
                     res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('This invoice No. ' + invoice_data.invoice_no + ' is expired'));
                  }
               } else {
                  res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('This invoice No. ' + invoice_data.invoice_no + ' is ' + invoice_data.status));
               }
            } else {
               res.status(StatusCode.badRequest).send(ServerResponse.validationResponse('Record not exits'));
            }

         }
      } catch (error) {
         console.log(error);
         res.status(StatusCode.badRequest).send(ServerResponse.validationResponse(error));
      }
   }

}
module.exports = validation