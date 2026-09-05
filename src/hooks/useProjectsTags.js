import { useState, useEffect } from "react";

const useProjectsTags = () => {
  const [projectsTags, setProjectsTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/project-tags`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur project-tags");
        return res.json();
      })
      .then(setProjectsTags)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projectsTags, loading, error };
};

export default useProjectsTags;
