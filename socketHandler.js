const io = require("./server");
const { createTask, updateTask, deleteTask } = require("./controller/todo");

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on("createTodo", async (todo) => {
        const add = await createTask(todo, io);
    });

    socket.on("updateTodo", async (todo) => {
        const update = await updateTask(todo, io);
    });

    socket.on("deleteTodo", async (todo) => {
        const remove = await deleteTask(todo, io);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});