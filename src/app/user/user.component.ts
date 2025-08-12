import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Car, type User } from './user.model';
import { DUMMY_CARS, DUMMY_USERS } from '../dummy-users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @Input({ required: true }) user!: User;
  @Input({ required: true }) selected!: boolean;
  @Output() select = new EventEmitter<string>();
  @Output() carUpdated = new EventEmitter<Car>();
  public cars = DUMMY_CARS;

  get imagePath() {
    return 'assets/users/' + this.user.avatar;
  }

  onSelectUser() {
    this.select.emit(this.user.id);
  }

  onCarChanged(updatedCar: Car) {
    const carIndex = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (carIndex > -1) {
      this.cars[carIndex] = updatedCar;
    }
    this.carUpdated.emit(updatedCar);
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  trackByarId(index: number, car: Car): string {
    return car.id;
  }
}
