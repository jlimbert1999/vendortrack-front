import { traderResponse } from './trader-response.interface';

export interface stallResponde {
  id: string;
  number: number;
  area: string;
  location: string;
  market: marketProps;
  trader?: traderResponse;
  category: categoryProps;
}

interface categoryProps {
  id: number;
  name: string;
}

interface marketProps {
  id: number;
  name: string;
}
