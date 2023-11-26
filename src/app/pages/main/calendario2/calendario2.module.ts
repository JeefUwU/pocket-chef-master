import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Calendario2PageRoutingModule } from './calendario2-routing.module';

import { Calendario2Page } from './calendario2.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgCalendarModule } from 'ionic6-calendar';

import{registerLocaleData} from '@angular/common';
import localeCL from '@angular/common/locales/es-CL';
registerLocaleData(localeCL, 'es-CL');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Calendario2PageRoutingModule,
    SharedModule,
    NgCalendarModule
  ],
  declarations: [Calendario2Page],
  providers: [{provide: LOCALE_ID, useValue:'es-CL'}]
})
export class Calendario2PageModule {}
