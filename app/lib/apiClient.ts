"use client"

import axios from "axios"

const url = "http://localhost:3000/api" as string;


export const api = axios.create({
    baseURL:url,
})







