import { Component, OnInit, Input } from '@angular/core';
import { IonicModule,ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- ✅ Required for ngModel
import { ReviewService, Review } from 'src/services/review.service';
import { IonHeader, IonItem, IonButton, IonRange, IonLabel, IonContent, IonTextarea, IonToolbar, IonButtons, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
  imports: [ 
    CommonModule,
    FormsModule,
    
    IonicModule,
  ]

})
export class ReviewModalComponent implements OnInit {

  @Input() serviceId!: string; // Receive the service ID from parent

  message = '';
  rating = 5;
  reviews$!: Observable<Review[]>;

  @Input() jobId!: string;
  @Input() role!: 'service-provider' | 'user';
  @Input() recipientId!: string;  // Add this new input

  constructor(
    private modalCtrl: ModalController,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
  }

  async addReview() {
    try {
      const reviewId = await this.reviewService.addReview(
        this.jobId,
        this.message,
        this.rating,
        this.recipientId 
      );
      console.log("Review added:", reviewId);

      // Close modal and pass result back
      this.modalCtrl.dismiss({ submitted: true }, 'submit');
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
