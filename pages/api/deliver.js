import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "/Utils/JWTAuth"
import OrdersModel from "@/Model/Orders";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const deliver = await OrdersModel.find({ 'products.product.sellerId': req.user.id, paymentStatus: true, deliveryStatus: true, packedStatus: true});
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ deliver: deliver }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);