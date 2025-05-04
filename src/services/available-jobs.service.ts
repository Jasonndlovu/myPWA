import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, orderBy, query, where, getDocs, doc, getDoc, Timestamp, updateDoc, increment } from '@angular/fire/firestore';
import { Auth, getAuth, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Property } from './property.service';

export interface Extra {
  icon: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface requestedService {
  id?: string;
  userId: string;
  additionalInfo: string;
  adminFee: number;
  bookingType: string;
  totalCostToUser: number;
  serviceType?: string;
  selectedExtras: string;
  selectedExtrasPrice?: Extra[];
  selectedTimeAndDate: string;
  recurringDate: string;
  recurringDay: string;
  recurringOption: string;
  isAvailable: boolean;
  cleanerID: string;
  createdAt: Date | string;
  selectedProperty: Property;
  serviceStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvailableJobsService {

  constructor(private firestore: Firestore, private auth: Auth) { }

  // Get all reviews for a specific service and filter by isAvailable: true
  getServiceReviews(): Observable<requestedService[]> {
    const requestedServiceRef = collection(this.firestore, 'service-requests');
    const q = query(
      requestedServiceRef,
      where('isAvailable', '==', true)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(requestedService =>
        requestedService.map(requestedService => ({
          ...requestedService,
          createdAt: (requestedService['createdAt'] as Timestamp)?.toDate() || new Date(),
        }))
      )
    ) as Observable<requestedService[]>;
  }

  // Fetch user name by userId
  getUserName(userId: string): Observable<string> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(getDoc(userRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          return userData?.['displayName'] || 'Unknown';
        } else {
          return 'Unknown';
        }
      })
    );
  }

  // Update the job status when it's accepted
  updateJobStatus(jobId: string, user: User): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);

    return updateDoc(jobRef, {
      isAvailable: false,
      cleanerID: user.uid,
      serviceStatus: 'Accepted'
    });
  }

  // Cancel a job
  cancelJob(jobId: string, reason: string): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    return updateDoc(jobRef, {
      serviceStatus: 'Canceled',
      cancellationReason: reason
    });
  }

  // Mark job as completed by user
  markJobCompletedByUser(jobId: string): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    return updateDoc(jobRef, {
      completedByUser: true
    });
  }

  // Mark job as completed by cleaner
  markJobCompletedByCleaner(jobId: string): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    return updateDoc(jobRef, {
      completedByCleaner: true
    });
  }

  // Adds 'cleanerConfirmed' or 'userConfirmed' = true
  async updateJobConfirmation(jobId: string, key: 'cleanerConfirmed' | 'userConfirmed', value: boolean): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
  
    const jobSnap = await getDoc(jobRef);
  
    if (!jobSnap.exists()) {
      console.error(`❌ Job with ID ${jobId} not found.`);
      throw new Error(`Job with ID ${jobId} does not exist.`);
    }
  
    await updateDoc(jobRef, {
      [key]: value
    });
  
    console.log(`✅ Job ${jobId} updated: ${key} set to ${value}`);
  }

  // Returns the job document data
  getJobById(jobId: string): Promise<any> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    return getDoc(jobRef).then(docSnap => docSnap.data());
  }

  // Updates the 'serviceStatus' to 'finalized' or similar
  markJobAsFinalized(jobId: string) {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    return updateDoc(jobRef, { serviceStatus: 'finalized' });
  }

  // Finalize job and pay cleaner if both completed
  async finalizeJobIfBothCompleted(jobId: string): Promise<void> {
    const jobRef = doc(this.firestore, 'service-requests', jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error('Job not found');
    }

    const jobData = jobSnap.data();
    const { completedByUser, completedByCleaner, totalCostToUser, cleanerID } = jobData;

    if (completedByUser && completedByCleaner) {
      const payout = totalCostToUser * 0.9;

      await updateDoc(jobRef, {
        serviceStatus: 'Completed'
      });

      const cleanerRef = doc(this.firestore, 'cleaners', cleanerID);
      await updateDoc(cleanerRef, {
        accountBalance: increment(payout)
      });

      console.log(`✅ Job ${jobId} marked completed. R${payout.toFixed(2)} added to cleaner's balance.`);
    } else {
      console.log('⚠️ Both parties have not confirmed completion yet.');
    }
  }
  // Fetch Service History by Service Status (Cancelled or Completed)
getServiceHistoryByStatus(status: 'Completed' | 'Cancelled' | 'finalized'): Observable<requestedService[]> {
  const requestedServiceRef = collection(this.firestore, 'service-requests');
  
  // Query to get jobs with 'Completed' or 'Cancelled' status
  const q = query(
    requestedServiceRef,
    where('serviceStatus', '==', status)
  );

  return collectionData(q, { idField: 'id' }).pipe(
    map(requestedService =>
      requestedService.map(requestedService => ({
        ...requestedService,
        createdAt: (requestedService['createdAt'] as Timestamp)?.toDate() || new Date(),
      }))
    )
  ) as Observable<requestedService[]>;
}

}
