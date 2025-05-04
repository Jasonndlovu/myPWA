import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonContent, IonButton,IonMenuButton, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
  standalone: true, // Make the component standalone
  imports: [IonBackButton, IonButtons, 
    IonContent,
    ReactiveFormsModule, // Use this instead of FormsModule
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonLabel,
    IonMenuButton,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
  ],
})
export class ProfileSettingPage {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      expertise: ['', Validators.required],
      address: ['', Validators.required],
      idNumber: ['', Validators.required],
    });
  }

  next() {
    if (this.profileForm.valid) {
      this.navCtrl.navigateForward('/payment');
    }
  }
}
