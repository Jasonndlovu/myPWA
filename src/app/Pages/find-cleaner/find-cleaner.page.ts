import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { GlobalBackgroundComponent } from "../../components/global-background/global-background.component";
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { ServiceRequestService } from 'src/services/service-request.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-find-cleaner',
  templateUrl: './find-cleaner.page.html',
  styleUrls: ['./find-cleaner.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    GlobalBackgroundComponent
  ]
})
export class FindCleanerPage implements OnInit {
  cleanerFound = false;
  cleaner: any = null; // ✅ Store cleaner info here
  user: User | null = null;
  latestServiceRequestId: string = ''; // ✅ You should set this after creating the request

  constructor(
    private auth: Auth,
    private serviceRequestService: ServiceRequestService,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

      this.route.queryParams.subscribe(params => {
    const serviceID = params['serviceID'];
    if (serviceID) {
      // Use this ID to listen for updates, e.g., cleaner acceptance
      this.latestServiceRequestId = serviceID;
      console.log("Listening for service ID:", serviceID);
    }
  });

    this.auth.onAuthStateChanged(async user => {
      if (user) {
        this.user = user;
        if (this.latestServiceRequestId) {
          this.listenForCleanerAssignment();
        }
      } else {
        console.log("No user is logged in.");
      }
    });
  }

  /**
   * Call this after creating the service request and setting latestServiceRequestId
   */
  listenForCleanerAssignment() {
    this.serviceRequestService.waitForCleanerAssignment(this.latestServiceRequestId)
      .then(cleanerInfo => {
        this.cleaner = cleanerInfo;
        console.log(this.cleaner);
        this.cleanerFound = true;
        this.showToast(`Cleaner found: ${cleanerInfo.fullName || 'Name not available'}`);
      })
      .catch(error => {
        console.error('Error detecting cleaner assignment:', error);
      });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
