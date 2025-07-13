// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './src/models/clients.js';
import Project from './src/models/Projects.js';
import Task from './src/models/Task.js';
import Invoice from './src/models/Invoice.js';
import Document from './src/models/Document.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB ✅');

    // Clear previous data
    await Promise.all([
      Client.deleteMany(),
      Project.deleteMany(),
      Task.deleteMany(),
      Invoice.deleteMany(),
      Document.deleteMany(),
    ]);

    // Seed Client (User/VA)
    const client = await Client.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashedPassword123', // Assume it's already hashed
      businessName: 'Jane’s Admin Studio',
      role: 'VA',
      phone: '+1234567890',
      timeZone: 'Africa/Lagos',
      businessType: 'Admin Support',
      services: ['Email Management', 'Document Creation'],
    });

    // Seed Project
    const project = await Project.create({
      title: 'Onboard New Client',
      description: 'Set up the welcome package and onboarding documents',
      owner: client._id,
      client: client._id,
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 86400000),
      tags: ['onboarding', 'admin'],
    });

    // Seed Tasks
    const tasks = await Task.insertMany([
      {
        title: 'Create Welcome Email Template',
        description: 'Draft and format a reusable email for client onboarding',
        project: project._id,
        owner: client._id,
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 2 * 86400000),
        subtasks: [
          { title: 'Header copy', done: false },
          { title: 'CTA button', done: false },
        ],
      },
      {
        title: 'Prepare Onboarding Docs',
        description: 'Compile client intro guide and terms',
        project: project._id,
        owner: client._id,
        status: 'In Progress',
        priority: 'High',
      },
    ]);

    // Seed Invoice
    await Invoice.create({
      client: client._id,
      owner: client._id,
      amount: 250,
      currency: 'USD',
      description: 'First month of VA services',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 5 * 86400000),
      status: 'Sent',
    });

    // Seed Document
    await Document.create({
      title: 'VA Agreement',
      owner: client._id,
      content: 'This is a sample agreement document...',
      category: 'Contracts',
      type: 'text',
      tags: ['contract', 'legal'],
    });

    console.log('Seed data inserted ✅');
    process.exit();
  } catch (error) {
    console.error('Seed error ❌', error);
    process.exit(1);
  }
};

seed();
