import { Component, OnDestroy, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { AuthService } from '../service/auth.service'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { User } from '../shared/user.model'

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnDestroy {
  @ViewChild('authForm') formObj: NgForm

  newUserMode = false

  authErrorSub: Subscription
  authErrorMsg: string

  constructor (private authService: AuthService, private router: Router) {
    if (this.authService.username) {
      this.router.navigate([''])
    }

    this.authErrorSub = authService.errorEventEmit.subscribe(errorMessage => {
      this.authErrorMsg = errorMessage
    })
  }

  switchMode (event: MouseEvent) {
    const target = event.target as HTMLElement

    if (!target.parentElement.classList.contains('active')) {
      this.authErrorMsg = null
      this.newUserMode = !this.newUserMode
    }
  }

  submitForm () {
    if (this.formObj.form.invalid) {
      return
    }

    this.authErrorMsg = null

    const formData: User = {
      email: this.formObj.value.email,
      password: this.formObj.value.password
    }

    if (this.newUserMode) {
      this.authService.onRegister(formData)
    } else {
      this.authService.onLogin(formData)
    }
  }

  ngOnDestroy (): void {
    this.authErrorSub.unsubscribe()
  }
}
