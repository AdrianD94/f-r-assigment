import { ProducerService } from '@fineAndRare/services/ProducerService';
import { ProductService } from '@fineAndRare/services/ProductService';
import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { eventEmitter } from '@fineAndRare/services/eventEmitter';
import { downloadFile } from '@fineAndRare/services/syncronize';

const productService = new ProductService();
const producerService = new ProducerService();

const productType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        vintage: { type: GraphQLString },
        producer_id: { type: GraphQLID },
        producer: {
            type: producerType,
            async resolve(parent, _args) {
                if (parent.producer_id) {
                    return await producerService.getSingleProducer({ id: parent?.producer_id });
                }
                return;
            }
        }
    })
});

const producerType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Producer',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        region: { type: GraphQLString },
        products: {
            type: new GraphQLList(productType),
            async resolve(parent, _args) {
                return await producerService.getProductForProducer({ id: parent._id });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        product: {
            type: productType,
            args: { id: { type: GraphQLID } },
            async resolve(_parent, args) {
                return productService.getProductById(args as { id: string });
            }
        },
        products: {
            type: new GraphQLList(productType),
            async resolve(_parent, _args) {
                return await productService.getProducts();
            }
        },
        producers: {
            type: new GraphQLList(producerType),
            async resolve(_parent, _args) {
                return await producerService.getProducers();
            }
        }
    }
});
const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        createProducts: {
            type: new GraphQLList(productType),
            args: {
                products: {
                    type: new GraphQLNonNull(new GraphQLList(new GraphQLInputObjectType({
                        name: 'ProductInput',
                        fields: () => ({
                            name: { type: new GraphQLNonNull(GraphQLString) },
                            vintage: { type: new GraphQLNonNull(GraphQLString) },
                            producer_id: { type: new GraphQLNonNull(GraphQLID) },
                        }),
                    }))),
                },
            },
            async resolve(_parent, args) {
                return await productService.createProducts(args.products);
            }
        },
        updateProduct: {
            type: productType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                vintage: { type: GraphQLString },
                producer_id: { type: GraphQLID },
            },
            async resolve(_parent, args) {
                return await productService.updateProduct(args);
            }
        },
        deleteProducts: {
            type: new GraphQLObjectType({
                name: 'DelteProductsResult',
                fields: () => ({
                    deletedCount: { type: GraphQLInt },
                    acknowledged: { type: GraphQLBoolean }
                })
            }),
            args: {
                ids: {
                    type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
                }
            },
            async resolve(_parent, args) {
                return await productService.deleteProducts(args as { ids: string[] });
            }
        },
        syncronize: {
            type: GraphQLBoolean,
            async resolve(_parent, _args) {
                eventEmitter.emit('syncronize');
                return true;
            }
        },
        createProducer: {
            type: producerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                country: { type: GraphQLString },
                region: { type: GraphQLString },
            },
            async resolve(_parent, args) {
                return await producerService.createProducer(args.producer);
            }
        }
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});

eventEmitter.on('syncronize', async () => {
    await downloadFile();
});
