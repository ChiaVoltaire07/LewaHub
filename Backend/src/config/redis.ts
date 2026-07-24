import { createClient } from "redis";


const redis = createClient({
    url: "redis://localhost:6379"
});


redis.on("ready", () => {
    console.log("Redis ready 🚀");
});


redis.on("error", (err) => {
    console.log("Redis error:", err);
});


export async function connectRedis(){

    if(!redis.isOpen){

        await redis.connect();

    }

}


export default redis;