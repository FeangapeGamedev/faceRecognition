import { useState, useCallback } from 'react';

const Signin = ({ onRouteChange, loadUser }) => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const onEmailChange = useCallback((e) => {
    setSignInEmail(e.target.value);
  }, []);

  const onPasswordChange = useCallback((e) => {
    setSignInPassword(e.target.value);
  }, []);

  const onSubmitSignIn = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword
        })
      });

      const user = await res.json();
      if (user.id) {
        loadUser(user);
        onRouteChange('home');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  }, [signInEmail, signInPassword, loadUser, onRouteChange]);

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={onEmailChange}
                value={signInEmail}
                autoComplete="email"
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={onPasswordChange}
                value={signInPassword}
                autoComplete="current-password"
              />
            </div>
          </fieldset>
          <div>
            <button
              onClick={onSubmitSignIn}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="button"
            >
              Sign in
            </button>
          </div>
          <div className="lh-copy mt3">
            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Signin;
