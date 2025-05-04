import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';

export interface requestedService {
  id?: string;
  userId: string;
  // serviceId: string;
  selectedProperty: string | undefined;
  selectedExtras: string;
  selectedTimeAndDate: string;
  isAvailable : boolean; 
  cleanerID: string;
  additionalInfo: string;
  serviceType: string;
  selectedExtrasPrice: number,
  totalCostToUser: number,
  adminFee: number,
  bookingType: string,
  recurringOption: string,
  recurringDay:string,
  recurringDate:string,
  serviceStatus:string,
  userConfirmed :boolean;
  cleanerConfirmed : boolean;
  createdAt: Date | Timestamp;  // Allow both Date and Timestamp
}

@Injectable({
  providedIn: 'root',
})
export class ServiceRequestService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Create a service request document in Firestore
  // Create a service request document in Firestore
  async createServiceRequest(requestDetails: any): Promise<any> {
    const user = this.auth.currentUser;

    // Check if user is logged in
    if (!user) {
      throw new Error("User not logged in");
    }

    // Prepare the requestedService object
    const requestedService: requestedService = {
      userId: user.uid,
      selectedProperty: requestDetails.selectedProperty,
      selectedExtras: requestDetails.selectedExtras,
      selectedTimeAndDate: requestDetails.selectedTimeAndDate,
      isAvailable : true,
      cleanerID: "null",
      serviceType: requestDetails.serviceType,
      additionalInfo: requestDetails.additionalInfo,
      selectedExtrasPrice: requestDetails.selectedExtrasPrice,
      totalCostToUser: requestDetails.totalCostToUser,
      adminFee: requestDetails.adminFee,
      bookingType:requestDetails.bookingType,
      recurringOption: requestDetails.recurringOption,
      recurringDay: requestDetails.recurringDay,
      recurringDate:requestDetails.recurringDate,
      userConfirmed: false,
      cleanerConfirmed : false,
      serviceStatus: 'Posted',//'Posted','Accepted','Canceled','Completed',
      createdAt: Timestamp.now(),
    };

    // Reference to the Firestore 'service-requests' collection
    const requestedServiceRef = collection(this.firestore, 'service-requests');

    try {
      // Add the service request document to Firestore
      const docRef = await addDoc(requestedServiceRef, requestedService);
      console.log("Service request successfully added with ID:", docRef.id);
      return docRef.id;  // Return the document ID for further processing if needed
    } catch (error) {
      console.error("Error adding service request:", error);
      throw new Error("Error adding service request: " + error); // Display meaningful error
    }
  }
}
