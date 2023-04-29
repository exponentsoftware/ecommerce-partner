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
        const sellerProducts = await ProductModel.find({ sellerId: req.user.id })
        const newSellerProducts = sellerProducts.reverse().slice(0, 5)
        const sellerOrders = await OrdersModel.find({ 'products.product.sellerId': req.user.id, paymentStatus: true });
        const newSellerOrders = sellerOrders.reverse().slice(0, 5)
        const deliveredOrders = await OrdersModel.find({ 'products.product.sellerId': req.user.id, paymentStatus: true, deliveryStatus: true })
        const newDeliveredOrders = deliveredOrders.reverse().slice(0, 5)
        let date = (new Date()).getMonth() + 1
        const monthlyProducts = sellerProducts.filter((e) => {
            let substring = e.addedOn.substring(5, 7)
            return substring == date
        })
        let monthlyOrders = sellerOrders.filter((e) => {
            let substring = e.paymentDate.substring(5, 7)
            return substring == date
        })
        const monthlyDelivered = deliveredOrders.filter((e) => {
            let substring = e.paymentDate.substring(5, 7)
            return substring == date
        })
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ sellerProducts: newSellerProducts, sellerOrders: newSellerOrders, productLength: monthlyProducts, orderLength: monthlyOrders, deliveredOrders: newDeliveredOrders, monthlyDelivered: monthlyDelivered }), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);