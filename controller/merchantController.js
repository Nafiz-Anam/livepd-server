const MerchantModel = require("../models/merchantModel");
const statusCode = require("../utilities/statuscode/index");
const response = require("../utilities/response/ServerResponse");
const helpers = require("../utilities/helper/general_helper");
const enc_dec = require("../utilities/decryptor/decryptor");
// const admin_activity_logger = require("../utilities/activity-logger/admin_activity_logger");

var merchant = {
    add: async (req, res) => {
        let added_date = new Date().toJSON().substring(0, 19).replace("T", " ");
        let name = req.bodyString("name");
        let email = req.bodyString("email");
        let address_line_1 = req.bodyString("address_line_1");
        let address_line_2 = req.bodyString("address_line_2");
        let address_line_3 = req.bodyString("address_line_3");
        let country = req.bodyString("country");
        let state = req.bodyString("state");
        let city = req.bodyString("city");
        let zip_code = req.bodyString("zip_code");
        let mobile_code = req.bodyString("mobile_code");
        let mobile_no = req.bodyString("mobile_no");
        let alt_mobile_code = req.bodyString("alt_mobile_code");
        let alt_mobile_no = req.bodyString("alt_mobile_no");
        let roles = req.bodyString("roles");
        let allow_stores = req.bodyString("allow_stores");

        let new_data = {
            name: name,
            email: email,
            address_line_1: address_line_1,
            address_line_2: address_line_2,
            address_line_3: address_line_3,
            country: country,
            state: state,
            city: city,
            zip_code: zip_code,
            code: mobile_code,
            mobile_no: mobile_no,
            alt_mobile_code: alt_mobile_code,
            alt_mobile_no: alt_mobile_no,
            roles: roles,
            allow_stores: allow_stores,
            // updated_at: added_date,
            ip: await helpers.get_ip(req),
        };

        MerchantModel.add(new_data)
            .then((result) => {
                res.status(statusCode.ok).send(
                    response.successmsg("Merchant added successfully.")
                );
                // let module_and_user = {
                //     user: req.user.id,
                //     admin_type: req.user.type,
                //     module: "Locations",
                //     sub_module: "Country",
                // };
                // let added_name = req.bodyString("name");
                // let headers = req.headers;
                // admin_activity_logger
                //     .add(module_and_user, added_name, headers)
                //     .then((result) => {
                //         res.status(statusCode.ok).send(
                //             response.successmsg("Merchant added successfully.")
                //         );
                //     })
                //     .catch((error) => {
                //         res.status(statusCode.internalError).send(
                //             response.errormsg(error.message)
                //         );
                //     });
            })
            .catch((error) => {
                res.status(statusCode.internalError).send(
                    response.errormsg(error.message)
                );
            });
    },

    list: async (req, res) => {
        let limit = {
            perpage: 0,
            page: 0,
        };
        if (req.bodyString("perpage") && req.bodyString("page")) {
            perpage = parseInt(req.bodyString("perpage"));
            start = parseInt(req.bodyString("page"));
            limit.perpage = perpage;
            limit.start = (start - 1) * perpage;
        }

        const country = req.bodyString("country_name");
        const filter = { country_name: "" };
        if (req.bodyString("country_name")) {
            filter.country_name = country;
        }

        let filter_arr = { deleted: 0 };

        if (req.bodyString("status") == "Active") {
            filter_arr.status = 0;
        }
        if (req.bodyString("status") == "Deactivated") {
            filter_arr.status = 1;
        }

        MerchantModel.select(filter_arr, filter, limit)
            .then(async (result) => {
                let send_res = [];
                result.forEach(function (val, key) {
                    console.log(val);
                    let res = {
                        user_id: enc_dec.cjs_encrypt(val.id),
                        name: val.name,
                        email: val.email,
                        address_line_1: val.address_line_1,
                        address_line_2: val.address_line_2,
                        address_line_3: val.address_line_3,
                        country: val.country,
                        state: val.state,
                        city: val.city,
                        zip_code: val.zip_code,
                        code: val.mobile_code,
                        mobile_no: val.mobile_no,
                        alt_mobile_code: val.alt_mobile_code,
                        alt_mobile_no: val.alt_mobile_no,
                        roles: val.roles,
                        allow_stores: val.allow_stores,
                        status: val.status == 1 ? "Deactivated" : "Active",
                    };
                    send_res.push(res);
                });
                total_count = await MerchantModel.get_count(filter);
                res.status(statusCode.ok).send(
                    response.successdatamsg(
                        send_res,
                        "List fetched successfully.",
                        total_count
                    )
                );
            })
            .catch((error) => {
                res.status(statusCode.internalError).send(
                    response.errormsg(error.message)
                );
            });
    },

    details: async (req, res) => {
        // let user_id = req.bodyString("user_id");
        let user_id = await enc_dec.cjs_decrypt(req.bodyString("user_id"));
        // console.log(user_id);

        MerchantModel.selectOne("*", { id: user_id, deleted: 0 })
            .then((result) => {
                let send_res = [];
                let val = result;
                // console.log("val", val);
                let data = {
                    user_id: enc_dec.cjs_encrypt(val.id),
                    name: val.name,
                    email: val.email,
                    address_line_1: val.address_line_1,
                    address_line_2: val.address_line_2,
                    address_line_3: val.address_line_3,
                    country: val.country,
                    state: val.state,
                    city: val.city,
                    zip_code: val.zip_code,
                    code: val.mobile_code,
                    mobile_no: val.mobile_no,
                    alt_mobile_code: val.alt_mobile_code,
                    alt_mobile_no: val.alt_mobile_no,
                    roles: val.roles,
                    allow_stores: val.allow_stores,
                    status: val.status == 1 ? "Deactivated" : "Active",
                };
                send_res = data;

                res.status(statusCode.ok).send(
                    response.successdatamsg(
                        send_res,
                        "Details fetched successfully."
                    )
                );
            })
            .catch((error) => {
                res.status(statusCode.internalError).send(
                    response.errormsg(error.message)
                );
            });
    },

    update: async (req, res) => {
        try {
            // let user_id = req.bodyString("user_id");
            let user_id = await enc_dec.cjs_decrypt(req.bodyString("user_id"));
            let name = req.bodyString("name");
            let email = req.bodyString("email");
            let address_line_1 = req.bodyString("address_line_1");
            let address_line_2 = req.bodyString("address_line_2");
            let address_line_3 = req.bodyString("address_line_3");
            let country = req.bodyString("country");
            let state = req.bodyString("state");
            let city = req.bodyString("city");
            let zip_code = req.bodyString("zip_code");
            let mobile_code = req.bodyString("mobile_code");
            let mobile_no = req.bodyString("mobile_no");
            let alt_mobile_code = req.bodyString("alt_mobile_code");
            let alt_mobile_no = req.bodyString("alt_mobile_no");
            let roles = req.bodyString("roles");
            let allow_stores = req.bodyString("allow_stores");

            var insdata = {
                name: name,
                email: email,
                address_line_1: address_line_1,
                address_line_2: address_line_2,
                address_line_3: address_line_3,
                country: country,
                state: state,
                city: city,
                zip_code: zip_code,
                code: mobile_code,
                mobile_no: mobile_no,
                alt_mobile_code: alt_mobile_code,
                alt_mobile_no: alt_mobile_no,
                roles: roles,
                allow_stores: allow_stores,
            };

            $ins_id = await MerchantModel.updateDetails(
                { id: user_id },
                insdata
            );
            res.status(statusCode.ok).send(
                response.successmsg("User updated successfully")
            );

            // let module_and_user = {
            //     user: req.user.id,
            //     admin_type: req.user.type,
            //     module: "Locations",
            //     sub_module: "Country",
            // };
            // let headers = req.headers;
            // admin_activity_logger
            //     .edit(module_and_user, country_id, headers)
            //     .then((result) => {
            //         res.status(statusCode.ok).send(
            //             response.successmsg("Country updated successfully")
            //         );
            //     })
            //     .catch((error) => {
            //         res.status(statusCode.internalError).send(
            //             response.errormsg(error.message)
            //         );
            //     });
        } catch (error) {
            console.log(error);
            res.status(statusCode.internalError).send(
                response.errormsg(error.message)
            );
        }
    },

    user_deactivate: async (req, res) => {
        try {
            // let user_id = req.bodyString("user_id");
            let user_id = await enc_dec.cjs_decrypt(req.bodyString("user_id"));
            var insdata = {
                status: 1,
            };

            $ins_id = await MerchantModel.updateDetails(
                { id: user_id },
                insdata
            );
            res.status(statusCode.ok).send(
                response.successmsg("User deactivated successfully")
            );
            // let module_and_user = {
            //     user: req.user.id,
            //     admin_type: req.user.type,
            //     module: "Locations",
            //     sub_module: "Country",
            // };
            // let headers = req.headers;
            // admin_activity_logger
            //     .deactivate(module_and_user, country_id, headers)
            //     .then((result) => {
            //         res.status(statusCode.ok).send(
            //             response.successmsg("Country deactivated successfully")
            //         );
            //     })
            //     .catch((error) => {
            //         res.status(statusCode.internalError).send(
            //             response.errormsg(error.message)
            //         );
            //     });
        } catch {
            res.status(statusCode.internalError).send(
                response.errormsg(error.message)
            );
        }
    },

    user_activate: async (req, res) => {
        try {
            // let user_id = req.bodyString("user_id");
            let user_id = await enc_dec.cjs_decrypt(req.bodyString("user_id"));
            var insdata = {
                status: 0,
            };

            $ins_id = await MerchantModel.updateDetails(
                { id: user_id },
                insdata
            );
            res.status(statusCode.ok).send(
                response.successmsg("User activated successfully")
            );
            // let module_and_user = {
            //     user: req.user.id,
            //     admin_type: req.user.type,
            //     module: "Locations",
            //     sub_module: "Country",
            // };
            // let headers = req.headers;
            // admin_activity_logger
            //     .activate(module_and_user, country_id, headers)
            //     .then((result) => {
            //         res.status(statusCode.ok).send(
            //             response.successmsg("Country activated successfully")
            //         );
            //     })
            //     .catch((error) => {
            //         res.status(statusCode.internalError).send(
            //             response.errormsg(error.message)
            //         );
            //     });
        } catch {
            res.status(statusCode.internalError).send(
                response.errormsg(error.message)
            );
        }
    },

    user_delete: async (req, res) => {
        try {
            // let user_id = req.bodyString("user_id");
            let user_id = await enc_dec.cjs_decrypt(req.bodyString("user_id"));
            var insdata = {
                deleted: 1,
            };

            $ins_id = await MerchantModel.updateDetails(
                { id: user_id },
                insdata
            );
            res.status(statusCode.ok).send(
                response.successmsg("User deleted successfully")
            );
            // let module_and_user = {
            //     user: req.user.id,
            //     admin_type: req.user.type,
            //     module: "Locations",
            //     sub_module: "Country",
            // };
            // let headers = req.headers;
            // admin_activity_logger
            //     .delete(module_and_user, country_id, headers)
            //     .then((result) => {
            //         res.status(statusCode.ok).send(
            //             response.successmsg("Country deleted successfully")
            //         );
            //     })
            //     .catch((error) => {
            //         res.status(statusCode.internalError).send(
            //             response.errormsg(error.message)
            //         );
            //     });
        } catch {
            res.status(statusCode.internalError).send(
                response.errormsg(error.message)
            );
        }
    },
};
module.exports = merchant;
