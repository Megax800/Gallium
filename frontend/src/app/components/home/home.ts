import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserLoginService } from '../../services/userLoginService';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  userLoginService = inject(UserLoginService);
}
