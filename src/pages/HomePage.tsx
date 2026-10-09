import Hero from '../components/hero'
import About from '../components/about'
import Parcours from '../components/parcours'
import Skills from '../components/skills'
import Projects from '../components/projects'
import Contacts from '../components/contacts'
import Marquee from '../components/marquee'
import ApiError from '../components/apiError'

import useApi from '../hooks/useApi'
import { usePageReady } from '../context/transitionContext'

function HomePage() {

  const profil = useApi("/api/profil");
  const socials = useApi("/api/socials");
  const timeline = useApi("/api/timeline");
  const sections = useApi("/api/sections");
  const projects = useApi("/api/projects");
  const projectsTags = useApi("/api/project-tags");
  const briefs = useApi("/api/briefs");
  const skillCategories = useApi("/api/skill-categories");
  const skillsItems = useApi("/api/skill-items");

  const requests = [profil, socials, timeline, sections, projects, projectsTags, briefs, skillCategories, skillsItems];
  const isLoading = requests.some((request) => request.loading);
  const hasError = requests.some((request) => request.error);

  // Le rideau (preloader / transition) se lève quand tout est chargé
  usePageReady(!isLoading);

  if (hasError) return <ApiError />;

  return (
    <main>
      <Hero profil={profil.data[0]} socials={socials.data} />
      <Marquee items={skillsItems.data.map((item) => item.label)} duration={60} />
      <About briefs={briefs.data} />
      <Parcours timeline={timeline.data} sections={sections.data}/>
      <Skills skillCategories={skillCategories.data} skillsItems={skillsItems.data} />
      <Projects projects={projects.data} projectsTags={projectsTags.data}/>
      <Contacts socials={socials.data} />
    </main>
  )
}

export default HomePage
