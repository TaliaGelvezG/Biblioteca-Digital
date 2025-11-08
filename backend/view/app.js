const express = require("express");
const app = express();
const mongoDbConfig = require("../controller/config/mongodb-connection-config.js");
const authMiddleware = require("../controller/middlewares/authMiddleware.js");
const userController = require("../controller/user-controller.js");
const bookController = require("../controller/book-controller.js");
const loanController = require("../controller/loan-controller.js");
const seedBooks = require("../controller/seed.js").seedBooks;
const cors = require("cors");

require("dotenv").config()

app.use(cors());
app.use(authMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`${process.env.BASE_PATH}/health`, (req, res)=>{
    res.json({
        "State": "UP",
        "Description": "The application is running"
    })
});

app.use(`${process.env.BASE_PATH}/users`, userController);
app.use(`${process.env.BASE_PATH}/books`, bookController);
app.use(`${process.env.BASE_PATH}/loans`, loanController);

const startServer = async () => {
    await mongoDbConfig;
    app.listen(process.env.PORT, () =>
      console.info(`Server listen in port ${process.env.PORT}`)
    );
}
seedBooks();
startServer();
  