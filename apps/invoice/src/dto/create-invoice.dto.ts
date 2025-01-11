import { CardDto } from "@app/common";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

class Item {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    qt: number;
}

export class CreateInvoiceDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    amount: number

    @IsString()
    @IsNotEmpty()
    paymentId: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Item)
    items: Item[];

    @IsDefined()
    @ValidateNested()
    @IsNotEmptyObject()
    @Type(() => CardDto)
    card: CardDto
}
