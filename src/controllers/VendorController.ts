import { Express,Request,Response, NextFunction } from "express";
import { findVendor } from ".";
import { CreateFoodInput } from "../dto/Food.dto";
import { EditVendorInput, VendorLoginInput } from "../dto/vendor.dto";
import { food } from "../models";
import { generateSignature, validatePassword } from "../utility";

export const VendorLogin =async (req:Request,res:Response,next:NextFunction) => {
    const {email,password} = <VendorLoginInput>req.body
    
    const existingVendor =await findVendor('',email)
   
    if(existingVendor!==null){
      const validation = await validatePassword(password, existingVendor.password,existingVendor.salt)
    
      if(validation){
        
        const signature = await generateSignature({
            _id: existingVendor._id,
            email: existingVendor.email,
            name: existingVendor.name
        })

        return res.json(signature)
      }else{
        return res.json({"message":"Password not correct"})
      }
    }

    return res.json({"message":"Login Details not correct"})
}

export const GetVendorProfile =async (req:Request,res:Response) => {
    const user =req.user
    
    if(user){
        const existingUser =await findVendor(user._id)
        return res.json(existingUser)
    }
    return res.json({"message":"No user Found"})

}


export const UpdateVendorProfile =async (req:Request,res:Response) => {
    const {foodtype,name,address,phone} = <EditVendorInput>req.body
    const user =req.user
    
    
    if(user){
        const existingUser =await findVendor(user._id)

        if(existingUser!==null){
            existingUser.address=address
            existingUser.name=name
            existingUser.phone=phone
            existingUser.foodtype=foodtype

            const savedResult =await existingUser.save()
            return res.json(savedResult)
        }
        return res.json(existingUser)
    }
    return res.json({"message":"No user Found"})

}


export const UpdateVendorService =async (req:Request,res:Response) => {
    const user =req.user
    
    
    if(user){
        const existingUser =await findVendor(user._id)

        if(existingUser!==null){
           existingUser.serviceAvailable =!existingUser.serviceAvailable

            const savedResult =await existingUser.save()
            return res.json(savedResult)
        }
        return res.json(existingUser)
    }
    return res.json({"message":"No user Found"})
 
}


export const AddFood =async (req:Request,res:Response) => {
    const user =req.user
    
    
    if(user){
        const {name,description,foodtype,category,price,readytime} =<CreateFoodInput>req.body
        const vendor = await findVendor(user._id) 
         
        if(vendor!==null){
            const files = req.files as [Express.Multer.File]
           const images = files.map((file: Express.Multer.File) => file.filename);
            
            const createFood = await food.create({
                vendorId:vendor._id,
                name:name,
                description:description,
                foodtype:foodtype,
                category:category,
                price:price,
                readytime:readytime,
                rating:0,
                images:images,

            })

            vendor.foods.push(createFood)
            const result = await vendor.save()
            return res.json(result)
        }
    }
    return res.json({"message":"Something Wrong"})
 
}

export const UpdateCoverImage =async (req:Request,res:Response) => {
    const user =req.user
    
    
    if(user){
        const vendor = await findVendor(user._id) 
         
        if(vendor!==null){
            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            vendor.coverImage.push(...images);

            
            const result = await vendor.save()
            return res.json(result)
        }
    }
    return res.json({"message":"Something Wrong"})
 
}


export const GetFood =async (req:Request,res:Response) => {
    const user =req.user
    
    if(user){
        const foods = await food.find({vendorId:user._id})
        if(foods!==null){
            return res.json(foods)
        }
    }
    return res.json({"message":"Food not Found"})
 
}