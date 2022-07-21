import express from 'express';

import routes from './routes';
import session from './session';

class Server {
    public express;

    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
        this.session();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes() {
        this.express.use(routes);
    }
    session() {
        this.express.use(session)
    }
}

const server = new Server();
server.express.listen(3333);