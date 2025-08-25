import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    email: string;
    username: string;
}

export type registerUser = {
    username: string;
    email: string;
}


export type loginUserResponse = {
    _id: string;
    email: string;
    username:string
}