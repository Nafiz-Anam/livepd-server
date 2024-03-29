module.exports = function(data,logo,title){
    return `
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <meta charset="utf-8">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
        <!--[if mso]>
        <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
        <style>
          td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
        </style>
      <![endif]-->
        <title>`+title+`</title>
        <link
            href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
            rel="stylesheet" media="screen">
        <style>
            .hover-underline:hover {
                text-decoration: underline !important;
            }
    
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
    
            @keyframes ping {
    
                75%,
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
    
            @keyframes pulse {
                50% {
                    opacity: .5;
                }
            }
    
            @keyframes bounce {
    
                0%,
                100% {
                    transform: translateY(-25%);
                    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                }
    
                50% {
                    transform: none;
                    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                }
            }
    
            @media (max-width: 600px) {
                .sm-leading-32 {
                    line-height: 32px !important;
                }
    
                .sm-px-24 {
                    padding-left: 24px !important;
                    padding-right: 24px !important;
                }
    
                .sm-py-32 {
                    padding-top: 32px !important;
                    padding-bottom: 32px !important;
                }
    
                .sm-w-full {
                    width: 100% !important;
                }
            }
        </style>
    </head>
    
    <body
        style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity));">
    
        <div role="article" aria-roledescription="email" aria-label="Welcome to `+title+`" lang="en">
            <table style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%"
                cellpadding="0" cellspacing="0" role="presentation">
                <tbody>
                    <tr>
                        <td align="center"
                            style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(236, 239, 241, var(--bg-opacity)); font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;"
                            bgcolor="rgba(236, 239, 241, var(--bg-opacity))">
                            <table class="sm-w-full" style="font-family: 'Montserrat',Arial,sans-serif; width: 600px; border: solid 1px #ccc; border-radius: 10px;"
                                width="600" cellpadding="0" cellspacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src="${data.invoice.merchant_details.logo}" style="height: 50px; text-align: left; margin-left: 10px" alt="${data.invoice.merchant_details.company_name}">
                                        </td>
                                        <td class="sm-py-32 sm-px-24"
                                            style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; padding: 20px 0px 20px 10px; text-align: right;"
                                            align="center">
                                            <a href="javascript:;">
                                                <img src="`+logo+`"   alt="`+title+`"
                                                    style="border: 0; height: 50px; line-height: 100%; vertical-align: middle; margin-right: 10px">
                                            </a>
                                        </td>
                                       
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="text-align: center;">
                                            <h5>Invoice from ${data.invoice.merchant_details.company_name}</h5>
                                            <h5>Invoice #${data.invoice.invoice_details.invoice_no}</h5>
                                        </td>
                                       
                                    </tr>
    
                                    <tr>
                                        <td colspan="2" style="text-align: center;">
                                            <h5> ${data.invoice.merchant_details.company_name} has sent you an invoice for ${data.invoice.invoice_details.currency} ${data.amount} </h5>
                                        </td>
                                       
                                    </tr>
                                    <tr>
                                        <td align="center" colspan="2" class="sm-px-24"
                                            style="font-family: 'Montserrat',Arial,sans-serif;">
                                            <table
                                                style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;border:1px solid #ccc;border-radius:5px;"
                                                width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                                <tbody>
                                                    <tr>
                                                        <td class="sm-px-24"
                                                            style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, var(--bg-opacity)); border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #626262; color: rgba(98, 98, 98, var(--text-opacity));"
                                                            bgcolor="rgba(255, 255, 255, var(--bg-opacity))" align="left">
    
                                                            <p class="sm-leading-32"
                                                                style="font-weight: 600; font-size: 20px; margin: 0 0 24px; --text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity));">
                                                            </p>
    
                                                            <p style="margin: 24px 0;"></p>
                                                            <p style="font-weight: 500; font-size: 16px; margin-bottom: 0;">
                                                            </p>
                                                            <p style="margin: 24px 0;">
                                                                <b style="color: #263238 !important;">INVOICE SUMMARY</b>
                                                                <br>
                                                                ${data.invoice.invoice_details.description}
                                                            </p>
    
                                                            <p style="margin: 24px 0;">
                                                                <b style="color: #263238 !important;">BILLING TO</b>
                                                                <br>
                                                                ${data.invoice.invoice_details.customer_title} ${data.invoice.invoice_details.customer_name}, ${data.invoice.invoice_details.customer_mobile}<br>
                                                                ${data.invoice.invoice_details.customer_email},<br>
                                                                ${data.invoice.invoice_details.billing_address.address}, ${data.invoice.invoice_details.billing_address.city}, ${data.invoice.invoice_details.billing_address.state},
                                                                ${data.invoice.invoice_details.billing_address.country}, ${data.invoice.invoice_details.billing_address.zip_code}
    
                                                            </p>
    
                                                            <p style="margin: 24px 0;">
                                                                <b style="color: #263238 !important;">EXPIRES ON</b>
                                                                <br>
                                                               ${data.invoice.invoice_details.expiry_date}
    
                                                            </p>
                                                           
    <table style="margin-top: 30px;font-family: 'Montserrat',Arial,sans-serif; "
    cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td style="text-align: left; width: 45%;">
            <b style="color: #263238 !important; font-size: 14px !important;">AMOUNT PAYABLE</b> <br>
            <span tyle=" font-size: 16px !important;">${data.invoice.invoice_details.currency} ${data.amount}</span>
           
        </td>
        <td style="text-align: right">
            <a href="${data.pay_url}"
            style="display: block;margin-left:100px; font-weight: 600; font-size: 14px; line-height: 100%; --text-opacity: 1;  color: rgba(255, 255, 255, var(--text-opacity));border-radius:3px; text-decoration: none;padding: 0.8em 30px;border: 1px solid #ccc;background-color:#7367f0 ;">Proceed To Pay </a>
        </td>
    </tr></table>
                                                            
                                                            
                                                            <table style="margin-top: 30px;font-family: 'Montserrat',Arial,sans-serif; border-top: solid 1px #cccccc5c !important; width: 100%;"
                                                                cellpadding="0" cellspacing="0" role="presentation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td 
                                                                            style="margin-top:10px; width: 100% !important; mso-padding-alt: 16px 24px; --bg-opacity: 1; text-align: center; border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; ">
    
                                                                            <a href="${data.download}"
                                                                                style="display: block; font-weight: 600; font-size: 14px; line-height: 100%; --text-opacity: 1;  color: rgba(255, 255, 255, var(--text-opacity));border-radius:3px; text-decoration: none;padding: 0.8em 30px;border: 1px solid #ccc;background-color:#7367f0 ; margin-top:20px;">Download
                                                                                Invoice</a>
                                                                        </td>
                                                                       
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                         
                                                            <p style="margin: 0 0 16px;">
    
                                                            </p>
                                                            <p style="margin: 0 0 16px;">Thanks, <br>`+title+` Team</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 20px;"
                                                            height="20"></td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 12px; padding-left: 48px; padding-right: 48px; --text-opacity: 1; color: #eceff1; color: rgba(236, 239, 241, var(--text-opacity));">
    
                                                            <p
                                                                style="--text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity));">
                                                                Use of our service and website is subject to our
                                                                <a href="#" class="hover-underline"
                                                                    style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">Terms
                                                                    of Use</a> and
                                                                <a href="#" class="hover-underline"
                                                                    style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">Privacy
                                                                    Policy</a>.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 16px;"
                                                            height="16"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
    
    </body>
    
    </html>`
}