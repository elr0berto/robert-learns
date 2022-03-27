import express from 'express';

import routes from './routes';

class Server {
    public express;

    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes() {
        this.express.use(routes);
    }
}

const server = new Server();
server.express.listen(3333);