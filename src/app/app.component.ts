import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonLabel, IonRouterOutlet, IonRouterLink, IonIcon } from '@ionic/angular/standalone';
import { User } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './../services/auth.service'; // Make sure to import AuthService
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';
import { Observable, of, switchMap } from 'rxjs';
import { ChatService } from 'src/services/chat.service';
import { CommonModule } from '@angular/common'; 
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule,IonIcon, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {

    user: User | null = null; // Store the logged-in user
    userRole: string | null = null;


    public appPages = [
      { title: 'Dashboard', url: '/dashboard', icon: 'trash' },
      { title: 'Available Jobs', url: '/available-jobs' , icon: 'paper-plane'},
      { title: 'Messages', url: '/messenger', icon: 'mail' },
      { title: 'Service History', url: '/service-history' , icon: 'archive'},
      { title: 'Upcoming jobs', url: '/upcoming-jobs' , icon: 'warning'},
    ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; 
  unreadCount$: Observable<number> = of(0);
  numberOfMessages: number = 2;
  constructor(private router: Router,private auth: Auth,private userService: UserService,  private authService: AuthService,private chatService: ChatService) {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }
  
ngOnInit() {
this.auth.onAuthStateChanged(user => {
    if (user) {
      this.user = user; // Assign the logged-in user details

      this.fetchUserDetails().then(() => {
        console.log("Full user details:", this.user);
      });
    } else {
      console.log("No user is logged in.");
    }
  });
}



  closeMenu() {
  document.querySelector('ion-menu')?.close();
}

  async logout() {
    await this.authService.logout();  // Call logout method from AuthService
    this.router.navigate(['/login']);  // Redirect to the login page
  }

  navigateSettings() {
    this.router.navigate(['/profile']);
  }

// Update fetchUserDetails to return a Promise for easier chaining
async fetchUserDetails() {
  return new Promise<void>((resolve) => {
    this.authService.getCurrentUser().subscribe(authUser => {
      this.user = authUser;
      console.log('Auth User:', authUser);
      if (authUser?.uid) {
        this.userService.getUserById(authUser.uid).subscribe(firestoreUser => {
          console.log('Firestore User:', firestoreUser);
          this.user = {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            ...firestoreUser
          };
          this.userRole = firestoreUser?.role ?? null; // Set userRole
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}
}