import got from "got";
import * as FormData from 'form-data';
import { Injectable, Inject } from "../../node_modules/@nestjs/common";
import { CONFIG_OPTIONS } from "../common/common.constants";
import { MailModuleOptions, EmailVar } from "./mail.interface";


@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {}

    private async sendMail(
        subject: string, template: string, emailVars: EmailVar[]
    ) {
        const form = new FormData();
        form.append('from', `happyDelivery@happyDelivery.co.kr`);
        form.append('to', `wnsgh5049@naver.com`);
        form.append('subject', subject)
        form.append('template', template);
        emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value))
        try {
            const response = await got(
                `https://api.mailgun.net/v3/${this.options.domain}/messages`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `api:${this.options.apiKey}`,
                        ).toString('base64')}`,
                    },
                    body: form,
                },
            );
        } catch(error) {
            console.log(error);
        };
    }
    sendVerificationEmail(email: string, code: string) {
        this.sendMail(
            'Verify Your Email', 'verify-email', [
                { key: 'code', value: code },
                { key: 'username', value: email}
            ] 
        )
    }
}

