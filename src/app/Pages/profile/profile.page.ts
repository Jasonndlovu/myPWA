import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service'; // Import your user service
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonIcon,
    IonButton,
    IonAvatar,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton
  ]
})
export class ProfilePage implements OnInit {
  user: any = null; // will contain merged auth + firestore data
  private authUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.authService.getCurrentUser().subscribe(authUser => {
      this.authUser = authUser;

      if (authUser?.uid) {
        this.userService.getUserById(authUser.uid).subscribe(firestoreUser => {
          // Merge Firestore data with Auth basic data
          this.user = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            ...firestoreUser
          };
        });
      }
    });
  }

  navigateSettings() {
    this.router.navigate(['/profile-settings']);
  }

  navigateProperty() {
    this.router.navigate(['/add-user-property']);
  }
}
