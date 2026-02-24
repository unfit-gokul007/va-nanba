import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const { token, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch Notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(
        ` https://va-nanba.onrender.com/api/notes?search=${search}`,
        {
          headers: { Authorization: token }
        }
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err.response?.data || err);
    }
  };

  // Create Note
  const createNote = async () => {
  if (!title || !content) {
    alert("Title and Content required");
    return;
  }

  try {
    await axios.post(
      " https://va-nanba.onrender.com/api/notes",
      { title, content },
      {
        headers: { Authorization: token }
      }
    );

    setTitle("");
    setContent("");
    fetchNotes();

  } catch (err) {
    console.error("Error creating note", err.response?.data || err);
  }
};

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(
        ` https://va-nanba.onrender.com/api/notes/${id}`,
        {
          headers: { Authorization: token }
        }
      );
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err.response?.data || err);
    }
  };

  // Download PDF
  const downloadPDF = async (id) => {
    try {
      const res = await axios.get(
        ` https://va-nanba.onrender.com/api/notes/pdf/${id}`,
        {
          headers: { Authorization: token },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "note.pdf");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error("PDF download error", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [search, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar />

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">My Notes</h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <input
          placeholder="Search notes..."
          className="border p-2 mt-4 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 space-y-2 bg-white p-4 rounded shadow">
          <input
            placeholder="Title"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Content"
            className="border p-2 w-full rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />


          <button
            onClick={createNote}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Note
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes found</p>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white shadow rounded p-4 border"
              >
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className="text-gray-600 mt-2">{note.content}</p>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="text-blue-500"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadPDF(note._id)}
                    className="text-purple-500"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${note._id}`)}
                    className="text-green-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}