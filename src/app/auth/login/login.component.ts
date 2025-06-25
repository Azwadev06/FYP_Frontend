import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  loading = false
  submitted = false
  error = ""
  returnUrl = "/"

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"])
      return
    }

    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)],],
      password: ["", Validators.required],
    })

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"
  }

  get f() {
    return this.loginForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.loginForm.invalid) {
      return
    }

    this.loading = true


    const user = {
      username: this.f["username"].value,
      password: this.f["password"].value,
    }

    this.authService.login(user).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl])
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
