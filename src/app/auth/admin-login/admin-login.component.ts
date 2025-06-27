import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin/admin.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  imports: [ReactiveFormsModule, NgIf]
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/) // Only alphanumeric and underscore
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });
  }

  ngOnInit(): void {
    // Check if admin is already logged in
    this.adminService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  // Getter methods for easy access to form controls
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Get specific error messages for username
  getUsernameErrorMessage(): string {
    if (this.username?.hasError('required')) {
      return 'Username is required';
    }
    if (this.username?.hasError('minlength')) {
      return 'Username must be at least 5 characters long';
    }
    if (this.username?.hasError('maxlength')) {
      return 'Username cannot exceed 20 characters';
    }
    if (this.username?.hasError('pattern')) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  }

  // Get specific error messages for password
  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Password is required';
    }
    if (this.password?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (this.password?.hasError('maxlength')) {
      return 'Password cannot exceed 50 characters';
    }
    return '';
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handle form submission
  onLogin(): void {
    // Clear previous error message
    this.errorMessage = '';

    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    // Check if form is valid
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fix the errors above';
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Get form values
    const { username, password } = this.loginForm.value;

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Additional validation after trimming
    if (!trimmedUsername || !trimmedPassword) {
      this.errorMessage = 'Username and password cannot be empty';
      this.isLoading = false;
      return;
    }

    this.adminService.login(trimmedUsername, trimmedPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        if(response.statusCode){
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Handle different types of errors
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. Admin privileges required.';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
        }

        console.error('Login error:', error);
      }
    });
  }

  // Handle input field focus (clear errors)
  onFieldFocus(): void {
    this.errorMessage = '';
  }

  // Handle Enter key press
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.loginForm.valid) {
      this.onLogin();
    }
  }

  // Clear form
  clearForm(): void {
    this.loginForm.reset();
    this.errorMessage = '';
  }
}