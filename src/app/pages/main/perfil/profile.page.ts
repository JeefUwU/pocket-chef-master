import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from 'src/app/modelos/recipes.model';
import { User } from 'src/app/modelos/user.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }


  user() : User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage(){

    let user = this.user();
    

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let path = `users/${user.uid}`

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath,dataUrl);
    
    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
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
