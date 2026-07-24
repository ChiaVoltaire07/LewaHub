import {
    Request,
    Response
} from "express";


import {
    searchSchools
} from "../services/search.service";



export async function search(
    req:Request,
    res:Response
){

    try{

        const query =
            req.query.query as string;


        if(!query){

            return res.status(400).json({

                success:false,

                message:"Search query required"

            });

        }


        const result =
            await searchSchools(query);



        res.json({

            success:true,

            data:result

        });



    }catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Search failed"

        });

    }

}