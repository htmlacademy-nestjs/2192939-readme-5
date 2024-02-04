import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { EmailSubject } from './mail.constant';
import { Public, Subscriber } from '@project/shared/app/types';
import { NotifyConfig } from '@project/shared/config/notify';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof NotifyConfig>;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EmailSubject.AddSubscriber,
      template: './add-subscriber',
      context: {
        user: `${subscriber.name}`,
        email: `${subscriber.email}`,
      },
    });
  }

  public async sendNewsletter(email: string, publicsInfo: Public[]) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: email,
      subject: EmailSubject.Newsletter,
      template: './newsletter',
      context: {
        publics: publicsInfo,
      },
    });
  }
}
