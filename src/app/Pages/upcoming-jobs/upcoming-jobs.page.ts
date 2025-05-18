import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard ,IonCardHeader, IonCardContent, IonCardTitle, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-jobs',
  templateUrl: './upcoming-jobs.page.html',
  styleUrls: ['./upcoming-jobs.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, GlobalBackgroundComponent,IonButton,IonCard,IonCardTitle ,IonCardHeader, IonCardContent],
})
export class UpcomingJobsPage implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  jobs: any[] = [];
  loading = true;
  role: string | null = null;
  userId: string | null = null;

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn("User not logged in.");
      this.loading = false;
      return;
    }

    
    this.userId = user.uid;

    // Get user document to fetch their role
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    console.log(userSnapshot);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      this.role = userData['role'];

      let q;
      console.log('User Id : ' + user.uid)
      console.log('User role : ' + this.role)
      if (this.role === 'service-provider') {
        // Service providers see jobs they’ve accepted
        q = query(collection(this.firestore, 'service-requests'), 
        where('cleanerID', '==', user.uid),
       // where('serviceStatus', 'not-in', ['Completed', 'Cancelled']),
       where('serviceStatus', 'in', ['Pending', 'Accepted', 'Ongoing']) // Add more if needed
      );
      } else {
        // User sees jobs they’ve requested
        q = query(collection(this.firestore, 'service-requests'), where('userId', '==', user.uid),
        //where('serviceStatus', 'not-in', ['Completed', 'Cancelled']));
        where('serviceStatus', 'in', ['Pending', 'Accepted', 'Ongoing'])); // Add more if needed
      }

      const snapshot = await getDocs(q);
      this.jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.warn('User data not found.');
    }

    this.loading = false;
  }

  goToJob(job: any) {
    const state = {
      job,
      editMode: true,
      role: this.role // cleaner or user
    };

    this.router.navigateByUrl('/view-service', { state });
  }
}
