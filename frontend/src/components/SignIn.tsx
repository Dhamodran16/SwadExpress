import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import styles from '../styles/signin.module.css'; // Ensure CSS file is responsive
import signinImage from '../images/signin.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg({ type: 'success', text: 'Signed in! Redirecting…' });
      setTimeout(() => (window.location.href = '/home'), 1500);
    } catch (e: any) {
      console.error("Sign-in error: ", e);  // Log detailed error info to console
      let errorMessage = 'An error occurred during sign-in.';
      if (e.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (e.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (e.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please try again.';
      } else {
        errorMessage = `Error: ${e.message}`;
      }
      setMsg({ type: 'error', text: errorMessage });
    }
  };
  
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMsg({ type: 'success', text: 'Google sign‑in successful! Redirecting…' });
      setTimeout(() => (window.location.href = '/'), 1500);
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  return (
    <div className={styles.signIn}>
      <div className={styles.container}>
        <div className={styles.loginSection}>
          <h1>Sign in</h1>
          <p className={styles.subtitle}>Please login to continue to your account.</p>

          <form onSubmit={handleSignIn}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

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

            <div className={styles.checkboxContainer}>
              <input type="checkbox" className={styles.checkbox} id="keep" />
              <label htmlFor="keep" className={styles.checkboxLabel}>
                Keep me logged in
              </label>
            </div>

            <button type="submit" className={styles.btn}>Sign in</button>
          </form>

          {msg && (
            <p style={{ color: msg.type === 'error' ? 'red' : 'green', marginTop: '10px' }}>{msg.text}</p>
          )}

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <button className={styles.googleBtn} onClick={handleGoogle}>
            <svg className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Sign in with Google
          </button>

          <div className={styles.footer}>
            Need an account? <a href="/signup">Create one</a>
          </div>
        </div>

        <div className={styles.graphicSection}>
          <img src={signinImage} alt="Graphic" />
        </div>
      </div>    
    </div>
  );
};

export default SignIn;