import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import './App.css'

const App = () => {
  const [engineReady, setEngineReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setEngineReady(true)
    })
  }, [])

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
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: { default: "bounce" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 },
    },
  },
  detectRetina: true,
};


  return (
    <>
      {engineReady && (
        <Particles
          id="tsparticles"
          options={particleOptions}
        />
      )}
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/* <FaceRecognition /> */}
      </div>
    </>
  )
}

export default App
