import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InvoiceDocument } from "../models/invoice.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class InvoiceRepository extends AbstractRepository<InvoiceDocument> {
    protected readonly logger = new Logger(InvoiceRepository.name)

    constructor(@InjectModel(InvoiceDocument.name) invoiceModel: Model<InvoiceDocument>) {
        super(invoiceModel)
    }
}