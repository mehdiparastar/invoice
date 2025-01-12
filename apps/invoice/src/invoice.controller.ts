import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CurrentUser, JwtAuthGuard, Roles, UserDto } from '@app/common';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @Roles('Admin', 'User')
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() user: UserDto) {
    return await this.invoiceService.create(createInvoiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles('Admin', 'User')
  async findAll() {
    return this.invoiceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @Roles('Admin', 'User')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles('Admin', 'User')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
