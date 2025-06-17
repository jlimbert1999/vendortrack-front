import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AlertService } from '../../shared';

export const LOAD_INDICATOR = new HttpContextToken<boolean>(() => true);
export const UPLOAD_INDICATOR = new HttpContextToken<boolean>(() => true);

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const alertService = inject(AlertService);
  // const loadingService = inject(LoadingService);

  const showLoadIndicator =
    req.context.get(LOAD_INDICATOR) && req.method === 'GET';
  const showUploadIndicator =
    req.context.get(UPLOAD_INDICATOR) && req.method !== 'GET';

  // if (showLoadIndicator) {
  //   loadingService.toggleLoading(true);
  // }

  // if (showUploadIndicator) {
  //   loadingService.toggleUploading(true);
  // }

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });

  return next(reqWithHeader).pipe(
    catchError((error) => {
      handleHttpMessages(error, alertService);
      return throwError(() => error);
    }),
    finalize(() => {
      // if (showLoadIndicator) loadingService.toggleLoading(false);
      // if (showUploadIndicator) loadingService.toggleUploading(false);
    })
  );
}

function handleHttpMessages(error: HttpErrorResponse, service: AlertService) {
  // const authService = inject(AuthService);
  // const router = inject(Router);
  const message: string = error.error['message'] ?? 'Error no controlado';
  console.log(error.status);
  switch (error.status) {
    case 500:
      service.showToast({
        severity: 'error',
        title: 'Ha ocurrido un error',
        description: 'Error interno',
      });
      break;

    case 400:
      service.showToast({
        severity: 'warning',
        title: 'Solictud incorrecta',
        description: message,
      });
      break;
    case 403:
      // Alert.Alert({
      //   icon: 'info',
      //   title: 'Accesso denegado',
      //   text: 'Esta cuenta no tiene los permisos requeridos',
      // });
      break;
    case 404:
      service.showToast({
        severity: 'warning',
        title: 'Recurso no encontrado',
        description: message,
      });
      break;
    case 409:
      service.showToast({
        severity: 'warning',
        title: 'Conflicto registro',
        description: message,
      });
      break;
    default:
      service.showToast({
        title: 'Error no controlado',
        description: message,
      });
      break;
  }
  throw error;
}
