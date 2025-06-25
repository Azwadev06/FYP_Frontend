import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const BaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.BASE_URL;

  const url = req.url.startsWith('http') ? req.url : `${baseUrl}/api${req.url}`;

  const modifiedReq = req.clone({ url });
  
  console.log(modifiedReq)

  return next(modifiedReq);
};
