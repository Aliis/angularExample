import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})

export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true
  isLoading = false
  error: string = null

  private storeSub: Subscription

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      this.error = authState.authError
      if (this.error) {
        this.error = 'An error occurred'
      }
    })
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin
  }

  onSubmit(form: NgForm) {
    this.isLoading = true
    if(!form.valid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    if(this.isLogin) {
      // authObservable = this.authService.login(email, password)
      this.store.dispatch(new AuthActions.LoginStart({email, password}))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email, password}))
    }
    form.reset()
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }
}
