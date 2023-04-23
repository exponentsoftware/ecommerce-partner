import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "/Utils/JWTAuth"
import ProductModel from "@/Model/Products";
import OrdersModel from "@/Model/Orders";


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let sellerProducts = await ProductModel.find({ sellerId: req.user.id })
        sellerProducts = sellerProducts.reverse().slice(0, 5)
        let sellerOrders = await OrdersModel.find({ 'products.product.sellerId': req.user.id, paymentStatus: true })
        sellerOrders = sellerOrders.reverse().slice(0, 5)
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({sellerProducts: sellerProducts, sellerOrders: sellerOrders}), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);