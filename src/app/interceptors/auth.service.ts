import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptando petición:', req);

    // Obtener el token desde el almacenamiento local
    const token = localStorage.getItem('authToken');

    // Si el token está presente, agregarlo a los encabezados de la solicitud
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    // Si no hay token, continuar con la solicitud original
    return next.handle(req);
  }
}
