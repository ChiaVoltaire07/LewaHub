import express from "express";
import searchRoutes from "./routes/search.routes";
import redis from "./config/redis";

const app = express();


// Middleware
app.use(express.json());


// Routes
app.use(
    "/api/search",
    searchRoutes
);


// Test route
app.get("/", (req, res) => {
    res.send("LewaHub API running 🚀");
});


// Server start
const PORT = 5001;
//Server start
redis.connect();

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});