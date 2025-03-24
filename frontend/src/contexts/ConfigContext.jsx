// ConfigContext.js
import React, { createContext, useState, useEffect } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [configs, setConfigs] = useState({
    studentStatuses: [],
    faculties: [],
    programs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch("http://localhost:3001/config");
        if (!response.ok) throw new Error("Failed to fetch configurations");
        const data = await response.json();
        setConfigs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  return (
    <ConfigContext.Provider value={{ configs, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};
