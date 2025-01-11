import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NotifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MaxLength(78, { message: 'Subject must not exceed 78 characters' })
    subject: string

    @IsString()
    text: string
}