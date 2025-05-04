import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,IonMenuButton, IonToolbar, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonLabel, IonList, IonItem, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-accept-job',
  templateUrl: './accept-job.page.html',
  styleUrls: ['./accept-job.page.scss'],
  standalone: true,
  imports: [IonButtons, IonMenuButton,IonItem, IonList, IonLabel, IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AcceptJobPage implements OnInit {
  step = 1;
  constructor() { }

  ngOnInit() {
  }

  nextStep(){
    this.step += 1;
  }

  register(){}

}
