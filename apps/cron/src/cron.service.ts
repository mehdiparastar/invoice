import { InvoiceRepository, NOTIFICATIONS_SERVICE, UsersRepository } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient: ClientProxy
  ) { }

  @Cron('0 12 * * *') // Runs every day at 12:00 PM
  async handleCron() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [report] = await this.invoiceRepository.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }, // Match today's invoices
        },
      },
      {
        $facet: {
          totalSales: [
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' }, // Sum up the total sales
              },
            },
          ],
          itemSummary: [
            { $unwind: '$items' }, // Break down items array
            {
              $group: {
                _id: '$items.sku', // Group by SKU
                totalQuantity: { $sum: '$items.qt' }, // Sum the quantities
              },
            },
            {
              $project: {
                sku: '$_id',
                totalQuantity: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalSales: { $arrayElemAt: ['$totalSales.total', 0] }, // Extract total sales
          itemSummary: 1,
        },
      },
    ]);

    // Generate HTML table
    const htmlTable = `
      <h3>Daily Sales Report</h3>
      <h5>Your total of invoices today was $${report?.totalSales} and sold items was as below:</h5><br/>
      <p>Total Sales: <strong>$${report?.totalSales.toFixed(2)}</strong></p>
      <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>SKU</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${report?.itemSummary
        .map(
          (item) => `
            <tr>
              <td>${item.sku}</td>
              <td>${item.totalQuantity}</td>
            </tr>`
        )
        .join('')}
        </tbody>
      </table>
    `;

    this.notificationsClient.emit(
      'notify_email',
      {
        email: 'invoice.project.2025@gmail.com',
        subject: "Daily Report summary (Invoice APP)",
        text: ``,
        html: htmlTable
      }
    )
  }
}
