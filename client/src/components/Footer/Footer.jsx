import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const footerLinks = {
  Platform: [
    { label: 'How it Works', to: '/#how-it-works' },
    { label: 'Browse Workers', to: '/search' },
    { label: 'Post a Job', to: '/register' },
    { label: 'Pricing', to: '/subscription' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Contact', to: '/contact' },
    { label: 'Policy', to: '/policy' },
  ],
}

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div className={styles.footerBrand}>
        <div className={styles.footerLogo}>Workverra</div>
        <p className={styles.footerTagline}>Hyperlocal talent marketplace for Tier 2 &amp; 3 India.</p>
        <p className={styles.footerDesc}>Connecting skilled workers with employers across 200+ cities.</p>
      </div>
      <div className={styles.footerLinks}>
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group} className={styles.footerCol}>
            <h4 className={styles.colHeading}>{group}</h4>
            {links.map((link) => (
              <Link key={link.label} to={link.to} className={styles.footerLink}>{link.label}</Link>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className={styles.footerBottom}>
      <div className={styles.footerBottomLeft}>
        <span>© 2026 Workverra Technologies Pvt. Ltd. All Rights Reserved.</span>
      </div>
      <div className={styles.footerCredit}>
        Developed by <strong>Gopal Makwana</strong> © 2026 All Rights Reserved
      </div>
      <div className={styles.footerLegal}>
        <Link to="/policy">Privacy Policy</Link>
        <Link to="/policy">Terms of Service</Link>
      </div>
    </div>
  </footer>
)

export default Footer
