// Admin Service for API calls
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from "rxjs/operators"
import { Admin, AdminLoginData, ApiResponse } from '../../types/types';
import { User } from '../../types/types';

interface AdminData {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  updateAdminUsername(newUsername: string): void {
    const adminData = this.getAdminData();

    if (!adminData) {
      throw new Error('No admin data found in localStorage');
    }

    const updatedData: Admin = {
      ...adminData,
      username: newUsername.trim()
    };

    localStorage.setItem('admin', JSON.stringify(updatedData));
  }


  getAdminData(): AdminData | null {
    try {
      const adminRaw = localStorage.getItem("admin");
      return adminRaw ? JSON.parse(adminRaw) : null;
    } catch (error) {
      console.error('Failed to parse admin data:', error);
      return null;
    }
  }


  getAdminToken(): String | null {
    try {
      const adminRaw = localStorage.getItem("adminToken");
      return adminRaw
    } catch (error) {
      console.error('Failed to parse admin token:', error);
      return null;
    }
  }


  // Authentication
  login(username: string, password: string): Observable<any> {
    // return this.http.post(`/admin/login`, { username, password })

    return this.http.post<AdminLoginData>(`/admin/login`, { username, password }).pipe(
      tap(data => {
        const storeData = <Admin>{
          "username": data.data.admin.username,
          "_id": data.data.admin._id
        }

        localStorage.setItem('admin', JSON.stringify(storeData));
        localStorage.setItem('adminToken', data.data.accessToken);
        this.isAuthenticatedSubject.next(true);
      })
    );

  }

  logout() {
    localStorage.removeItem('adminToken');
    this.isAuthenticatedSubject.next(false);
    return of(true);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthToken(token: string): void {
    localStorage.setItem('adminToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  // User Management
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`/admin/all-users`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`/admin/add-user`, user);
  }

  updateUser(_id: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`/admin/update-user/${_id}`, user);
  }

  deleteUser(userId: string): Observable<ApiResponse<User>> {
    return this.http.request<ApiResponse<User>>(
      'DELETE',
      `/admin/delete-user`,
      {
        body: { userId }
      }
    );
  }

  updateAdminSettings(data: {
    token: string;
    username: string;
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.patch(`/admin/update`, data);
  }

}