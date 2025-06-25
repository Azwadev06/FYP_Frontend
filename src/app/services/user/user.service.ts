import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { User } from "../../types/user"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "api/users" // Replace with your actual API URL

  // Mock data for development
  private mockUsers: User[] = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      isAdmin: false,
      preferences: {
        cuisinePreferences: ["Italian", "Mexican"],
        dietaryRestrictions: ["Vegetarian"],
        priceRange: "$$",
      },
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      isAdmin: false,
      preferences: {
        cuisinePreferences: ["Japanese", "Thai"],
        dietaryRestrictions: [],
        priceRange: "$$$",
      },
    },
    {
      id: 3,
      username: "admin",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
      preferences: {
        cuisinePreferences: ["French", "Italian"],
        dietaryRestrictions: [],
        priceRange: "$$",
      },
    },
  ]

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Return mock data for development
    return of(
      this.mockUsers.map((user) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      }),
    )

    // Actual implementation:
    // return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    // Return mock data for development
    const user = this.mockUsers.find((u) => u.id === id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return of(userWithoutPassword as User)
    }
    return of({} as User)

    // Actual implementation:
    // return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    // Simulate updating a user
    const index = this.mockUsers.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...user }
      const { password, ...userWithoutPassword } = this.mockUsers[index]
      return of(userWithoutPassword as User)
    }
    return of(user)

    // Actual implementation:
    // return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    // Simulate deleting a user
    const index = this.mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
      this.mockUsers.splice(index, 1)
    }
    return of({ success: true })

    // Actual implementation:
    // return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updatePreferences(userId: number, preferences: any): Observable<User> {
    // Simulate updating user preferences
    const index = this.mockUsers.findIndex((u) => u.id === userId)
    if (index !== -1) {
      this.mockUsers[index].preferences = {
        ...this.mockUsers[index].preferences,
        ...preferences,
      }
      const { password, ...userWithoutPassword } = this.mockUsers[index]
      return of(userWithoutPassword as User)
    }
    return of({} as User)

    // Actual implementation:
    // return this.http.put<User>(`${this.apiUrl}/${userId}/preferences`, preferences);
  }
}
