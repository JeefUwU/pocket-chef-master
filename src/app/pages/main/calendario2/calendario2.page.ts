import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { format, parseISO } from 'date-fns';
import { CalendarComponent, CalendarMode } from 'ionic6-calendar';
import { CalEvent, EventsService } from 'src/app/CalendarioEvent/events.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendario2.page.html',
  styleUrls: ['./calendario2.page.scss'],
})
export class Calendario2Page implements OnInit{


  calendar ={
    mode: 'week' as CalendarMode,
    currentDate: new Date(),
  };

  viewTitle = '';
  eventSource: any[] = [];

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild('modal') modal: IonModal;
  presentingElement: any = null;

  newEvent: any = {
    tittle:'',
    allDay: false,
    startTime: null,
    endTime: null,
  }

  showStart = false;
  showEnd = false;
  formattedStart = '';
  formattedEnd = '';

  constructor(private ionRouterOutlet: IonRouterOutlet, private eventsService: EventsService) { 
    this.presentingElement= ionRouterOutlet.nativeEl;
  }

  async ngOnInit(){
    this.eventSource = await this.eventsService.getData();
  }

  setToday() {
    this.myCal.currentDate = new Date();
  }

  calendarBack(){
    this.myCal.slidePrev();
  }

  calendarNext(){
    this.myCal.slideNext();
  }


  onTimeSelected( ev: { selectedTime: Date; events: any[] }) {
    this.formattedStart = format(ev.selectedTime, 'HH:mm, dd MMMM yyyy');
    this.newEvent.startTime = format(ev.selectedTime, "dd/MMMM/yyyy' 'HH:mm")


    const later = ev.selectedTime.setHours(ev.selectedTime.getHours() + 1);
    this.formattedEnd = format(later, 'HH:mm, d MMMM yyyy');
    this.newEvent.endTime =format(later, "dd/MMMM/yyyy' 'HH:mm");

    if(this.calendar.mode === 'day' || this.calendar.mode === 'week') {
      this.modal.present();
    }
  }

  startChanged(value: any){
    this.newEvent.startTime = value;
    this.formattedStart = format(parseISO(value), 'HH:mm, dd MMMM yyyy');

  }

  endChanged(value: any){
    this.newEvent.endTime = value;
    this.formattedEnd = format(parseISO(value), 'HH:mm, dd MMMM yyyy');
  }

  scheduleEvent(){
    const toAdd: CalEvent= {
      title:this.newEvent.title,
      startTime: new Date(this.newEvent.startTime),
      endTime: new Date(this.newEvent.endTime),
      allDay: this.newEvent.allDay,
    };
    console.log(toAdd);


    this.eventSource.push(toAdd);
    this.myCal.loadEvents();
    this.eventsService.addData(toAdd);

    this.newEvent ={
      title:'',
      allDay: false,
      startTime: null,
      endTime: null,
   
    }
    this.modal.dismiss();
  }

}