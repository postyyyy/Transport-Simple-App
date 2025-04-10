import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Trip {
  start: string;
  end: string;
  level: number;
  isContinued: boolean;
  isReturn: boolean;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tripForm: FormGroup;
  trips: Trip[] = [];
  currentId = 0;
  
  constructor(private fb: FormBuilder) {
    this.tripForm = this.fb.group({
      startPoint: ['', Validators.required],
      endPoint: ['', Validators.required]
    });
  }

  addTrip() {
    console.log("app wala hai");
    if (this.tripForm.valid) {
      const newTrip: Trip = {
        start: this.tripForm.value.startPoint,
        end: this.tripForm.value.endPoint,
        level: 1,
        isContinued: false,
        isReturn: false,
        id: this.currentId++
      };

      this.determineTripProperties(newTrip);
      this.trips.push(newTrip);
      this.tripForm.reset();
    }
  }

  private determineTripProperties(newTrip: Trip) {
    if (this.trips.length > 0) {
      const lastTrip = this.trips[this.trips.length - 1];
      
      // Check if it's a continued trip
      if (lastTrip.end.toLowerCase() === newTrip.start.toLowerCase()) {
        newTrip.isContinued = true;
        newTrip.level = 1;
      } 
      // Check if it's a return trip
      else if (lastTrip.start.toLowerCase() === newTrip.end.toLowerCase()) {
        newTrip.isReturn = true;
        newTrip.level = 1;
      }
      // Check if it's the same trip repeated
      else if (
        lastTrip.start.toLowerCase() === newTrip.start.toLowerCase() && 
        lastTrip.end.toLowerCase() === newTrip.end.toLowerCase()
      ) {
        newTrip.level = 2;
      }
      // Check if we need to return to level 1 from level 2
      else if (lastTrip.level === 2 && newTrip.level === 1) {
        // This will be handled in the template with the connector
      }
    }
  }

  getFirstThreeChars(location: string): string {
    return location.substring(0, 3).toUpperCase();
  }

  clearAll() {
    this.trips = [];
    this.currentId = 0;
  }

  getConnectorType(index: number): string {
    if (index === 0) return 'none';
    
    const current = this.trips[index];
    const previous = this.trips[index - 1];
    
    if (current.level === 1 && previous.level === 1) {
      if (current.isContinued) return 'straight';
      if (current.isReturn) return 'return';
      return 'straight';
    }
    if (current.level === 2 && previous.level === 1) return 'down';
    if (current.level === 1 && previous.level === 2) return 'up';
    if (current.level === 2 && previous.level === 2) return 'straight-level2';
    
    return 'straight';
  }
}