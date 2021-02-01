const sgMail = require('@sendgrid/mail')
    // const sendgridAPIKey = "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"
    // sgMail.setApiKey(sendgridAPIKey)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aryan2005gautam@gmail.com',
        subject: 'Thanks for Joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).then(() => {
        console.log('Message Sent')
    }).catch((error) => {
        console.log(error.message.body)
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aryan2005gautam@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye. ${name}. Hope to see you back sometime soon.`
    })
}

module.exports = {
        // sendWelcomeEmail = sendWelcomeEmail
        sendWelcomeEmail,
        sendCancelationEmail
    }
    // sgMail.send({
    //     to: 'aryan2005gautam@gmail.com',
    //     from: 'aryan2005gautam@gmail.com',
    //     subject: 'This is my first Creation!',
    //     text: 'I hope this one actually got to you'
    // }).then(() => {
    //     console.log('Message sent')
    // }).catch((error) => {
    //     console.log(error.response.body)
    // })