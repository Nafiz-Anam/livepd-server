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

const Validator = {
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
                    .min(2)
                    .max(100)
                    .required()
                    .error(() => {
                        return new Error("Valid name required");
                    }),
                email: Joi.string()
                    .min(5)
                    .max(100)
                    .email()
                    .required()
                    .error(() => {
                        return new Error("Valid email required");
                    }),
                country_code: Joi.string()
                    .min(1)
                    .max(3)
                    .required()
                    .error(() => {
                        return new Error("Valid country code required");
                    }),
                mobile_no: Joi.string()
                    .min(9)
                    .max(12)
                    .required()
                    .error(() => {
                        return new Error("Valid mobile no required");
                    }),
                company_name: Joi.string()
                    .min(1)
                    .max(200)
                    .required()
                    .error(() => {
                        return new Error("Valid company name no required");
                    }),
                type_of_business: Joi.string()
                    .min(9)
                    .max(200)
                    .required()
                    .error(() => {
                        return new Error("Valid type of business required");
                    }),
                address: Joi.string()
                    .min(2)
                    .max(200)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error(
                            "Valid address required (max. characters 200)"
                        );
                    }),
                country_id: Joi.string()
                    .min(2)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error("Valid country required");
                    }),
                state: Joi.string()
                    .min(2)
                    .max(100)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error("Valid state required");
                    }),
                city: Joi.string()
                    .min(2)
                    .max(100)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error("Valid city required");
                    }),
                zip_code: Joi.string()
                    .min(4)
                    .max(6)
                    .optional()
                    .allow("")
                    .error(() => {
                        return new Error(
                            "Valid zipcode required (max. length 6)"
                        );
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
                        { mobile: req.bodyString("mobile_no"), deleted: 0 },
                        "master_partners"
                    );
                    let email_exist = await checkifrecordexist(
                        { email: req.bodyString("email"), deleted: 0 },
                        "master_partners"
                    );
                    let username = await encrypt_decrypt(
                        "encrypt",
                        req.bodyString("username")
                    );
                    let username_exist = await checkifrecordexist(
                        { username: username, deleted: 0 },
                        "master_partners"
                    );

                    if (req.bodyString("country_id")) {
                        country_id = enc_dec.cjs_decrypt(
                            req.bodyString("country_id")
                        );
                        let country_exist = await checkifrecordexist(
                            { id: country_id, deleted: 0 },
                            "country"
                        );
                        if (!country_exist) {
                            error = "Country not found.";
                        }
                    }

                    if (
                        !email_exist &&
                        !mobile_exist &&
                        !username_exist &&
                        error === ""
                    ) {
                        next();
                    } else {
                        res.status(StatusCode.badRequest).send(
                            ServerResponse.validationResponse(
                                email_exist
                                    ? "Email already exist."
                                    : mobile_exist
                                    ? "Mobile already exist."
                                    : username_exist
                                    ? "Username already exist."
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
                    .required()
                    .error(() => {
                        return new Error("User ID not found");
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
module.exports = Validator;
