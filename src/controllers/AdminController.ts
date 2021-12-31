import express ,{Request,Response ,NextFunction} from 'express'
import { CreateVendorInput } from '../dto/vendor.dto'
import { Vendor } from '../models'
import { generatePassword, generateSalt } from '../utility'

export const findVendor =async (id:string | undefined,email?:string) => {
    if(email){
        return await Vendor.findOne({email:email})
    }else{
        return await Vendor.findById(id)
    }
}


export const CreateVendor =async (req:Request,res:Response,next:NextFunction) => {
   const {name, address, pincode, foodtype, email, password, ownername, phone } =  <CreateVendorInput>req.body
  
   const existingVendor = await findVendor('',email)

   if(existingVendor!==null){
       return res.json({"message":"Vendor Already exists"})
   }
   
   const salt= await generateSalt()
   const userPassword = await generatePassword(password,salt)

   const createVendor  =await Vendor.create({
       name:name,
       address:address,
       pincode:pincode,
       foodtype:foodtype,
       email:email,
       password:userPassword,
       salt:salt,
       ownername:ownername,
       phone:phone,
       rating:0,
       serviceAvailable:false,
       coverImage:[],
       foods:[]
   })

   return res.json(createVendor)
}

export const GetVendor =async (req:Request,res:Response,next:NextFunction) => {
    const vendors  = await Vendor.find()

    if(vendors!==null){
         return res.json(vendors)        
    }

    return res.json({"message":"Data not available"})
}

export const GetVendorById =async (req:Request,res:Response,next:NextFunction) => {
   
    const vendorId = req.params.id
    const vendor = await findVendor(vendorId)

    if(vendor!==null){
        return res.json(vendor)
    }
    return res.json({"message":"Data Not Available"})
}