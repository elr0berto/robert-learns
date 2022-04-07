import {Sequelize} from "sequelize";

const sequelize = new Sequelize('robertlearns', 'robertlearns', 'robertlearns', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;