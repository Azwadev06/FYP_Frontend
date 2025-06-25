import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { FormsModule } from '@angular/forms';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Place, User } from '../../types/types';
import { Router } from '@angular/router';
import { SearchValidationService } from '../../services/search-validation/search-validation.service';


@Component({
  selector: 'app-home',
  imports: [FormsModule, RestaurantCardComponent, NgIf, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn = false
  searchQuery = ""
  selectedCity?: { name: string, coords: string };
  cities = [
    { name: 'Lahore', coords: '31.5204,74.3587' },
    { name: 'Karachi', coords: '24.8607,67.0011' },
    { name: 'Islamabad', coords: '33.6844,73.0479' },
    { name: 'Faisalabad', coords: '31.4504,73.1350' },
    { name: 'Rawalpindi', coords: '33.5651,73.0169' },
    { name: 'Multan', coords: '30.1575,71.5249' },
    { name: 'Peshawar', coords: '34.0151,71.5805' },
    { name: 'Quetta', coords: '30.1798,66.9750' },
    { name: 'Sialkot', coords: '32.4945,74.5229' },
    { name: 'Hyderabad', coords: '25.3960,68.3578' }
  ];

  cuisinePreferences: string[] = []
  places: Place[] = []
  loading = false

  searchError: string = ""
  searchLoading = false
  currentUser: User | null = null


  constructor(
    private restaurant: RestaurantService,
    private authService: AuthService,
    private searchValidationService: SearchValidationService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user
    })

    this.authService.loadPreferences()
      .subscribe({
        next: (preferences) => {
          this.cuisinePreferences = preferences.data.cuisine
          this.loadRecommendations()
        },
        error: (error) => {
          console.error("Error loading preferences", error)
          this.loading = false
        },
      })
  }


  loadRecommendations(): void {
    if (this.cuisinePreferences.length === 0) {
      return;
    }

    this.loading = true;

    const observables = this.cuisinePreferences.map(cuisine =>
      this.restaurant.getPlaces(`${cuisine} food`, null).pipe(
        map(places => {
          return places.map(place => ({
            ...place,
            cuisine: cuisine
          }));
        })
      )
    );

    forkJoin(observables).subscribe({
      next: (results) => {
        const allPlaces = results.flat();
        this.places = this.shuffleArray(allPlaces);
      },
      error: (error) => {
        console.error("Error loading recommendations", error);
      },
      complete: () => {
        this.loading = false;
        console.log(this.loading)
      }
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  search(): void {
    if (this.searchQuery.trim()) {
      const queryParams: any = {
        search: this.searchQuery
      };


      this.searchLoading = true;
      this.searchValidationService.validateSearch({ text: queryParams })
        .subscribe({
          next: (response) => {
            if (response.response === "not_food") {
              this.searchError = "Food not recognised, Check your spellings or try a different dish"
            }
            else {
              if (this.selectedCity) {
                queryParams.location = this.selectedCity.coords;
              }

              this.router.navigate(['/restaurants'], { queryParams });
            }
          },
          error: (error) => {
            console.log(error)
            this.searchLoading = false;
          },
          complete: () => {
            this.searchLoading = false;
          }
        })
    }
  }

}
