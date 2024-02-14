
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';

export const createPermanentAdminUser = async () => {
  const adminEmail = 'admin@example.com'; // Use real admin email
  const adminExists = await UserModel.findOne({ email: adminEmail });

  if (adminExists) {
    console.log('Admin user already exists.');
    return;
  }

  const adminPassword = 'SecureAdminPassword'; // Use a secure password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = new UserModel({
    username: 'admin',
    email: adminEmail,
    password: hashedPassword,
    phoneNumber: '1234567890',
    role: 'admin',
  });

  try {
    await adminUser.save();
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
