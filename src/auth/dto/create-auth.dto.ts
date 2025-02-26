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

    @ApiProperty()
    password:string
}

export class loginAuthDto{
    @ApiProperty({required:true})
    mobileNumber:string

    @ApiProperty({required:true})
    password:string
}
