import { Sequelize } from 'sequelize';
import { Router } from 'express';
//import {RobertLearnsTest} from "@elr0berto/robert-learns-shared/src/test";


const sequelize = new Sequelize('robertlearns', 'robertlearns', 'robertlearns', {
    host: 'localhost',
    dialect: 'mysql',
});

const routes = Router();

routes.get('/api', async (_, res) => {
    try {
        await sequelize.authenticate();
        return res.json({message: 'db Succuess'});
    } catch (error) {
        return res.json({message: 'db suxx'});
    }
});

export default routes;