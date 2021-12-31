import express, {Request, Response, NextFunction} from 'express'
import { FoodDoc, Vendor } from '../models'


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode

    const result = await Vendor.find({pincode:pincode,serviceAvailable:false}).sort([['rating','descending']])
    .populate('foods')

    if(result.length>0){
        return res.status(200).json(result)
    }

    return res.status(400).json({"message":"Data Not Found"})
  
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode

    const result = await Vendor.find({pincode:pincode,serviceAvailable:false}).sort([['rating','descending']])
    .limit(1)
    if(result.length>0){
        return res.status(200).json(result)
    }

    return res.status(400).json({"message":"Data Not Found"})
  
}

export const GetFoodsIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode

    const result = await Vendor.find({pincode:pincode,serviceAvailable:false}).sort([['rating','descending']])
    .populate('foods')
    if(result.length>0){
        let foodresult: any=[]
      
        result.map(vendor=>{
            const foods= vendor.foods as [FoodDoc]
            foodresult.push(...foods.filter(food => food.readytime<=30))

        })
          
        return res.status(200).json(foodresult)
    }

    return res.status(400).json({"message":"Data Not Found"})
  
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode

    const result = await Vendor.find({pincode:pincode,serviceAvailable:false}).sort([['rating','descending']])
    .populate('foods')

    if(result.length>0){ 
        let foodresult: any=[]
      
        result.map(item => foodresult.push(...item.foods) )
     

        return res.status(200).json(foodresult)
    }

    return res.status(400).json({"message":"Data Not Found"})
  
    
}

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {
     const id =req.params.id

     const result = await Vendor.findById(id).populate('foods')

     if(result){
      return res.status(200).json(result)
     }
    return res.status(400).json({"message":"Data Not Found"})
}


export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {

}