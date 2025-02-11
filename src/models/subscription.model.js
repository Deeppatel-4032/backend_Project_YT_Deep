import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId, // One Who are subscriber
        ref : "user",
    },
    channel : {
        type : Schema.Types.ObjectId, // One Who are "subscriber" is subscribing
        ref : "user",
    },
}, { timestamps : true });

export const subscriptionModel = mongoose.model("subscriptions", subscriptionSchema)