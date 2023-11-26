import { Component } from '@angular/core';
import { EventsService } from './CalendarioEvent/events.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private eventsService: EventsService) {
    this.eventsService.init();
  }
}