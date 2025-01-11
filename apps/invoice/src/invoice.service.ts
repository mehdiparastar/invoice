import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRepository } from './invoice.repository';
import { UserDto } from '@app/common';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) { }

  create(createInvoiceDto: CreateInvoiceDto, user: UserDto) {
    return this.invoiceRepository.create({
      ...createInvoiceDto,
      customer: user
    })
  }

  findAll() {
    return this.invoiceRepository.find({})
  }

  findOne(_id: string) {
    return this.invoiceRepository.findOne({ _id })
  }

  update(_id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceRepository.findOneAndUpdate({ _id }, { $set: updateInvoiceDto })
  }

  remove(_id: string) {
    return this.invoiceRepository.findOneAndDelete({ _id })
  }
}
