import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';

export interface State {
    ingredients: Ingredient[]
    editedIngerdient: Ingredient
    editedIngerdientIndex: number
}

const initalState: State = {
    ingredients: [
        new Ingredient('Bananas', 10),
        new Ingredient('Onions', 5)
      ],
      editedIngerdient: null,
      editedIngerdientIndex: -1
}

export function shoppingListReducer(
    state: State = initalState, 
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients:[...state.ingredients, action.payload]
        }
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[...state.ingredients, ...action.payload]
        }
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngerdientIndex]
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            }
            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editedIngerdientIndex] = updatedIngredient

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngerdient: null,
                editedIngerdientIndex: -1
        }
        case ShoppingListActions.DELETE_INGREDIENT:
        return {
            ...state,
            ingredients: state.ingredients.filter((ig, igIndex) => {
                return igIndex !== state.editedIngerdientIndex
            })
        }
        case ShoppingListActions.START_EDIT:
        return {
            ...state,
            editedIngerdientIndex: action.payload,
            editedIngerdient: {...state.ingredients[action.payload]}
        }
        case ShoppingListActions.STOP_EDIT:
        return {
            ...state,
            editedIngerdient: null,
            editedIngerdientIndex: -1
        }
        default: 
            return state
    }
}