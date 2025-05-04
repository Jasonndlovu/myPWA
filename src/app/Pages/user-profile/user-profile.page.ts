import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './../../../services/auth.service'; // Make sure to import AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class UserProfilePage implements OnInit {
  userData: any = {}; // Holds user data

  constructor(
    private firestore: Firestore, 
    private auth: Auth, 
    private authService: AuthService,  // Inject AuthService
    private router: Router // Inject Router for navigation
  ) {}

  async ngOnInit() {
    await this.getUserData();
  }

  async getUserData() {
    try {
      const user = this.auth.currentUser; // Get current logged-in user
      if (!user) return; // Exit if no user is logged in

      const userRef = doc(this.firestore, `users/${user.uid}`); // Firestore path
      const userSnap = await getDoc(userRef); // Fetch user data

      if (userSnap.exists()) {
        const userData = userSnap.data(); // Get document data

        // 🔥 Merge userProfile fields into main object
        this.userData = {
          displayName: userData['displayName'] || '',
          email: userData['email'] || '',
          photoURL: userData['photoURL'] || '',
          ...userData['userProfile'] || {} // Merging userProfile fields
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async logout() {
    await this.authService.logout();  // Call logout method from AuthService
    this.router.navigate(['/login']);  // Redirect to the login page
  }
}
