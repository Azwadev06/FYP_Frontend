import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ReviewService } from '../../services/review/review.service';
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Review } from '../../types/types';

@Component({
  selector: 'app-review-form',
  imports: [StarRatingComponent, RouterModule, ReactiveFormsModule, NgIf],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit {

  @Input() placeId!: string
  @Output() reviewSubmitted = new EventEmitter<Review>()
  @Output() cancelled = new EventEmitter<void>()

  reviewForm!: FormGroup
  submitting = false
  error = ""

  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ["", [Validators.required, Validators.minLength(10)]],
    })

    this.route.params.subscribe((params) => {
      this.placeId = params["placeId"]
    })
  }

  onStarClick(event: MouseEvent): void {
    const rating = parseInt((event.currentTarget as HTMLElement).getAttribute('data-rating') || '0', 10);
    this.setRating(rating);
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      return
    }

    this.submitting = true
    this.error = ""

    const review = {
      rating: this.reviewForm.value.rating,
      text: this.reviewForm.value.comment,
      placeId: this.placeId,
    }

    this.reviewService.addReview(review).subscribe({
      next: (newReview) => {
        console.log(newReview)
        this.reviewSubmitted.emit(newReview.data)
        this.submitting = false
      },
      error: (error) => {
        console.error("Error submitting review", error)
        this.error = error.error.message
        this.submitting = false
      },
    })
  }

  onCancel(): void {
    this.cancelled.emit()
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating })
  }

}
