import { Routes } from '@angular/router';
import { AuthGuard } from './guards/AuthGuards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "restaurants", component: RestaurantsComponent },
  { path: "restaurants/:placeId", component: RestaurantDetailComponent },
  { path: "profile", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: "recommendations", component: RecommendationsComponent, canActivate: [AuthGuard] },

  { path: "**", redirectTo: "" },
]
