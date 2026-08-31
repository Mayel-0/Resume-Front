import React from 'react'
import Header from '../components/header'
import Hero from '../components/hero'
import About from '../components/about'
import Parcours from '../components/parcours'
import Skills from '../components/skills'

function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <About />
        <Parcours />
        <Skills />
      </main>
    </div>
  )
}

export default HomePage
