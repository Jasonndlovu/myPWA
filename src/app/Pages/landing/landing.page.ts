import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LandingPage {
    user: User | null = null; // Store the logged-in user's details
  constructor(private auth: Auth, private router: Router) {}

  selectRole(role: 'user' | 'service-provider') {
    localStorage.setItem('userRole', role); // Save role temporarily
    this.router.navigate(['/onboarding']); // Redirect to login page
  }

  ngOnInit() {
    // move this to the splash screen so that it checks first if there is a user or not
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        console.log("we have found the user : " + user);
        this.user = user; // Assign the logged-in user details
        this.router.navigate(['/dashboard']);
      } else {
        console.log("No user is logged in.");
      }
    });
  }


}
