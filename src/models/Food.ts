import mongoose, {Schema,Document,Model} from 'mongoose'
import { transform } from 'typescript'

export interface FoodDoc extends Document{
    vendorId:string,
    name:string,
    description:string,
    category:string,
    foodtype:string,
    readytime:number,
    price:number,
    rating:number,
    images:[string]
}

const FoodSchema =new Schema({
    vendorId:{type:String},
    name:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String},
    foodtype:{type:String,required:true},
    readytime:{type:Number},
    price:{type:Number,required:true},
    rating:{type:Number},
    images:{type:[String]}
},{
    toJSON:{transform(doc,ret){
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;

    }
    },
    timestamps:true
})

const food  =mongoose.model<FoodDoc>('food',FoodSchema) 
export {food}