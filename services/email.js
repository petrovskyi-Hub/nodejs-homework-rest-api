const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
const config = require('../config/email.json');

require('dotenv').config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev;
        break;
      case 'stage':
        this.link = config.stage;
        break;
      case 'production':
        this.link = config.prod;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }

  #createTemplate(verificationToken, name = 'Guest') {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'default',
      product: {
        name: 'ContactsBook',
        link: this.link,
      },
    });
    const template = {
      body: {
        name,
        intro: 'Welcome to Phonebook!',
        action: {
          instructions:
            'To finish registrate for ContactsBook, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/auth/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(verificationToken, email, name) {
    const emailBody = this.#createTemplate(verificationToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'contactsbook@contacts.com', // Use the email address or domain you verified above
      subject: 'Confirmation of registration',
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
