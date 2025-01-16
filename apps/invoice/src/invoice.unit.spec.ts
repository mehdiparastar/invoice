import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceDocument, InvoiceRepository, AbstractRepository, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { firstValueFrom, of } from 'rxjs';
import { invoices } from '../../../e2e/specs/invoices';
import { adminUser } from '../../../e2e/specs/users';
import mongoose from 'mongoose';


type MockAbstractRepository = {
    [P in keyof AbstractRepository<InvoiceDocument>]: jest.Mock;
};

describe('InvoiceService', () => {
    let service: InvoiceService;
    let invoiceRepository: MockAbstractRepository;
    let paymentsClient: jest.Mocked<ClientProxy>;

    beforeEach(async () => {
        // Mocking InvoiceRepository
        invoiceRepository = {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
        } as unknown as MockAbstractRepository;

        // Mocking ClientProxy
        paymentsClient = {
            send: jest.fn(),
        } as unknown as jest.Mocked<ClientProxy>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoiceService,
                { provide: InvoiceRepository, useValue: invoiceRepository },
                { provide: PAYMENTS_SERVICE, useValue: paymentsClient },
            ],
        }).compile();

        service = module.get<InvoiceService>(InvoiceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an invoice and return it', async () => {
            const createInvoiceDto: CreateInvoiceDto = invoices[0];
            const user: UserDto = { ...adminUser, _id: new mongoose.Types.ObjectId(), createdAt: new Date(), updatedAt: new Date() };
            const mockPaymentResponse = { id: 'payment-id-123' };
            const mockInvoice = {
                ...createInvoiceDto,
                customer: user,
                paymentId: mockPaymentResponse.id,
            };

            // Mocking the paymentsClient send method
            paymentsClient.send.mockReturnValue(of(mockPaymentResponse));

            // Mocking the repository create method
            invoiceRepository.create.mockResolvedValue(mockInvoice);

            const result = await firstValueFrom(await service.create(createInvoiceDto, user));

            // Assertions
            expect(paymentsClient.send).toHaveBeenCalledWith('create_charge', {
                amount: createInvoiceDto.amount,
                card: createInvoiceDto.card,
                email: user.email,
            });
            expect(invoiceRepository.create).toHaveBeenCalledWith(mockInvoice);
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('findAll', () => {
        it('should return all invoices', async () => {
            const mockInvoices = invoices;

            invoiceRepository.find.mockResolvedValue(mockInvoices);

            const result = await service.findAll();
            expect(invoiceRepository.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockInvoices);
        });
    });

    describe('findOne', () => {
        it('should return an invoice by id', async () => {
            const _id = new mongoose.Types.ObjectId()
            const mockInvoice = { ...invoices[0], _id };

            invoiceRepository.findOne.mockResolvedValue(mockInvoice);

            const result = await service.findOne(_id.toString());
            expect(invoiceRepository.findOne).toHaveBeenCalledWith({ _id:_id.toString() });
            expect(result).toEqual(mockInvoice);
        });
    });

    describe('update', () => {
        it('should update an invoice and return it', async () => {
            const updatedInvoice = { id: '1', amount: 200 };

            invoiceRepository.findOneAndUpdate.mockResolvedValue(updatedInvoice);

            const result = await service.update('1', { amount: 200 });
            expect(invoiceRepository.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: '1' },
                { $set: { amount: 200 } },
            );
            expect(result).toEqual(updatedInvoice);
        });
    });

    describe('remove', () => {
        it('should delete an invoice and return it', async () => {
            const mockInvoice = { id: '1' };

            invoiceRepository.findOneAndDelete.mockResolvedValue(mockInvoice);

            const result = await service.remove('1');
            expect(invoiceRepository.findOneAndDelete).toHaveBeenCalledWith({ _id: '1' });
            expect(result).toEqual(mockInvoice);
        });
    });
});