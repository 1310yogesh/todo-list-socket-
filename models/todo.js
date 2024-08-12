const { sequelize } = require("./index");
const { Sequelize, DataTypes } = require('sequelize');

const todoList = sequelize.define('todo', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taskDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estimatedTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = todoList;