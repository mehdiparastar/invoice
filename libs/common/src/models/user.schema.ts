import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class UserDocument extends AbstractDocument {
    @Prop({ required: true, type: SchemaTypes.String, index: true, unique: true })
    email: string

    @Prop({ required: true, type: SchemaTypes.String })
    password: string


    @Prop({
        type: [String], // Define the type as an array of strings
        default: ['User'], // Default value
        validate: {
            validator: (roles: string[]) => roles.every((role) => typeof role === 'string' && role.trim().length > 0),
            message: 'Each role must be a non-empty string.',
        },
    })
    roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)