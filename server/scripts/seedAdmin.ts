import { connectDB } from '../config/db';
import { User } from '../models/User';

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_INIT_EMAIL || 'admin@monadesigners.com';
    const adminPassword = process.env.ADMIN_INIT_PASSWORD || 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: adminEmail,
      username: 'admin',
      phone: '+91 98765 43210',
      passwordHash: adminPassword, // Will be hashed by pre-save middleware
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    process.exit(0);
  }
};

// Run if called directly (ESM-safe check)
if (process.argv[1] && process.argv[1].includes('seedAdmin')) {
  seedAdmin();
}

export default seedAdmin;
