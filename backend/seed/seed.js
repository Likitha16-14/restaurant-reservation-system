import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Table.deleteMany({}), Reservation.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  const capacities = [2, 2, 2, 4, 4, 4, 4, 6, 6, 6, 8, 8, 8, 10, 12];
  const tables = capacities.map((capacity, index) => ({
    tableNumber: index + 1,
    capacity,
    isActive: true,
  }));

  await Table.insertMany(tables);
  console.log(`Seeded admin user ${admin.email} and ${tables.length} tables`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
