import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../services/user';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  userService = inject(User);
  emailSent = signal(false);
  signupForm = new FormGroup({
    nickname: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
    ]),
  });
  get nickname() {
    return this.signupForm.controls.nickname;
  }
  get name() {
    return this.signupForm.controls.name;
  }
  get surname() {
    return this.signupForm.controls.surname;
  }
  get email() {
    return this.signupForm.controls.email;
  }
  get password() {
    return this.signupForm.controls.password;
  }
  onSubmit() {
    this.userService
      .signup(
        this.signupForm.value.nickname!,
        this.signupForm.value.name!,
        this.signupForm.value.surname!,
        this.signupForm.value.email!,
        this.signupForm.value.password!,
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe(() => {
        this.emailSent.set(true);
      });
  }
}
