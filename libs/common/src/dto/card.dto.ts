import { IsCreditCard, IsNotEmpty, IsString } from "class-validator";

export class CardDto {
    @IsString()
    @IsNotEmpty()
    cvc: string;

    @IsString()
    exp_month: string;

    @IsString()
    exp_year: string;

    @IsCreditCard()
    number: string;

}