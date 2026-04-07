// ── Workverra Shared Data ─────────────────────────────────────────────────

export const SKILLS_LIST = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason',
  'Welder', 'AC Technician', 'Tiler', 'Roofer', 'Gardener',
  'Security Guard', 'Driver', 'Cook', 'Housekeeper', 'Labourer',
  'IT Support', 'CCTV Technician', 'Packers & Movers', 'Pest Control', 'Fabricator',
  'Tailor', 'Mechanic', 'Glass Worker', 'Plumber Helper', 'Lift Technician',
  'Solar Technician', 'Water Purifier Technician', 'Marble Polisher', 'Flooring Expert',
]

export const CITIES = [
  // ── Madhya Pradesh ──
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa',
  'Satna', 'Chhindwara', 'Dewas', 'Khandwa', 'Ratlam', 'Singrauli',
  // ── Chhattisgarh ──
  'Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon',
  // ── Maharashtra ──
  'Nagpur', 'Aurangabad', 'Nashik', 'Pune', 'Mumbai', 'Thane',
  'Solapur', 'Kolhapur', 'Amravati', 'Nanded',
  // ── Gujarat ──
  'Surat', 'Rajkot', 'Vadodara', 'Ahmedabad', 'Gandhinagar', 'Junagadh', 'Bhavnagar',
  // ── Rajasthan ──
  'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Alwar', 'Bharatpur',
  // ── Uttar Pradesh ──
  'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut',
  'Ghaziabad', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad', 'Mathura',
  // ── Bihar / Jharkhand ──
  'Patna', 'Gaya', 'Muzaffarpur', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro',
  // ── Uttarakhand / Punjab / Haryana ──
  'Dehradun', 'Haridwar', 'Chandigarh', 'Ludhiana', 'Amritsar',
  'Jalandhar', 'Gurugram', 'Faridabad', 'Hisar', 'Rohtak',
  // ── South India — Tamil Nadu ──
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
  'Tirunelveli', 'Vellore', 'Erode', 'Tiruppur', 'Dindigul',
  'Thanjavur', 'Kancheepuram', 'Kumbakonam', 'Hosur', 'Nagercoil',
  // ── South India — Kerala ──
  'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
  'Kannur', 'Malappuram', 'Palakkad', 'Alappuzha', 'Kottayam',
  // ── South India — Karnataka ──
  'Bengaluru', 'Mysuru', 'Hubli', 'Dharwad', 'Mangaluru', 'Belagavi',
  'Ballari', 'Davangere', 'Shivamogga', 'Tumkur', 'Raichur',
  'Kalaburagi', 'Bidar', 'Vijayapura', 'Hassan', 'Mandya', 'Udupi',
  // ── South India — Andhra Pradesh ──
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool',
  'Nellore', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur',
  'Eluru', 'Ongole', 'Vizianagaram', 'Srikakulam',
  // ── South India — Telangana ──
  'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
  'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Sangareddy',
  // ── North East / Other ──
  'Guwahati', 'Shillong', 'Bhubaneswar', 'Cuttack', 'Rourkela',
  'Kolkata', 'Siliguri', 'Asansol', 'Delhi', 'New Delhi',
]

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(amount)

// Booking statuses used across dashboards
export const BOOKING_STATUS = {
  pending:   { bg:'#FFF8E7', color:'#92400E', label:'Pending' },
  confirmed: { bg:'#EBF2FF', color:'#1344B8', label:'Confirmed' },
  completed: { bg:'#D1FAE5', color:'#065F46', label:'Completed' },
  rejected:  { bg:'#FEF2F2', color:'#991B1B', label:'Rejected' },
}

// Subscription plans
export const PLANS = {
  worker: [
    { id:'worker_free',    label:'Free',   price:0,   period:'',       features:['1 active profile','Basic search listing','5 bookings/month'] },
    { id:'worker_monthly', label:'Monthly',price:49,  period:'month',  features:['Unlimited bookings','Priority listing','Verified badge','Chat support'] },
    { id:'worker_yearly',  label:'Yearly', price:499, period:'year',   features:['Everything in Monthly','Top search ranking','Dedicated support','Analytics dashboard'] },
  ],
  employer: [
    { id:'employer_free',    label:'Free',   price:0,    period:'',       features:['Post 2 jobs/month','Basic worker search','Standard listing'] },
    { id:'employer_monthly', label:'Monthly',price:99,   period:'month',  features:['Unlimited job posts','Advanced filters','Priority workers','Chat support'] },
    { id:'employer_yearly',  label:'Yearly', price:999,  period:'year',   features:['Everything in Monthly','Dedicated account manager','Bulk booking','Analytics'] },
  ],
}

export const bookings = []
export const workerNotifications = []
export const workers = []
