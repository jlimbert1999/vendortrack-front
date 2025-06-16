import { Stall } from './stall.mode';
import { Trader } from './trader.model';

interface certificateProps {
  id: string;
  code: number;
  trader: Trader;
  stall: Stall;
  paymentMethod: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
}

export class Certificate {
  id: string;
  code: number;
  trader: Trader;
  stall: Stall;
  paymentMethod: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  constructor({
    id,
    code,
    trader,
    stall,
    paymentMethod,
    createdAt,
    startDate,
    endDate,
  }: certificateProps) {
    this.id = id;
    this.code = code;
    this.trader = trader;
    this.stall = stall;
    this.paymentMethod = paymentMethod;
    this.createdAt = createdAt;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  get paymentMethodLabel(): string {
    switch (this.paymentMethod) {
      case 'cash':
        return 'Efectivo';
      default:
        return 'Desconocido';
    }
  }
}
