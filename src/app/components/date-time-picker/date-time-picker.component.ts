import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule],
})
export class DateTimePickerComponent implements OnInit {
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  daysInMonth: number[] = [];
  firstDayOfMonth: number = 0;

  onceOff: boolean = true;
  selectedDates: Date[] = []; // for recurring
  selectedDate: Date = new Date(); // for once-off
  selectedTime = { hour: 6, minute: '00' };

  allowedMinutes = ['00', '15', '30', '45'];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.generateDays();
  }

  generateDays() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  isWeekday(day: number): boolean {
    const tempDate = new Date(this.currentYear, this.currentMonth, day);
    const dayOfWeek = tempDate.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
  }

  isSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day).toDateString();
    if (this.onceOff) {
      return this.selectedDate.toDateString() === date;
    } else {
      return this.selectedDates.some(d => d.toDateString() === date);
    }
  }

  toggleDateSelection(day: number) {
    if (!this.isWeekday(day)) return;

    const date = new Date(this.currentYear, this.currentMonth, day);
    const dateString = date.toDateString();

    if (this.onceOff) {
      this.selectedDate = date;
    } else {
      const exists = this.selectedDates.find(d => d.toDateString() === dateString);
      if (exists) {
        this.selectedDates = this.selectedDates.filter(d => d.toDateString() !== dateString);
      } else {
        this.selectedDates.push(date);
      }
    }
  }

  selectTimeHour(hour: number) {
    this.selectedTime.hour = hour;
  }

  selectTimeMinute(min: string) {
    this.selectedTime.minute = min;
  }

  confirmSelection() {
    const { hour, minute } = this.selectedTime;

    const applyTime = (date: Date): Date => {
      const d = new Date(date);
      d.setHours(hour, +minute);
      return d;
    };

    const finalDates = this.onceOff
      ? [applyTime(this.selectedDate)]
      : this.selectedDates.map(d => applyTime(d));

    this.modalController.dismiss({
      selectedDates: finalDates,
      selectedTime: this.selectedTime,
      type: this.onceOff ? 'once' : 'recurring',
    });
  }

  close() {
    this.modalController.dismiss();
  }
}
