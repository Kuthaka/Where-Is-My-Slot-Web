export const TYPES = {
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    BusinessRepository: Symbol.for("BusinessRepository"),
    PostRepository: Symbol.for("PostRepository"),
    OtpRepository: Symbol.for("OtpRepository"),
    ParkingRepository: Symbol.for("ParkingRepository"),

    // Services
    AuthService: Symbol.for("AuthService"),
    BusinessesService: Symbol.for("BusinessesService"),
    AdminService: Symbol.for("AdminService"),
    PostsService: Symbol.for("PostsService"),
    OtpService: Symbol.for("OtpService"),
    LocationService: Symbol.for("LocationService"),
    ParkingService: Symbol.for("ParkingService"),

    // Controllers
    AuthController: Symbol.for("AuthController"),
    BusinessesController: Symbol.for("BusinessesController"),
    AdminController: Symbol.for("AdminController"),
    PostsController: Symbol.for("PostsController"),
    FlashDealsController: Symbol.for("FlashDealsController"),
    LocationController: Symbol.for("LocationController"),
    ParkingController: Symbol.for("ParkingController"),
};
