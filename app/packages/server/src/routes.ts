import { Sequelize } from 'sequelize';
import { Router } from 'express';
import sequelize from "./db/instance";
//import {RobertLearnsTest} from "@elr0berto/robert-learns-shared/src/test";



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