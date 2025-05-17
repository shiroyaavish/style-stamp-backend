import { Global, Module } from "@nestjs/common";
import { TwilioService } from "./services/twilio.service";
import { EmailService } from "./services/email.service";

@Global()
@Module({
    imports:[],
    providers: [TwilioService,EmailService],
    exports: [TwilioService,EmailService],
})

export class SharedModule { }