import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "/Utils/JWTAuth"
import ProductModel from "@/Model/Products";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const sellerProducts = await ProductModel.find({ sellerId: req.user.id })
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ allProduct: sellerProducts }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);