import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
interface toastProps {
  title: string;
  description?: string;
  severity?: 'warning' | 'info' | 'success' | 'error';
}
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  protected readonly toast = toast;
  constructor() {}

  showToast({ title, description, severity }: toastProps) {
    switch (severity) {
      case 'warning':
        toast.warning(title, { description });
        break;

      case 'error':
        toast.error(title, { description });
        break;

      case 'success':
        toast.success(title, { description });
        break;

      case 'info':
        toast.info(title, { description });
        break;

      default:
        toast(title, { description });
        break;
    }
  }
}
