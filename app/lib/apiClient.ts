"use client"

import axios from "axios"

const url = "https://trenda-sand.vercel.app//api" as string;


export const api = axios.create({
    baseURL:url,
})







