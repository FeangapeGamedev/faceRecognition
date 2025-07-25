import { useState, useCallback } from 'react';

const Register = ({ onRouteChange, loadUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onNameChange = useCallback((e) => setName(e.target.value), []);
  const onEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.target.value), []);

  const onSubmitRegister = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const user = await res.json();
      if (user && user.id) {
        loadUser(user);
        onRouteChange('home');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  }, [name, email, password, loadUser, onRouteChange]);

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                onChange={onNameChange}
                value={name}
                autoComplete="name"
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={onEmailChange}
                value={email}
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
                value={password}
                autoComplete="new-password"
              />
            </div>
          </fieldset>
          <div>
            <button
              onClick={onSubmitRegister}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="button"
            >
              Register
            </button>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Register;
