// Lớp ngoài cùng
const asyncHandler = (fn) => {
  // Lớp bên trong
  return (req, res, next) => {
    // Lõi xử lý
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  asyncHandler,
};
