// ============================================================
// WORKVERRA — DUMMY DATA
// Replace these with real API calls once backend is ready.
// All data is imported from one place — easy to swap later.
// ============================================================

export const SKILLS_LIST = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter',
  'AC Repair', 'Welder', 'Mason', 'Tile Work',
  'Pest Control', 'Cleaning', 'Driver', 'Cook',
  'Security Guard', 'Gardener', 'Computer Repair',
];

export const CITIES = [
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior',
  'Ujjain', 'Sagar', 'Ratlam', 'Satna',
];

// ============================================================
// WORKERS
// ============================================================
export const workers = [
  {
    id: 'w001',
    initials: 'RS',
    name: 'Ravi Sharma',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    skill: 'Electrician',
    experience: 8,
    city: 'Indore',
    state: 'MP',
    distance: '0.8 km',
    hourlyRate: 450,
    rating: 4.9,
    totalReviews: 134,
    totalJobs: 210,
    verified: true,
    badge: 'Top Rated Pro',
    available: true,
    about:
      'Certified electrician with 8 years of experience in residential and commercial wiring, AC installation, and inverter setup. Available 7 days a week.',
    skills: ['Wiring', 'AC Repair', 'Inverter Setup', 'Panel Work', 'CCTV Installation'],
    certifications: ['ITI Electrician', 'Wireman License'],
    languages: ['Hindi', 'English'],
    responseTime: '~10 min',
  },
  {
    id: 'w002',
    initials: 'MK',
    name: 'Mohan Kumar',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    skill: 'Plumber',
    experience: 6,
    city: 'Indore',
    state: 'MP',
    distance: '1.2 km',
    hourlyRate: 380,
    rating: 4.7,
    totalReviews: 89,
    totalJobs: 156,
    verified: true,
    badge: null,
    available: true,
    about:
      'Expert plumber specializing in pipe fitting, leakage detection, and bathroom renovation. Quick response and clean work guaranteed.',
    skills: ['Pipe Fitting', 'Leakage Fix', 'Bathroom Setup', 'Water Tank', 'RO Installation'],
    certifications: ['ITI Plumber'],
    languages: ['Hindi'],
    responseTime: '~15 min',
  },
  {
    id: 'w003',
    initials: 'PS',
    name: 'Priya Sharma',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    skill: 'Painter',
    experience: 9,
    city: 'Bhopal',
    state: 'MP',
    distance: '1.5 km',
    hourlyRate: 520,
    rating: 5.0,
    totalReviews: 201,
    totalJobs: 318,
    verified: true,
    badge: 'Top Rated Pro',
    available: true,
    about:
      'Interior and exterior painting specialist with 9 years of experience. Expert in texture work, waterproofing, and premium finishes.',
    skills: ['Wall Painting', 'Texture Work', 'Waterproofing', 'Polish Work', 'POP Design'],
    certifications: ['Painting & Décor Diploma'],
    languages: ['Hindi', 'English'],
    responseTime: '~5 min',
  },
  {
    id: 'w004',
    initials: 'AV',
    name: 'Amit Verma',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    skill: 'Carpenter',
    experience: 4,
    city: 'Jabalpur',
    state: 'MP',
    distance: '2.1 km',
    hourlyRate: 290,
    rating: 4.5,
    totalReviews: 56,
    totalJobs: 78,
    verified: true,
    badge: null,
    available: false,
    about:
      'Skilled carpenter offering modular furniture fitting, door installation, and custom woodwork at affordable rates.',
    skills: ['Furniture Fitting', 'Door Installation', 'Modular Kitchen', 'Window Work', 'Polish'],
    certifications: ['ITI Carpenter'],
    languages: ['Hindi'],
    responseTime: '~30 min',
  },
  {
    id: 'w005',
    initials: 'DK',
    name: 'Deepak Kaushik',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    skill: 'AC Repair',
    experience: 11,
    city: 'Bhopal',
    state: 'MP',
    distance: '3.0 km',
    hourlyRate: 600,
    rating: 4.8,
    totalReviews: 178,
    totalJobs: 290,
    verified: true,
    badge: 'Expert Pro',
    available: true,
    about:
      'AC technician with 11 years of experience across all major brands — Voltas, Daikin, LG, Samsung. Gas refilling, servicing, and installation.',
    skills: ['AC Installation', 'Gas Refilling', 'AC Servicing', 'Split AC', 'Window AC'],
    certifications: ['RAC Technician Diploma', 'Voltas Certified'],
    languages: ['Hindi', 'English'],
    responseTime: '~8 min',
  },
  {
    id: 'w006',
    initials: 'SR',
    name: 'Sunita Rawat',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    skill: 'Cook',
    experience: 5,
    city: 'Gwalior',
    state: 'MP',
    distance: '0.5 km',
    hourlyRate: 250,
    rating: 4.9,
    totalReviews: 112,
    totalJobs: 189,
    verified: true,
    badge: null,
    available: true,
    about:
      'Home chef specializing in North Indian, South Indian, and Chinese cuisine. Available for daily tiffin, party catering, and event cooking.',
    skills: ['North Indian', 'South Indian', 'Chinese', 'Roti Making', 'Party Cooking'],
    certifications: ['Food Safety Certificate'],
    languages: ['Hindi'],
    responseTime: '~20 min',
  },
  {
    id: 'w007',
    initials: 'VT',
    name: 'Vijay Tiwari',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #f7971e, #ffd200)',
    skill: 'Welder',
    experience: 14,
    city: 'Ujjain',
    state: 'MP',
    distance: '1.8 km',
    hourlyRate: 480,
    rating: 4.6,
    totalReviews: 67,
    totalJobs: 143,
    verified: true,
    badge: null,
    available: true,
    about:
      'Experienced welder skilled in arc welding, MIG, TIG, and gas welding. Gate fabrication, grills, and structural steel work.',
    skills: ['Arc Welding', 'MIG Welding', 'Gate Fabrication', 'Grill Work', 'Steel Furniture'],
    certifications: ['ITI Welder', 'NCVT Certified'],
    languages: ['Hindi'],
    responseTime: '~25 min',
  },
  {
    id: 'w008',
    initials: 'AJ',
    name: 'Ankit Jain',
    avatar: null,
    avatarGradient: 'linear-gradient(135deg, #30cfd0, #330867)',
    skill: 'Mason',
    experience: 7,
    city: 'Sagar',
    state: 'MP',
    distance: '2.5 km',
    hourlyRate: 350,
    rating: 4.4,
    totalReviews: 45,
    totalJobs: 92,
    verified: false,
    badge: null,
    available: true,
    about:
      'Mason with expertise in brick laying, plastering, tile work, and flooring. Handles both small repairs and large construction projects.',
    skills: ['Brick Laying', 'Plastering', 'Tile Work', 'Flooring', 'Wall Repair'],
    certifications: [],
    languages: ['Hindi'],
    responseTime: '~40 min',
  },
];

// ============================================================
// REVIEWS
// ============================================================
export const reviews = [
  {
    id: 'r001',
    workerId: 'w001',
    reviewerName: 'Rahul Gupta',
    reviewerInitials: 'RG',
    reviewerColor: '#667eea',
    rating: 5,
    date: '2025-02-10',
    comment:
      'Ravi fixed our entire house wiring in one day. Very professional, clean work, and explained everything clearly. Highly recommended!',
    jobType: 'Home Wiring',
  },
  {
    id: 'r002',
    workerId: 'w001',
    reviewerName: 'Neha Singh',
    reviewerInitials: 'NS',
    reviewerColor: '#f093fb',
    rating: 5,
    date: '2025-01-28',
    comment:
      'Installed 2 ACs perfectly. Came on time, finished quickly. Very affordable for the quality of work.',
    jobType: 'AC Installation',
  },
  {
    id: 'r003',
    workerId: 'w002',
    reviewerName: 'Pooja Malhotra',
    reviewerInitials: 'PM',
    reviewerColor: '#43e97b',
    rating: 5,
    date: '2025-02-14',
    comment:
      'Mohan fixed a leakage that 2 other plumbers couldn\'t find. Excellent detective work and very honest pricing.',
    jobType: 'Leakage Repair',
  },
  {
    id: 'r004',
    workerId: 'w003',
    reviewerName: 'Vivek Sharma',
    reviewerInitials: 'VS',
    reviewerColor: '#fa709a',
    rating: 5,
    date: '2025-02-18',
    comment:
      'Priya transformed our living room with beautiful texture work. The finish is absolutely stunning. Worth every rupee!',
    jobType: 'Texture Painting',
  },
  {
    id: 'r005',
    workerId: 'w005',
    reviewerName: 'Kavita Joshi',
    reviewerInitials: 'KJ',
    reviewerColor: '#30cfd0',
    rating: 5,
    date: '2025-02-20',
    comment:
      'Deepak is the best AC technician in Bhopal. Fixed my Daikin unit in 30 minutes. Reasonable rates and very polite.',
    jobType: 'AC Servicing',
  },
  {
    id: 'r006',
    workerId: 'w006',
    reviewerName: 'Ramesh Patel',
    reviewerInitials: 'RP',
    reviewerColor: '#f7971e',
    rating: 5,
    date: '2025-02-22',
    comment:
      'Sunita cooked for our family function of 80 people. Everything was delicious and served on time. Will hire again!',
    jobType: 'Event Catering',
  },
];

// ============================================================
// TESTIMONIALS (Landing Page)
// ============================================================
export const testimonials = [
  {
    id: 't001',
    quote:
      'Found a certified electrician in under 20 minutes. Payment was smooth via PhonePe. The worker showed his Workverra badge — I felt completely safe.',
    name: 'Sunita Rawat',
    role: 'Homeowner · Bhopal',
    initials: 'SR',
    color: '#667eea',
    stars: 5,
  },
  {
    id: 't002',
    quote:
      'As a plumber, I used to rely on word-of-mouth. Since joining Workverra, I get 6–8 bookings a week. The app is simple and payments are always on time.',
    name: 'Deepak Kaushik',
    role: 'Plumber · Indore',
    initials: 'DK',
    color: '#f093fb',
    stars: 5,
  },
  {
    id: 't003',
    quote:
      'We hired 4 painters for our office renovation through Workverra. The escrow payment feature gave us full confidence. No upfront cash risk.',
    name: 'Ankit Jain',
    role: 'Business Owner · Gwalior',
    initials: 'AJ',
    color: '#43e97b',
    stars: 5,
  },
];

// ============================================================
// BOOKINGS (for Dashboard demo)
// ============================================================
export const bookings = [
  {
    id: 'b001',
    workerId: 'w001',
    workerName: 'Ravi Sharma',
    workerSkill: 'Electrician',
    workerGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    workerInitials: 'RS',
    employerName: 'Rahul Gupta',
    date: '2025-03-10',
    time: '10:00 AM',
    duration: 3,
    amount: 1350,
    status: 'completed',
    jobDescription: 'Fix wiring in 2 rooms and install 1 ceiling fan',
    city: 'Indore',
    paymentStatus: 'released',
  },
  {
    id: 'b002',
    workerId: 'w003',
    workerName: 'Priya Sharma',
    workerSkill: 'Painter',
    workerGradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    workerInitials: 'PS',
    employerName: 'Vivek Sharma',
    date: '2025-03-15',
    time: '09:00 AM',
    duration: 8,
    amount: 4160,
    status: 'confirmed',
    jobDescription: 'Paint 3 rooms with texture finish, living room + 2 bedrooms',
    city: 'Bhopal',
    paymentStatus: 'held',
  },
  {
    id: 'b003',
    workerId: 'w002',
    workerName: 'Mohan Kumar',
    workerSkill: 'Plumber',
    workerGradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    workerInitials: 'MK',
    employerName: 'Pooja Malhotra',
    date: '2025-03-20',
    time: '11:00 AM',
    duration: 2,
    amount: 760,
    status: 'pending',
    jobDescription: 'Check and fix bathroom leakage, replace tap fittings',
    city: 'Indore',
    paymentStatus: 'pending',
  },
  {
    id: 'b004',
    workerId: 'w005',
    workerName: 'Deepak Kaushik',
    workerSkill: 'AC Repair',
    workerGradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    workerInitials: 'DK',
    employerName: 'Kavita Joshi',
    date: '2025-03-22',
    time: '02:00 PM',
    duration: 1,
    amount: 600,
    status: 'completed',
    jobDescription: 'Annual AC servicing for 1.5 ton split AC',
    city: 'Bhopal',
    paymentStatus: 'released',
  },
];

// ============================================================
// NOTIFICATIONS (for Dashboard demo)
// ============================================================
export const notifications = [
  {
    id: 'n001',
    type: 'booking_request',
    message: 'New booking request from Rahul Gupta for Electrical work',
    time: '2 min ago',
    read: false,
    icon: '📋',
  },
  {
    id: 'n002',
    type: 'payment',
    message: 'Payment of ₹1,350 released for job B001',
    time: '1 hour ago',
    read: false,
    icon: '💰',
  },
  {
    id: 'n003',
    type: 'review',
    message: 'Neha Singh left you a 5★ review — "Very professional!"',
    time: '3 hours ago',
    read: true,
    icon: '⭐',
  },
  {
    id: 'n004',
    type: 'booking_confirmed',
    message: 'Your booking with Priya Sharma is confirmed for Mar 15',
    time: '1 day ago',
    read: true,
    icon: '✅',
  },
];

// ============================================================
// PLATFORM STATS (Landing Page)
// ============================================================
export const platformStats = [
  { number: '2,400+', label: 'Verified Workers' },
  { number: '140+', label: 'Cities Covered' },
  { number: '₹1.2Cr+', label: 'Payments Processed' },
  { number: '4.8★', label: 'Average Rating' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Get workers by skill filter
export const getWorkersBySkill = (skill) => {
  if (!skill || skill === 'All') return workers;
  return workers.filter((w) => w.skill === skill);
};

// Get workers by city filter
export const getWorkersByCity = (city) => {
  if (!city || city === 'All') return workers;
  return workers.filter((w) => w.city === city);
};

// Get a single worker by ID
export const getWorkerById = (id) => {
  return workers.find((w) => w.id === id) || null;
};

// Get reviews for a worker
export const getReviewsByWorkerId = (workerId) => {
  return reviews.filter((r) => r.workerId === workerId);
};

// Get bookings by status
export const getBookingsByStatus = (status) => {
  if (!status || status === 'all') return bookings;
  return bookings.filter((b) => b.status === status);
};

// Format currency Indian style
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format star rating display
export const formatStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};
