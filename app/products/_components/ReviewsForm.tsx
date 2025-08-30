import { api } from "@/app/lib/apiClient"
import { reviewInput, reviewSchema } from "@/app/lib/zodSchema"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Star } from "lucide-react"
import { redirect } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ReviewsForm = ({productId}:{productId:string}) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {data:session, isPending} = useSession();

    const form = useForm<reviewInput>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 1,
            comment: ""
        }
    });

    const queryClient = useQueryClient()


    const createMutation = useMutation({
        mutationFn: async (data: reviewInput) => {
            const res = await api.post("/reviews", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["reviews"]})
            toast.success("review writing successfully");
            setIsDialogOpen(false)

        },
        onError: (error) => {
            toast.error("error writing review!")
            console.log(error);
        }
    })

    const onSubmit = async (data: reviewInput) => {
        console.log(data);

        if(!session?.user) return 
        const reviewData ={
            ...data,
            productId,
            userId:session?.user.id
        }
        createMutation.mutate(reviewData);
    }

    if( isPending) return <h1>loading....</h1>

    if(isDialogOpen && !session?.session){
        redirect("/login");
    }


    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Write review about this product</DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-1 mt-2">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => field.onChange(rating)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 transition-colors ${rating <= field.value
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-slate-300 hover:text-yellow-400"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Your Review </FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your review her.... " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{createMutation.isPending ? "Writing..." : "write review"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ReviewsForm
