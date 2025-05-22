import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty()
    name:string

    @ApiProperty()
    mobileNumber:string

    @ApiProperty()
    phoneCode : string

    @ApiProperty()
    countryCodeEmoji:string

    @ApiProperty()
    email:string

}
export class AdminAuthDto {
    @ApiProperty()
    name:string

    @ApiProperty()
    mobileNumber:string

    @ApiProperty()
    phoneCode : string

    @ApiProperty()
    countryCodeEmoji:string

    @ApiProperty()
    email:string

    @ApiProperty()
    password:string
}

export class LoginAuthDto{
    @ApiProperty({required:false})
    mobileNumber:string

    @ApiProperty({required:false})
    email:string

    @ApiProperty({required:true})
    password:string
}


export class SendotpDto {
    @ApiProperty({description:"user mobilenumber"})
    mobileNumber:string

    @ApiProperty({description:"user mobilenumber's phone code"})
    phoneCode:string
}
export class VerifyOtpDto {
    @ApiProperty({description:"user mobilenumber"})
    mobileNumber:string

    @ApiProperty({description:"otp which you recieved"})
    otp:string
}