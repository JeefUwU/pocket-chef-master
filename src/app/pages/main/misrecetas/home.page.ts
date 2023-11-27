import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  sampleArr=[];
  resultArr=[];
  constructor(public fs: AngularFirestore){

  }

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

search(event) {
  let searchKey: string = event.target.value;
  let firstLetter = searchKey.toUpperCase();

  if (searchKey.length == 0) {
    this.sampleArr = [];
    this.resultArr = [];
    return; // No hay necesidad de continuar si la búsqueda es vacía
  }

  this.resultArr = []; // Limpiar los resultados anteriores

  this.fs.collection('recipes', ref => ref.where('searchIndex', '==', firstLetter)).snapshotChanges()
    .subscribe(data => {
      this.sampleArr = []; // Limpiar el array antes de agregar nuevos resultados

      data.forEach(childData => {
        this.sampleArr.push(childData.payload.doc.data());
        let name: string = childData.payload.doc.data()['name'];
        if (name.toUpperCase().startsWith(searchKey.toUpperCase())) {
          this.resultArr.push(childData.payload.doc.data());
        }
      });
    });
}
}
