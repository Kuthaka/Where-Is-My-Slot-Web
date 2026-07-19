import { Container } from 'inversify';
import { IParkingRepository } from '../repositories/interfaces/parking.repository.interface';
import { ParkingRepository } from '../repositories/implementations/parking.repository';
import { IParkingService } from '../services/interfaces/parking.service.interface';
import { ParkingService } from '../services/implementations/parking.service';
import { IParkingController } from '../controllers/interfaces/parking.controller.interface';
import { ParkingController } from '../controllers/implementations/parking.controller';

export function bindParkingModule(container: Container) {
  container.bind<IParkingRepository>('IParkingRepository').to(ParkingRepository);
  container.bind<IParkingService>('IParkingService').to(ParkingService);
  container.bind<IParkingController>('IParkingController').to(ParkingController);
}
