var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
    user: "emailapikey",
    pass: "wSsVR61x+xb3Da4smjakIu1tml4DAgmkF0gr2lv0v3f9Fv+Xosc+lkWbUVWvGPZNF2U6EDAX9u4hyRgD12ENjIt/n1hTCCiF9mqRe1U4J3x17qnvhDzIXmVdlhqBLI0MxA9tnWhoEM8q+g=="
    }
});

var mailOptions = {
    from: '"Example Team" <noreply@rootedrising.org.ng>',
    to: 'info@rootedrising.org.ng',
    subject: 'Test Email',
    html: 'Test email sent successfully.',
};

console.log('Attempting to send email...');
transport.sendMail(mailOptions, (error, info) => {
    if (error) {
    return console.log('Error occurred:', error);
    }
    console.log('Successfully sent');
    console.log('Message ID:', info.messageId);
});
