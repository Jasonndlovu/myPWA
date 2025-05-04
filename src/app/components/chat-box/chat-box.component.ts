import { Component, Input, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonText, IonNote, IonIcon } from '@ionic/angular/standalone';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  imports: [IonItem, IonLabel,IonText,IonNote,IonIcon],
})
export class ChatBoxComponent implements OnInit {

  @Input() chat: any;
  @Input() current_user_id: any;

  constructor() { }

  ngOnInit() {}

}
