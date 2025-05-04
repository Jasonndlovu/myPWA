import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth.service'; // Ensure this path is correct

@Component({
  selector: 'app-cleaner-profile',
  templateUrl: './cleaner-profile.page.html',
  styleUrls: ['./cleaner-profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CleanerProfilePage implements OnInit {
  userProfileForm: FormGroup;
  firestore: Firestore;
  userId: string | null = null;  // This will hold the user's ID

  constructor(
    private fb: FormBuilder,
    private authService: AuthService // Inject the auth service
  ) {
    // Initialize Firebase app and Firestore
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);

    this.userProfileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', [Validators.required]],
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit() {
    // Fetch the current user ID
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;  // Set the user ID from Firebase Auth
      } else {
        alert('No user logged in');
      }
    });
  }

  async onSubmit() {
    if (this.userProfileForm.valid && this.userId) {
      try {
        const userRef = doc(this.firestore, 'users', this.userId);  // Get reference to the user document
        const userDoc = await getDoc(userRef);  // Check if the user document exists

        if (userDoc.exists()) {
          // If the user exists, update the document with cleaner profile data
          await updateDoc(userRef, {
            userProfile: this.userProfileForm.value  // Add the cleaner profile as a subfield
          });
        } else {
          // If the user doesn't exist, create a new user document (you could also handle this differently)
          await setDoc(userRef, {
            userProfile: this.userProfileForm.value  // Add cleaner profile data
          });
        }

        alert('Profile saved successfully!');
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving profile. Please try again.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
