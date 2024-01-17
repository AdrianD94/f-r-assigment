import { writeFile } from 'fs/promises';
import fs from 'fs';

import { Producer } from '@fineAndRare/models/Producer';
import { Product } from '@fineAndRare/models/Product';
import csv from 'csv-parser';

export async function downloadFile() {
    const response = await fetch('https://api.frw.co.uk/feeds/all_listings.csv');
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile('all_listings.csv', buffer);
    await readCsv();
}

async function readCsv() {
    const batchSize = 100;
    let currentBatch = 0;
    let batchRows: any[] = [];
    const readStream = fs.createReadStream('../all_listings.csv');
    readStream.pipe(csv())
        .on('data', (row) => {
            batchRows.push(row);
            currentBatch++;

            if (currentBatch === batchSize) {
                processBatch(batchRows);
                currentBatch = 0;
                batchRows = [];
            }
        })
        .on('end', () => {
            console.log('CSV read stream ended.');
        })
        .on('error', (error) => {
            console.error('Error in CSV read stream:', error);
        });
}

async function processBatch(batch: any[]) {
    const producerData = batch.map((b) => {
        return {
            name: b.Producer,
            country: b.Country,
            region: b.Region
        };
    });
    await Producer.bulkWrite(producerData.map(producer => ({
        updateOne: {
            filter: {
                name: producer.name
            },
            update: { $set: producer },
            upsert: true
        }
    })
    ));
    const producers = await Producer.find();
    const productData = batch.map((b) => {
        {
            return {
                name: b['Product Name'],
                vintage: b.Vintage,
                producerName: b.Producer
            };
        }
    });
    const productToSave = productData.map((product) => {
        const producer_id = producers.find((produce) => produce.name === product.name)?._id;
        return {
            name: product.name,
            vintage: product.vintage,
            producer_id: producer_id
        };
    });
    await Product.bulkWrite(productToSave.map((product) => ({
        updateOne: {
            filter: {
                name: product.name,
                vintage: product.vintage,
            },
            update: {
                $set: product
            },
            upsert: true
        }
    })));
}