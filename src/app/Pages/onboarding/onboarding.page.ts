import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, CommonModule, FormsModule,IonButton]
})
export class OnboardingPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateRegistration() {
    this.router.navigate(['/sign-up']);
  }

}
