import { ApiProperty } from "@nestjs/swagger"

export class CreateTransactionDto {
    @ApiProperty()
    eventId: number

    @ApiProperty()
    entityId: number
    @ApiProperty()
    listenerEntityId: number
    @ApiProperty()
    listenerEntityTechnicalName: string
    @ApiProperty()
    spaceId: number
    @ApiProperty()
    webhookListenerId: number
    @ApiProperty()
    timestamp: Date
}