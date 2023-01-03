const nodemailer = require("nodemailer");
require('dotenv').config({ path: "../../.env" });
const welcome_template = require('../mail-template/welcome');
const forgot_template = require('../mail-template/forget');
const forgot_admin_template = require('../mail-template/forget_admin');
const PSPMail_template = require('../mail-template/PSPMail');
const otp_mail_template = require('../mail-template/otp_sent_mail');
const owners_ekyc_template = require('../mail-template/ownersMail');
const invoice_mail = require('../mail-template/invoice_mail');
const helpers = require('../helper/general_helper');
const payment_mail = require('../mail-template/payment_mail');
const customer_transaction_mail = require('../mail-template/customer_transaction_mail');
const merchant_transaction_mail = require("../mail-template/merchant_transaction_mail");
const forgot2fa_template = require('../mail-template/forget_2fa');
require('dotenv').config({ path: "../../.env" });
const server_addr = process.env.SERVER_LOAD
const port = process.env.SERVER_PORT

var mailSender = {
    welcomeMail: async (mail,subject,url) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: welcome_template({url:url},logo,title) // html body
        });
    },

    forgotMail: async (mail,subject,url) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo

        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: forgot_template({url:url},logo,title) // html body
        });
    },
    forgot2fa: async (mail,subject,url) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo

        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: forgot2fa_template({url:url},logo,title) // html body
        });
    },

    forgotAdminMail: async (mail,subject,data) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: forgot_admin_template(data,logo,title) // html body
        });
    },

    PSPMail: async (mail,mail_cc,subject,table,para) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            cc:mail_cc,
            subject: title+" - "+subject, // Subject line
            html: PSPMail_template({table:table},logo,title,para) // html body
        });
    },
    otpMail: async (mail,subject,otp) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: otp_mail_template(otp,logo,title) // html body
        });
    },
    ekycOwnersMail: async (mail,subject,url) => {
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: mail, // list of receivers
            subject: title+" - "+subject, // Subject line
            html: owners_ekyc_template({url:url},logo,title) // html body
        });
    },
    InvoiceMail: async (data) => {
        console.log(data);
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.mail_to, // list of receivers
            cc:data.mail_cc,
            subject:data.subject, // Subject line
            html: invoice_mail(data,logo,title) // html body
        });
    },

    PaymentMail: async (data) => {
        
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.mail_to, // list of receivers
            cc:data.mail_cc,
            subject:data.subject, // Subject line
            html: payment_mail(data,logo,title) // html body
        });
        
    },
    CustomerTransactionMail:async(data)=>{
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.customer_email, // list of receivers
            subject:'Transaction Receipt', // Subject line
            html: customer_transaction_mail(data,logo,title) // html body
        });
    },
    MerchantTransactionMail:async(data)=>{
        let smtp_details = await helpers.company_details({id:1});
        let title = await helpers.get_title();
        let transporter = nodemailer.createTransport({
            host: smtp_details.smtp_name,
            port: smtp_details.smtp_port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtp_details.smtp_username, // generated ethereal user
                pass: smtp_details.smtp_password, // generated ethereal password
            },
        });
        let image_path = server_addr+':'+port+"/static/images/";
        let logo =image_path+smtp_details.company_logo
        let info = await transporter.sendMail({
            from: smtp_details.smtp_from, // sender address
            to: data.co_email, // list of receivers
            subject:'Transaction Details', // Subject line
            html: merchant_transaction_mail(data,logo,title) // html body
        });
    }
}
module.exports = mailSender;