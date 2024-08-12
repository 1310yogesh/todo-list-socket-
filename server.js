require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const { PORT } = process.env;
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const { sendMail } = require("./utils/mailer");
const { getTodayTask } = require("./controller/todo");
const cron = require('node-cron');

const io = socketIo(server
//     , {
//     path: "/todo/socket.io",
//     cors: {
//         origin: "*",
//         METHODS: ["GET","POST"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//         credential: true
//     }
// }
);

// only can able to execute 18000 port 
const whiteList = [
    "http://localhost:18000"
];

const corsOption = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callBack(new Error("Not allowed by CORS"));
        }
    }
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static("./images"));
app.set("socket.io", io);

module.exports = io;
require("./socketHandler");

app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "todo" });
});

app.use("/api", require("./router/index"));

// it will run every minute 
// adjest the time to run daily once
cron.schedule('* * * * *', async () => {
    const task = await getTodayTask();
    task.map((todo) => {
         sendMail("1013yogesh@gmail.com", todo?.id, todo?.task);
         io.emit("notification", `Reminder: Today is the Last Day to Complete Task-${todo.id}"`)
    });
});

// 404 handler
app.all("*", (req, res) => {
    return res.status(404).json({
        error: "404 not found",
    });
});

app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})
