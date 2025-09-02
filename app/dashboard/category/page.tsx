"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Tag } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { categoryInput, categorySchema } from "@/app/lib/zodSchema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/app/lib/apiClient"
import { toast } from "sonner"

import { Category } from "@prisma/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ProductListSkeleton } from "@/components/skeletons/ProductSkeleton"


export default function CategoryManager() {

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [open, setOpen] = useState(false)

    const form = useForm<categoryInput>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: ""
        }
    })
    const queryClient = useQueryClient()

    const { data: categories,isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/category");
            return res.data
        },
        retry: 1
    })

    const createMutation = useMutation({
        mutationFn: async (data: categoryInput) => {
            const res = await api.post("/category", data);
            return res.data
        },
        onSuccess: () => {
            toast.success("category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            form.reset();
            setIsDialogOpen(false)
        },
        onError: (err) => {
            toast.error("failed to create category");
            console.log(err);
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`category/${id}`);
            return res.data
        },
        onSuccess: () => {
            toast.success("category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setOpen(false)
        },
        onError: (err) => {
            toast.error("error deleting category");
            console.log(err);

        }
    })
    const onSubmit = async (data: categoryInput) => {
        console.log(data);
        await createMutation.mutate(data)
    }


    const handleDelete = async (id: string) => {
        
        await deleteMutation.mutateAsync(id)
    }

    return (
        <main className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Category Manager</h1>
                    <p className="text-muted-foreground mt-2">Manage your categories</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="category name " {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Category name will be unique.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">{createMutation.isPending ? "Adding..." : "Add Category"}</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Categories ({categories?.length | 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        isLoading ?
                        <ProductListSkeleton />
                        :
                    categories?.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No categories yet. Add your first category to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {
                            categories?.map((category: Category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setOpen(true)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            Delete
                                        </Button>
                                        <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
                                            <AlertDialogTrigger asChild>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This category will permanently delete &quot;{category.name}&quot;
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction asChild>
                                                        <Button variant={"destructive"} onClick={() => handleDelete(category.id)}>
                                                            {deleteMutation.isPending ? "Deleting...":"Delete"}
                                                        </Button>

                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

        </main>
    )
}





