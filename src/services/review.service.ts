import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';

export interface Review {
  id?: string;
  userId: string;
  recipient: string;
  serviceId: string;
  userName: string;
  message: string;
  stars: number;
  createdAt: Date | Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Add a review with comprehensive validation
  async addReview(serviceId: string, message: string, stars: number, recipientId: string): Promise<string> {
    // Validate inputs
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    if (!message?.trim()) {
      throw new Error('Review message cannot be empty');
    }
    if (stars < 1 || stars > 5) {
      throw new Error('Stars must be between 1 and 5');
    }
    if (!recipientId) {
      throw new Error('Recipient ID is required');
    }

    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in');
    }

    // Prepare the review object with all required fields
    const review: Review = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      recipient: recipientId,
      serviceId: serviceId,
      message: message.trim(),
      stars: stars,
      createdAt: Timestamp.now(),
    };

    // Reference to the Firestore 'reviews' collection
    const reviewsRef = collection(this.firestore, 'reviews');

    try {
      const docRef = await addDoc(reviewsRef, review);
      console.log('Review successfully added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding review:', error);
      throw new Error(`Failed to add review: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Get all reviews for a specific service
  getServiceReviews(serviceId: string): Observable<Review[]> {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }

    const reviewsRef = collection(this.firestore, 'reviews');
    const q = query(reviewsRef, where('serviceId', '==', serviceId));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(reviews => reviews.map(review => ({
        ...review,
        createdAt: this.convertTimestamp(review['createdAt'])
      })))
    ) as Observable<Review[]>;
  }

  // Get all reviews received by a specific user
  async getUserReviews(userId: string): Promise<Review[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const reviewsRef = collection(this.firestore, 'reviews');
    const q = query(reviewsRef, where('recipient', '==', userId));

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: this.convertTimestamp(data['createdAt'])
        } as Review;
      });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw new Error(`Failed to get user reviews: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Helper method to handle both Timestamp and Date conversion
  private convertTimestamp(timestamp: Timestamp | Date | undefined): Date {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    return timestamp.toDate();
  }
}