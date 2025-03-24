import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 7; // Số trang hiển thị tối đa trước khi dùng dấu "..."

  if (totalPages <= maxPagesToShow) {
    // Nếu tổng số trang nhỏ hơn hoặc bằng maxPagesToShow, hiển thị tất cả
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Nếu nhiều trang, hiển thị trang đầu, trang cuối và xung quanh currentPage
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Điều chỉnh nếu currentPage gần đầu hoặc cuối
    if (currentPage === 1) {
      startPage = 2;
      endPage = 4;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    pageNumbers.push(1);
    if (startPage > 2) {
      pageNumbers.push("...");
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }
    pageNumbers.push(totalPages);
  }

  return (
    <div className="mt-4 flex justify-center">
      {/* Nút Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 rounded bg-gray-300 px-3 py-1 text-gray-800 disabled:opacity-50"
      >
        Prev
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="mx-1 px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`mx-1 rounded px-3 py-1 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 rounded bg-gray-300 px-3 py-1 text-gray-800 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
