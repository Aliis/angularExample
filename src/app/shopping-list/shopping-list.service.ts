import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>()
  startedEditing = new Subject<number>()
  private ingredients: Ingredient[] = [
    new Ingredient('Bananas', 10),
    new Ingredient('Onions', 5)
  ]

  constructor() {}

  getIngredient(index: number) {
    return this.ingredients[index]
  }

  getIngredients() {
    return this.ingredients.slice()
  }

  addIngredient(ingridient: Ingredient) {
    this.ingredients.push(ingridient)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  addIngedients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1)
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
