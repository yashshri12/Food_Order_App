
export const GenerateOtp = () =>{
    let otp = Math.floor(10000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime()+(30*60*1000))

    return {otp,expiry}
}

export const onRequestOtp =async(otp:number,toPhoneNumber:string) =>{
    const accountSid='AC6c500ca0eba3ab9b9a1ce97a92f89d8b'
    const authToken='da7caa231c51f560220276b046619989'

    const client = require('twilio')(accountSid,authToken)

    const response =await client.messages.create({
        body:`Otp is${otp}`,
        from:'+12172900925',
        to:`+91${toPhoneNumber}`
    })

    return response
}