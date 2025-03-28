import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config.js";

const LOCAL_STORAGE_KEY = "ALLOWED_EMAIL_DOMAINS";

const EmailManager = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");

  // Load domains from localStorage on component mount
  useEffect(() => {
    const storedDomains = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDomains) {
      setDomains(JSON.parse(storedDomains));
    }
  }, []);

  // Update localStorage and send updated domains to the backend
  const updateDomains = async (newDomains) => {
    try {
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDomains));
      setDomains(newDomains);

      // Send update request to the backend
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.domains}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ALLOWED_EMAIL_DOMAINS: newDomains }),
        }
      );

      if (!response.ok) throw new Error("Failed to update backend");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Add domains success.",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    } catch (error) {
      console.error("Error updating backend:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update domains on the server.",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

  // Add a new email domain
  const addDomain = () => {
    if (!newDomain.startsWith("@")) {
      Swal.fire("Error!", "Domain must start with '@'.", "error");
      return;
    }
    if (domains.includes(newDomain)) {
      Swal.fire("Error!", "Domain already exists.", "error");
      return;
    }

    const updatedDomains = [...domains, newDomain];
    updateDomains(updatedDomains);
    setNewDomain("");
  };

  // Remove an existing email domain
  const removeDomain = (domain) => {
    const updatedDomains = domains.filter((item) => item !== domain);
    updateDomains(updatedDomains);
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Email Domain Manager
      </h2>

      {/* Display the list of domains */}
      <ul className="mb-6 space-y-4">
        {domains.map((domain, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
          >
            <span className="text-gray-700">{domain}</span>
            <button
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={() => removeDomain(domain)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Form to add a new domain */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="Enter email domain (e.g., @example.com)"
          className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addDomain}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Add Domain
        </button>
      </div>
    </div>
  );
};

export default EmailManager;
