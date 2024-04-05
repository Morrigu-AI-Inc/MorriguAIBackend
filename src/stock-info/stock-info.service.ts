import { Injectable } from '@nestjs/common';
import { ActionsService } from 'src/actions/actions.service';

@Injectable()
export class StockInfoService {
  constructor(private readonly actionService: ActionsService) {}

  async getStockInfo(stockSymbol: string) {
    return await this.actionService.searchGoogle(
      'stock market information for ' + stockSymbol,
    );
  }
}
