import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm
  private subject: Subscription
  editMode = false
  editedIngredient: Ingredient
 

  constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subject = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngerdientIndex > -1) {
        this.editMode = true
        this.editedIngredient = stateData.editedIngerdient
        this.slForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        })
      } else {
        this.editMode = false
      }
    })
  }

  onSubmit(form: NgForm){
    const newIngerdient = new Ingredient(form.value.name, form.value.amount)
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngerdient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngerdient))
    }
    this.editMode = false
    form.reset()
  }

  onClear() {
    this.slForm.reset()
    this.editMode = false
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear()
  }

  ngOnDestroy() {
    this.subject.unsubscribe()
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
}

