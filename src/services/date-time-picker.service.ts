import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTimePickerModalComponent  } from 'src/app/components/date-time-picker/date-time-picker.component';

@Injectable({
  providedIn: 'root',
})
export class DateTimePickerService {
  modalController: any;
  constructor(private modalCtrl: ModalController) {}

  async openDateTimePicker(): Promise<string | null> {
    const modal = await this.modalController.create({
      component: DateTimePickerModalComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    return data; // This will return the selected date/time
  }
}
