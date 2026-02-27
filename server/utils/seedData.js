import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';
import Complaint from '../models/Complaint.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Room.deleteMany();
    await Payment.deleteMany();
    await Complaint.deleteMany();

    console.log('Data cleared');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });

    // Create Warden User
    const warden = await User.create({
      name: 'Warden Smith',
      email: 'warden@hostel.com',
      password: 'warden123',
      role: 'warden',
      phone: '9876543210'
    });

    // Create Student Users
    const student1User = await User.create({
      name: 'John Doe',
      email: 'john@student.com',
      password: 'student123',
      role: 'student',
      phone: '5551234567'
    });

    const student2User = await User.create({
      name: 'Jane Smith',
      email: 'jane@student.com',
      password: 'student123',
      role: 'student',
      phone: '5559876543'
    });

    const student3User = await User.create({
      name: 'Mike Johnson',
      email: 'mike@student.com',
      password: 'student123',
      role: 'student',
      phone: '5555555555'
    });

    console.log('Users created');

    // Create Rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: '101',
        blockName: 'Block A',
        capacity: 4,
        occupiedBeds: 0,
        status: 'Available',
        wardenId: warden._id
      },
      {
        roomNumber: '102',
        blockName: 'Block A',
        capacity: 4,
        occupiedBeds: 0,
        status: 'Available',
        wardenId: warden._id
      },
      {
        roomNumber: '103',
        blockName: 'Block A',
        capacity: 2,
        occupiedBeds: 0,
        status: 'Available',
        wardenId: warden._id
      },
      {
        roomNumber: '201',
        blockName: 'Block B',
        capacity: 4,
        occupiedBeds: 0,
        status: 'Available'
      },
      {
        roomNumber: '202',
        blockName: 'Block B',
        capacity: 3,
        occupiedBeds: 0,
        status: 'Maintenance'
      }
    ]);

    console.log('Rooms created');

    // Create Students
    const student1 = await Student.create({
      userId: student1User._id,
      studentId: 'STU001',
      dateOfBirth: new Date('2002-05-15'),
      guardianName: 'Robert Doe',
      guardianPhone: '5551111111',
      address: '123 Main St, City, State',
      roomId: rooms[0]._id,
      course: 'Computer Science',
      year: 2
    });

    const student2 = await Student.create({
      userId: student2User._id,
      studentId: 'STU002',
      dateOfBirth: new Date('2003-08-20'),
      guardianName: 'David Smith',
      guardianPhone: '5552222222',
      address: '456 Oak Ave, City, State',
      roomId: rooms[0]._id,
      course: 'Electrical Engineering',
      year: 1
    });

    const student3 = await Student.create({
      userId: student3User._id,
      studentId: 'STU003',
      dateOfBirth: new Date('2002-12-10'),
      guardianName: 'Sarah Johnson',
      guardianPhone: '5553333333',
      address: '789 Pine Rd, City, State',
      roomId: rooms[1]._id,
      course: 'Mechanical Engineering',
      year: 3
    });

    // Update room occupancy
    await Room.findByIdAndUpdate(rooms[0]._id, { occupiedBeds: 2 });
    await Room.findByIdAndUpdate(rooms[1]._id, { occupiedBeds: 1 });

    console.log('Students created');

    // Create Payments
    await Payment.insertMany([
      {
        studentId: student1._id,
        amount: 5000,
        month: 'January',
        year: 2026,
        status: 'Paid',
        paymentMethod: 'UPI',
        transactionId: 'TXN001'
      },
      {
        studentId: student1._id,
        amount: 5000,
        month: 'February',
        year: 2026,
        status: 'Pending',
        paymentMethod: 'Cash'
      },
      {
        studentId: student2._id,
        amount: 5000,
        month: 'January',
        year: 2026,
        status: 'Paid',
        paymentMethod: 'Card',
        transactionId: 'TXN002'
      },
      {
        studentId: student3._id,
        amount: 5000,
        month: 'January',
        year: 2026,
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN003'
      }
    ]);

    console.log('Payments created');

    // Create Complaints
    await Complaint.insertMany([
      {
        studentId: student1._id,
        title: 'AC not working',
        description: 'The air conditioner in room 101 is not cooling properly',
        category: 'Maintenance',
        status: 'Pending'
      },
      {
        studentId: student2._id,
        title: 'Food quality issue',
        description: 'The food served in the mess needs improvement',
        category: 'Food',
        status: 'In Progress'
      },
      {
        studentId: student3._id,
        title: 'Cleanliness concern',
        description: 'Common area needs more frequent cleaning',
        category: 'Cleanliness',
        status: 'Resolved',
        resolvedBy: warden._id,
        resolvedDate: new Date()
      }
    ]);

    console.log('Complaints created');

    console.log('\n✅ Seed data created successfully for Hostel Hub!');
    console.log('\nLogin Credentials:');
    console.log('==================');
    console.log('Admin:');
    console.log('  Email: admin@hostel.com');
    console.log('  Password: admin123');
    console.log('\nWarden:');
    console.log('  Email: warden@hostel.com');
    console.log('  Password: warden123');
    console.log('\nStudent:');
    console.log('  Email: john@student.com');
    console.log('  Password: student123');
    console.log('==================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
