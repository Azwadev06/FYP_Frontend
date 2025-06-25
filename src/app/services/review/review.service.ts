import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { Review } from "../../types/types"
import { HttpClient } from "@angular/common/http"
import { ApiResponse } from "../../types/types"

@Injectable({
  providedIn: "root",
})
export class ReviewService {



  private mockReviews: Review[] = []

  constructor(private http: HttpClient) { }


  formatDate(dateInput: string | number | Date): string {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  addReview({ rating, text, placeId }: {
    rating: number,
    text: string,
    placeId: string,
  }): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`/review/add`, {
      rating,
      text,
      placeId
    });
  }




  loadReviews(): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`/review/my`);
  }


  // updateReview(review: Review): Observable<Review> {
  //   // Simulate updating a review
  //   const index = this.mockReviews.findIndex((r) => r.id === review.id)
  //   if (index !== -1) {
  //     this.mockReviews[index] = { ...this.mockReviews[index], ...review }
  //     return of(this.mockReviews[index])
  //   }
  //   return of(review)

  //   // Actual implementation:
  //   // return this.http.put<Review>(`${this.apiUrl}/${review.id}`, review);
  // }

  // deleteReview(id: number): Observable<any> {
  //   // Simulate deleting a review
  //   const index = this.mockReviews.findIndex((r) => r.id === id)
  //   if (index !== -1) {
  //     this.mockReviews.splice(index, 1)
  //   }
  //   return of({ success: true })

  //   // Actual implementation:
  //   // return this.http.delete(`${this.apiUrl}/${id}`);
  // }


}
