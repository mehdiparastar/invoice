import { IsDefined, IsNotEmptyObject, IsPositive, ValidateNested } from "class-validator";
import { CardDto } from "./card.dto";
import { Type } from "class-transformer";

export class CreateChargeDto {
    @IsPositive()
    amount: number

    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CardDto)
    card: CardDto
}