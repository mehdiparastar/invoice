import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "apps/auth/src/users/models/user.schema";
import { SchemaTypes } from "mongoose";

@Schema()
export class InvoiceDocument extends AbstractDocument {
    @Prop({ required: true })
    amount: number

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: UserDocument.name, index: true })
    customer: UserDocument

    @Prop({ required: true, type: SchemaTypes.String })
    paymentId: string

    @Prop({ type: [{ sku: { type: SchemaTypes.String, required: true, index: true }, qt: { type: Number, required: true } }], required: true })
    items: { sku: string; qt: number }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(InvoiceDocument)