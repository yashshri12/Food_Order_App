import express, {Request,Response,NextFunction} from 'express'
import {plainToClass} from 'class-transformer'
import {validate} from 'class-validator'
import { CreateCustomerInput, CustomerLoginInput, EditCustomerProfileInput } from '../dto/Customer.dto'
import { GenerateOtp, generatePassword, generateSalt, generateSignature, onRequestOtp, validatePassword } from '../utility'
import { Customer } from '../models'

export const CustomerSignup =async (req:Request,res:Response,next:NextFunction) => {
    const customerInput = plainToClass(CreateCustomerInput,req.body)
    
    const InputError =await validate(customerInput,{validationError:{target:true}})

    if(InputError.length > 0){
        return res.status(400).json(InputError)
    }

    const {email,phone,password} = customerInput

    const salt =await generateSalt()
    const userPassword = await generatePassword(password,salt)

    const {otp,expiry}= GenerateOtp()
    const existingCustomer =  await Customer.findOne({ email: email});
    
    if(existingCustomer !== null){
        return res.status(400).json({message: 'Email already exist!'});
    }

    const result = await Customer.create({
        email:email,
        password:userPassword,
        salt:salt,
        phone:phone,
        otp:otp,
        otp_expiry:expiry,
        firstname:'',
        lastname:'',
        address:'',
        verified:false,
        lat:0,
        long:0

    })

    if(result){
       await onRequestOtp(otp,phone)

       const signature= await generateSignature({
           _id:result._id,
           email:result.email,
           verified:result.verified

       })

       return res.status(201).json({signature:signature,verified:result.verified,email:result.email})
    }

    return res.status(400).json({"message":"error with Signup"})
}

export const CustomerLogin =async (req:Request,res:Response,next:NextFunction) => {
    const customerLogin = plainToClass(CustomerLoginInput,req.body)

    const loginError = await validate(customerLogin,{validationError:{target:false}})

    if(loginError.length > 0){
        return res.status(400).json(loginError)
    }

    const {email,password} = customerLogin
    const customer= await Customer.findOne({email:email})

    if(customer){
        const validation = await validatePassword(password,customer.password,customer.salt)
    
       if(validation){
        const signature= await generateSignature({
            _id:customer._id,
            email:customer.email,
            verified:customer.verified
 
        })
 
        return res.status(201).json({signature:signature,verified:customer.verified,email:customer.email})

       }
    }
    return res.status(404).json({"message":"error with login"})
}

export const CustomerVerify =async (req:Request,res:Response,next:NextFunction) => {
    const {otp} =req.body
    const customer =req.user

    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
               profile.verified = true
               const updateCustomerResponse = await profile.save()
       
               const signature= await generateSignature({
                _id:updateCustomerResponse._id,
                email:updateCustomerResponse.email,
                verified:updateCustomerResponse.verified
     
            })
            return res.status(201).json({signature:signature,verified:updateCustomerResponse.verified,email:updateCustomerResponse.email})
     
            }

        }
    }
    return res.status(400).json({"message":"error with otp"})

}

export const RequestOtp =async (req:Request,res:Response,next:NextFunction) => {
    const customer =req.user

    if(customer){
        const profile =await Customer.findById(customer._id)

        if(profile){
            const {otp,expiry} = GenerateOtp()
            profile.otp = otp
            profile.otp_expiry = expiry
            
            await profile.save()
            await onRequestOtp(otp,profile.phone)
            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})

        }
    }
    return res.status(400).json({"message":"error with otp"})

}

export const GetCustomerProfile =async (req:Request,res:Response,next:NextFunction) => {
    const customer  =req.user

    if(customer){
        const profile =await Customer.findById(customer._id)
           
        if(profile){
            return res.status(200).json(profile)

        }
    }
    return res.status(400).json({"message":"error"})
   
}

export const EditCustomerProfile =async (req:Request,res:Response,next:NextFunction) => {
    const customer  =req.user
    
    const profileInput = plainToClass(EditCustomerProfileInput,req.body)

    const profileError = await validate(profileInput,{validationError:{target:false}})
    
    if(profileError.length > 0){
        return res.status(400).json(profileError)
    }

    const {firstname,lastname,address} = profileInput

    if(customer){
        const profile =await Customer.findById(customer._id)
           
        if(profile){
            profile.firstname=firstname
            profile.lastname=lastname
            profile.address=address
            const result =  await profile.save()
            return res.status(200).json(result)

        }
    }
    return res.status(400).json({"message":"error"})
   
}