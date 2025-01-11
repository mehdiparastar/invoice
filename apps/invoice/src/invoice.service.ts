import { Inject, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceRepository } from './invoice.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto, user: UserDto) {
    return this.paymentsClient.send('create_charge', { amount: createInvoiceDto.amount, card: createInvoiceDto.card })
      .pipe(
        map((response) => {
          return this.invoiceRepository.create({
            ...createInvoiceDto,
            customer: user,
            paymentId: response.id
          })
        })
      )
  }

  async findAll() {
    return this.invoiceRepository.find({})
  }

  async findOne(_id: string) {
    return this.invoiceRepository.findOne({ _id })
  }

  async update(_id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceRepository.findOneAndUpdate({ _id }, { $set: updateInvoiceDto })
  }

  async remove(_id: string) {
    return this.invoiceRepository.findOneAndDelete({ _id })
  }
}
