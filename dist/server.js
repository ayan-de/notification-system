"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_cofig_1 = require("./DB/db.cofig");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await (0, db_cofig_1.connectDB)(); // connect Prisma
        app_1.default.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received: shutting down gracefully");
    await (0, db_cofig_1.disconnectDB)();
    process.exit(0);
});
process.on("SIGINT", async () => {
    console.log("SIGINT received: shutting down gracefully");
    await (0, db_cofig_1.disconnectDB)();
    process.exit(0);
});
startServer();
