import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, increment } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUserById(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef).pipe(
      map(user => user ? { id: userId, ...user } : null),
      catchError(err => {
        console.error('Error fetching user:', err);
        return of(null);
      })
    );
  }

  // Adds to the cleaner's available balance
  addToCleanerAccount(cleanerId: string, amount: number) {
    const cleanerRef = doc(this.firestore, `users/${cleanerId}`);
    return updateDoc(cleanerRef, {
      accountBalance: increment(amount)
    });
  }
}
