import express ,{Request,Response ,NextFunction} from 'express'
import { AddFood, GetFood, GetVendorProfile, UpdateCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers';
import { Authenicate } from '../middlewares';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-'));
    }
})

const images = multer({ storage: imageStorage}).array('images', 10);


router.use(Authenicate)
router.post('/login',VendorLogin)
router.get('/profile',GetVendorProfile)
router.patch('/profile',UpdateVendorProfile)
router.patch('/coverimage',images,UpdateCoverImage)        
router.get('/service',UpdateVendorService)

router.post('/food',images,AddFood)
router.get('/foods',GetFood)

router.get('/',(req: Request, res: Response, next: NextFunction)=>{
    res.json({message:"Hello from vendor"})
})

export {router as VendorRoute}