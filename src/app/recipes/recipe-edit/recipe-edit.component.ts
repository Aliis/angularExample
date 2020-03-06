import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number
  editMode: boolean = false
  recipe: Recipe
  recipeForm: FormGroup

  constructor(private route: ActivatedRoute,
    private rsService: RecipeService,
    private slservice: ShoppingListService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id']
        this.editMode = params['id'] != null
        this.initForm()
      })
  }

  onSubmit() {
    if(this.editMode) {
      this.rsService.updateRecipe(this.id, this.recipeForm.value)
    } else {
      this.rsService.addRecipe(this.recipeForm.value)
    }
    this.onCancel()
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(),
        'amount': new FormControl(null,  Validators.pattern(/^[1-9]+[0-9]*$/))
      })
    )
  }

  onDelete() {
    this.rsService.deleteRecipe(this.id)
    this.router.navigate(['/recipes'])
  }

  onCancel() {
    this.editMode = false
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }

  private initForm() {
    let recipeName = ''
    let recipeImg = ''
    let recipeDescription = ''
    let recipeIngredients = new FormArray([])

    if (this.editMode) {
      this.editMode = true
      const recipe = this.rsService.getRecipe(this.id)
      const ingredient = this.slservice.getIngredient(this.id)
      recipeName = recipe.name
      recipeImg = recipe.imagePath
      recipeDescription = recipe.description
      if(recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name),
              'amount': new FormControl(ingredient.amount, Validators.pattern(/^[1-9]+[0-9]*$/))
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImg),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients
    })
  }
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}
