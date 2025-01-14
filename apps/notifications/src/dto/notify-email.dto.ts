import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import * as nodemailer from 'nodemailer'

type EmailHtml = Pick<nodemailer.SendMailOptions, 'html'>['html'];

export class NotifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MaxLength(78, { message: 'Subject must not exceed 78 characters' })
    subject: string

    @IsString()
    text: string

    @IsOptional()
    html?: EmailHtml
}