import crypto from "crypto";
import redis, { connectRedis } from "../config/redis";



function normalizeKey(key:string){

    return crypto
        .createHash("sha256")
        .update(
            key.trim().toLowerCase()
        )
        .digest("hex");

}




export async function setCache(
    key:string,
    value:any,
    ttl:number = 3600
){

    await connectRedis();


    const hashedKey =
        normalizeKey(key);


    await redis.set(
        hashedKey,
        JSON.stringify(value),
        {
            EX: ttl
        }
    );

}




export async function getCache(
    key:string
){

    await connectRedis();


    const hashedKey =
        normalizeKey(key);



    const data =
        await redis.get(hashedKey);



    if(!data){

        return null;

    }



    return JSON.parse(data);

}




export async function deleteCache(
    key:string
){

    await connectRedis();


    const hashedKey =
        normalizeKey(key);



    await redis.del(hashedKey);

}