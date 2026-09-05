import React from 'react'
import Hero from '../components/hero'
import About from '../components/about'
import Parcours from '../components/parcours'
import Skills from '../components/skills'
import Projects from '../components/projects'
import Contacts from '../components/contacts'

import PageLoader from '../components/pagesLoader'

import useProfile from "../hooks/useHero.js";
import useSocials from "../hooks/useSocials.js";
import useTimeline from "../hooks/useTimeline";
import useSections from "../hooks/useSections";
import useProjects from "../hooks/useProject.js";
import useSkillsItems from "../hooks/useSkillsItems.js";
import useSkillCategories from "../hooks/useSkillCategories.js";

function HomePage() {

  const { profil, loading: loadingProfil } = useProfile();
  const { socials, loading: loadingSocials } = useSocials();
  const { timeline, loading: loadingTimeline } = useTimeline();
  const { sections, loading: loadingSections } = useSections();
  const { projects, loading: loadingProjects } = useProjects();
  const {skillCategories, loading: loadingskillCategories} = useSkillCategories();
  const {skillsItems, loading: loadingskillsitems} = useSkillsItems();


  const isLoading = [loadingProfil,loadingSocials,loadingTimeline,loadingSections,loadingProjects,loadingskillCategories,loadingskillsitems].some(Boolean);

  return (
    <div>
      <PageLoader loading={isLoading}>
        <main>
          <Hero profil={profil} socials={socials}/>
          <About />
          <Parcours timeline={timeline} sections={sections}/>
          <Skills skillCategories={skillCategories} skillsItems={skillsItems} />
          <Projects projects={projects}/>
          <Contacts socials={socials} />
        </main>
      </PageLoader>
    </div>
  )
}

export default HomePage
