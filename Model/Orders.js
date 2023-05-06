import mongoose from "mongoose";

const Order = new mongoose.Schema({
    paymentStatus: Boolean,
    fullName: String,
    userId: String,
    email: String,
    mobileNumber: String,
    DeliveryAddress: String,
    products: Array,
    paymentURL: String,
    paymentID: String,
    deliveryDate: String,
    paymentDate: String,
    orderId: String,
    subTotal: String,
    shippingCharges: String,
    tax: String,
    grandTotal: String,
    packedStatus: Boolean,
    packedOn: String,
    city: String,
    deliveryStatus: Boolean,
    deliveredDate: String,
    deliveredBy: String,
    receivedBy: String,
});

const OrdersModel = mongoose.models.Order || mongoose.model('Order', Order);

export default OrdersModel;