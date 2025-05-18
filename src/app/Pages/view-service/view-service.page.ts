import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,IonMenuButton, IonToolbar, IonButtons, IonItem, IonActionSheet, IonIcon, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';

import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";
import { Router } from '@angular/router';
import { AvailableJobsService } from 'src/services/available-jobs.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { requestedService } from 'src/services/service-request.service';
import { UserService } from 'src/services/user.service';
import { ModalController } from '@ionic/angular';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component'; // Adjust pat
import { IonicModule } from '@ionic/angular';  // Import IonicModule

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.page.html',
  styleUrls: ['./view-service.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GlobalBackgroundComponent]
})
export class ViewtServicePage implements OnInit {
  jobId: string | undefined;
  jobType!: string;
  userId!: string;
  userName!: string;
  scheduledDate?: string;
  scheduledDateOnly?: string;
  scheduledTimeOnly?: string;
  additionalInfo!: string;
  price?: number;
  jobItems!: any;
  user: User | null = null; // Store the logged-in user
  bookingType!: string;
  bookingFrequency!: string;
  recurringDay!:string;
  recurringDate!:string;
  userConfirmed!:boolean;
  cleanerConfirmed!:boolean;
  // Add a flag to indicate if it's an upcoming job or not
  isUpcomingJob: boolean = false;
  checkedItems: boolean[] = [];
  canMarkComplete: boolean = false;
  scheduledDates: string[] = [];

  job!: requestedService;
  otherPartyInfo: any;

  editMode = false;
  role: 'service-provider' | 'user' = 'user';

  constructor(private modalController: ModalController,private router: Router, private availableJobsService: AvailableJobsService,private auth: Auth,private userService: UserService,) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;

    if (state) {

      console.log(state)
      this.job = state['job'];
      this.editMode = state['editMode'];
      this.role = state['role'];
      console.log(this.job);
      this.jobId = this.job.id;
      this.jobType = this.job.serviceType;
      this.userId = this.job.userId;
      //this.userName = this.job.selectedProperty?.name || 'Unknown';
      this.price = this.job.totalCostToUser;
      this.additionalInfo = this.job.additionalInfo;
      this.bookingType = this.job.bookingType;
      this.scheduledDates = Array.isArray(this.job.selectedTimeAndDate)
  ? this.job.selectedTimeAndDate
  : this.job.selectedTimeAndDate
    ? [this.job.selectedTimeAndDate]
    : [];

      this.userConfirmed = this.job.userConfirmed;
      this.cleanerConfirmed = this.job?.cleanerConfirmed;
      this.bookingFrequency = this.job.recurringOption || 'None';
      this.recurringDay = this.job.recurringDay || 'N/A';
      this.recurringDate = this.job.recurringDate || 'N/A';

      const extrasRaw = this.job.selectedExtras as string;
    this.jobItems = extrasRaw ? extrasRaw.split(',').map(item => item.trim()) : [];

      // Set the first scheduled date if available
      if (this.scheduledDates.length > 0) {
        this.scheduledDate = this.scheduledDates[0];

        const [datePart, timePart] = this.scheduledDate.split('T');
        this.scheduledDateOnly = datePart;
        this.scheduledTimeOnly = timePart?.slice(0, 5);
      }

      if (this.scheduledDate) {
        const [datePart, timePart] = this.scheduledDate.split('T');
        this.scheduledDateOnly = datePart;
      
        // Optional: format time to HH:MM if needed
        this.scheduledTimeOnly = timePart?.slice(0, 5); // Gets '10:33'
      }
    } else {
      // fallback or redirect if state isn't passed
      console.warn('No state data found. Redirecting back.');
      this.router.navigate(['/upcoming-jobs']);
    }
  }

  ngOnInit() {
    this.checkedItems = this.jobItems.map(() => false);

      // move this to the splash screen so that it checks first if there is a user or not
      this.auth.onAuthStateChanged(async user => {
          this.user = user; // Assign the logged-in user details
      });

      const otherId = this.role === 'user' ? this.job.cleanerID : this.job.userId;

      this.userService.getUserById(otherId).subscribe(
        user => {
          this.otherPartyInfo = user;
        },
        err => {
          console.error('Error loading user:', err);
        }
      );
  }



  backtoDash(){
    // Optionally redirect
    this.router.navigate(['/dashboard']);
  }
  
  

  startChat(user: any) {
    if (this.user) {
      this.router.navigate([`/chat/${this.user.uid}-${user.uid}`]);
    }
  }
  

    /**
   * Called when user or cleaner marks service as complete
   */
    async markServiceComplete() {
      if (!this.user || !this.jobId) return;
  
      const roleKey = this.role === 'service-provider' ? 'cleanerConfirmed' : 'userConfirmed';
  
      try {
        await this.availableJobsService.updateJobConfirmation(this.jobId, roleKey, true);
        console.log(`${roleKey} set to true`);
  
        // After marking, check if both have confirmed
        this.checkAndFinalizeServiceCompletion();
        this.backtoDash();
      } catch (err) {
        console.error('Error updating confirmation:', err);
      }
    }


  /**
   * Finalize payment if both have confirmed
   */
  async checkAndFinalizeServiceCompletion() {
    const jobData = await this.availableJobsService.getJobById(this.jobId!);

    const bothConfirmed = jobData?.cleanerConfirmed && jobData?.userConfirmed;

    if (bothConfirmed) {
      const cleanerId = this.job.cleanerID;
      const cleanerShare = Math.round((this.price || 0) * 0.9);

      try {
        await this.userService.addToCleanerAccount(cleanerId, cleanerShare);
        console.log(`Credited R${cleanerShare} to cleaner's account`);
        await this.availableJobsService.markJobAsFinalized(this.jobId!);
      } catch (err) {
        console.error('Error finalizing service or crediting cleaner:', err);
      }
    }
  }

  get shouldOnlyReview(): boolean {
    if (this.role === 'user' && this.userConfirmed) return true;
    if (this.role === 'service-provider' && this.cleanerConfirmed) return true;
    return false;
  }
  
  get canReview(): boolean {
    return this.shouldOnlyReview;
  }




  async openReviewModal() {
    // Determine who is being reviewed based on the current user's role
    const recipientId = this.role === 'user' ? this.job.cleanerID : this.job.userId;
  
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      componentProps: {
        jobId: this.jobId,       // Pass the service/job ID
        role: this.role,         // Pass the current user's role
        recipientId: recipientId // Pass the ID of who is being reviewed
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
  
    await modal.present();
  
    const { data, role } = await modal.onDidDismiss();
    if (role === 'submit') {
      console.log('Review submitted:', data);
      // You might want to refresh the view or show a success message here
    }
  }

  checkCompletion() {
  this.canMarkComplete = this.checkedItems.every(item => item === true);
}


}
