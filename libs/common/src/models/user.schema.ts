import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class UserDocument extends AbstractDocument {
    @Prop({ required: true, type: SchemaTypes.String, index: true, unique: true })
    email: string

    @Prop({ required: true, type: SchemaTypes.String })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)