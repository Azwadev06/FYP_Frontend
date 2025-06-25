import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [NgFor],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating = 0
  @Input() editable = false
  @Input() size: "small" | "medium" | "large" = "medium"
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5]
  hoveredRating = 0

  getStarClass(star: number): string {
    const rating = this.hoveredRating || this.rating

    if (rating >= star) {
      return "full"
    } else if (rating >= star - 0.5) {
      return "half"
    } else {
      return "empty"
    }
  }

  hoverStar(star: number): void {
    if (this.editable) {
      this.hoveredRating = star
    }
  }

  resetHover(): void {
    if (this.editable) {
      this.hoveredRating = 0
    }
  }

  setRating(star: number): void {
    if (this.editable) {
      this.rating = star
      this.ratingChange.emit(this.rating);
    }
  }

}
