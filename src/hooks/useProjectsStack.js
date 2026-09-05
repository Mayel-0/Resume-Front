import { useState, useEffect } from "react";

const useProjectsStack = () => {
  const [projectsStack, setProjectsStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/project-tech-stack`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur project-tech-stack");
        return res.json();
      })
      .then(setProjectsStack)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projectsStack, loading, error };
};

export default useProjectsStack;
