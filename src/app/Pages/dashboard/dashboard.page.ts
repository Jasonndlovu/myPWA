import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Review, ReviewService } from '../../../services/review.service';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonButtons, IonButton, IonMenuButton, IonList, IonItem, IonLabel, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonLabel,IonItem, IonList, IonButtons, IonButton,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonMenuButton]
})
export class DashboardPage implements OnInit {

  user: User | null = null; // Store the logged-in user
  reviews: Review[] = [];

  constructor(private auth: Auth,private reviewService: ReviewService,private router: Router) {}
  //constructor(private auth: Auth,private reviewService: ReviewService) {}
  businessServices = [
    { image: 'assets/icon/CreativeGraphicDesign.svg', label: 'Coming Soon',url: '/creative-graphic-design' },
    { image: 'assets/icon/SalesMarketing.svg', label: 'Coming Soon',url: '/sales-marketing' }
  ];

  householdServices = [
    {  image: 'assets/icon/CleaningServecies.svg', label: 'NEW', url:'/property-information'},
    {  image: 'assets/icon/LiveStreaming.svg', label: 'Coming Soon', url: '/live-streaming'}
  ];
  
  ngOnInit() {
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.user = user; // Assign the logged-in user details
        await this.loadUserReviews(); // Fetch reviews once the user is authenticated
      } else {
        console.log("No user is logged in.");
      }
    });
  }


  async loadUserReviews() {
    console.log('this.user:'+ this.user)
    if (!this.user) return;
    console.log('user found')
    try {
      this.reviews = await this.reviewService.getUserReviews(this.user.uid);
      console.log("User Reviews:", this.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }


}
