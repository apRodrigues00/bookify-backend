import express from "express";
import cors from "cors";
import usersRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";

const app = express();
const port = 8080;

const allowedOrigins = ["http://localhost:4200"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "A política de CORS para esta origem não permite acesso.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
}));

app.use(express.json());

app.use('/', usersRoute);
app.use('/', authRoute);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
