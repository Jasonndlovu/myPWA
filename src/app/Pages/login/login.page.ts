import { Component } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonTextarea, IonCheckbox, IonIcon, IonInput } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonIcon, IonTextarea, IonButton, IonContent, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';
  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {}

  async loginGoogle() {
    await this.authService.loginWithGoogle();
    
    this.router.navigate(['/dashboard']);
  }

  async loginApple() {
    await this.authService.loginWithApple();
    
    this.router.navigate(['/dashboard']);
  }

  async login() {
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }


  async forgotPassword() {
    if (!this.email) {
      this.showAlert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.showAlert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      this.showAlert('Error', 'Failed to send password reset email. Please check your email address and try again.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
