import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { docData } from 'rxfire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UpcomingJobsService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getUpcomingJobs(): Observable<any[]> {
    return new Observable((observer) => {
      this.auth.onAuthStateChanged(async user => {
        if (!user) {
          observer.next([]);
          return;
        }

        const cleanerId = user.uid;
        const serviceRequestRef = collection(this.firestore, 'service-request');

        const q = query(serviceRequestRef, where('cleanerID', '==', cleanerId));

        const jobData$ = collectionData(q, { idField: 'id' });

        jobData$.subscribe(jobs => {
          const filtered = jobs.filter(job => !!job['selectedTimeAndDate']);
          observer.next(filtered);
        }, error => {
          observer.error(error);
        });
      });
    });
  }
}
