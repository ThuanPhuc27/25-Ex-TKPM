import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CancelHistoryPage = () => {
  const [cancelHistory, setCancelHistory] = useState([]);

  useEffect(() => {
    // Lấy lịch sử hủy đăng ký từ localStorage
    const history = JSON.parse(localStorage.getItem("cancelHistory")) || [];
    setCancelHistory(history);
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-md max-w-3xl">
      <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">
        Cancellation History
      </h2>

      {cancelHistory.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {cancelHistory.map((history, index) => (
            <li key={index} className="py-2">
              <span className="font-semibold">{history.studentId}</span> -{" "}
              {history.classCode} -{" "}
              <span className="text-sm text-gray-500">
                {new Date(history.canceledAt).toLocaleString()}
              </span>
              <p>{history.reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No cancellation history available.</p>
      )}

      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CancelHistoryPage;
