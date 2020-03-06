import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false
  private userSub: Subscription

  constructor(private dsService: DataStorageService, private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.userSub = this.store
    .select('auth')
    .pipe(map(authState => {
        return authState.user
  })).subscribe(user => {
      this.isAuthenticated = !!user
    })
  }

  onSaveData() {
    this.dsService.storeRecipes()
  }

  onFetchData() {
    this.dsService.fetchRecipes().subscribe()
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout())
    this.router.navigate(['/auth'])
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
 }
