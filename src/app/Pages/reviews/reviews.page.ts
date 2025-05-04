import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton,IonButton, IonList, IonItem, IonLabel, IonIcon, IonCardHeader, IonSelectOption ,IonCardTitle, IonCardContent, IonCard, IonButtons } from '@ionic/angular/standalone';
import { ReviewService, Review } from '../../../services/review.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';  // ✅ Import Auth
import { addDoc, collection, Firestore } from '@angular/fire/firestore'; // ✅ Import Firestore

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [IonButtons, IonCard, IonCardContent, IonMenuButton,IonSelectOption,IonCardTitle, IonCardHeader, IonLabel, IonItem, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ReviewsPage implements OnInit {
  serviceId!: string;
  reviews$!: Observable<Review[]>;
  newMessage = '';
  newStars = 5;
  recipientId!:string;

  constructor(
    private reviewService: ReviewService, 
    private route: ActivatedRoute,
    private auth: Auth, // ✅ Inject Firebase Auth
    private firestore: Firestore // ✅ Inject Firestore
  ) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id')!;
    this.reviews$ = this.reviewService.getServiceReviews(this.serviceId);
  }

  logStars(event: any) {
    this.newStars = event.detail.value;  // Ensure the value is updated
    console.log('Stars Selected:', this.newStars);
  }
  

  logMessage(event: any) {
    this.newMessage = event.detail.value;  // Ensure it captures the value correctly
    console.log('Input Value:', this.newMessage);
  }
  

  async addReview() {
    console.log('Message:', this.newMessage);  // Log message value
    console.log('Stars:', this.newStars);      // Log stars value
    try {
      const reviewId = await this.reviewService.addReview(
        this.serviceId,
        this.newMessage,
        this.newStars,
        this.recipientId
      );
      console.log("Review successfully added with ID:", reviewId);
  
      // Reset review form after successful submission
      this.newMessage = '';
      this.newStars = 5;
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }
  
  
}
