import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SingleNote() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!token) return;

    axios.get(" https://va-nanba.onrender.com/api/notes", {
      headers: { Authorization: token }
    }).then(res => {
      setNotes(res.data);
      const found = res.data.find(n => n._id === id);
      setNote(found);
    });

  }, [id, token]);

  if (!note) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">Loading...</div>
      </div>
    );
  }

  const currentIndex = notes.findIndex(n => n._id === id);

  const prevNote =
    currentIndex > 0 ? notes[currentIndex - 1] : null;

  const nextNote =
    currentIndex < notes.length - 1
      ? notes[currentIndex + 1]
      : null;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={note._id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-3xl font-bold text-primary">
              {note.title}
            </h2>

            <p className="mt-4">{note.content}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 border-t pt-6 flex justify-between">

          {prevNote ? (
            <button
              onClick={() => navigate(`/notes/${prevNote._id}`)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:scale-105 transition"
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          {nextNote && (
            <button
              onClick={() => navigate(`/notes/${nextNote._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
            >
              Next →
            </button>
          )}

        </div>
      </div>
    </div>
  );
}