import { Schema, model } from 'mongoose';

import { producerSchema } from './Producer';

const productSchema = new Schema({
    vintage: {
        type: String,
        reguired: true
    },
    name: {
        type: String,
        required: true
    },
    producer_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    producer: {
        type: producerSchema
    }
});

export const Product = model('Product', productSchema);