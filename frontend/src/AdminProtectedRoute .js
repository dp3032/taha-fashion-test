const AdminProtectedRoute = ({ element: Element }) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token) {
      window.location.href = "/login";
      return null;
  }

  if (role !== 'admin') {
      window.location.href = "/dashboard";
      return null;
  }

  return Element;
};

export default AdminProtectedRoute;
