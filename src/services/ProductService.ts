import { Product } from '@fineAndRare/models/Product';

export type CreateProductDto = {
    id:string;
    name: string;
    vintage: string
}

export class ProductService {
    async getProductsByIds(ids: string[]) {
        try {
            const result = await Product.find({ producer_id: { $in: ids } });
            return result;
        } catch (error) {
            console.error('Error in getProductsByIds:', error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    async getProductById(req: { id: string }) {
        try {
            const result = await Product.findById(req.id);
            return result;
        } catch (error) {
            console.error('Error in getProductById:', error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }

    async getProducts() {
        try {
            return await Product.find();
        } catch (error) {
            console.log(error);
        }
    }

    async createProducts(products: CreateProductDto) {
        try {
            const newProducts = await Product.insertMany(products);
            return newProducts;
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProducts(req: { ids: string[] }) {
        try {
            const productsDeleted = await Product.deleteMany({ _id: req.ids });
            return productsDeleted;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(req: Partial<CreateProductDto>) {
        try {
            const { id, ...updateDto } = req;
            const updateProduct = await Product.findByIdAndUpdate(id, updateDto, { new: true });
            return updateProduct;
        } catch (error) {
            console.error('Error in getProductsByIds:', error);
            throw error; // Rethrow the error to handle it elsewhere
        }
    }
}