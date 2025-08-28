"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { productSchema } from "@/app/lib/zodSchema";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/apiClient";
import { Check, ChevronsUpDown, ImageIcon, Upload, X } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { ProductsWithRelations } from "@/app/types/prisma";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {Category} from "@prisma/client"

type UploadFile = {
  id: string;
  file: File;
};

export default function ProductForm({
  product,
}: {
  product: ProductsWithRelations | null;
}) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images?.map((img) => img.url) ?? []
  );
  const [progress, setProgress] = useState(0);

  const maxImages = 5;
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      price: product?.price ?? 0,
      isFeatured: product?.isFeatured ?? false,
      images: product?.images?.map((img) => img.url) ?? [],
      stock: product?.stock ?? 0,
    },
  });

  const { isSubmitting } = form.formState;

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        //   toast.success("✅ Upload completed!");
        console.log("Uploaded files:", res);
        console.log("files");

        setFiles([]);
        setExistingImages([]);

        setProgress(0);
      },
      onUploadError: (err) => {
        toast.error(`Upload failed: ${err.message}`);
        setProgress(0);
      },
      onUploadProgress: (p) => setProgress(p * 100),
    }
  );

  // Dropzone

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length >= maxImages) {
        toast.error("❌ Maximum 5 images allowed");
        return;
      }

      const remaining = maxImages - files.length;
      const filesToAdd = acceptedFiles.slice(0, remaining).map((file) => ({
        id: crypto.randomUUID(), // unique per file
        file,
      }));
      console.log("files to add", filesToAdd);

      setFiles((prev) => [...prev, ...filesToAdd]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig
      ? routeConfig.image
        ? Object.keys(routeConfig.image).reduce(
            (acc, ext) => ({ ...acc, [ext]: [] }),
            {}
          )
        : undefined
      : undefined,
    disabled: files.length + existingImages.length >= 5,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const queryClient = useQueryClient();

  const {data:categories} = useQuery<Category[]>({
    queryKey:["categories"],
    queryFn: async () =>{
        const res = await api.get("/category");
        return res.data
    },
    retry:1
})

  const createProduct = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const res = await api.post("/products", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("product created successfully", data);
      toast.success("product created successfully");
      form.reset();
      setFiles([]);
      router.push("/dashboard/products");
    },
    onError: (err) => {
      console.log("error log:", err);
      toast.error("error creating product");
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const res = await api.put(`/products/${product?.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("product updated successfully");
      form.reset();
      setFiles([]);
      setExistingImages([]);
    },
    onError: (err) => {
      console.log("error update Product", err);
      toast.error("failed update product");
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    console.log(data);

    if (files.length === 0 && existingImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    let newImageUrls: string[] = [];
    if (files.length > 0) {
      const res = await startUpload(files.map((f) => f.file));
      if (res) {
        newImageUrls = res.map((f) => f.ufsUrl);
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    console.log("Combine image", allImages);

    // Update form state
    form.setValue("images", allImages, { shouldValidate: true });
    const formData = {
      ...data,
      images: form.getValues("images") ?? [],
    };

    if (product) {
      updateProduct.mutate(formData);
      router.push("/dashboard/products");
    } else {
      createProduct.mutate(formData);
      router.push("/dashboard/products");
    }
  };

  const handelClear = () => {
    form.reset();
    router.push("/dashboard/products");
  };

  return (
    <div className="@container/main py-6 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            {product ? "UpdateProduct" : "Create new Product"}
          </CardTitle>
          <CardDescription>
            {product ? "update product" : "create new product "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories?.find(
                            (category) => category.id === field.value
                          )?.name
                        : "Select category"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      className="h-9"
                    />
                    <CommandList className="w-full">
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.map((category) => (
                          <CommandItem
                            value={category.id}
                            key={category.id}
                            onSelect={() => {
                              form.setValue("categoryId", category.id)
                            }}
                          >
                            {category.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                category.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter product stock quantity"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter product stock quantity"
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Products</FormLabel>
                      <FormDescription>
                        this will be featured product.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product images</FormLabel>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                        files.length + existingImages.length >= 5
                          ? "border-gray-400 bg-gray-100 cursor-not-allowed opacity-70"
                          : isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}>
                      <input {...getInputProps()} />
                      {files.length + existingImages.length >= 5 ? (
                        <p className="text-red-500">Maximum 5 images reached</p>
                      ) : isDragActive ? (
                        <p className="text-blue-500">Drop files here...</p>
                      ) : (
                        <p className="text-gray-500">
                          Drag & drop product images here, or click to browse
                        </p>
                      )}

                      <div className="space-y-4">
                        <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <Button
                          type="button"
                          variant="outline"
                          className="mx-auto bg-transparent">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Images
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-5 gap-4">
                        {existingImages.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border">
                              <Image
                                src={url}
                                alt={`existing-${idx}`}
                                width={50}
                                height={50}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                setExistingImages((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }>
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                              {url}
                            </div>
                          </div>
                        ))}
                        {files.map(({ file, id }) => (
                          <div key={id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={id}
                                width={50}
                                height={50}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(id)}>
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {files.length + existingImages.length < maxImages && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent">
                          ({files.length + existingImages.length}/{maxImages})
                        </Button>
                      )}
                    </div>

                    {files.length + existingImages.length > 0 && (
                      <FormDescription className="text-xs text-slate-500 mt-2">
                        {files.length + existingImages.length} of {maxImages}{" "}
                        images uploaded
                      </FormDescription>
                    )}

                    {isUploading && progress > 0 && (
                      <Progress value={progress} className="h-2" />
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || isUploading}>
                  {isSubmitting
                    ? product
                      ? isUploading && "updating..."
                      : isUploading && "Creating..."
                    : product
                    ? "Update Product"
                    : "Create new Product"}
                </Button>
                <Button type="button" variant={"outline"} onClick={handelClear}>
                  cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


