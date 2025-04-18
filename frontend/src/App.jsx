import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudentDetails from "./pages/StudentDetails";
import Faculties from "./pages/Faculties";
import StudentStatuses from "./pages/StudentStatuses";
import Programs from "./pages/Programs";
import Header from "./components/Header";
import EmailManager from "./pages/Email";
import RuleManager from "./pages/Rules";
import Courses from "./pages/Courses";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import CancelHistoryPage from "./pages/CancelHistoryPage"
import TranscriptPage from "./pages/TranscriptPage"
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
          <Route path="/email-format" element={<EmailManager />} />
          <Route path="/rules" element={<RuleManager />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:classId" element={<ClassDetail />} />
          <Route path="/cancel-history" element={<CancelHistoryPage />} />
          <Route path="/transcript" element={<TranscriptPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
