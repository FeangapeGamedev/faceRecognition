import { useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from "@tsparticles/engine";
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

// Manually initialize engine once, outside React lifecycle
loadSlim(tsParticles);

const App = () => {
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
    const boundingBox = data.outputs?.[0]?.data?.regions?.[0]?.region_info?.bounding_box;
    const image = document.getElementById('inputimage');

    if (!image) {
      console.warn('⚠️ Image not loaded yet');
      return {};
    }

    const width = Number(image.width);
    const height = Number(image.height);

    if (!boundingBox || !width || !height) {
      console.warn('⚠️ Missing bounding box or image dimensions', boundingBox);
      return {};
    }

    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    };
  };

  const displayFaceBox = (box) => setBox(box);

 const onButtonSubmit = () => {
  if (!input.trim() || input === imageUrl) {
    console.warn('No new image submitted or input is empty.');
    return;
  }

  setImageUrl(input);

  fetch('http://localhost:3000/clarifai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl: input })
  })
    .then(res => res.json())
    .then(result => {
      const regions = result?.outputs?.[0]?.data?.regions;

      if (regions && regions.length > 0) {
        const faceBox = calculateFaceLocation(result);
        displayFaceBox(faceBox);

        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        })
          .then(res => res.json())
          .then(count => {
            setUser(prev => ({ ...prev, entries: count }));
          });
      } else {
        console.warn('No face detected in the image.');
        setBox({}); // Clear the previous box
      }
    })
    .catch(err => console.error('Clarifai error:', err));
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
      <Particles id="tsparticles" options={particleOptions} />
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </>
        ) : route === 'signin' ? (
          <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
        ) : (
          <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )}
      </div>
    </>
  );
};

export default App;
