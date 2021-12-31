import { Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config'
import { VendorPayload } from '../dto/vendor.dto'
import { AuthPayload } from '../dto/Auth.dto'

export const generateSalt =async () => {
    return await bcrypt.genSalt()
}

export const generatePassword =async (password:string,salt:string) => {
    return await bcrypt.hash(password,salt)
}

export const validatePassword =async (enteredpassword:string,savedpassword:string,salt:string) => {
    return await generatePassword(enteredpassword,salt) === savedpassword
}

export const generateSignature =async (payload:AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d'});
    //return signature
}

export const validateSignature =async (req:Request) => {
    const signature= req.get('Authorization')
    
    if(signature){
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload; 
        req.user=payload
        return true;
    }
    
    return false
}