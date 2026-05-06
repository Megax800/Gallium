import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
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
    console.log(this.signupForm.value);
  }
}
