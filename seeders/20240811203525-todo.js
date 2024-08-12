const todoList = require("../models/todo");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const batchSize = 1000; 
        const totalRecords = 100000;

        for (let i = 0; i < totalRecords; i += batchSize) {
            const records = [];
            for (let j = 0; j < batchSize; j++) {
                records.push({
                    task: `Task-${i+j}`,
                    taskDescription: `Task-${i+j} Description`,
                    estimatedTime: new Date(),
                });
            }

            await todoList.bulkCreate(records);
            console.log(`Inserted ${i + batchSize} records`);
        }
    },

    down: async (queryInterface, Sequelize) => {
       
    }
};
