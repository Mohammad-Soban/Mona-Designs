import { connectDB } from '../config/db';
import { Product } from '../models/Product';


const fixOccasions = async () => {
  try {
    await connectDB();
    console.log('Starting occasion field migration...');

    // Find all products with old occasion format
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const attributes = product.attributes as any;
      
      console.log(`\nProduct: ${product.title}`);
      console.log(`  Attributes:`, JSON.stringify(attributes, null, 2));
      console.log(`  Has occasion?`, !!attributes?.occasion);
      console.log(`  Type:`, typeof attributes?.occasion);

      // Check if attributes.occasion exists (old format) or occasions is not an array
      const occasionValue = attributes?.get ? attributes.get('occasion') : attributes?.occasion;
      if (occasionValue && typeof occasionValue === 'string') {
        console.log(`Fixing product: ${product.title}`);
        console.log(`  Old occasion: "${occasionValue}"`);

        // Split comma-separated occasions into array
        const occasions = occasionValue
          .split(',')
          .map((o: string) => o.trim())
          .filter((o: string) => o.length > 0);

        // Update to new format
        if (attributes.set) {
          attributes.set('occasions', occasions);
          attributes.delete('occasion');
        } else {
          (attributes as any).occasions = occasions;
          delete (attributes as any).occasion;
        }
        
        console.log(`  New occasions: [${occasions.join(', ')}]`);
        needsUpdate = true;
      } else {
        const occasionsValue = attributes?.get ? attributes.get('occasions') : attributes?.occasions;
        if (occasionsValue && !Array.isArray(occasionsValue)) {
          // If occasions exists but is not an array, convert it
          console.log(`Fixing product: ${product.title}`);
          console.log(`  Old occasions (non-array): "${occasionsValue}"`);
          
          const occasions = String(occasionsValue)
            .split(',')
            .map((o: string) => o.trim())
            .filter((o: string) => o.length > 0);
          
          if (attributes.set) {
            attributes.set('occasions', occasions);
          } else {
            (attributes as any).occasions = occasions;
          }
          console.log(`  New occasions: [${occasions.join(', ')}]`);
          needsUpdate = true;
        }
      }

      // Save if updated
      if (needsUpdate) {
        product.markModified('attributes');
        await product.save();
        updatedCount++;
      }
    }

    console.log(`✅ Migration complete! Updated ${updatedCount} product(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1] && process.argv[1].includes('fixOccasions')) {
  fixOccasions();
}

export default fixOccasions;
