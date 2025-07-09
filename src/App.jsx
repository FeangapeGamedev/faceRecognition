import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const App = () => {
  const [engineReady, setEngineReady] = useState(false);
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const calculateFaceLocation = (data) => {
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const returnClarifaiJSONRequest = (imageUrl) => {
    const PAT = 'bfffc4577d2a42d995a3c855a8c1c05d';
    const USER_ID = 'feangape';
    const APP_ID = 'FaceRecognition';

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl
            }
          }
        }
      ]
    });

    return {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', returnClarifaiJSONRequest(input))
      .then(response => response.json())
      .then(result => {
        if (result && result.outputs) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id })
          })
            .then(res => res.json())
            .then(count => {
              setUser(prev => ({ ...prev, entries: count }));
            });

          const faceBox = calculateFaceLocation(result);
          displayFaceBox(faceBox);
        }
      })
      .catch(error => console.log('Clarifai error:', error));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setUser({ id: '', name: '', email: '', entries: 0, joined: '' });
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const particleOptions = {
    fullScreen: { enable: true },
    particles: {
      number: { value: 250 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
      opacity: { value: 0.5 },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.6,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: { default: "bounce" }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 }
      }
    },
    detectRetina: true
  };

  return (
    <>
      {engineReady && <Particles id="tsparticles" options={particleOptions} />}
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </>
        ) : (
          route === 'signin' ? (
            <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
          ) : (
            <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          )
        )}
      </div>
    </>
  );
};

export default App;
