// Admin Service for API calls
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  joinDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'your-api-url'; // Replace with your actual API URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Authentication
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthToken(token: string): void {
    localStorage.setItem('adminToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  // Statistics
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }
}