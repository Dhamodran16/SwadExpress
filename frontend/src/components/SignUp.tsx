import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup
} from 'firebase/auth';
import styles from '../styles/signup.module.css';
import signupImage from '../images/signup.png';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uc = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(uc.user);
      setMsg({ type: 'success', text: 'Account created! Check your email.' });
      setTimeout(() => window.location.href = '/home', 1500);
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = '/';
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  return (
    <div className={styles.signUp}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.graphicSection}>
          <img src={signupImage} alt="Sign in graphic" />
        </div>
        </div>

        <div className={styles.right}>
          <div className={styles.formBox}>
            <h1>Create Account</h1>

            <div className={styles.socialButtons}>
              <button className={styles.googleBtn} onClick={handleGoogle}>
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  alt="Google logo"
                  width={18}
                  height={18}
                  style={{ marginRight: '8px' }}
                />
                Sign up with Google
              </button>
            </div>

            <div className={styles.divider}><span>OR</span></div>

            {/* // inside SignUp.tsx */}
<form onSubmit={handleSignup}>
  <input
    type="text"
    placeholder="Full Name"
    value={name}
    onChange={e => setName(e.target.value)}
    required
    className={styles.formInput}           // ← add this
  /><br/><br/>
  <input
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={e => setEmail(e.target.value)}
    required
    className={styles.formInput}           // ← add this
  /><br/><br/>
   <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="4" y1="4" x2="20" y2="20" />
                  </svg>
                )}
              </span>
            </div>
  <button type="submit" className={styles.createAccount}>
    Create Account
  </button>
</form>

            {msg && (
              <p style={{ color: msg.type === 'error' ? 'red' : 'green' }}>{msg.text}</p>
            )}

            <p className={styles.loginLink}>
              Already have an account? <a href="/signin">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;