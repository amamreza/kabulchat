import {} from 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';

import models from './models';
import schema from './schema';
import resolvers from './resolvers';
import { createApolloServer } from './utils/apollo-server';

// Connect to database
const mongoUrl = 'mongodb://localhost:27017/appdb'; //'mongodb+srv://testappusername:@Yhdxs32@cluster0.jd96o.mongodb.net/appdb?retryWrites=true&w=majority'
mongoose
    .connect(mongoUrl, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connected'))
    .catch((err) => console.error(err));

// Initializes application
const app = express();

// Enable cors
const corsOptions = {
    origin: 'http://localhost:3000', //process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));

// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql' });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Listen to HTTP and WebSocket server
const PORT = '4000'; // process.env.PORT || process.env.API_PORT;
httpServer.listen({ port: PORT }, () => {
    console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});