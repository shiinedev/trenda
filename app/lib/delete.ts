import prisma from "@/lib/prisma"; // adjust import to your prisma client

export async function deleteProductWithRelations(productId: string) {
  // Delete all related entities first
  await prisma.productImage.deleteMany({
    where: { productId },
  });

  await prisma.review.deleteMany({
    where: { productId },
  });

  await prisma.orderItem.deleteMany({
    where: { productId },
  });

  // Delete the product itself
  return prisma.product.delete({
    where: { id: productId },
  });
}
