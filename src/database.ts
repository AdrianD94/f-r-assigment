
import mongoose from 'mongoose';

export const databaseConnection = async (dbUrl: string): Promise<void> => {
    try {
        await mongoose.connect(dbUrl);
        console.log('API successfully connected to database.');
    } catch (error) {
        console.error('Unable to connect to MongoDD', error);
    }
};
