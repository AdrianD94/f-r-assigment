import { Producer } from '@fineAndRare/models/Producer';
import { Product } from '@fineAndRare/models/Product';

type CreateProducerDto = {
    name: string;
    region: string;
    country: string
}
export class ProducerService {
    async getProducersByIds(ids: string[]) {
        try {
            const result = await Producer.find({ _id: { $in: ids } });
            return result;
        } catch (error) {
            console.error('Error in getProducersByIds:', error);
            throw error;
        }
    }
    async getProducers() {
        try {
            return await Producer.find();
        } catch (error) {
            console.log(error);
        }
    }

    async createProducer(producerDto: CreateProducerDto) {
        try {
            const producer = new Producer(producerDto);
            const newProducer = await producer.save();
            return newProducer;
        } catch (error) {
            console.log(error);
        }
    }

    async getSingleProducer(req: { id: string }) {
        try {
            return await Producer.findById(req.id);
        } catch (error) {
            console.log(error);
        }
    }

    async getProductForProducer(req: { id: string }) {
        return Product.find({ producer_id: req.id });
    }
}