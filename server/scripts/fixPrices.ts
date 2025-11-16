import { connectDB } from '../config/db';
import { Product } from '../models/Product';

/**
 * Migration script to fix price from paise to rupees
 * Divides all prices by 100
 */
const fixPrices = async () => {
  try {
    await connectDB();
    console.log('Starting price conversion (paise to rupees)...');

    // Find all products
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      console.log(`\nProduct: ${product.title}`);
      console.log(`  Old price (paise): ${product.price}`);

      // Convert from paise to rupees
      const newPrice = Math.round(product.price / 100);
      
      if (newPrice !== product.price) {
        product.price = newPrice;
        await product.save();
        console.log(`  New price (rupees): ${newPrice}`);
        updatedCount++;
      } else {
        console.log(`  Price already in rupees: ${product.price}`);
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updatedCount} product(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1] && process.argv[1].includes('fixPrices')) {
  fixPrices();
}

export default fixPrices;
