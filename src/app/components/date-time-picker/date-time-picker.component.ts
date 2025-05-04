import { Component, OnInit } from '@angular/core';
import { IonDatetime } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  standalone: true,
  imports: [IonicModule],
 
})
export class DateTimePickerModalComponent  implements OnInit {
 
  constructor() {}
  ngOnInit(): void {
  }


}
