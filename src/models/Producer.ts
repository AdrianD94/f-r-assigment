import { Schema, model } from 'mongoose';

export const producerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
    region: {
        type: String
    }
});

export const Producer = model('Producer', producerSchema);