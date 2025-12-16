import { IResolvers } from "@graphql-tools/utils";
import { createUser, validateUser } from "../collections/users";
import { signToken } from "../auth";
import { buyRopa, createRopita, deleteRopa, getRopita, getRopitaID } from "../collections/ropa";
import { getDb } from "../db/mongo";
import { ObjectId } from "mongodb";
import { RopaCOLLECTION } from "../utils";
import { Clothing, User } from "../types";


export const resolvers: IResolvers = {

    User:{
        clothes:async(parent:User)=>{
            const db=getDb()
            const ids=parent.clothes as Array<string>||[]

            const idMongo= ids.map(x=>new ObjectId(x))

            return await db.collection<Clothing>(RopaCOLLECTION).find({
                _id:{$in:idMongo}

            }).toArray()

        }
    },

    Mutation: {
        register: async (_, { email, password }: { email: string, password: string }) => {
            const idClienteCreado = await createUser(email, password)
            return signToken(idClienteCreado)
        },
        login: async (_, { email, password }: { email: string, password: string }) => {
            const user = await validateUser(email, password)
            if (!user) { throw new Error("Credencialias no validos") }
            return signToken(user._id.toString())
        },
        addClothing: async (_, { name, size, color, price }, { user }) => {
            if (!user) {
                throw new Error("logeate")
            }
            const result = await createRopita(name, size, color, price)
            return result

        },
        buyClothing:async(_,{clothingId},{user})=>{
            if (!user) {
                throw new Error("logeate")
            }
            return await buyRopa(clothingId,user._id.toString())
        },
        deleteClothing:async(_,{id},{user})=>{
            if(!user){
                throw new Error("logeate")
            }

            return deleteRopa(id,user._id.toString())

        }

    },
    Query: {
        me: async (_, __, { user }) => {
            console.log(user)
            if (!user) {
                throw new Error("logeate perro")
            }
             return {
                _id: user._id,
                ...user
            }
        },
        clothes: async (_, { page, size }) => {
            return await getRopita(page, size)
        },
        clothing: async (_, { id }) => {
            return await getRopitaID(id)
        }
    }
}
