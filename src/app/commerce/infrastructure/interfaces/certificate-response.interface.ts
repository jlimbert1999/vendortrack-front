import { stallResponde } from './stall-response.interface';
import { traderResponse } from './trader-response.interface';

export interface certificateResponse {
  id: string;
  code: number;
  trader: traderResponse;
  stall: stallResponde;
  paymentMethod: string;
  createdAt: string;
  startDate: string;
  endDate: string;
}
