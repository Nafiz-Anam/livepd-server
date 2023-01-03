const path = require("path");
require("dotenv").config({ path: "../.env" });
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const helpers = require("../utilities/helper/general_helper");
const dbtable = config.table_prefix + "master_super_merchant";

var dbModel = {
    // add a merchant
    add: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },

    // get all merchants
    select: async (condition, filter, limit) => {
        let qb = await pool.get_connection();
        let response;
        if (limit.perpage) {
            response = await qb
                .select("*")
                .where(condition)
                .order_by("name", "asc")
                .limit(limit.perpage, limit.start)
                .get(dbtable);
            if (filter.country_name != "") {
                response = await qb
                    .select("*")
                    .where(condition)
                    .like(filter)
                    .order_by("name", "asc")
                    .limit(limit.perpage, limit.start)
                    .get(dbtable);
            }
            qb.release();
        } else {
            response = await qb
                .select("*")
                .where(condition)
                .order_by("name", "asc")
                .get(dbtable);
            if (filter.country_name != "") {
                response = await qb
                    .select("*")
                    .where(condition)
                    .like(filter)
                    .order_by("name", "asc")
                    .get(dbtable);
            }
            qb.release();
        }
        return response;
    },

    // get a merchant
    selectSpecific: async (selection, condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select(selection).where(condition).get(dbtable);
        qb.release();
        return response;
    },

    selectOne: async (selection, condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select(selection).where(condition).get(dbtable);
        qb.release();
        return response[0];
    },

    // get merchant details
    selectMerchantDetails: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select(selection).where(condition).get(dbtable);
        qb.release();
        return response[0];
    },

    // update merchant details
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        return response;
    },

    // get total merchants count
    get_count: async (condition_obj) => {
        let qb = await pool.get_connection();

        if (condition_obj.country_name != "") {
            let condition = await helpers.get_conditional_like_string(
                condition_obj
            );
            response = await qb.query(
                "select count('id') as count from " +
                    dbtable +
                    " where deleted = 0 " +
                    condition
            );
        } else {
            response = await qb.query(
                "select count('id') as count from " +
                    dbtable +
                    " where deleted = 0 "
            );
        }

        qb.release();
        return response[0].count;
    },
};
module.exports = dbModel;
