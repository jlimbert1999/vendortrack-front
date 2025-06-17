import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: Date): string {
  return format(date, 'dd / MMMM / yyyy', { locale: es });
}
