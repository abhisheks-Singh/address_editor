import prisma from '../db.server.js'; // Adjust the path as necessary

async function deleteAllRecordsForShop(shop) {
  try {
    // Delete related records in the order of dependencies
    await prisma.timeLimit.deleteMany({
      where: { shop: shop },
    });

    await prisma.designSettings.deleteMany({
      where: { shop: shop },
    });

    await prisma.shopSettings.deleteMany({
      where: { shop: shop },
    });

    // Finally, delete the session
    const deletedSession = await prisma.session.delete({
      where: {
        shop: shop,
      },
    });

    console.log(`All records deleted for shop: ${shop}`, deletedSession);
  } catch (error) {
    console.error('Error deleting records for shop:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
// const shopToDelete = 'abhishek-dev-storee.myshopify.com'; // Replace with your actual shop URL
// deleteAllRecordsForShop(shopToDelete);
