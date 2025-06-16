import { Certificate } from '../../domain';
import { certificateResponse } from '../interfaces/certificate-response.interface';
import { StallMapper } from './stall.mapper';
import { TraderMapper } from './trader.mapper';

export class CertificateMapper {
  static fromReponse(response: certificateResponse) {
    const { trader, stall, startDate, endDate, createdAt, ...props } = response;
    return new Certificate({
      ...props,
      trader: TraderMapper.fromResponse(trader),
      stall: StallMapper.fromResponse(stall),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(createdAt),
    });
  }
}
