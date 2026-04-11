import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home              from "./pages/Home";
import Login             from "./pages/Login/Login";
import Register          from "./pages/Register/Register";
import EmployerDashboard from "./pages/EmployerDashboard/EmployerDashboard";
import WorkerDashboard   from "./pages/WorkerDashboard/WorkerDashboard";
import WorkerProfile     from "./pages/WorkerProfile/WorkerProfile";
import Search            from "./pages/Search/Search";
import BookingPage       from "./pages/Booking/BookingPage";
import PaymentPage       from "./pages/Payment/PaymentPage";
import ChatPage          from "./pages/Chat/ChatPage";
import SubscriptionPage  from "./pages/Subscription/SubscriptionPage";
import PolicyPage        from "./pages/Policy/PolicyPage";
import ContactPage       from "./pages/Contact/ContactPage";
import HelpPage          from "./pages/Help/HelpPage";
import FAQPage           from "./pages/FAQ/FAQPage";
import AboutPage         from "./pages/About/AboutPage";
import BlogPage          from "./pages/Blog/BlogPage";
import CareersPage       from "./pages/Careers/CareersPage";
// FIX #8: dedicated How It Works page
import HowItWorksPage    from "./pages/HowItWorksPage/HowItWorksPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const Protected = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", fontFamily: "'Sora',sans-serif", color: "#1A56DB",
      fontSize: "1.1rem", gap: "12px",
    }}>
      <div style={{
        width: 24, height: 24, border: "3px solid #dbeafe",
        borderTopColor: "#1A56DB", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      Loading…
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

const NO_LAYOUT_PATHS = ["/login", "/register"];

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = NO_LAYOUT_PATHS.some(p => location.pathname.startsWith(p));
  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/"             element={<Home />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/search"       element={<Search />} />
            <Route path="/worker/:id"   element={<WorkerProfile />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/policy"       element={<PolicyPage />} />

            {/* Info pages */}
            <Route path="/contact"      element={<ContactPage />} />
            <Route path="/help"         element={<HelpPage />} />
            <Route path="/faq"          element={<FAQPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/blog"         element={<BlogPage />} />
            <Route path="/careers"      element={<CareersPage />} />
            {/* FIX #8: How It Works page */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* Protected */}
            <Route path="/dashboard/employer" element={
              <Protected role="employer"><EmployerDashboard /></Protected>
            } />
            <Route path="/dashboard/worker" element={
              <Protected role="worker"><WorkerDashboard /></Protected>
            } />
            <Route path="/booking/:workerId" element={
              <Protected><BookingPage /></Protected>
            } />
            <Route path="/payment/:bookingId" element={
              <Protected><PaymentPage /></Protected>
            } />
            <Route path="/chat" element={
              <Protected><ChatPage /></Protected>
            } />
            <Route path="/chat/:userId" element={
              <Protected><ChatPage /></Protected>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
