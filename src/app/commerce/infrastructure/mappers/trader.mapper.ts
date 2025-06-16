import { Trader } from '../../domain';
import { traderResponse } from '../interfaces/trader-response.interface';

export class TraderMapper {
  static fromResponse(trader: traderResponse): Trader {
    const { grantDate, ...props } = trader;
    return new Trader({ ...props, grantDate: new Date(grantDate) });
  }
}
