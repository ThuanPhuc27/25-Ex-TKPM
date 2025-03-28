import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config.js";

const RULES_KEY = "STUDENT_STATUS_RULES";

const RuleManager = () => {
  const [rules, setRules] = useState({});
  const [newRule, setNewRule] = useState({ from: "", to: "" });

  // Load rules from localStorage on mount
  useEffect(() => {
    const storedRules = localStorage.getItem(RULES_KEY);
    if (storedRules) {
      setRules(JSON.parse(storedRules));
    } else {
      // Default rules if not found
      setRules({
        Active: ["Paused", "Graduated", "Dropped Out"],
        Paused: ["Active", "Dropped Out"],
        "Dropped Out": [],
        Graduated: [],
      });
    }
  }, []);

  // Update localStorage and sync with backend
  const updateRules = async (updatedRules) => {
    try {
      // Save to localStorage
      localStorage.setItem(RULES_KEY, JSON.stringify(updatedRules));
      setRules(updatedRules);

      // Send updated rules to the backend
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.rules}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRules),
        }
      );

      if (!response.ok) throw new Error("Failed to update backend");

      Swal.fire("Success!", "Rules updated successfully.", "success");
    } catch (error) {
      console.error("Error updating backend:", error);
      Swal.fire("Error!", "Failed to sync with the server.", "error");
    }
  };

  // Handle new rule addition
  const addRule = () => {
    const { from, to } = newRule;

    // Validation
    if (!from || !to) {
      Swal.fire("Error!", "Both 'From' and 'To' fields are required.", "error");
      return;
    }

    // Check if transition already exists
    if (rules[from]?.includes(to)) {
      Swal.fire("Error!", "Transition already exists.", "error");
      return;
    }

    // Update rules
    const updatedRules = {
      ...rules,
      [from]: rules[from] ? [...rules[from], to] : [to],
    };

    updateRules(updatedRules);
    setNewRule({ from: "", to: "" });
  };

  // Delete a transition
  const removeTransition = (from, to) => {
    const updatedRules = {
      ...rules,
      [from]: rules[from].filter((item) => item !== to),
    };
    updateRules(updatedRules);
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Student Status Rule Manager
      </h2>

      {/* Display Current Rules */}
      <div className="mb-6 space-y-6">
        {Object.entries(rules).map(([from, toList]) => (
          <div key={from} className="rounded-lg bg-gray-100 p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-700">{from}</h3>
            <ul className="space-y-2">
              {toList.map((to) => (
                <li
                  key={to}
                  className="flex items-center justify-between rounded-md bg-blue-100 p-2"
                >
                  <span>{to}</span>
                  <button
                    onClick={() => removeTransition(from, to)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {toList.length === 0 && (
                <li className="text-gray-500">No transitions available.</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Add New Rule */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newRule.from}
          onChange={(e) => setNewRule({ ...newRule, from: e.target.value })}
          placeholder="From (e.g., Active)"
          className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={newRule.to}
          onChange={(e) => setNewRule({ ...newRule, to: e.target.value })}
          placeholder="To (e.g., Graduated)"
          className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addRule}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Add Transition
        </button>
      </div>
    </div>
  );
};

export default RuleManager;
