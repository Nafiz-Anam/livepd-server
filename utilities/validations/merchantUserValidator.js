const Joi = require("joi").extend(require("@joi/date"));
const ServerResponse = require("../response/ServerResponse");
const StatusCode = require("../statuscode/index");
const checkEmpty = require("./emptyChecker");
const validate_mobile = require("./validate_mobile");
const checkwithcolumn = require("./checkerwithcolumn");
const checkifrecordexist = require("./checkifrecordexist");
const enc_dec = require("../decryptor/decryptor");
const multer = require("multer");
const helpers = require("../helper/general_helper");
const fs = require("fs");
const encrypt_decrypt = require("../../utilities/decryptor/encrypt_decrypt");
const { join } = require("path");
const checkifrecordexistanddata = require("../../utilities/validations/checkifrecordexistanddata");

const MerchantUserValidator = {
    user_add: async (req, res, next) => {
        if (
            checkEmpty(req.body, [
                "name",
                "email",
                "address_line_1",
                "address_line_2",
                "address_line_3",
                "country",
                "state",
                "city",
                "zip_code",
                "mobile_code",
                "mobile_no",
                "alt_mobile_code",
                "alt_mobile_no",
                "roles",
                "allow_stores",
            ])
        ) {
            const schema = Joi.object().keys({
                name: Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .pattern(new RegExp(/[A-Za-z\s]+$/))
                    .error(() => {
                        return new Error("Valid name required");
                    }),
                email: Joi.string()
                    .email()
                    .required()
                    .error(() => {
                        return new Error("Valid email required");
                    }),
                address_line_1: Joi.string()
                    .max(100)
                    .required()
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 1 required (max. characters 100)"
                        );
                    }),
                address_line_2: Joi.string()
                    .max(100)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 2 required (max. characters 100)"
                        );
                    }),
                address_line_3: Joi.string()
                    .max(100)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 3 required (max. characters 100)"
                        );
                    }),
                country: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid state required");
                    }),
                state: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid state required");
                    }),
                city: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid city required");
                    }),
                zip_code: Joi.number()
                    .min(1)
                    // .max(6)
                    .required()
                    .error(() => {
                        return new Error(
                            "Valid zipcode required (max. length 6)"
                        );
                    }),
                mobile_code: Joi.string()
                    .min(1)
                    .max(3)
                    .required()
                    .error(() => {
                        return new Error("Valid mobile code required");
                    }),
                mobile_no: Joi.string()
                    .min(9)
                    .max(12)
                    .required()
                    .pattern(new RegExp(/^[0-9]+$/))
                    .error(() => {
                        return new Error("Valid mobile no required");
                    }),
                alt_mobile_code: Joi.string()
                    .min(1)
                    .max(3)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error(
                            "Valid alternate mobile code required"
                        );
                    }),
                alt_mobile_no: Joi.string()
                    .min(9)
                    .max(12)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[0-9]+$/))
                    .error(() => {
                        return new Error("Valid alternate mobile no required");
                    }),
                roles: Joi.string()
                    .min(3)
                    .max(250)
                    .required()
                    .error(() => {
                        return new Error("Valid role required");
                    }),
                allow_stores: Joi.string()
                    .min(3)
                    .max(50)
                    .required()
                    .pattern(new RegExp(/^[-,0-9]+$/))
                    .error(() => {
                        return new Error("Only comma separated digits allowed");
                    }),
            });

            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    var error = "";
                    let mobile_exist = await checkifrecordexist(
                        { mobile_no: req.bodyString("mobile_no"), deleted: 0 },
                        "master_super_merchant"
                    );
                    let email_exist = await checkifrecordexist(
                        { email: req.bodyString("email"), deleted: 0 },
                        "master_super_merchant"
                    );

                    if (!email_exist && !mobile_exist && error === "") {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                email_exist
                                    ? "Email already exist."
                                    : mobile_exist
                                    ? "Mobile already exist."
                                    : error
                                    ? error
                                    : "Error in data"
                            )
                        );
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },

    user_update: async (req, res, next) => {
        if (
            checkEmpty(req.body, [
                "user_id",
                "name",
                "email",
                "address_line_1",
                "address_line_2",
                "address_line_3",
                "country",
                "state",
                "city",
                "zip_code",
                "mobile_code",
                "mobile_no",
                "alt_mobile_code",
                "alt_mobile_no",
                "roles",
                "allow_stores",
            ])
        ) {
            const schema = Joi.object().keys({
                user_id: Joi.string()
                    .min(10)
                    .required()
                    .error(() => {
                        return new Error("Valid user ID required");
                    }),
                name: Joi.string()
                    .min(3)
                    .max(30)
                    .required()
                    .pattern(new RegExp(/[A-Za-z\s]+$/))
                    .error(() => {
                        return new Error("Valid name required");
                    }),
                email: Joi.string()
                    .email()
                    .required()
                    .error(() => {
                        return new Error("Valid email required");
                    }),
                address_line_1: Joi.string()
                    .max(100)
                    .required()
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 1 required (max. characters 100)"
                        );
                    }),
                address_line_2: Joi.string()
                    .max(100)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 2 required (max. characters 100)"
                        );
                    }),
                address_line_3: Joi.string()
                    .max(100)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[A-Za-z0-9\s]+$/))
                    .error(() => {
                        return new Error(
                            "Valid address line 3 required (max. characters 100)"
                        );
                    }),
                country: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid state required");
                    }),
                state: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid state required");
                    }),
                city: Joi.number()
                    .min(1)
                    // .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid city required");
                    }),
                zip_code: Joi.number()
                    .min(1)
                    // .max(6)
                    .required()
                    .error(() => {
                        return new Error(
                            "Valid zipcode required (max. length 6)"
                        );
                    }),
                mobile_code: Joi.string()
                    .min(1)
                    .max(3)
                    .required()
                    .error(() => {
                        return new Error("Valid mobile code required");
                    }),
                mobile_no: Joi.string()
                    .min(9)
                    .max(12)
                    .required()
                    .pattern(new RegExp(/^[0-9]+$/))
                    .error(() => {
                        return new Error("Valid mobile no required");
                    }),
                alt_mobile_code: Joi.string()
                    .min(1)
                    .max(3)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error(
                            "Valid alternate mobile code required"
                        );
                    }),
                alt_mobile_no: Joi.string()
                    .min(9)
                    .max(12)
                    .optional()
                    .allow("")
                    .pattern(new RegExp(/^[0-9]+$/))
                    .error(() => {
                        return new Error("Valid alternate mobile no required");
                    }),
                roles: Joi.string()
                    .min(3)
                    .max(250)
                    .required()
                    .error(() => {
                        return new Error("Valid role required");
                    }),
                allow_stores: Joi.string()
                    .min(3)
                    .max(50)
                    .required()
                    .pattern(new RegExp(/^[-,0-9]+$/))
                    .error(() => {
                        return new Error("Only comma separated digits allowed");
                    }),
            });

            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    var error = "";
                    record_id = enc_dec.cjs_decrypt(req.bodyString("user_id"));

                    let user_exist = await checkifrecordexist(
                        { id: record_id, status: 0, deleted: 0 },
                        "master_super_merchant"
                    );

                    if (user_exist && error === "") {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                !user_exist
                                    ? "User not found"
                                    : error
                                    ? error
                                    : "Error in data"
                            )
                        );
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },

    user_deactivate: async (req, res, next) => {
        if (checkEmpty(req.body, ["user_id"])) {
            const schema = Joi.object().keys({
                user_id: Joi.string()
                    .min(10)
                    .required()
                    .error(() => {
                        return new Error("Valid user ID required");
                    }),
            });
            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    record_id = enc_dec.cjs_decrypt(req.bodyString("user_id"));
                    let record_exist = await checkifrecordexist(
                        { id: record_id, status: 0, deleted: 0 },
                        "master_super_merchant"
                    );
                    if (record_exist) {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                "Record not found or already deactivated."
                            )
                        );
                    }
                }
            } catch (error) {
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },

    user_activate: async (req, res, next) => {
        if (checkEmpty(req.body, ["user_id"])) {
            const schema = Joi.object().keys({
                user_id: Joi.string()
                    .min(10)
                    .required()
                    .error(() => {
                        return new Error("Valid user ID required");
                    }),
            });
            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    record_id = enc_dec.cjs_decrypt(req.bodyString("user_id"));
                    let record_exist = await checkifrecordexist(
                        { id: record_id, status: 1, deleted: 0 },
                        "master_super_merchant"
                    );
                    if (record_exist) {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                "Record not found or already activated."
                            )
                        );
                    }
                }
            } catch (error) {
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },

    user_delete: async (req, res, next) => {
        if (checkEmpty(req.body, ["user_id"])) {
            const schema = Joi.object().keys({
                user_id: Joi.string()
                    .min(10)
                    .required()
                    .error(() => {
                        return new Error("Valid user ID required");
                    }),
            });
            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    record_id = enc_dec.cjs_decrypt(req.bodyString("user_id"));
                    let record_exist = await checkifrecordexist(
                        { id: record_id, deleted: 0 },
                        "master_super_merchant"
                    );
                    if (record_exist) {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                "Record not found or already deleted."
                            )
                        );
                    }
                }
            } catch (error) {
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },

    user_details: async (req, res, next) => {
        if (checkEmpty(req.body, ["user_id"])) {
            const schema = Joi.object().keys({
                user_id: Joi.string()
                    .min(10)
                    .required()
                    .error(() => {
                        return new Error("Valid user ID required");
                        // return new Error("User ID not found");
                    }),
            });
            try {
                const result = schema.validate(req.body);
                if (result.error) {
                    res.status(StatusCode.badRequest).send(
                        ServerResponse.validationResponse(result.error.message)
                    );
                } else {
                    let user_id = enc_dec.cjs_decrypt(
                        req.bodyString("user_id")
                    );
                    let user_exist = await checkifrecordexist(
                        { id: user_id, deleted: 0 },
                        "master_super_merchant"
                    );
                    if (user_exist) {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse()
                        );
                    }
                }
            } catch (error) {
                res.status(StatusCode.badRequest).send(
                    ServerResponse.validationResponse(error)
                );
            }
        } else {
            res.status(StatusCode.badRequest).send(ServerResponse.badRequest);
        }
    },
};
module.exports = MerchantUserValidator;
