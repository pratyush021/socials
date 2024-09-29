import { PrismaClient } from '@prisma/client';

const prismaClientSingleton =()=>{
    return new PrismaClient(); 
}

/**
 * Declares a global variable `prismaGlobal` that can either be `undefined` 
 * or an instance of the Prisma client singleton.
 * 
 * This is used to ensure that the Prisma client is instantiated only once 
 * and can be reused across the application, preventing multiple instances 
 * and potential connection issues.
 * 
 * @global
 * @var {undefined | ReturnType<typeof prismaClientSingleton>} prismaGlobal
 */
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma; 

if(process.env.NODE_ENV !== 'production'){
    globalThis.prismaGlobal = prisma; 
}

