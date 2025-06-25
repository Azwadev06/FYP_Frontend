import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

import { AppComponent } from "./app/app.component"
import { HeaderComponent } from "./app/components/header/header.component"
import { FooterComponent } from "./app/components/footer/footer.component"
import { HomeComponent } from "./app/pages/home/home.component"
import { LoginComponent } from "./app/auth/login/login.component"
import { RegisterComponent } from "./app/auth/register/register.component"
import { RestaurantsComponent } from "./app/pages/restaurants/restaurants.component"
import { RestaurantCardComponent } from "./app/components/restaurant-card/restaurant-card.component"
import { RestaurantDetailComponent } from "./app/pages/restaurant-detail/restaurant-detail.component"
import { ReviewFormComponent } from "./app/components/review-form/review-form.component"
import { UserProfileComponent } from "./app/pages/user-profile/user-profile.component"
import { RecommendationsComponent } from "./app/pages/recommendations/recommendations.component"
import { ReviewListComponent } from "./app/components/review-list/review-list.component"
import { StarRatingComponent } from "./app/components/star-rating/star-rating.component"

import { routes } from "./app/app.routes"

NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RestaurantsComponent,
    RestaurantCardComponent,
    ReviewFormComponent,
    RestaurantDetailComponent,
    UserProfileComponent,
    RecommendationsComponent,
    ReviewListComponent,
    StarRatingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
