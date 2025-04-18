import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import config from "../config"; 

const TranscriptPage = () => {
  const [studentId, setStudentId] = useState("");
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchScoreboard = async () => {
    if (!studentId.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${config.backendApiRoot}${config.apiPaths.enrollments}/student/${studentId}/scoreboard`
      );
      setScoreboard(res.data);
    } catch (error) {
      console.error("Error fetching scoreboard", error);
      setScoreboard([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (!scoreboard.length) return "N/A";

    const validScores = scoreboard.filter((item) => typeof item.score === "number");
    const total = validScores.reduce((sum, item) => sum + item.score, 0);

    return validScores.length ? (total / validScores.length).toFixed(2) : "N/A";
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("OFFICIAL SCOREBOARD", 14, 20);

    doc.setFontSize(12);
    doc.text(`Student ID: ${studentId}`, 14, 30);

    scoreboard.forEach((item, index) => {
      doc.text(`${index + 1}. Class: ${item.classCode} - Score: ${item.score}`, 14, 40 + index * 10);
    });

    doc.text(`GPA: ${calculateGPA()}`, 14, 50 + scoreboard.length * 10);

    doc.save(`${studentId}_scoreboard.pdf`);
  };

  const exportExcel = () => {
    const data = scoreboard.map((item) => ({
      "Class Code": item.classCode,
      "Score": item.score,
    }));

    data.push({ "Class Code": "GPA", "Score": calculateGPA() });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scoreboard");
    XLSX.writeFile(wb, `${studentId}_scoreboard.xlsx`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student Scoreboard</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <button
          onClick={fetchScoreboard}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View
        </button>
      </div>

      {loading && <p>Loading data...</p>}

      {scoreboard.length > 0 && (
        <>
          <table className="w-full border border-gray-400 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Class Code</th>
                <th className="border px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{item.classCode}</td>
                  <td className="border px-4 py-2">{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mb-4 font-semibold">GPA: {calculateGPA()}</p>

          <div className="flex gap-4">
            <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
              Export PDF
            </button>
            <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">
              Export Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TranscriptPage;
