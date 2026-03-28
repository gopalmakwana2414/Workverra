import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const footerLinks = {
  Platform: [
    { label: 'How it Works', to: '/#how-it-works' },
    { label: 'Browse Workers', to: '/search' },
    { label: 'Post a Job', to: '/register' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Contact', to: '/contact' },
    { label: 'Safety', to: '/safety' },
  ],
}

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerTop}>
      <div className={styles.footerBrand}>
        <div className={styles.footerLogo}>Workverra</div>
        <p className={styles.footerTagline}>Hyperlocal talent marketplace for Tier 2 &amp; 3 India.</p>
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
      <span>© 2025 Workverra Technologies Pvt. Ltd.</span>
      <div className={styles.footerLegal}>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </div>
  </footer>
)

export default Footer