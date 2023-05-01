import MongoDBConnect from "@/Utils/MongoDB"
import JWTAuth from "@/Utils/JWTAuth"
import OrdersModel from "@/Model/Orders"
import moment from "moment"


const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        res.status(400).json({ message: 'Only PUT requests allowed.' })
    }
    try {
        const { field } = req.body;
        await MongoDBConnect();
        let time = moment().format()
        await OrdersModel.updateOne({ _id: field }, { $set: { packedStatus: true, packedOn: time } })
        res.json({ message: 'Success' })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again' })
    }
}


export default JWTAuth(handler);