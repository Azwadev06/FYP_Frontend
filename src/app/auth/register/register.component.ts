import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup
  loading = false
  submitted = false
  error = ""
  isMenuOpen = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  // Regex for strong password
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return strongPassword.test(value)
    ? null
    : { weakPassword: true };
}



usernameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  // 4-20 chars, starts with letter, only letters, numbers, underscores
  const usernamePattern = /^[A-Za-z][A-Za-z0-9_]{3,19}$/;
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  if (usernamePattern.test(value) && hasLetter && hasNumber) {
  return null;
}
  return { invalidUsername: true };
}

// ✅ Custom Email Validator
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;

    const basicPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!basicPattern.test(value)) {
      return { invalidEmail: "Email format is invalid" };
    }

    const invalidPatterns = [
      { regex: /^[^@]+$/, message: "Missing @ symbol" },
      { regex: /^@.+$/, message: "Missing username" },
      { regex: /^[^@]+@$/, message: "Missing domain" },
      { regex: /^[^@]+@[^@]+\.$/, message: "Missing top-level domain" },
      { regex: /\.\./, message: "Double dots in email" },
      { regex: /^\./, message: "Email can't start with dot" },
      { regex: /\.$/, message: "Email can't end with dot" },
      { regex: /\s/, message: "Email contains spaces" },
      { regex: /[^a-zA-Z0-9._%+-@]/, message: "Email contains invalid characters" }
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.regex.test(value)) {
        return { invalidEmail: pattern.message };
      }
    }

    return null;
  }


;




  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"])
      return
    }
    


    this.registerForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        username: [
      "",
      [
        Validators.required,
        this.usernameValidator
      ]
    ],
     email: 
     ["", 
      [
        Validators.required, 
        Validators.email, 
        this.customEmailValidator
      ]],
         password: [
      "",
      [
        Validators.required,
        this.strongPasswordValidator // Use custom validator
      ]
    ],
      },
    )
  }

  get f() {
    return this.registerForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.registerForm.invalid) {
      return
    }

    this.loading = true

    const user = {
      firstName: this.f["firstName"].value,
      lastName: this.f["lastName"].value,
      username: this.f["username"].value,
      email: this.f["email"].value,
      password: this.f["password"].value,
    }

    this.authService.register(user).subscribe({
      next: () => {
        this.router.navigate(["/login"])
      },
      error: (error) => {
        this.error = error.error.message
        this.loading = false
      },
      complete: () => {
        this.loading = false
      },
    })
  }
}
