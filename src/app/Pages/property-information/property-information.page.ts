import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { ToastController  } from '@ionic/angular';
import { IonContent, IonHeader, IonActionSheet,IonTitle,IonMenuButton,IonSelect, IonSelectOption, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea, IonList, IonItem, IonLabel, IonFooter, IonModal, IonDatetime, IonSegmentButton, IonChip } from '@ionic/angular/standalone';
import { ServiceRequestService } from 'src/services/service-request.service';
import { Property, PropertyService } from 'src/services/property.service';
import { Auth, User } from '@angular/fire/auth';  // ✅ Import Auth
import { Observable } from 'rxjs';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";
import { Router } from '@angular/router';
import { DateTimePickerComponent } from "../../components/date-time-picker/date-time-picker.component";

@Component({
  selector: 'app-property-information',
  templateUrl: './property-information.page.html',
  styleUrls: ['./property-information.page.scss'],
  standalone: true,
  imports: [IonChip, IonSegmentButton, IonDatetime, IonModal, IonActionSheet, IonLabel, IonMenuButton, IonItem, IonList, IonTextarea, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, GlobalBackgroundComponent, DateTimePickerComponent]
})
export class PropertyInformationPage implements OnInit {
  step: number = 1; // Controls step navigation
  //selectedProperty: string | undefined; // This will hold the selected property value
  selectedDate_Time: string | null = null;
  showDateTimeModal = false; // Controls the modal visibility
  minDate: string;
  maxDate: string;
  user: User | null = null; // Store the logged-in user
  property: Property[] = [];
  actionSheetButtons: any[] = []; // Initialize the buttons array as empty

  selectedProperty: Property | undefined;
  

  // For time validation
  isTimeValid: boolean = true;  // Track time validity

  restrictedStartTime: string = '09:00';
  restrictedEndTime: string = '17:00';

  serviceType: string = 'Standard';
  bookingType: 'once' | 'recurring' | null = null;

additionalNotes: string = '';

recurringOption: 'Weekly' | 'Monthly' | null = null;
weeklyDay: string | null = null;
monthlyDate: number | null = null;

dateTimeWarning = false;
//daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; //Just incase
daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


  extras = [
    { name: 'Clothesline/Tumble Dry', price: 40, selected: false, icon: 'shirt' },
    { name: 'Ironing', price: 60, icon: 'shirt-outline', selected: false},
    { name: 'Inside Fridge', price:0, icon: 'snow-outline', selected: false },
    { name: 'Garage', price: 0 , icon: 'car-outline', selected: false },
    { name: 'Inside Cabinets', price: 0, icon: 'briefcase-outline', selected: false },
    { name: 'Interior Windows', price: 0, icon: 'albums-outline', selected: false },
    { name: 'Interior Walls', price: 0, icon: 'business-outline', selected: false },
    { name: 'Laundry', price: 80 , icon: 'water-outline', selected: false },
    { name: 'Oven', price: 0, selected: false, icon: 'flame' },
    { name: 'Sweep Garage', price: 0, selected: false, icon: 'car-sport' }
  ];


// cancel() {
//   this.modal.dismiss(null, 'cancel');
// }


  constructor(private modalController: ModalController,private toastController: ToastController,private serviceRequestService: ServiceRequestService,private auth: Auth,private router: Router, private propertyService: PropertyService) // ✅ Inject Firebase Auth) 
  {
    let today = new Date();
    let min = new Date();
    min.setDate(today.getDate() + 1); // Tomorrow
    let max = new Date();
    max.setMonth(today.getMonth() + 1); // One month ahead

    this.minDate = min.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    this.maxDate = max.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  ngOnInit() {
    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.user = user; // Assign the logged-in user details
        await this.loadUserProperties(); // Fetch reviews once the user is authenticated
      } else {
        //console.log("No user is logged in.");
      }
    });
  }

  validateTime(event: any) {
    const selectedDateTime = new Date(event.detail.value);
    const selectedTime = selectedDateTime.toTimeString().split(' ')[0]; // Get the time part of the datetime

    if (selectedTime < this.restrictedStartTime || selectedTime > this.restrictedEndTime) {
      this.selectedDate_Time = null; // Reset the time if it is restricted
      this.isTimeValid = false; // Set validity to false
    } else {
      this.isTimeValid = true; // Time is valid
    }
  }

  isWeekday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6; // Exclude Sunday (0) and Saturday (6)
  };

  async openDateTimePicker() {
  const modal = await this.modalController.create({
    component: DateTimePickerComponent,
    componentProps: {},
  });
  await modal.present();

  const { data } = await modal.onWillDismiss();

  if (data && data.selectedDates?.length > 0 && data.selectedTime) {
    // Combine date and time into full ISO string(s)
    const combinedDateTimes = data.selectedDates.map((dateStr: string) => {
      const date = new Date(dateStr);
      date.setHours(parseInt(data.selectedTime.hour), parseInt(data.selectedTime.minute));
      return date.toISOString();
    });
    this.bookingType = data.type; // ✅ Save the booking type

    this.selectedDate_Time = data.type === 'once'
      ? combinedDateTimes[0]
      : combinedDateTimes;

    this.confirmSelection(); // Continue with validation
  } else {
    this.showToast('Please select a valid date and time!');
  }
}


  closeDateTimePicker() {
    this.showDateTimeModal = false;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration for which the toast will be displayed
      position: 'top', // Position of the toast
      color: 'danger', // You can change the color if needed
    });
    toast.present();
  }

confirmSelection() {
  if (!this.selectedDate_Time) {
    this.showToast('Please select a valid date and time! 09:00 - 17:00');
    return;
  }

  // Handle recurring (array of dates)
  const datesToCheck = Array.isArray(this.selectedDate_Time)
    ? this.selectedDate_Time
    : [this.selectedDate_Time];

  const allTimesValid = datesToCheck.every((dt) => {
    const time = new Date(dt).toTimeString().split(' ')[0];
    return time >= this.restrictedStartTime && time <= this.restrictedEndTime;
  });

  if (!allTimesValid) {
    this.showToast('One or more selected times are outside the allowed range! 09:00 - 17:00');
    this.isTimeValid = false;
    return;
  }

  this.isTimeValid = true;
  this.showDateTimeModal = false;
  this.dateTimeWarning = true;

  this.getCleaner(); // Proceed with your form submission
}



  onCheckboxChange(extra: any) {
    extra.selected = !extra.selected; // Toggle selection state
  }

  openTimeOnlyPicker() {
    this.showDateTimeModal = true;
    // You may want to set a flag if you want to hide the date portion in modal
  }
  

  async getCleaner() {

    if (!this.selectedDate_Time) {
      this.showToast('Please select a date and time first.');
      return;
    }


    const selectedExtras = this.extras
      .filter(extra => extra.selected)
      .map(extra => extra.name)
      .join(", "); // Join selected extras into a comma-separated string

    try {
      const docId = await this.serviceRequestService.createServiceRequest({
        userId: this.auth.currentUser?.uid,
        selectedProperty: this.selectedProperty,
        selectedExtras: selectedExtras,
        selectedTimeAndDate: this.selectedDate_Time,
        additionalInfo:this.additionalNotes,
        serviceType: this.serviceType,
        selectedExtrasPrice: this.selectedExtras,
        totalCostToUser: this.totalCost,
        adminFee: this.adminFee,
        bookingType:this.bookingType,
        recurringOption: this.bookingType === 'recurring' ? this.recurringOption : null,
        recurringDay: this.bookingType === 'recurring' && this.recurringOption === 'Weekly' ? this.weeklyDay : null,
        recurringDate: this.bookingType === 'recurring' && this.recurringOption === 'Monthly' ? this.monthlyDate : null,
        createdAt: new Date(),
      });
      const toast = await this.toastController.create({
        message: "A job post has been created, you will be notified as soon as it is accepted by a cleaner",
        duration: 2000, // Duration for which the toast will be displayed
        position: 'top', // Position of the toast
        color: 'success', // You can change the color if needed
      });
      toast.present();

// Clear the form fields (if you're using form groups)
this.selectedProperty = undefined;
this.selectedDate_Time = null;
this.additionalNotes = '';
this.extras.forEach(extra => extra.selected = false);  // Deselect all extras
      // Navigate back to the dashboard
    this.router.navigate(['/find-cleaner'], { queryParams: { serviceID: docId } });
    } catch (error) {
      console.error("Error creating service request:", error);
    }
  }


   // Dynamically load actionSheetButtons from the properties object
   async loadUserProperties() {
    if (!this.user) return;
    try {
      this.property = await this.propertyService.getUserProperties(this.user.uid);

      // Now that properties are loaded, generate the action sheet buttons
      this.actionSheetButtons = this.property.map(property => ({
        text: property.propertyType, // Set the button text to the property type
        handler: () => {
          this.selectedProperty = property;
          this.step = 2;  // Move to the next step
        },
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }

  prices = {
    standard: 200,
    adminFee: 22
  };
  
  get selectedExtras() {
    return this.extras.filter(e => e.selected);
  }
  
  get adminFee() {
    return this.prices.adminFee;
  }
  
  get totalCost() {
    const extrasTotal = this.selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return this.prices.standard + extrasTotal + this.adminFee;
  }
  
  toggleExtra(extra: any) {
    extra.selected = !extra.selected;
  }
  
  selectService(type: string) {
    this.serviceType = type;
  }

  navigateProperty() {
    this.router.navigate(['/add-user-property']);
  }

}

