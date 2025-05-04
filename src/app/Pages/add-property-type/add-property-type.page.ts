import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-property-type',
  templateUrl: './add-property-type.page.html',
  styleUrls: ['./add-property-type.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // Ensure IonicModule is imported
})
export class AddPropertyTypePage implements OnInit {
  propertyName: string = '';
  propertyDescription: string = '';
  selectedCategory: string = ''; // Holds the selected category

  // Dropdown options
  categories: string[] = [
    'Residential Property',
    'Short-Term Rental Property',
    'Commercial Property',
    'Specialty Property'
  ];

  constructor(private firestore: Firestore) {}

  ngOnInit() {}

  async addPropertyType() {
    if (!this.propertyName.trim() || !this.selectedCategory.trim()) {
      alert('Property name and category are required.');
      return;
    }

    try {
      const propertyTypesRef = collection(this.firestore, 'property-types');
      await addDoc(propertyTypesRef, {
        name: this.propertyName,
        description: this.propertyDescription || '',
        category: this.selectedCategory,
        createdAt: new Date()
      });

      alert('Property type added successfully!');
      this.propertyName = '';
      this.propertyDescription = '';
      this.selectedCategory = ''; // Reset form fields
    } catch (error) {
      console.error('Error adding property type:', error);
      alert('Failed to add property type.');
    }
  }
}
