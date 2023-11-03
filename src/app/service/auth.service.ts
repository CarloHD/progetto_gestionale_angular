import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { BehaviorSubject, Subject } from 'rxjs'
import { User } from '../shared/user.model'
import { resAuth, resErrorAuth } from '../shared/firebase.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username: string = null
  usernameEmitter = new BehaviorSubject<string>(this.username)
  sessionTimer: any

  errorEventEmit = new Subject<string>()

  constructor (private http: HttpClient, private router: Router) {
    const restoredUsername = localStorage.getItem('email')

    if (restoredUsername) {
      this.username = restoredUsername
      this.autoLogOut()
    }
    this.usernameEmitter.next(this.username)
  }

  handleSignIn (res: resAuth) {
    localStorage.setItem('email', res.email)
    localStorage.setItem('userToken', res.idToken)
    localStorage.setItem(
      'expire',

      JSON.stringify(Date.now() + +res.expiresIn * 1000)
    )

    this.username = res.email
    this.usernameEmitter.next(this.username)
    this.router.navigate([''])
    this.autoLogOut()
  }

  autoLogOut () {
    const expire = localStorage.getItem('expire')
    const expireDate = new Date(+expire).getTime()
    const dateNow = new Date().getTime()

    if (dateNow > expireDate) {
      this.onLogout()
    } else {
      const msBeforeExpire = expireDate - dateNow

      this.sessionTimer = setTimeout(() => {
        this.onLogout()
      }, msBeforeExpire)
    }
  }

  onLogout () {
    console.log('Sessione terminata')
    clearTimeout(this.sessionTimer)
    this.username = null
    this.usernameEmitter.next(this.username)

    this.router.navigate([''])

    localStorage.removeItem('email')
    localStorage.removeItem('userToken')
    localStorage.removeItem('expire')
  }

  onLogin (userData: User) {
    this.http
      .post<resAuth>('login', { ...userData, returnSecureToken: true })
      .subscribe({
        error: (res: { error: resErrorAuth }) => {
          this.errorEventEmit.next(res.error.error.message)
        },
        next: res => {
          this.handleSignIn(res)
        }
      })
  }

  onRegister (userData: User) {
    this.http
      .post<resAuth>('register', {
        ...userData,
        returnSecureToken: true
      })
      .subscribe({
        error: (res: { error: resErrorAuth }) => {
          this.errorEventEmit.next(res.error.error.message)
        },
        next: res => {
          this.handleSignIn(res)
        }
      })
  }
}

export const authorizedGuard: CanActivateFn = () => {
  const authService = inject(AuthService)

  const router = inject(Router)

  if (!authService.username) {
    return router.navigate([''])
  }
}
