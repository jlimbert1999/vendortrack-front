import { Stall } from '../../domain';
import { stallResponde } from '../interfaces/stall-response.interface';
import { TraderMapper } from './trader.mapper';

export class StallMapper {
  static fromResponse(response: stallResponde): Stall {
    const { trader, market, category, ...props } = response;
    return new Stall({
      ...props,
      market: market.name,
      category: category.name,
      ...(trader && { trader: TraderMapper.fromResponse(trader) }),
    });
  }
}
