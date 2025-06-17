import { Stall } from '../../domain';
import { stallResponde } from '../interfaces/stall-response.interface';
import { TraderMapper } from './trader.mapper';

export class StallMapper {
  static fromResponse(response: stallResponde): Stall {
    console.log(response);
    const { trader, market, category, taxZone, ...props } = response;
    return new Stall({
      ...props,
      market: market.name,
      category: category.name,
      taxZone: taxZone.name,
      ...(trader && { trader: TraderMapper.fromResponse(trader) }),
    });
  }
}
