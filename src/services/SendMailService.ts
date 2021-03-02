import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

interface emailVariables{
    name: string,
    title: string,
    description: string
}

class SendMailService {

    private client: Transporter;
    
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }

    async execute(to: string, variables: emailVariables, handlebarsPath: string) {
        
        const templateFileContent = fs.readFileSync(handlebarsPath).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const { title } = variables;

        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject: title,
            html,
            from: "NPS <noreply@nps.com.br>"
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();