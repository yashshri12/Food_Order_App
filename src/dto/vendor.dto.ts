export interface CreateVendorInput{
  name:string,
  ownername:string,
  foodtype:[string],
  pincode:string,
  address:string,
  phone:string,
  email:string,
  password:string
}

export interface VendorLoginInput{
  email:string,
  password:string
}

export interface VendorPayload {

  _id: string;
  email: string;
  name: string;

}

export interface EditVendorInput{
  name:string,
  address:string,
  phone:string,
  foodtype:[string],
 
}