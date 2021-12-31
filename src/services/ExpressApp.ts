import  express, { Application }  from "express";
import path from 'path'
import {AdminRoute,VendorRoute,ShoppingRoute, CustomerRoute} from '../routes'


export default async (app:Application) => {
//const PORT = 8000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use('/admin',AdminRoute)
app.use('/vendor',VendorRoute)
app.use(ShoppingRoute)
app.use('/customer',CustomerRoute)

return app
}


