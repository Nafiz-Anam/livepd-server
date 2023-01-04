const express = require("express");
const app = express();
/*Validator Imported*/
const Validator = require("../../../utilities/validations/index");
/*Controller*/
const countries = require("../../../controller/country");
const merchants = require("../../../controller/merchantController");

/*O Auth2 Manager*/
const CheckHeader = require("../../../utilities/tokenmanager/headers");
const CheckToken = require("../../../utilities/tokenmanager/checkToken");
const MerchantUserValidator = require("../../../utilities/validations/merchantUserValidator");

app.post("/country/list", CheckHeader, countries.list);
app.post("/country/add", CheckHeader, Validator.country_add, countries.add);
app.post(
    "/country/details",
    CheckHeader,
    Validator.country_details,
    countries.details
);
app.post(
    "/country/update",
    CheckHeader,
    Validator.country_update,
    countries.update
);
app.post(
    "/country/deactivate",
    CheckHeader,
    Validator.country_deactivate,
    countries.country_deactivate
);
app.post(
    "/country/activate",
    CheckHeader,
    Validator.country_activate,
    countries.country_activate
);
app.post(
    "/country/delete",
    CheckHeader,
    Validator.country_delete,
    countries.country_delete
);
// app.post('/country/add', CheckHeader, CheckToken, Validator.country_add, countries.add);
// app.post('/country/list', CheckHeader, countries.list);
// app.post('/country/details', CheckHeader, CheckToken, Validator.country_details, countries.details);
// app.post('/country/update', CheckHeader, CheckToken, Validator.country_update, countries.update);
// app.post('/country/deactivate', CheckHeader, CheckToken, Validator.country_deactivate, countries.country_deactivate);
// app.post('/country/activate', CheckHeader, CheckToken, Validator.country_activate, countries.country_activate);
// app.post('/country/delete', CheckHeader, CheckToken, Validator.country_delete, countries.country_delete);

// merchants routes
app.post("/merchant/list", CheckHeader, merchants.list);
app.post(
    "/merchant/user/add",
    CheckHeader,
    MerchantUserValidator.user_add,
    merchants.add
);
app.post(
    "/merchant/user/details",
    CheckHeader,
    MerchantUserValidator.user_details,
    merchants.details
);
app.post(
    "/merchant/user/update",
    CheckHeader,
    MerchantUserValidator.user_update,
    merchants.update
);
app.post(
    "/merchant/user/deactivate",
    CheckHeader,
    MerchantUserValidator.user_deactivate,
    merchants.user_deactivate
);
app.post(
    "/merchant/user/activate",
    CheckHeader,
    MerchantUserValidator.user_activate,
    merchants.user_activate
);

app.post(
    "/merchant/user/delete",
    CheckHeader,
    MerchantUserValidator.user_delete,
    merchants.user_delete
);

module.exports = app;
