import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateSignature } from "../utility";


declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenicate =async (req:Request,res:Response,next:NextFunction) => {
    const signature = await validateSignature(req);
    if(signature){
        return next()
    }else{
        return res.json({message: "User Not authorised"});
    }
}