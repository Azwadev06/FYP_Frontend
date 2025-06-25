import { HttpInterceptorFn } from '@angular/common/http';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const skipUrls = ['/user/login', '/user/signup'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));
  if (token && !shouldSkip) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
