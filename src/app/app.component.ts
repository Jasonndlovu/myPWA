import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {

    user: User | null = null; // Store the logged-in user
    
    public appPages = [
      { title: 'Dashboard', url: '/dashboard', icon: 'trash' },
      { title: 'Available Jobs', url: '/available-jobs' , icon: 'paper-plane'},
      { title: 'Messages', url: '/messenger', icon: 'mail' },
      { title: 'Service History', url: '/service-history' , icon: 'archive'},
      { title: 'Upcoming jobs', url: '/upcoming-jobs' , icon: 'warning'},
    ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; 
  
  constructor(private router: Router,private auth: Auth) {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }
  
  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user; // Assign the logged-in user details
        console.log("User Details:", this.user);
      } else {
        console.log("No user is logged in.");
      }
    });
  }

  navigateSettings() {
    this.router.navigate(['/profile']);
  }
}