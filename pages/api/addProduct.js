import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "/Utils/JWTAuth"
import cloudinary from 'cloudinary'
import ProductModel from "@/Model/Products";
import RegisterModel from "@/Model/User";


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
}

const uploadToCloudinary = async (image) => {
    try {
        const data = await cloudinary.v2.uploader.upload(image, { folder: 'E-commerce' });
        return data
    } catch (error) {
        console.log(error)
        return { message: "Error" };
    }
}

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();

        let responseData = await RegisterModel.findOne({ _id: req.user.id })
        let bytesEmail = responseData.email ? CryptoJS.AES.decrypt(responseData.email, process.env.JWT) : '';
        let decryptEmail = bytesEmail ? bytesEmail.toString(CryptoJS.enc.Utf8) : '';
        let bytesFullName = responseData.fullName ? CryptoJS.AES.decrypt(responseData.fullName, process.env.JWT) : '';
        let decryptFullName = bytesFullName ? bytesFullName.toString(CryptoJS.enc.Utf8) : '';
        let bytesNumber = responseData.mobileNumber ? CryptoJS.AES.decrypt(responseData.mobileNumber, process.env.JWT) : '';
        let decryptNumber = bytesNumber ? bytesNumber.toString(CryptoJS.enc.Utf8) : '';
        let bytesDisplayName = responseData.displayName ? CryptoJS.AES.decrypt(responseData.displayName, process.env.JWT) : '';
        let decryptDisplayName = bytesDisplayName ? bytesDisplayName.toString(CryptoJS.enc.Utf8) : '';
        let bytesAddress = responseData.address ? CryptoJS.AES.decrypt(responseData.address, process.env.JWT) : '';
        let decryptAddress = bytesAddress ? bytesAddress.toString(CryptoJS.enc.Utf8) : '';

        if (!decryptEmail || decryptEmail === 'Empty' || !decryptFullName || decryptFullName === 'Empty' || !decryptNumber || decryptNumber === 'Empty' || !decryptDisplayName || decryptDisplayName === 'Empty' || !decryptAddress || decryptAddress === 'Empty') {
            res.status(200).json({ message: 'Please complete your profile.' })
            return;
        }

        const { title, desc, brand, category, addedOn, price, img1, img2, img3, img4, img1Desc, img2Desc, img3Desc, img4Desc } = req.body.data;
        let image1, image2, image3, image4;
        if (img1) {
            console.log('UPLOADING IMG1')
            const status = await uploadToCloudinary(img1);
            console.log('UPLOADED IMG1')
            if (status.secure_url) {
                image1 = status.secure_url
            }
            else {
                res.status(400).json({ message: 'Error, please try again...' })
            }
        }
        if (img2) {
            console.log('UPLOADING IMG2')
            const status = await uploadToCloudinary(img2);
            console.log('UPLOADED IMG2')
            if (status.secure_url) {
                image2 = status.secure_url
            }
            else {
                res.status(400).json({ message: 'Error, please try again...' })
            }
        }
        if (img3) {
            console.log('UPLOADING IMG3')
            const status = await uploadToCloudinary(img3);
            console.log('UPLOADED IMG3')
            if (status.secure_url) {
                image3 = status.secure_url
            }
            else {
                res.status(400).json({ message: 'Error, please try again...' })
            }
        }
        if (img4) {
            console.log('UPLOADING IMG4')
            const status = await uploadToCloudinary(img4);
            console.log('UPLOADED IMG4')
            if (status.secure_url) {
                image4 = status.secure_url
            }
            else {
                res.status(400).json({ message: 'Error, please try again...' })
            }
        }
        console.log('images', image1, image2, image3, image4)
        const product = new ProductModel({
            sellerId: req.user.id,
            title: title,
            images: [
                {
                    image: image1,
                    desc: img1Desc
                },
                {
                    image: image2,
                    desc: img2Desc
                },
                {
                    image: image3,
                    desc: img3Desc
                },
                {
                    image: image4,
                    desc: img4Desc
                }
            ],
            description: desc,
            price: price,
            brand: brand,
            category: category,
            thumbnail: image1 || image2 || image3 || image4,
            addedOn: addedOn,
        })
        await product.save();
        res.status(200).json({ message: 'Success' })
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);