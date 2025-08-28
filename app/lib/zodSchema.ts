import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "product name must be 3 characters")
    .max(30, "productName  maximum is 30 characters  "),
  description: z.string().min(5, "product description is required"),
  price: z.number().min(1, "product price is must be grater than 0"),
  categoryId: z.string().min(1, "category is required"),
  images: z.array(z.string().url()).max(5,"product image is only allowed by 5 image").optional(),
  stock: z.number().min(1, "Stock must be at least 1"),
  isFeatured: z.boolean().optional().default(false),
});


export const updateProductSchema = productSchema.partial()
export type FormData = z.infer<typeof productSchema>


export const categorySchema = z.object({
  name:z.string().min(1,"category name is required")
})
export type categoryInput = z.infer<typeof categorySchema>

export const orderSchema = z.object({
  name:z.string().min(1,"fullname is required"),
  email:z.email("invalid email"),
  phone:z.string().min(8,"phone is not valid").max(20,"phone is not valid"),
  postalCode:z.string().min(1,"postal code is required"),
  address:z.string().min(3,"address is required")

})

export type OrderInput = z.infer<typeof orderSchema>
