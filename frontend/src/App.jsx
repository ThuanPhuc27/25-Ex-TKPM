import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/index";
import StudentDetails from "./pages/StudentDetails";
import Faculties from "./pages/Faculties";
import StudentStatuses from "./pages/StudentStatuses";
import Programs from "./pages/Programs";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/student-statuses" element={<StudentStatuses />} />
          <Route path="/programs" element={<Programs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
