import { Component, Input } from '@angular/core';
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { RouterModule } from '@angular/router';
import { Place } from '../../types/types';
import { environment } from '../../../environments/environment.development';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LikeService } from '../../services/like/like.service';

@Component({
  selector: 'app-restaurant-card',
  imports: [StarRatingComponent, RouterModule, NgOptimizedImage, CommonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {

  isLiked = false;

  @Input() place!: Place;

  constructor(private likeService: LikeService) { }

  ngOnInit(): void {
    if (this.place?.place_id) {
      this.isLikeStatus(this.place.place_id);
    }
  }

  toggleLike(event: Event, placeId: string): void {
    event.stopPropagation();
    this.isLiked = !this.isLiked;
    this.handleIsLike(placeId);
  }


  getPhotoUrl(): string {
    if (this.place.photos && this.place.photos.length > 0) {
      const photoRef = this.place.photos[0].photo_reference;
      return `${environment.BASE_URL}/api/place/photo-proxy?photoRef=${photoRef}`;
    }
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop";
  }

  handleIsLike(placeId: string): void {
    this.likeService.toggleLike(placeId).subscribe({
      next: (data) => {
      },
      error: (error) => {
        console.error("Error Toggle Like", error)
      },
    })
  }


  isLikeStatus(placeId: string): void {
    this.likeService.islike(placeId).subscribe({
      next: (data) => {
        if(data.data){
          this.isLiked = true
        }
      },
      error: (error) => {
        console.error("Error Toggle Like", error)
      },
    })
  }





}
