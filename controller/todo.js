const todoList = require("../models/todo");
const createError = require("http-errors");
// const io = require("../server");
const { Op, fn } = require("sequelize");

// get all tasks
const getTodoList = async (req,res,next) => {
    const {
        page=1,
        pageSize=10,
        search="",
        orderBy,
        sortBy
    } = req?.query;
    try {
        const offsetValue = (page - 1) * pageSize;
        let orderCondition = [["id", "DESC"]]
        if(orderBy && sortBy) {
            orderCondition = [];
            orderCondition.push([orderBy, sortBy])
        }
        const { rows, count } = await todoList.findAndCountAll({
            where: {
                task: {
                    [Op.like]: `%${search}%`
                } 
            },
            offset: parseInt(offsetValue),
            limit: parseInt(pageSize),
            order: orderCondition
        });

        return res.status(200).json({
            totalPages: Math.ceil(count/pageSize),
            currentPage: page,
            rows
        })
    } catch (error) {
        return next(createError(500, error));
    }
};

// create new task using socket
const createTask = async (todo, io) => {
    try {
        let parseObj = JSON.parse(todo);
        const createTask = await todoList.create({
            task: parseObj?.task,
            taskDescription: parseObj?.description,
            estimatedTime: parseObj?.estimatedTime
        });
        // send response to client
        if(createTask) {
            io.emit("resmessage", "Task Created Successfully!");
        }else {
            io.emit("resmessage", "Task Creation failed!");
            return false
        }
    } catch (error) {
        // send error to client
        io.emit("errMessage", error?.message);
        return createError(500,error);
    }   
};

// update existing task using socket
const updateTask = async (todo, io) => {
    try {
        let parseObj = JSON.parse(todo);
        const checkTaskExist = await todoList.findOne({
            where: {
                id: parseObj?.id
            }
        });
        if(checkTaskExist) {
            const updateTask = await checkTaskExist.update({
                task: parseObj?.task,
                taskDescription: parseObj?.description,
                estimatedTime: parseObj?.estimatedTime
            });
            await updateTask.save();
            io.emit("resmessage", "Task Updated Successfully!");
        }else {
            io.emit("resmessage", "Task Not Found!");
        }
    } catch (error) {
        io.emit("errMessage", error?.message);
        return createError(500,error);
    };   
};

// delete task using socket
const deleteTask = async (todo, io) => {
    try {
        let parseObj = JSON.parse(todo);
        if(!parseObj?.id) {
            return io.emit("resmessage", "Task Id Required!");
        }
        const checkTaskExist = await todoList.destroy({
            where: {
                id: parseObj?.id
            }
        });
        if(checkTaskExist) {
            io.emit("resmessage", "Task Deleted Successfully!");
        }else {
            io.emit("resmessage", "Task Not Found!");
        }
    } catch (error) {
        io.emit("errMessage", error?.message);
        return createError(500,error);
    };   
};

// upload compressed image 
const uploadCompressedImage = async (req,res,next) => {
    const { id } = req.body;
    try {
        const imagePath = "/images/"+ req.file.originalname;
        console.log("imagePath",imagePath)
        const checkTaskExist = await todoList.findOne({
            where: {
                id: id
            }
        });
        if(checkTaskExist) {
            const result = await checkTaskExist.update({
                img: imagePath
            });
            await result.save();
            return res.status(200).json({ "message": "Image Uploaded Successfully!"});
        }else {
            return next(createError(500,"Task Not Found!"));
        }
    } catch (error) {
        return next(createError(500,error));
    }
};

// get tasks for cron job
const getTodayTask = async (req,res,next) => {
    try {
       const findTask = await todoList.findAll({
        where: {
            estimatedTime: {
                [Op.eq]: fn('CURDATE')
            }
        },
        attributes: ["id", "task"]
       });
       return findTask;
    } catch (error) {
        return next(createError(500,error))
    }
}

module.exports = { getTodoList, createTask, updateTask, deleteTask, uploadCompressedImage, getTodayTask };