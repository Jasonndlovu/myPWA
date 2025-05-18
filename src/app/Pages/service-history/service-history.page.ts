import { Component, OnInit, OnDestroy } from '@angular/core';
import { AvailableJobsService } from 'src/services/available-jobs.service';
import { forkJoin } from 'rxjs';
import { 
  IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, 
  IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonLabel, IonBadge, IonSpinner, IonIcon, IonButton, IonRow, IonCol, IonGrid, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { requestedService } from 'src/services/available-jobs.service';
import { Auth } from '@angular/fire/auth';  // For accessing the logged-in user
import { Firestore, doc, getDoc } from '@angular/fire/firestore';  // For Firestore user document

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.page.html',
  styleUrls: ['./service-history.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, 
    IonGrid, IonCol, IonRow, IonButton, IonIcon, 
    CommonModule,
    IonHeader, IonToolbar, IonTitle, 
    IonContent, IonList, IonItem, 
    IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonLabel, IonBadge, IonSpinner
  ],
  providers: [DatePipe]
})
export class ServiceHistoryPage implements OnInit, OnDestroy {
  serviceHistory: requestedService[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  private subscription!: Subscription;
  private userRole: string | null = null;
  private userId: string | null = null;

  constructor(
    private jobsService: AvailableJobsService,
    private datePipe: DatePipe,
    private auth: Auth,           // Injecting Auth to access current user
    private firestore: Firestore // Injecting Firestore for user document access
  ) {}

  ngOnInit() {
    this.loadServiceHistory();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async loadServiceHistory() {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn("User not logged in.");
      this.isLoading = false;
      return;
    }

    this.userId = user.uid;

    // Get user document to fetch their role
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      this.userRole = userData['role'];
    } else {
      console.warn('User data not found.');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;


    // First fetch completed jobs
this.jobsService.getServiceHistoryByStatus('Completed').subscribe({
  next: (completed) => {
    // Then fetch cancelled jobs
    this.jobsService.getServiceHistoryByStatus('Cancelled').subscribe({
      next: (cancelled) => {
        // Then fetch finalized jobs
        this.jobsService.getServiceHistoryByStatus('finalized').subscribe({
          next: (finalized) => {
            // Combine all three statuses
            let combinedHistory = [...completed, ...cancelled, ...finalized];
            console.log(combinedHistory);
            
            // Filter based on user role
            if (this.userRole === 'user') {
              combinedHistory = combinedHistory.filter(job => job.userId === this.userId);
            } else if (this.userRole === 'service-provider') {
              combinedHistory = combinedHistory.filter(job => job.cleanerID === this.userId);
            }

            // Assign the filtered data
            this.serviceHistory = combinedHistory;

            this.sortByDate();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error fetching finalized jobs:', err);
            this.error = 'Failed to load finalized jobs';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching cancelled jobs:', err);
        this.error = 'Failed to load cancelled jobs';
        this.isLoading = false;
      }
    });
  },
  error: (err) => {
    console.error('Error fetching completed jobs:', err);
    this.error = 'Failed to load completed jobs';
    this.isLoading = false;
  }
});
  }
  private sortByDate() {
    this.serviceHistory.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return this.datePipe.transform(dateObj, 'mediumDate') || 'N/A';
    } catch {
      return 'N/A';
    }
  }
}
