import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { ApiResponse } from "../../types/types"
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})


export class SearchValidationService {

  constructor(private http: HttpClient) { }

  validateSearch({ text }: { text: string }): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(
      `${environment.FLASK_BASE_URL}/prompt/classify-search`,
      { text }
    );
  }


}
