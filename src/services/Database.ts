import  mongoose  from "mongoose";
import { MONGO_URL } from "../config";


export default async () => {
    try{
    await mongoose.connect(MONGO_URL).then((result)=>{
        //console.log(result)
        console.log("MongoDB Connected")
    }).catch((error)=>{
        console.log(error)
    })
           
    }catch(err){
        console.log(err)
    }
    
}

