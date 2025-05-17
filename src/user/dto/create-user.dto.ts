import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto { }

export class PaginationDto {
    @ApiProperty()
    page: number

    @ApiProperty()
    limit: number

    @ApiProperty()
    search: string

    @ApiProperty()
    sortColumn: string

    @ApiProperty()
    sortOrder: number
}