import { Component, OnInit } from '@angular/core';

import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  isLogged: boolean;
  isLoggedSub: Subscription;

  constructor(private authService: AuthService) {
    this.isLoggedSub = this.authService.usernameEmitter.subscribe(
      (username) => (this.isLogged = !!username)
    );
  }
}
