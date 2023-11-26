import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from 'src/app/modelos/recipes.model';
import { User } from 'src/app/modelos/user.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-update-recipes',
  templateUrl: './add-update-recipes.component.html',
  styleUrls: ['./add-update-recipes.component.scss'],
})
export class AddUpdateRecipesComponent implements OnInit {

  @Input() recipe: Recipe;

  form = new FormGroup({
    id: new FormControl(uuidv4()),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    ingredientes: new FormControl('', [Validators.required, Validators.minLength(4)]),
    preparacion: new FormControl('', [Validators.required, Validators.minLength(4)]),

  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.recipe) this.form.setValue(this.recipe);
  }

  // ==========Tomar o seleccionar foto============
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de la receta')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.recipe) this.updateRecipe();
      else this.createRecipe()
    }
  }

  // =============Crear receta===========
  
  
  async createRecipe() {

    let path = `users/${this.user.uid}/recipes`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // ==========Subir la imagen y obtener la url============ 

    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${this.form.value.id}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ succes: true });

      this.utilsSvc.presentToast({
        message: 'Receta creada exitosamente',
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


  // =============Actualizar receta===========
  async updateRecipe() {


    let path = `users/${this.user.uid}/recipes/${this.recipe.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // ==========Si cambio la imagen, subir la nueva y obtener la url============ 

    if (this.form.value.image !== this.recipe.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.recipe.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ succes: true });

      this.utilsSvc.presentToast({
        message: 'Receta actualizada exitosamente',
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