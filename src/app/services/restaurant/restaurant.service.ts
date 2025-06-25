import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { tap } from "rxjs"


import { Place } from "../../types/types"
import { AuthService } from "../../auth/auth.service"
import { HttpHeaders } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class RestaurantService {

  private userId: string | undefined

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = authService.currentUser?._id
  }

  getPlaces(keyword: string, location: string | null): Observable<Place[]> {
    const headers = new HttpHeaders().set('userId', this.userId || '');

    const params = {
      keyword,
      location: location || ''
    };

    return this.http.get<Place[]>('/place', { params, headers });
  }

  getPlace(placeId: string): Observable<Place> {
    return this.http.get<Place>(`/place/${placeId}`)
  }

}
