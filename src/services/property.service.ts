import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, orderBy,query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';

export interface Property {
  id: string;
  name: string;
  location:string;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  numberOfFloors: number;
  numberOfGarages: number;
  numberOfKitchens: number;
  numberOfLivingRooms: number;
  propertyType: string;
  userId: string;
  createdAt: any; // Firestore Timestamp
}


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private firestore: Firestore, private auth: Auth) {}
  async getUserProperties(userId: string): Promise<Property[]>{
    console.log('Fetching properties for userId:', userId);
    const propertyRef = collection(this.firestore, 'user-property');
    const q = query(propertyRef, where('userId', '==', userId)); // Removed orderBy

    const querySnapshot = await getDocs(q);
    console.log('Found', querySnapshot.size, 'properties'); // Debugging
  
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('property data:', data); // Log data to debug
  
      return {
        id: doc.id,
        ...data,
        createdAt: data['createdAt'] instanceof Timestamp ? data['createdAt'].toDate() : new Date(),
      } as Property;
    });
  }


}
