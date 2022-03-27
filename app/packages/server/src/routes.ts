import { Router } from 'express';
import {RobertLearnsTest} from "@elr0berto/robert-learns-shared/src/test";

const routes = Router();

routes.get('/api', (_, res) => {
    const x : RobertLearnsTest = {xxx:true};
    return res.json({ message: 'Hello World API' });
});

export default routes;