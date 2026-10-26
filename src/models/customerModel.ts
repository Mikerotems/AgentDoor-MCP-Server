import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    cust_name: {type: String, required: true},
    cust_email: {type: String, requires: true},
    cust_phone: {type: String, required: true}
}, {timestamps: true});

export const customerModel = mongoose.model("Customer", customerSchema);