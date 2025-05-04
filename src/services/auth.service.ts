import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState, User, OAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject  } from 'rxjs';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { getAuth, updateProfile } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private userEmail = new BehaviorSubject<string | null>(null);
  private userName = new BehaviorSubject<string | null>(null);
  private userRole = new BehaviorSubject<string | null>(null);

  userEmail$ = this.userEmail.asObservable();
  userName$ = this.userName.asObservable();
  userRole$ = this.userRole.asObservable();
  router: any;

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    
    if (result.user) {
      await this.saveUserData(result.user);
    }
    return result;
  }

  async loginWithApple() {
    const provider = new OAuthProvider('apple.com');
    
    const result = await signInWithPopup(this.auth, provider);
    
    if (result.user) {
      await this.saveUserData(result.user);
    }
    return result;
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      if (result.user) {
        await this.saveUserData(result.user);
      }
      return result;
    } catch (error) {
      console.error('Error logging in with email and password:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return true; // Indicates success
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error; // Re-throw the error for handling in the component
    }
  }

  async saveUserData(user: User, additionalData?: { name: string; surname: string; phone: string },justRegistered?: boolean) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userRef);

    if (justRegistered != true){
      justRegistered = false;
    }

    if (!userSnap.exists()) {
        const role = localStorage.getItem('userRole'); // Get stored role
        const displayName = user.displayName || `${additionalData?.name} ${additionalData?.surname}`;
        const email = user.email || '';

        console.log('Role:', role);
        console.log('Display Name:', displayName);
        console.log('Email:', email);

        if (!role) {
            throw new Error('Role not found in local storage');
        }

        await setDoc(userRef, {
            uid: user.uid,
            displayName: displayName,
            email: email,
            photoURL: user.photoURL || '',
            role: role, // Save role permanently
            phoneNumber: additionalData?.phone || '',
            createdAt: new Date()
        });
        if(justRegistered){this.updateUserProfile(displayName);}
        console.log('Saving to localStorage...');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', displayName);

        console.log('Saved:', localStorage.getItem('userEmail'), localStorage.getItem('userName'));
    }
  }
  
  async updateUserProfile(displayName: string){
    var auth = getAuth();
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        console.log("Display Name Updated:", auth.currentUser.displayName);
      } catch (error) {
        console.error("Error updating display name:", error);
      }
    } else {
      console.log("No user is signed in.");
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.clearLocalStorage();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    sessionStorage.clear(); // Clear all session storage
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth); // This ensures it is correctly accessed
  }


  loadUserFromStorage() {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    if (storedEmail) this.userEmail.next(storedEmail);
    if (storedName) this.userName.next(storedName);
  }

  async getUserRole(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data()?.['role'] || null : null;
  }

  async setUserRole(role: 'user' | 'service-provider') {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(this.firestore, `users/${currentUser.uid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !userSnap.data()?.['role']) {
      await setDoc(userRef, { role }, { merge: true }); // Store role in Firestore
      localStorage.setItem('userRole', role); // Store in localStorage
      this.userRole.next(role); // Update observable
    }
  }

  async registerWithEmail(email: string, password: string, additionalData: { name: string; surname: string; phone: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
  
      // Save additional user info in Firestore
      await this.saveUserData(user, additionalData,true);
  
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}


//https://mypwa-1e7f2.firebaseapp.com/__/auth/handler
