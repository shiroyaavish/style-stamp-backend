import {Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  constructor(private configService: ConfigService) {}
  async sendTwilioVerificationSMS(phoneNumber: string) {
    const ACCOUNT_SID = this.configService.get<string>('twilio.account_sid');
    const AUTH_TOKEN = this.configService.get<string>('twilio.auth_token');
    const SERVICE_SID = this.configService.get<string>('twilio.service_sid');
    const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN);
    try {
      const sendVerificationText = await client.verify.v2
        .services(SERVICE_SID)
        .verifications.create({
          to: phoneNumber,
          channel: 'sms',
        });

      return { status: true, allData: sendVerificationText.sendCodeAttempts };
    } catch (error) {
      return { status: false, error: error.message };
    }
  }

  async verifyTwilioSMS(phoneNumber: string, code: string) {
    const ACCOUNT_SID = this.configService.get<string>('twilio.account_sid');
    const AUTH_TOKEN = this.configService.get<string>('twilio.auth_token');
    const SERVICE_SID = this.configService.get<string>('twilio.service_sid');

    const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN);
    const verificationCheck = await client.verify.v2
      .services(SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });
    return verificationCheck;
  }
}
