import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ApiResponse } from '../../types/types';


@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }

  getRecommendedPreferences(): Observable<ApiResponse<{recommended_cuisines:[]}>> {
    return this.http.get<ApiResponse<{recommended_cuisines:[]}>>(`/recommendation/get-preference-recomendations`);
  }

}
