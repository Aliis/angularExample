import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private rsService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.rsService.getRecipes()
    this.http.put('https://ng-course-2818d.firebaseio.com/recipes.json', recipes)
    .subscribe(response => {
      console.log(response)
    })
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-course-2818d.firebaseio.com/recipes.json'
    )
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
        })
      }),
      tap(response => {
        this.rsService.setRecipes(response)
      })
    )
  }
}
