import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})

export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>
  private subject: Subscription

  constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
  }

  onEditIngredient(i: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(i))
  }
}