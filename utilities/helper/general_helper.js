const path = require('path')
require('dotenv').config({ path: "../.env" });
const env = process.env.ENVIRONMENT
const config = require('../../config/config.json')[env];
const pool = require('../../config/database');
const enc_dec = require("../decryptor/decryptor")
const encrypt_decrypt = require('../decryptor/encrypt_decrypt');
const server_addr = process.env.SERVER_LOAD
const port = process.env.SERVER_PORT
const fs = require('fs')
const axios = require('axios')
function randomString(length, capslock = 0) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    if (capslock == 1) {
        return result.toUpperCase();
    } else {
        return result;
    }

}
function pad2(n) {
    return (n < 10 ? '0' : '') + n;
}

var helpers = {
    make_random_key: async (pre) => {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        let str = pre + '_';
        str += randomString(4) + year + randomString(4) + month + randomString(4) + day + randomString(4);
        return str
    },
    make_order_number: async (pre) => {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        let str = pre;
        str += randomString(2, 1) + month + randomString(3, 1) + day + randomString(2, 1);
        return str
    },
    make_reference_number: async (pre, length) => {
        let str = pre;
        str += randomString(length, 1);
        return str
    },
    get_ip: async (req) => {
        return req.socket.remoteAddress
    },
    generateOtp: async (size) => {
        const zeros = '0'.repeat(size - 1);
        const x = parseFloat('1' + zeros);
        const y = parseFloat('9' + zeros);
        const confirmationCode = String(Math.floor(x + Math.random() * y));
        return confirmationCode;
    },
    get_merchant_api_key: async (mer_id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('api_key').where({ 'merchant_id': mer_id, 'deactivated': 0 })
            .get(config.table_prefix + 'merchant_api_key');
        qb.release();

        if (response[0]) {
            return response[0].api_key;
        } else {
            return '';
        }
    },
    get_question_by_id: async (question_id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('question').where({ 'id': question_id })
            .get(config.table_prefix + 'master_security_questions');
        qb.release();

        if (response[0]) {
            return response[0].question;
        } else {
            return '';
        }
    },
    get_country_name_by_iso: async (iso) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('country_name').where({ 'iso3': iso })
            .get(config.table_prefix + 'country');
        qb.release();

        if (response[0]) {
            return response[0].country_name;
        } else {
            return '';
        }
    },
    add_days_date: async (days) => {
        let day = parseInt(days);
        var result = new Date();
        result.setDate(result.getDate() + day);
        return new Date(result).toJSON().substring(0, 19).replace('T', ' ');
    },
    date_format: async (date) => {
        var date_format = new Date(date);
        formatted_date = pad2(date_format.getDate()) + '-' + pad2(parseInt(date_format.getMonth()) + 1) + '-' + date_format.getFullYear();
        return formatted_date;
    },
    get_country_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('country_name').where({ 'id': id })
            .get(config.table_prefix + 'country');
        qb.release();

        if (response[0]) {
            return response[0].country_name;
        } else {
            return '';
        }
    },
    get_state_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('state_name').where({ 'id': id })
            .get(config.table_prefix + 'states');
        qb.release();

        if (response[0]) {
            return response[0].state_name;
        } else {
            return '';
        }
    },

    get_city_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('city_name').where({ 'id': id })
            .get(config.table_prefix + 'city');
        qb.release();

        if (response[0]) {
            return response[0].city_name;
        } else {
            return '';
        }
    },
    get_currency_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('code').where({ 'id': id })
            .get(config.table_prefix + 'master_currency');
        qb.release();

        if (response[0]) {
            return response[0].code;
        } else {
            return '';
        }
    },
    get_currency_details: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('*').where(condition)
            .get(config.table_prefix + 'master_currency');
        qb.release();

        if (response[0]) {
            return response[0];
        } else {
            return '';
        }
    },
    get_country_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'country_name': name })
            .get(config.table_prefix + 'country');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_state_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'state_name': name })
            .get(config.table_prefix + 'states');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_city_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'city_name': name })
            .get(config.table_prefix + 'city');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_designation_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'designation': name, deleted: 0 })
            .get(config.table_prefix + 'master_designation');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_department_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'department': name, deleted: 0 })
            .get(config.table_prefix + 'master_department');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_business_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'type_of_business': name })
            .get(config.table_prefix + 'master_type_of_business');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },
    get_status: async (name) => {
        if (name === 'Deactivated') {
            return 1;
        } if (name === 'Active') {
            return 0;
        }
    },
    get_conditional_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " = " + obj[key] + " ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },
    get_join_conditional_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " = " + obj[key] + " ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },
    get_and_conditional_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " = '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },
    get_or_conditional_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "or " + key + " = '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },

    get_date_between_condition: async (from_date, to_date, db_date_field) => {
        return ("DATE(" + db_date_field + ") BETWEEN '" + from_date + "' AND '" + to_date + "'");
    },
    get_greater_than_equal_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " >= '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },
    get_less_than_equal_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " <= '" + obj[key] + "' ";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");

        return output_string1
    },
    get_conditional_like_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "and " + key + " LIKE '%" + obj[key] + "%'";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(0).join(" ");
        return output_string1
    },
    get_conditional_or_like_string: async (obj) => {
        var output_string = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                output_string += "or " + key + " LIKE '%" + obj[key] + "%'";
            }
        }

        let words = output_string.split(" ");
        let output_string1 = words.slice(1).join(" ");
        return output_string1
    },
    get_language_json: async (condition) => {

        let qb = await pool.get_connection();
        let response = await qb
            .select('file,direction,flag,name').where(condition)
            .get(config.table_prefix + 'master_language');
        qb.release();
        const data = fs.readFileSync(path.resolve('public/language/' + response[0].file));
        return { data: JSON.parse(data), name: response[0].name, direction: response[0].direction, flag: server_addr + ':' + port + "/static/language/" + response[0].flag }
    },
    get_first_active_language_json: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('file,direction,flag,name').where(condition).limit(1)
            .get(config.table_prefix + 'master_language');
        qb.release();
        const data = fs.readFileSync(path.resolve('public/language/' + response[0].file));
        return { data: JSON.parse(data), name: response[0].name, direction: response[0].direction, flag: server_addr + ':' + port + "/static/language/" + response[0].flag }
    },
    get_designation_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('designation').where({ 'id': id })
            .get(config.table_prefix + 'master_designation');
        qb.release();

        if (response[0]) {
            return response[0].designation;
        } else {
            return '';
        }
    },
    get_department_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('department').where({ 'id': id })
            .get(config.table_prefix + 'master_department');
        qb.release();

        if (response[0]) {
            return response[0].department;
        } else {
            return '';
        }
    },
    company_details: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('*')
            .where(condition)
            .get(config.table_prefix + 'company_master');
        qb.release();

        if (response[0]) {
            return response[0];
        } else {
            return '';
        }
    },
    updateDetails: async (condition, data, dbtable) => {
        let qb = await pool.get_connection();
        let response = await qb
            .set(data)
            .where(condition)
            .update(config.table_prefix + dbtable);
        qb.release();
        return response;
    },
    get_type_of_business: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('type_of_business').where({ 'id': id })
            .get(config.table_prefix + 'master_type_of_business');
        qb.release();

        if (response[0]) {
            return response[0].type_of_business;
        } else {
            return '';
        }
    },
    get_entity_type: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('entity').where({ 'id': id })
            .get(config.table_prefix + 'master_entity_type');
        qb.release();

        if (response[0]) {
            return response[0].entity;
        } else {
            return '';
        }
    },
    get_psp_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('name').where({ 'id': id })
            .get(config.table_prefix + 'psp');
        qb.release();

        if (response[0]) {
            return response[0].name;
        } else {
            return '';
        }
    },
    get_admin_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('name').where({ 'id': id })
            .get(config.table_prefix + 'adm_user');
        qb.release();

        if (response[0]) {
            return response[0].name;
        } else {
            return '';
        }
    },
    get_psp_details_by_id: async (selection, id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select(selection).where({ 'id': id })
            .get(config.table_prefix + 'psp');
        qb.release();

        if (response[0]) {
            return response[0];
        } else {
            return '';
        }
    },
    get_merchant_partner: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('partner_id').where({ 'id': id })
            .get(config.table_prefix + 'master_merchant');
        qb.release();

        if (response[0]) {
            return response[0].partner_id;
        } else {
            return '';
        }
    },
    get_merchant_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('mercahnt_name').where({ 'id': id })
            .get(config.table_prefix + 'master_merchant');
        qb.release();

        if (response[0]) {
            return response[0].mercahnt_name;
        } else {
            return '';
        }
    },

    get_sub_merchant_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('company_name').where({ 'id': id })
            .get(config.table_prefix + 'master_merchant_details');
        qb.release();

        if (response[0]) {
            return response[0].company_name;
        } else {
            return '';
        }
    },

    get_customer_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('prefix,name').where({ 'id': id })
            .get(config.table_prefix + 'inv_customer');
        qb.release();

        if (response[0]) {
            return response[0].prefix + ' ' + response[0].name;
        } else {
            return '';
        }
    },
    get_merchantdetails_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('company_name').where({ 'merchant_id': id })
            .get(config.table_prefix + 'master_merchant_details');
        qb.release();

        if (response[0]) {
            return response[0].company_name;
        } else {
            return '';
        }
    },
    get_title: async () => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('title')
            .get(config.table_prefix + 'title');
        qb.release();

        if (response[0]) {
            return response[0].title;
        } else {
            return '';
        }
    },
    get_partner_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('name').where({ 'id': id })
            .get(config.table_prefix + 'master_partners');
        qb.release();

        if (response[0]) {
            return response[0].name;
        } else {
            return '';
        }
    },

    insert_data: async (data, dbtable) => {
        let qb = await pool.get_connection();
        let response = await qb.returning('id').insert(config.table_prefix + dbtable, data);
        qb.release();
        return response;
    },

    get_data_list: async (selection, dbtable, condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select(selection).where(condition)
            .get(config.table_prefix + dbtable);
        qb.release();
        return response;
    },

    get_merchant_currency: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('currency').where({ 'id': id })
            .get(config.table_prefix + 'master_merchant');
        qb.release();

        if (response[0]) {
            return response[0].currency;
        } else {
            return '';
        }
    },
    get_token_check: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("*")
            .where(condition).order_by('id', "DESC").limit(1)
            .get(config.table_prefix + "password_token_check");
        qb.release();
        return response[0];
    },
    get_otp_check: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("*")
            .where(condition).order_by('id', "DESC").limit(1)
            .get(config.table_prefix + "email_otp_sent");
        qb.release();
        return response[0];
    },
    get_mobile_otp_check: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select("*")
            .where(condition).order_by('id', "DESC").limit(1)
            .get(config.table_prefix + "mobile_otp");
        qb.release();
        return response[0];
    },
    get_mcc_category_name_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('mcc_category').where({ 'id': id })
            .get(config.table_prefix + 'master_mcc_category');
        qb.release();

        if (response[0]) {
            return response[0].mcc_category;
        } else {
            return '';
        }
    },
    get_mcc_category_id_by_name: async (name) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'mcc_category': name })
            .get(config.table_prefix + 'master_mcc_category');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },


    get_mcc_code_description: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('description').where({ 'id': id })
            .get(config.table_prefix + 'mcc_codes');
        qb.release();
        if (response[0]) {
            return response[0].description;
        } else {
            return '';
        }
    },

    get_mcc_category_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('mcc_category').where({ 'id': id })
            .get(config.table_prefix + 'master_mcc_category');
        qb.release();
        if (response[0]) {
            return response[0].mcc_category;
        } else {
            return '';
        }
    },



    get_document_by_id: async (id) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id').where({ 'entity_id': id })
            .get(config.table_prefix + 'master_entity_document');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },

    get_multiple_ids_encrypt: (ids_cs) => {
        let ids_css = String(ids_cs)
        let code_array = ids_css.split(',');
        let new_codes_array = []
        for (i of code_array) {
            new_codes_array.push(encrypt_decrypt('encrypt', i))
        }
        return new_codes_array.join();
    },

    complete_kyc_step: async (merchant_id, step) => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('step_completed').where({ 'id': merchant_id })
            .get(config.table_prefix + 'master_merchant');

        let sequence;
        if (response[0].step_completed != '') {
            let sequence_arr = response[0].step_completed.split(",")

            if (sequence_arr.includes(step.toString())) {
                qb.release();
                return;
            } else {
                sequence_arr.push(step)
            }
            sequence_arr.sort();
            sequence = sequence_arr.join(",")

        } else {
            sequence = step
        }


        await qb
            .set({ step_completed: sequence })
            .where({ id: merchant_id })
            .update(config.table_prefix + 'master_merchant');
        qb.release();

        return;
    },

    doc_names: (seq) => {
        let req = {
            1: "Trade license",
            2: "ID proof",
            3: "ID proof auth sign",
            4: "MOA",
            5: "Proof of bank account",
        }
        return req[seq]
    },
    ekyc_steps: (seq) => {
        let req = {
            1: "Business Type",
            2: "Business details",
            3: "Business representative",
            4: "Business owners",
            5: "Business executives",
            6: "Public details",
            7: "Bank details",
        }
        return req[seq]
    },
    pushNotification: async (gcmid, title, message, url_, type, payload, user) => {
        let apiKey = "OTk2NjE4OWItOWJhOC00MTNhLWJlYTktMDczOWQyZTBjN2I0";
        let url = 'https://onesignal.com/api/v1/notifications';

        let content = { "en": message }
        let headings = { "en": title }

        let fields = JSON.stringify({
            "include_player_ids": [gcmid],
            "app_id": "4ca5a703-bb3d-4504-9a04-14df43d69cde",
            "body": message,
            "headings": headings,
            "contents": content,
            "title": title,
            "small_icon": "",
            "large_icon": "",
            "content_available": true,
            "data": {
                "title": title,
                "message": message,
                "type": type,
                "payload": payload
            }
        })

        function makeRequest(res_data, p_url, apiKey) {

            try {
                const config = {
                    method: 'post',
                    data: res_data,
                    url: p_url,
                    headers: {
                        'Authorization': 'Basic ' + apiKey,
                        'Content-Type': 'application/json'
                    }
                }

                let res = axios(config)
                console.log(res);
                return res.data
            } catch (error) {
                console.log(error);

            }
        }
        makeRequest(fields, url, apiKey)
    },


    pushNotificationtesting: async (gcmid = "6d422d5d-2dbf-4d44-a21d-6a3eb3594a31", title = "testing-title", message = "testing message", url_ = "testing url", type = "testing type", payload = { "abc": "payload object" }, user = "test user") => {
        let apiKey = "MGRhMzM5N2YtNWFkYS00NjgxLTk2OTQtMDBiZjMyNTgzM2Nj";
        url = 'https://onesignal.com/api/v1/notifications';

        let content = { "en": message }
        let headings = { "en": title }

        let fields = JSON.stringify({
            "include_player_ids": [gcmid],
            "app_id": "3fcfcc5c-70f4-4645-8035-1b71a790e4ce",
            "body": message,
            "headings": headings,
            "contents": content,
            "title": "title",
            "small_icon": "",
            "large_icon": "",
            "content_available": true,
            "data": {
                "title": title,
                "message": message,
                "type": type,
                "payload": payload
            }
        })

        function makeRequest(res_data, p_url, apiKey) {

            try {
                const config = {
                    method: 'post',
                    data: res_data,
                    url: p_url,
                    headers: {
                        'Authorization': 'Basic ' + apiKey,
                        'Content-Type': 'application/json'
                    }
                }

                let res = axios(config)

                return res.data
            } catch (error) {
                console.log(error);

            }
        }
        makeRequest(fields, url, apiKey)
    },

    get_latest_tc_version_id: async () => {
        let qb = await pool.get_connection();
        let response = await qb
            .select('id,version').where({ 'deleted': 0 }).order_by('id', 'DESC')
            .get(config.table_prefix + 'tc');
        qb.release();

        if (response[0]) {
            return response[0].id;
        } else {
            return '';
        }
    },

}
module.exports = helpers;