// ── SkillBridge Shared Data ────────────────────────────────────────────────

export const SKILLS_LIST = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason',
  'Welder', 'AC Technician', 'Tiler', 'Roofer', 'Gardener',
  'Security Guard', 'Driver', 'Cook', 'Housekeeper', 'Labourer',
  'IT Support', 'CCTV Technician', 'Packers & Movers', 'Pest Control', 'Fabricator',
]

export const CITIES = [
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain',
  'Raipur', 'Bilaspur', 'Nagpur', 'Aurangabad', 'Nashik',
  'Surat', 'Rajkot', 'Vadodara', 'Jaipur', 'Jodhpur',
  'Kota', 'Udaipur', 'Patna', 'Ranchi', 'Varanasi',
  'Agra', 'Meerut', 'Lucknow', 'Kanpur', 'Allahabad',
  'Dehradun', 'Haridwar', 'Chandigarh', 'Ludhiana', 'Amritsar',
]

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(amount)

export const workers = [
  {
    id:'w1', initials:'MK', name:'Mohan Kumar', skill:'Plumber',
    skills:['Pipe Fitting','Leakage Fix','Bathroom Setup','Water Tank','Drain Cleaning'],
    experience:6, city:'Indore', pinCode:'452001', rating:4.9, totalReviews:89,
    hourlyRate:380, jobsDone:120, verified:true, badge:null, available:true,
    avatarGradient:'linear-gradient(135deg,#667eea,#764ba2)',
    about:'Expert plumber with 6+ years in residential and commercial projects across Indore. Specialised in modern bathroom fittings and emergency repairs.',
    joinedDate:'Jan 2023', responseTime:'< 1 hour', successRate:'98%',
  },
  {
    id:'w2', initials:'PS', name:'Priya Sharma', skill:'Painter',
    skills:['Wall Painting','Texture Work','Waterproofing','Polish','Stencil'],
    experience:8, city:'Bhopal', pinCode:'462001', rating:4.8, totalReviews:134,
    hourlyRate:520, jobsDone:210, verified:true, badge:'Top Rated Pro', available:true,
    avatarGradient:'linear-gradient(135deg,#f093fb,#f5576c)',
    about:'Professional painter known for premium texture and decorative finishes. 8 years experience with both interior and exterior projects.',
    joinedDate:'Mar 2022', responseTime:'< 2 hours', successRate:'99%',
  },
  {
    id:'w3', initials:'AV', name:'Amit Verma', skill:'Carpenter',
    skills:['Furniture Making','Door Fitting','Modular Kitchen','Wood Polish'],
    experience:4, city:'Jabalpur', pinCode:'482001', rating:4.5, totalReviews:56,
    hourlyRate:290, jobsDone:78, verified:true, badge:null, available:false,
    avatarGradient:'linear-gradient(135deg,#4facfe,#00f2fe)',
    about:'Skilled carpenter with expertise in custom furniture and kitchen installations.',
    joinedDate:'Jul 2023', responseTime:'< 3 hours', successRate:'95%',
  },
  {
    id:'w4', initials:'RK', name:'Rajesh Kumar', skill:'Electrician',
    skills:['Wiring','Panel Work','Solar Install','CCTV Wiring','Fan/AC Fitting'],
    experience:10, city:'Indore', pinCode:'452002', rating:4.7, totalReviews:201,
    hourlyRate:450, jobsDone:340, verified:true, badge:'Expert', available:true,
    avatarGradient:'linear-gradient(135deg,#fa709a,#fee140)',
    about:'Licensed electrician with 10 years of experience in residential and commercial electrical work.',
    joinedDate:'Jun 2021', responseTime:'< 30 min', successRate:'99.5%',
  },
  {
    id:'w5', initials:'SJ', name:'Sunita Joshi', skill:'Housekeeper',
    skills:['Deep Cleaning','Laundry','Cooking','Childcare','Grocery'],
    experience:5, city:'Bhopal', pinCode:'462011', rating:4.9, totalReviews:310,
    hourlyRate:220, jobsDone:450, verified:true, badge:'Super Worker', available:true,
    avatarGradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    about:'Experienced housekeeper known for reliability and attention to detail.',
    joinedDate:'Sep 2021', responseTime:'< 1 hour', successRate:'100%',
  },
  {
    id:'w6', initials:'VG', name:'Vinod Gupta', skill:'AC Technician',
    skills:['AC Service','Gas Refilling','Installation','Repair','Split AC'],
    experience:7, city:'Gwalior', pinCode:'474001', rating:4.6, totalReviews:92,
    hourlyRate:500, jobsDone:188, verified:true, badge:null, available:true,
    avatarGradient:'linear-gradient(135deg,#0ba360,#3cba92)',
    about:'Certified AC technician skilled in all major brands. Fast, clean, and reliable service.',
    joinedDate:'Apr 2022', responseTime:'< 2 hours', successRate:'97%',
  },
]

export const bookings = [
  {
    id:'b1', workerId:'w1', workerName:'Mohan Kumar', employerName:'Rahul Enterprises',
    skill:'Plumber', date:'2026-04-10', time:'10:00 AM', duration:2,
    description:'Fix leaking pipe in bathroom and kitchen tap replacement',
    amount:760, status:'pending', paymentStatus:'pending',
  },
  {
    id:'b2', workerId:'w2', workerName:'Priya Sharma', employerName:'Rahul Enterprises',
    skill:'Painter', date:'2026-04-12', time:'09:00 AM', duration:6,
    description:'Interior wall painting for 2BHK flat, all rooms',
    amount:3120, status:'confirmed', paymentStatus:'held',
  },
  {
    id:'b3', workerId:'w4', workerName:'Rajesh Kumar', employerName:'Rahul Enterprises',
    skill:'Electrician', date:'2026-03-28', time:'11:00 AM', duration:3,
    description:'New wiring for office cabin + fan installation',
    amount:1350, status:'completed', paymentStatus:'released',
  },
  {
    id:'b4', workerId:'w5', workerName:'Sunita Joshi', employerName:'Rahul Enterprises',
    skill:'Housekeeper', date:'2026-04-08', time:'08:00 AM', duration:4,
    description:'Deep cleaning of 3BHK before Diwali',
    amount:880, status:'pending', paymentStatus:'pending',
  },
]

export const reviews = [
  { id:'r1', workerId:'w1', reviewerName:'Rahul Sharma', stars:5, comment:'Excellent work! Fixed the pipe very quickly and was very professional.', date:'Mar 2026' },
  { id:'r2', workerId:'w1', reviewerName:'Deepak Patel', stars:5, comment:'Highly recommend Mohan. He arrived on time and the work quality is superb.', date:'Feb 2026' },
  { id:'r3', workerId:'w1', reviewerName:'Anita Singh', stars:4, comment:'Good work overall, minor delay but got the job done perfectly.', date:'Jan 2026' },
  { id:'r4', workerId:'w2', reviewerName:'Rohan Mehta', stars:5, comment:'Priya did an amazing job on our living room. The texture finish looks stunning!', date:'Mar 2026' },
  { id:'r5', workerId:'w2', reviewerName:'Kavita Joshi', stars:5, comment:'Best painter in Bhopal without doubt. Very neat and professional.', date:'Feb 2026' },
]

export const workerNotifications = [
  { id:'n1', type:'booking', title:'New Booking Request', message:'Rahul Enterprises has sent you a booking request for Plumbing work on Apr 10.', time:'2 hours ago', read:false },
  { id:'n2', type:'payment', title:'Payment Released! 💰', message:'₹1,350 has been released to your account for the Electrician job on Mar 28.', time:'1 day ago', read:false },
  { id:'n3', type:'review', title:'New Review Received ⭐', message:'Deepak Patel gave you a 5-star review: "Highly recommend Mohan."', time:'3 days ago', read:true },
  { id:'n4', type:'booking', title:'Booking Confirmed', message:'Your booking for Painting work has been confirmed for Apr 12.', time:'5 days ago', read:true },
]
