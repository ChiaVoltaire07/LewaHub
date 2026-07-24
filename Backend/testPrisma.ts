import prisma from "./src/lib/prisma";


async function test(){

    const schools = await prisma.school.findMany();

    console.log(schools);

}


test()
.catch(console.error)
.finally(async()=>{

    await prisma.$disconnect();

});
