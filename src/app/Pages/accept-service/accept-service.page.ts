import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,IonMenuButton, IonToolbar, IonButtons, IonItem, IonActionSheet, IonIcon, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList } from '@ionic/angular/standalone';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";
import { Router } from '@angular/router';
import { AvailableJobsService } from 'src/services/available-jobs.service';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-accept-service',
  templateUrl: './accept-service.page.html',
  styleUrls: ['./accept-service.page.scss'],
  standalone: true,
  imports: [IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonButton, IonLabel, IonIcon, IonActionSheet, IonItem, IonButtons, IonContent, IonHeader, IonTitle, IonMenuButton, IonToolbar, CommonModule, FormsModule, GlobalBackgroundComponent]
})
export class AcceptServicePage implements OnInit {
  step = 1;
  jobId!: string;
  jobType!: string;
  userId!: string;
  userName!: string;
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
  scheduledDates: string[] = [];

  editMode = false;
  role: 'cleaner' | 'user' = 'user';

  constructor(private router: Router, private availableJobsService: AvailableJobsService,private auth: Auth,) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;

    if (state) {

      console.log(state)
      const extrasRaw = state['toDo'] as string;
      const rawDate = state['scheduledDate'];
      this.jobItems = extrasRaw ? extrasRaw.split(',').map(item => item.trim()) : [];
      this.jobId = state['jobId'];
      this.jobType = state['jobType'];
      this.userId = state['userId'];
      this.userName = state['userName'];
      this.price = state['price'];
      this.additionalInfo = state['additionalInfo'];
      this.bookingType = state['jobBookingType'];

      if (typeof rawDate === 'string') {
        this.scheduledDates = rawDate.split(',');
      } else if (Array.isArray(rawDate)) {
        this.scheduledDates = rawDate;
      } else {
        this.scheduledDates = [];
      }
      this.bookingFrequency = state['bookingFrequency'];
      this.recurringDay = state['recurringDay'];
     this.recurringDate = state['recurringDate']?.toString(); // Ensures it's a string if needed

      if (this.scheduledDates && this.scheduledDates.length > 0) {
        const [datePart, timePart] = this.scheduledDates[0].split('T');
        this.scheduledDateOnly = datePart;
        this.scheduledTimeOnly = timePart?.slice(0, 5);
      }


    }
  }

  ngOnInit() {

console.log(this.jobItems);
      // move this to the splash screen so that it checks first if there is a user or not
      this.auth.onAuthStateChanged(async user => {
          this.user = user; // Assign the logged-in user details
      });
  }

  confirmAcceptJob() {
    if (!this.jobId || !this.user) return;

    this.availableJobsService.updateJobStatus(this.jobId, this.user).then(() => {
      console.log(`Job ${this.jobId} has been accepted.`);
      // Optionally redirect
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.error('Error updating job status:', error);
    });
  }


  backtoDash(){
    // Optionally redirect
    this.router.navigate(['/dashboard']);
  }

  nextStep(){
    this.step += 1;
  }
  

  capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  

}
