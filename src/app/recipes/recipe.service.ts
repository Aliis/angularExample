import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>()

  recipes: Recipe[] = []

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipesChanged.next(this.recipes.slice())
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  getRecipes() {
    return this.recipes.slice()
   }

   addRecipe(recipe: Recipe) {
     this.recipes.push(recipe)
     this.recipesChanged.next(this.recipes.slice())
   }

   updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice())
  }
}
