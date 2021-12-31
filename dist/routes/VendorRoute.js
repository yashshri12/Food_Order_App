"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
exports.VendorRoute = router;
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-'));
    }
});
var images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.use(middlewares_1.Authenicate);
router.post('/login', controllers_1.VendorLogin);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', controllers_1.UpdateVendorProfile);
router.patch('/coverimage', images, controllers_1.UpdateCoverImage);
router.get('/service', controllers_1.UpdateVendorService);
router.post('/food', images, controllers_1.AddFood);
router.get('/foods', controllers_1.GetFood);
router.get('/', function (req, res, next) {
    res.json({ message: "Hello from vendor" });
});
//# sourceMappingURL=VendorRoute.js.map