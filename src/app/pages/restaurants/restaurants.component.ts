import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { CommonModule, NgIf } from '@angular/common';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Place } from '../../types/types';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ResponsebarComponent } from '../../components/responsebar/responsebar.component';


@Component({
  selector: 'app-restaurants',
  imports: [RestaurantCardComponent, NgIf, RouterModule, CommonModule, SpinnerComponent, ResponsebarComponent],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent {
  places: Place[] = []

  private searchQuery: string | null = null;
  private location: string | null = null;

  responseTime: number = 0;
  totalResults: number = 0;
  loading = false
  error = ""

  constructor(private route: ActivatedRoute, private router: Router, private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.searchQuery = this.route.snapshot.queryParamMap.get('search');
    this.location = this.route.snapshot.queryParamMap.get('location');


    if (!this.searchQuery) {
      this.router.navigate(['/']);
    }

    this.loading = true

    const startTime = performance.now();

    this.restaurantService.getPlaces(this.searchQuery!, this.location).subscribe({
      next: (data) => {
        const sortedPlaces = [...data].sort((a, b) => b.rating - a.rating);
        this.places = sortedPlaces;
        this.totalResults = data.length;
      },
      error: (error) => {
        console.log(error)
        this.error = error.error.message
        this.loading = false
      },
      complete: () => {
        this.loading = false
        const endTime = performance.now();
        this.responseTime = endTime - startTime;
      },
    })

  }






}
