import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

import { StarRatingComponent } from "../../components/star-rating/star-rating.component";
import { ReviewFormComponent } from "../../components/review-form/review-form.component";
import { ReviewListComponent } from "../../components/review-list/review-list.component";
import { NgFor, NgIf } from '@angular/common';
import { Place, PlacePhoto } from '../../types/types';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { environment } from '../../../environments/environment.development';
import { Review } from '../../types/types';


@Component({
  selector: 'app-restaurant-detail',
  imports: [StarRatingComponent, ReviewFormComponent, ReviewListComponent, NgFor, NgIf, SpinnerComponent],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css'
})
export class RestaurantDetailComponent implements OnInit {
  reviews: Review[] = []
  isLoggedIn = false
  activeTab = "overview"
  showReviewForm = false

  place?: Place
  loading = false
  error = ""

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn()

    this.route.params.subscribe((params) => {
      const placeId = params["placeId"]

      this.loading = true

      this.restaurantService.getPlace(placeId).subscribe({
        next: (data) => {
          this.place = data;
        },
        error: (error) => {
          console.log(error)
          this.error = error.error.message
          this.loading = false
        },
        complete: () => {
          this.loading = false
        },
      })
    })
  }

  getPhotoUrl(photo: PlacePhoto): string {
    if (photo) {
      const photoRef = photo.photo_reference;
      const apiKey = environment.GOOGLE_MAP_API_KEY;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`
    }
    return ""
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  toggleReviewForm(): void {
    this.activeTab = 'reviews'
    this.showReviewForm = !this.showReviewForm
  }

  getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }


  onReviewSubmitted(review: Review): void {
    this.place?.reviews.push(review)
    this.showReviewForm = false
  }

  getDefaultImage(): string {
    return "/assets/images/restaurant-placeholder.jpg"
  }
}
