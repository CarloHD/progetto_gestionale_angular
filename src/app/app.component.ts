import { Component, OnDestroy, OnInit } from '@angular/core';
import { Negozio } from './shared/negozio.model';
import { AuthService } from './service/auth.service';
import { StoreNegoziService } from './service/store-negozi.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'Gestionale';

  listaNegozi: Negozio[];
  listaNegoziSub: Subscription;

  username: string;
  usernameSub: Subscription;

  isLogged: boolean;

  constructor(
    private storeNegoziService: StoreNegoziService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usernameSub = this.authService.usernameEmitter.subscribe(
      (username) => {
        this.username = username;
        this.isLogged = !!username;
      }
    );

    this.listaNegoziSub = this.storeNegoziService.listaNegoziEmit.subscribe(
      (arrayNegozi) => (this.listaNegozi = arrayNegozi)
    );
  }

  logout() {
    this.authService.onLogout();
  }

  ngOnDestroy(): void {
    this.listaNegoziSub.unsubscribe();

    this.usernameSub.unsubscribe();
  }
}
