import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import Upload from "./pages/Upload";
import SingleNote from "./pages/SingleNote";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import EditNote from "./pages/EditNote";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
               <Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditNote />
    </ProtectedRoute>
  }
/>





          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <SingleNote />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />



        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;