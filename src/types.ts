import { ObjectId } from "mongodb"


export type User={
    _id:ObjectId,
    email:string,
    password:string,
    clothes:string[]
}


export type Clothing={
    _id?:ObjectId
    name:string,
    size:string,
    color:string,
    price:number
}