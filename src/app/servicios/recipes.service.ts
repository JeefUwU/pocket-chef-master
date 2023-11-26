import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class RecipesService {

  recipesUrl: string = "https://www.themealdb.com/api/json/v1/1/categories.php";

  constructor(private http: HttpClient) {



  }

  getRecipes() {
    return this.http.get(this.recipesUrl);
  }
}
