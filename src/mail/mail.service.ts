import got from "got";
import * as FormData from 'form-data';
import { Injectable, Inject } from "../../node_modules/@nestjs/common";
import { CONFIG_OPTIONS } from "../common/common.constants";
import { MailModuleOptions } from "./mail.interface";


@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {
        this.sendMail('testing', 'verify-email');
    }

    private async sendMail(subject: string, template: string) {
        const form = new FormData();
        form.append('from', `happyDelivery@happyDelivery.co.kr`);
        form.append('to', `wnsgh5049@naver.com`);
        form.append('subject', subject)
        form.append('template', template);
        form.append('v:code', 'assss');
        form.append('v:username', 'junho-Kim');
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
        console.log(response.body);
    }
}

