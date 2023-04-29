import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await RegisterModel.findOne({ _id: req.user.id })
        let bytesEmail = responseData.email ? CryptoJS.AES.decrypt(responseData.email, process.env.JWT) : '';
        let decryptEmail = bytesEmail ? bytesEmail.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesFullName = responseData.fullName ? CryptoJS.AES.decrypt(responseData.fullName, process.env.JWT) : '';
        let decryptFullName = bytesFullName ? bytesFullName.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesNumber = responseData.mobileNumber ? CryptoJS.AES.decrypt(responseData.mobileNumber, process.env.JWT) : '';
        let decryptNumber = bytesNumber ? bytesNumber.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesDisplayName = responseData.displayName ? CryptoJS.AES.decrypt(responseData.displayName, process.env.JWT) : '';
        let decryptDisplayName = bytesDisplayName ? bytesDisplayName.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesAddress = responseData.address ? CryptoJS.AES.decrypt(responseData.address, process.env.JWT) : '';
        let decryptAddress = bytesAddress ? bytesAddress.toString(CryptoJS.enc.Utf8) : 'Empty';

        /* Construct Account Data */
        const data = {
            name: decryptFullName,
            email: decryptEmail,
            number: decryptNumber,
            address: decryptAddress,
            displayName: decryptDisplayName,
            id: responseData._id
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext})

    } catch (error) {
        res.status(400).json({ message: 'Error, please try again' })
    }
}


export default JWTAuth(handler);