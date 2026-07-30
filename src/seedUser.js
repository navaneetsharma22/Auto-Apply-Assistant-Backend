require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '9876543210' },
  experienceYears: { type: Number, default: 5 },
  currentCTC: { type: String, default: '20 LPA' },
  expectedCTC: { type: String, default: '30 LPA' },
  noticePeriod: { type: String, default: '15 Days' },
  resumePath: { type: String, default: 'C:\\Resumes\\Navaneet_Sharma_Resume.pdf' }
}, { timestamps: true });

const prefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, default: 'Senior Software Engineer' },
  roles: [{ type: String }],
  locations: [{ type: String }],
  experience: { type: String, default: '3-6 Years' },
  salaryRange: { type: String, default: '20 - 32 LPA' },
  jobType: { type: String, default: 'Full-time' },
  platforms: [{ type: String }],
  dailyApplyCap: { type: Number, default: 15 },
  standardAnswers: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  externalId: { type: String, required: true },
  platform: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  salary: { type: String, default: '' },
  jobUrl: { type: String, required: true },
  rawFormDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, default: 'queued' },
  needsManualReview: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Preference = mongoose.models.Preference || mongoose.model('Preference', prefSchema);
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

async function seedUser() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auto_apply_assistant';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB:', mongoUri);

  const hashedPassword = await bcrypt.hash('123456987', 10);

  // Clean old instances
  await User.deleteMany({ email: { $in: ['navaneetsharma@dev', 'navaneetsharma@dev.com'] } });

  // Create user
  const user1 = await User.create({
    name: 'Navaneet Sharma',
    email: 'navaneetsharma@dev.com',
    password: hashedPassword,
    phone: '9876543210',
    experienceYears: 5,
    currentCTC: '20 LPA',
    expectedCTC: '30 LPA',
    noticePeriod: '15 Days',
    resumePath: 'C:\\Resumes\\Navaneet_Sharma_Resume.pdf'
  });

  const user2 = await User.create({
    name: 'Navaneet Sharma',
    email: 'navaneetsharma@dev',
    password: hashedPassword,
    phone: '9876543210',
    experienceYears: 5,
    currentCTC: '20 LPA',
    expectedCTC: '30 LPA',
    noticePeriod: '15 Days',
    resumePath: 'C:\\Resumes\\Navaneet_Sharma_Resume.pdf'
  });

  console.log('Seeded Users successfully:', user1.email, 'and', user2.email);

  // Seed Preferences
  for (const u of [user1, user2]) {
    await Preference.create({
      userId: u._id,
      label: 'Senior Fullstack Profile',
      roles: ['Node.js Developer', 'React Developer', 'Fullstack Engineer'],
      locations: ['Remote', 'Bangalore', 'Delhi NCR'],
      experience: '3-6 Years',
      salaryRange: '20 - 32 LPA',
      jobType: 'Full-time',
      platforms: ['naukri', 'indeed', 'linkedin'],
      dailyApplyCap: 15,
      standardAnswers: {
        currentCTC: '20 LPA',
        expectedCTC: '30 LPA',
        noticePeriod: '15 Days',
        relocation: 'Yes',
        workAuthorization: 'Authorized'
      }
    });

    // Seed Queued Jobs
    await Job.create([
      {
        userId: u._id,
        externalId: 'seed_job_101',
        platform: 'naukri',
        title: 'Senior Full Stack Engineer (React/Node)',
        company: 'TechCorp Global',
        location: 'Remote',
        salary: '24-30 LPA',
        jobUrl: 'https://www.naukri.com/job-listings-senior-full-stack-engineer',
        status: 'queued',
        needsManualReview: false,
        rawFormDetails: {
          experienceYears: 5,
          currentCTC: '20 LPA',
          expectedCTC: '30 LPA',
          noticePeriod: '15 Days',
          phone: '9876543210'
        }
      },
      {
        userId: u._id,
        externalId: 'seed_job_102',
        platform: 'linkedin',
        title: 'Lead Node.js Developer',
        company: 'HighScale Systems',
        location: 'Bangalore',
        salary: '28-35 LPA',
        jobUrl: 'https://www.linkedin.com/jobs/view/lead-node-js-developer',
        status: 'queued',
        needsManualReview: true,
        rawFormDetails: {
          experienceYears: 5,
          currentCTC: '20 LPA',
          expectedCTC: '30 LPA',
          noticePeriod: '15 Days',
          phone: '9876543210'
        }
      },
      {
        userId: u._id,
        externalId: 'seed_job_103',
        platform: 'indeed',
        title: 'Frontend Architect (React.js)',
        company: 'CloudNative Inc',
        location: 'Remote',
        salary: '25-32 LPA',
        jobUrl: 'https://www.indeed.com/viewjob?jk=cloudnative_react',
        status: 'queued',
        needsManualReview: false,
        rawFormDetails: {
          experienceYears: 5,
          currentCTC: '20 LPA',
          expectedCTC: '30 LPA',
          noticePeriod: '15 Days',
          phone: '9876543210'
        }
      }
    ]);
  }

  console.log('Successfully seeded preferences and 3 queued jobs for Navaneet Sharma.');
  await mongoose.disconnect();
  process.exit(0);
}

seedUser().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
