import { useState, useEffect } from "react";

const useBriefs = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/briefs`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur briefs");
        return res.json();
      })
      .then(setBriefs)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { briefs, loading, error };
};

export default useBriefs;
