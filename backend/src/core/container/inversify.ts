import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IUserRepository } from '../interfaces/repositories/user/user.repository.interface';
import { MongooseUserRepository } from '../../repositories/user/user.repository';
import { IBusinessRepository } from '../interfaces/repositories/business/business.repository.interface';
import { MongooseBusinessRepository } from '../../repositories/business/business.repository';
import { IPostRepository } from '../interfaces/repositories/business/post.repository.interface';
import { MongoosePostRepository } from '../../repositories/business/post.repository';
import { IOtpRepository } from '../interfaces/repositories/user/otp.repository.interface';
import { MongooseOtpRepository } from '../../repositories/user/otp.repository';

// Services
import { IAuthService } from '../interfaces/services/user/auth.service.interface';
import { AuthService } from '../../services/user/auth.service';
import { IBusinessAuthService } from '../interfaces/services/business/auth.service.interface';
import { BusinessAuthService } from '../../services/business/auth.service';
import { IAdminAuthService } from '../interfaces/services/admin/auth.service.interface';
import { AdminAuthService } from '../../services/admin/auth.service';
import { IBusinessesService } from '../interfaces/services/business/businesses.service.interface';
import { BusinessesService } from '../../services/business/businesses.service';
import { IAdminService } from '../interfaces/services/admin/admin.service.interface';
import { AdminService } from '../../services/admin/admin.service';
import { IPostsService } from '../interfaces/services/business/posts.service.interface';
import { PostsService } from '../../services/business/posts.service';
import { IOtpService } from '../../shared/services/interfaces/otp.service.interface';
import { OtpService } from '../../shared/services/implementations/otp.service';
import { ILocationService } from '../interfaces/services/user/location.service.interface';
import { LocationService } from '../../services/user/location.service';

// Controllers
import { IAuthController } from '../interfaces/controllers/user/auth.controller.interface';
import { AuthController } from '../../controllers/user/auth.controller';
import { IBusinessAuthController } from '../interfaces/controllers/business/auth.controller.interface';
import { BusinessAuthController } from '../../controllers/business/auth.controller';
import { IAdminAuthController } from '../interfaces/controllers/admin/auth.controller.interface';
import { AdminAuthController } from '../../controllers/admin/auth.controller';
import { IBusinessesController } from '../interfaces/controllers/business/businesses.controller.interface';
import { BusinessesController } from '../../controllers/business/businesses.controller';
import { IAdminController } from '../interfaces/controllers/admin/admin.controller.interface';
import { AdminController } from '../../controllers/admin/admin.controller';
import { IPostsController } from '../interfaces/controllers/business/posts.controller.interface';
import { PostsController } from '../../controllers/business/posts.controller';
import { IFlashDealsController } from '../interfaces/controllers/business/flash-deals.controller.interface';
import { FlashDealsController } from '../../controllers/business/flash-deals.controller';
import { ILocationController } from '../interfaces/controllers/user/location.controller.interface';
import { LocationController } from '../../controllers/user/location.controller';

// Parking Imports
import { IParkingRepository } from '../interfaces/repositories/business/parking.repository.interface';
import { ParkingRepository } from '../../repositories/business/parking.repository';
import { IParkingService } from '../interfaces/services/business/parking.service.interface';
import { ParkingService } from '../../services/business/parking.service';
import { IParkingController } from '../interfaces/controllers/business/parking.controller.interface';
import { ParkingController } from '../../controllers/business/parking.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(MongooseUserRepository);
container.bind<IBusinessRepository>(TYPES.BusinessRepository).to(MongooseBusinessRepository);
container.bind<IPostRepository>(TYPES.PostRepository).to(MongoosePostRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(MongooseOtpRepository);
container.bind<IParkingRepository>(TYPES.ParkingRepository).to(ParkingRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IBusinessAuthService>(TYPES.BusinessAuthService).to(BusinessAuthService);
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container.bind<IBusinessesService>(TYPES.BusinessesService).to(BusinessesService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IPostsService>(TYPES.PostsService).to(PostsService);
container.bind<IOtpService>(TYPES.OtpService).to(OtpService);
container.bind<ILocationService>(TYPES.LocationService).to(LocationService);
container.bind<IParkingService>(TYPES.ParkingService).to(ParkingService);

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IBusinessAuthController>(TYPES.BusinessAuthController).to(BusinessAuthController);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);
container.bind<IBusinessesController>(TYPES.BusinessesController).to(BusinessesController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IPostsController>(TYPES.PostsController).to(PostsController);
container.bind<IFlashDealsController>(TYPES.FlashDealsController).to(FlashDealsController);
container.bind<ILocationController>(TYPES.LocationController).to(LocationController);
container.bind<IParkingController>(TYPES.ParkingController).to(ParkingController);

export { container };
