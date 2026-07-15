import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IUserRepository } from '../../modules/users/repositories/interfaces/user.repository.interface';
import { MongooseUserRepository } from '../../modules/users/repositories/implementations/user.repository';
import { IBusinessRepository } from '../../modules/businesses/repositories/interfaces/business.repository.interface';
import { MongooseBusinessRepository } from '../../modules/businesses/repositories/implementations/business.repository';
import { IPostRepository } from '../../modules/posts/repositories/interfaces/post.repository.interface';
import { MongoosePostRepository } from '../../modules/posts/repositories/implementations/post.repository';
import { IOtpRepository } from '../../modules/auth/repositories/interfaces/otp.repository.interface';
import { MongooseOtpRepository } from '../../modules/auth/repositories/implementations/otp.repository';

// Services
import { IAuthService } from '../../modules/auth/services/interfaces/auth.service.interface';
import { AuthService } from '../../modules/auth/services/implementations/auth.service';
import { IBusinessesService } from '../../modules/businesses/services/interfaces/businesses.service.interface';
import { BusinessesService } from '../../modules/businesses/services/implementations/businesses.service';
import { IAdminService } from '../../modules/admin/services/interfaces/admin.service.interface';
import { AdminService } from '../../modules/admin/services/implementations/admin.service';
import { IPostsService } from '../../modules/posts/services/interfaces/posts.service.interface';
import { PostsService } from '../../modules/posts/services/implementations/posts.service';
import { IOtpService } from '../../shared/services/interfaces/otp.service.interface';
import { OtpService } from '../../shared/services/implementations/otp.service';

// Controllers
import { IAuthController } from '../../modules/auth/controllers/interfaces/auth.controller.interface';
import { AuthController } from '../../modules/auth/controllers/implementations/auth.controller';
import { IBusinessesController } from '../../modules/businesses/controllers/interfaces/businesses.controller.interface';
import { BusinessesController } from '../../modules/businesses/controllers/implementations/businesses.controller';
import { IAdminController } from '../../modules/admin/controllers/interfaces/admin.controller.interface';
import { AdminController } from '../../modules/admin/controllers/implementations/admin.controller';
import { IPostsController } from '../../modules/posts/controllers/interfaces/posts.controller.interface';
import { PostsController } from '../../modules/posts/controllers/implementations/posts.controller';
import { IFlashDealsController } from '../../modules/posts/controllers/interfaces/flash-deals.controller.interface';
import { FlashDealsController } from '../../modules/posts/controllers/implementations/flash-deals.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(MongooseUserRepository);
container.bind<IBusinessRepository>(TYPES.BusinessRepository).to(MongooseBusinessRepository);
container.bind<IPostRepository>(TYPES.PostRepository).to(MongoosePostRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(MongooseOtpRepository);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IBusinessesService>(TYPES.BusinessesService).to(BusinessesService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IPostsService>(TYPES.PostsService).to(PostsService);
container.bind<IOtpService>(TYPES.OtpService).to(OtpService);

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IBusinessesController>(TYPES.BusinessesController).to(BusinessesController);
container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IPostsController>(TYPES.PostsController).to(PostsController);
container.bind<IFlashDealsController>(TYPES.FlashDealsController).to(FlashDealsController);

export { container };
