import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentDetails from "./pages/StudentDetails";
import Faculties from "./pages/Faculties";
import StudentStatuses from "./pages/StudentStatuses";
import Programs from "./pages/Programs";
import Header from "./components/Header";
function App() {
  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
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
