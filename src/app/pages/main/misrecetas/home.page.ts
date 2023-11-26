import { Component, OnInit, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { Recipe } from 'src/app/modelos/recipes.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { AddUpdateRecipesComponent } from 'src/app/shared/components/crud-recipes/add-update-recipes.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  recipes: Recipe[] = [];

  ngOnInit() {
    
  }

// ========Cerrar Sesión=======
  // signOut() {
  //   this.firebaseSvc.signOut();

  // }

  user() : User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

ionViewWillEnter() {
  this.getRecipes();
}

// ========confirmar eliminacion de recetas=======
 async confirmDeleteRecipe(recipe: Recipe) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Receta!',
      message: '¿Quieres eliminar esta receta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteRecipe(recipe)
          }
        }
      ]
    });
  
  }



// ========Obtener recetas=======
  getRecipes(){
    let path = `users/${this.user().uid}/recipes`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.recipes = res;
        sub.unsubscribe();
      }
    })
  }



  // ========Agregar o actualizar receta=======
async addUpdateRecipes(recipe?: Recipe){

   let succes = await this.utilsSvc.presentModal({
    component: AddUpdateRecipesComponent,
    cssClass: 'add-update-modal',
    componentProps: {recipe }
   })

   if(succes) this.getRecipes();
  }

  // =============Eliminar receta===========
async deleteRecipe(recipe: Recipe) {

  let path = `users/${this.user().uid}/recipes/${recipe.id}`

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath = await this.firebaseSvc.getFilePath(recipe.image);
  await this.firebaseSvc.deleteFile(imagePath);

  this.firebaseSvc.deleteDocument(path).then(async res => {


    this.recipes = this.recipes.filter(r => r.id !== recipe.id);

    this.utilsSvc.presentToast({
      message: 'Receta eliminada exitosamente',
      duration: 1200,
      color: 'succes',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    })



  }).catch(error => {
    console.log(error);

    this.utilsSvc.presentToast({
      message: error.message,
      duration: 4000,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    })

  }).finally(() => {
    loading.dismiss();
  })
}
}
