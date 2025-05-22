import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsNumber, IsString } from "class-validator"

export class CreateTransactionDto {
    @ApiProperty()
    @IsNumber()
    eventId: number

    @ApiProperty()
    @IsNumber()
    entityId: number

    @ApiProperty()
    @IsNumber()
    listenerEntityId: number

    @ApiProperty()
    @IsString()
    listenerEntityTechnicalName: string

    @ApiProperty()
    @IsNumber()
    spaceId: number

    @ApiProperty()
    @IsNumber()
    webhookListenerId: number

    @ApiProperty()
    @IsString()
    timestamp: string
}


export enum transactionState {
    PENDING = "PENDING",
    FULFILL = "FULFILL",
    FAILED = "FAILED",
}