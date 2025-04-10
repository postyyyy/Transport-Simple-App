import { Component } from '@angular/core';

@Component({
  selector: 'app-trip-visualizer',
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.scss']
})
export class TripVisualizerComponent {
  startPoint = '';
  endPoint = '';
  trips: { from: string, to: string }[] = [];
 
  addTrip() {
    if (this.startPoint && this.endPoint) {
      this.trips.push({ from: this.startPoint.toLowerCase(), to: this.endPoint.toLowerCase() });
      this.startPoint = '';
      this.endPoint = '';
     
    }
  }

  getTripType(index: number): 'continued' | 'non-continued' | 'repeated' {
    if (index === 0) return 'continued';
    const prev = this.trips[index - 1];
    const curr = this.trips[index];
    if (prev.from === curr.from && prev.to === curr.to) return 'repeated';
    if (prev.to === curr.from) return 'continued';
    return 'non-continued';
  }
 
  
  getTripColor(index: number): string {
    const type = this.getTripType(index);
    switch (type) {
      case 'continued': return 'blue';
      case 'non-continued': return 'orange';
      case 'repeated': return 'gray';
      default: return '#555';
    }
  }

  isStartOfRepeated(index: number): boolean {
    return this.getTripType(index) === 'repeated' &&
           (index === 0 || this.getTripType(index - 1) !== 'repeated');
  }
 
 
  
  
  isEndOfRepeated(index: number): boolean {
    return this.getTripType(index) === 'repeated' &&
           (index === this.trips.length - 1 || this.getTripType(index + 1) !== 'repeated');
  }

  getY(index: number): number {
    return this.getTripType(index) === 'repeated' ? 20 : 60;
  }

  
  getRepeatedArcPath(fromIndex: number, toIndex: number): string {
    const x1 = fromIndex * 150 + 20;
    const y1 = this.getY(fromIndex);
    const x2 = toIndex * 150;
    const y2 = this.getY(toIndex);
    const cx = (x1 + x2) / 2;
    const cy = 20; // height of the arc (for repeated)
  
    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  }
  
  
}
