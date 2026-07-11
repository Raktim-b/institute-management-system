require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const DbCon = require("./app/config/db");
const router = require("./app/routes");
const logger = require("./app/utils/logger");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const SwaggerOptions = require("./swagger.json");
const swaggerDocument = swaggerJsDoc(SwaggerOptions);
const app = express();
DbCon();

app.use(morgan("dev"));
app.use(express.json());
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server connected ${PORT}`);
});
