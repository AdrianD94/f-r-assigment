import { schema } from '@fineAndRare/schema/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { Config } from './config';
import { databaseConnection } from '@fineAndRare/database';


async function init() {
    const { PORT, DATABASE_URL } = new Config();
    await databaseConnection(DATABASE_URL);
    const app = express();
    app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: true
    }))

    app.listen({ port: PORT }, () => console.log(`Server started at http://localhost:${PORT}`));

}

init();