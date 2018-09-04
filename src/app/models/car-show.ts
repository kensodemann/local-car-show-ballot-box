import { CarClass } from './car-class';

export class CarShow {
  id?: number;
  name: string;
  date: string;
  year: number;
  classes: Array<CarClass>;
}
