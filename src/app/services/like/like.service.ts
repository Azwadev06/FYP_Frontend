import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ApiResponse } from '../../types/types';
import { Place } from '../../types/types';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }


  toggleLike(placeId: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`/like/toggle-like`, { placeId });
  }

  islike(placeId: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`/like/islike`, { placeId });
  }

  myLikedPlaces(): Observable<ApiResponse<Place[]>> {
    return this.http.get<ApiResponse<Place[]>>(`/like/my-liked-places`);
  }
}
