import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user-property',
  standalone: true,
  templateUrl: './add-user-property.page.html',
  styleUrls: ['./add-user-property.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class AddUserPropertyPage implements OnInit {
  userId: string = '';
  name: string = '';
  propertyTypes: string[] = [];
  selectedPropertyType: string = '';
  numberOfBedrooms: number = 1;
  numberOfBathrooms: number = 1;
  numberOfLivingRooms: number = 1;
  numberOfKitchens: number = 1;
  numberOfGarages: number = 1;
  numberOfFloors: number = 1;

  constructor(private firestore: Firestore, private auth: Auth) {}

  ngOnInit() {
    user(this.auth).subscribe(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        alert('User is not authenticated.');
      }
    });

    this.getPropertyTypes();
  }

  async getPropertyTypes() {
    const propertyTypesRef = collection(this.firestore, 'property-types');
    const snapshot = await getDocs(propertyTypesRef);
    this.propertyTypes = snapshot.docs.map(doc => doc.data()['name'] as string);
  }

  async saveUserProperty() {
    if (!this.selectedPropertyType) {
      alert('Please select a property type.');
      return;
    }

    if (!this.userId) {
      alert('User is not authenticated.');
      return;
    }

    try {
      // Save property details to Firestore with userId field
      const userPropertyRef = collection(this.firestore, 'user-property');
      await addDoc(userPropertyRef, {
        userId: this.userId,
        name: this.name,
        propertyType: this.selectedPropertyType,
        numberOfBedrooms: this.numberOfBedrooms,
        numberOfBathrooms: this.numberOfBathrooms,
        numberOfLivingRooms: this.numberOfLivingRooms,
        numberOfKitchens: this.numberOfKitchens,
        numberOfGarages: this.numberOfGarages,
        numberOfFloors: this.numberOfFloors,
        createdAt: new Date()
      });

      alert('Property details saved successfully!');
      this.clearForm();
    } catch (error) {
      console.error('Error saving user property:', error);
      alert('Failed to save property details.');
    }
  }

  clearForm() {
    this.name = '';
    this.selectedPropertyType = '';
    this.numberOfBedrooms = 1;
    this.numberOfBathrooms = 1;
    this.numberOfLivingRooms = 1;
    this.numberOfKitchens = 1;
    this.numberOfGarages = 1;
    this.numberOfFloors = 1;
  }
}
