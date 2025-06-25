import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { tap } from "rxjs/operators"
import { ApiResponse, LoginData, LogoutData, User } from "../types/types"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`/user/signup`, user)
  }

  login(user: { username: string, password: string }): Observable<LoginData> {
    return this.http.post<LoginData>(`/user/login`, user)
      .pipe(
        tap(data => {

          const storeData = <User>{
            "firstName": data.data.user.firstName,
            "lastName": data.data.user.lastName,
            "username": data.data.user.username,
            "email": data.data.user.email,
            "_id": data.data.user._id
          }

          localStorage.setItem('user', JSON.stringify(storeData));
          localStorage.setItem('token', data.data.accessToken);
          this.currentUserSubject.next(data.data.user);
        })
      );
  }

  logout(): Observable<LogoutData> {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.currentUserSubject.next(null)
    return this.http.post<LogoutData>(`/user/logout`, {})
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value
  }

  isLoggedIn(): boolean {
    return !!this.currentUser
  }

  updateUserProfile(user: { email: string, firstName: string, lastName: string }): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`/user/update`, user)
      .pipe(
        tap(updatedUser => {
          const storageData = <User>{
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "username": this.currentUser?.username,
          }
          localStorage.setItem('user', JSON.stringify(storageData));
          this.currentUserSubject.next(storageData);
        })
      );
  }

  updatePreferences(cuisinePreferences: string[]): Observable<ApiResponse<{}>> {
    return this.http.post<ApiResponse<{}>>(`/preference/save`, { cuisinePreferences })
  }


  loadPreferences(): Observable<ApiResponse<{ cuisine: string[] }>> {
    return this.http.get<ApiResponse<{ cuisine: string[] }>>(`/preference/`)
  }
}
