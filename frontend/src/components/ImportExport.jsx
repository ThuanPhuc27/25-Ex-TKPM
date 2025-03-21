import React, { useRef, useState } from "react";
import config from "../config.js";

const ImportExport = ({ refreshStudents, setIsAdding }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [exportFormat, setExportFormat] = useState("json");

  // Hàm export dữ liệu sinh viên
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.students}/export-all?format=${exportFormat}`
      );

      if (!response.ok) {
        throw new Error("Failed to export students.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm import dữ liệu sinh viên
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      // Xác định Content-Type dựa vào phần mở rộng file
      let contentType;
      if (file.name.endsWith(".json")) {
        contentType = "application/json";
      } else if (file.name.endsWith(".xml")) {
        contentType = "application/xml";
      } else {
        throw new Error("Chỉ hỗ trợ file .json hoặc .xml");
      }

      console.log("contentType", contentType);

      const fileContent = await file.text();
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.students}/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": contentType,
          },
          body: fileContent,
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi import dữ liệu.");
      }
      refreshStudents();
      alert("Import thành công!");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  return (
    <div className="mb-2 flex justify-between">
      <div className="">
        <h2 className="mb-2 text-lg font-semibold">Import / Export Students</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex items-center gap-3">
          <select
            className="rounded border p-2"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
          </select>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleExport}
            disabled={loading}
          >
            Export
          </button>
          <input
            type="file"
            accept=".json, .xml"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />
          <button
            className="rounded bg-yellow-500 px-4 py-2 text-white"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            Import File
          </button>
        </div>
      </div>
      <div className="mt-8 mb-4">
        <button
          onClick={() => setIsAdding(true)}
          className="rounded bg-white px-4 py-2 text-blue-500 shadow-md transition hover:bg-gray-200"
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default ImportExport;
