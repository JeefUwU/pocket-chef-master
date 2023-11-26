import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipesService } from 'src/app/servicios/recipes.service';


interface Recipes {
  idCategory: number;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {

  categories: any;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe(data => {
      this.categories = data['categories']
    })
  }
}
