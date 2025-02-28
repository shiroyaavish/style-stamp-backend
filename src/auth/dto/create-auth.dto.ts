import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty()
    name:string

    @ApiProperty()
    mobileNumber:string

    @ApiProperty()
    countryCode : string

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
    countryCode : string

    @ApiProperty()
    countryCodeEmoji:string

    @ApiProperty()
    email:string

    @ApiProperty()
    password:string
}

export class loginAuthDto{
    @ApiProperty({required:false})
    mobileNumber:string

    @ApiProperty({required:false})
    email:string

    @ApiProperty({required:true})
    password:string
}
