import mongoose from 'mongoose'


export const truncateTestDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://mongo:27017/invoice');

        const collections = await mongoose.connection.db.collections();
        // Clear all documents in each collection
        for (let collection of collections) {
            await collection.deleteMany({});
            // console.log(`Truncated collection: ${collection.collectionName}`);
        }

    }
    catch (err) {
        throw new Error(`Failed to connect to MongoDB: ${(err as Error).message}`);
    }
    finally {
        await mongoose.connection.close();
    }
}
