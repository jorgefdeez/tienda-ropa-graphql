import { ObjectId } from "mongodb"
import { getDB } from "../db/mongo"
import { RopaCOLLECTION, userCOLLECTION } from "../utils"


export const getRopita = async (page?: number, size?: number) => {
    const db = getDB()
    //const localPage=page ?page :1
    page = page || 1
    size = size || 10

    return await db.collection(RopaCOLLECTION).find().skip((page - 1) * size).limit(size).toArray()
}

export const getRopitaID = async (id: string) => {
    const db = getDB()
    return await db.collection(RopaCOLLECTION).findOne({ _id: new ObjectId(id) })
}

export const createRopita = async (name: string, size: string, color: string, price: number) => {
    const db = getDB()
    const result = await db.collection(RopaCOLLECTION).insertOne({
        name,
        size,
        color,
        price
    })
    const newClothing = await getRopitaID(result.insertedId.toString())
    return newClothing
}

export const buyRopa = async (idRopa: string, userId: string) => {
    const db = getDB()
    const ropaAñadir = await getRopitaID(idRopa)
    if (!ropaAñadir) {
        throw new Error("Ropa no encontrada")
    }
    await db.collection(userCOLLECTION).updateOne({
        _id: new ObjectId(userId)
    },
        { $addToSet: { clothes: idRopa } }
    )

    const updateUser = await db.collection(userCOLLECTION).findOne({
        _id: new ObjectId(userId)
    })

    return updateUser
}