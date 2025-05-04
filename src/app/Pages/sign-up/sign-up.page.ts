import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle,IonTextarea , IonToolbar, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [ IonIcon, IonTextarea ,ReactiveFormsModule ,IonButton, IonContent, CommonModule, FormsModule]
})
export class SignUpPage implements OnInit {
  step: number = 1; // Controls step navigation
  name: string = '';
  surname: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  termsAccepted: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

  nextStep() {
    if (this.name && this.surname && this.phone) {
      this.step = 2; // Move to step 2
    } else {
      alert('Please fill in all fields before proceeding.');
    }
  }

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (this.termsAccepted) {
      alert('You must accept the terms and conditions.');
      return;
    }
  
    try {
      await this.authService.registerWithEmail(this.email, this.password, {
        name: this.name,
        surname: this.surname,
        phone: this.phone
      });
  
      alert('Registration successful!');
      this.router.navigate(['/login']); // Redirect to login page
    } catch (error) {
      alert('Registration failed: ' + error);
    }
  }
  

  login() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
