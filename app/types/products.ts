
export type product = {
    _id:string
    name: string,
    description: string,
    price: number,
    category: string,
    images?: string[],
    stock: number,
    isFeatured?: boolean,
    createdAt: Date  
}


export type updateProductType = {
    productName?: string,
    description?: string,
    price?: number,
    category?: string,
    images?: [string],
    stock?: number,
    featured?: boolean
}
