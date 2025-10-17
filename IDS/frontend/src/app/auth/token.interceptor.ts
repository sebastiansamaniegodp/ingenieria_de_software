import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

let isRefreshing = false;
let refreshWaiters: Array<(token: string|null) => void> = [];

function addAuthHeader(req: HttpRequest<any>) {
  const token = localStorage.getItem('access');
  if (token) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return req;
}

function queueRefresh(): Promise<string|null> {
  return new Promise(resolve => refreshWaiters.push(resolve));
}

function resolveQueue(token: string|null) {
  refreshWaiters.forEach(r => r(token));
  refreshWaiters = [];
}

function refreshToken(): Promise<string|null> {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return Promise.resolve(null);
  return fetch('http://localhost:8000/api/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  }).then(async r => {
    const data = await r.json();
    if (!r.ok) return null;
    localStorage.setItem('access', data.access);
    return data.access as string;
  }).catch(() => null);
}

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const authReq = addAuthHeader(req);
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.endsWith('/token/') && !req.url.endsWith('/token/refresh/') && !req.url.endsWith('/register/')) {
        if (!isRefreshing) {
          isRefreshing = true;
          return from(refreshToken()).pipe(
            switchMap(newToken => {
              isRefreshing = false;
              resolveQueue(newToken);
              if (newToken) {
                const retryReq = addAuthHeader(req);
                return next(retryReq);
              }
              // logout
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('user');
              router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        } else {
          return from(queueRefresh()).pipe(
            switchMap(token => {
              if (token) {
                const retryReq = addAuthHeader(req);
                return next(retryReq);
              }
              return throwError(() => err);
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
};
