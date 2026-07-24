import {
    setCache,
    getCache
} from "./src/services/cache.service";


async function test(){

    console.log("Saving to Redis...");

    await setCache(
        "test-school-search",
        {
            schools:[
                "ABC School",
                "Lewa International"
            ],
            cached:true
        },
        300
    );


    console.log("Reading from Redis...");


    const result = await getCache(
        "test-school-search"
    );


    console.log(result);

}


test()
.catch((error)=>{

    console.error(error);

});