import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditNote() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/notes/${id}`,
        { headers: { Authorization: token } }
      );

      setTitle(res.data.title);
      setContent(res.data.content);
    };

    fetchNote();
  }, [id, token]);

  const updateNote = async () => {
    await axios.put(
      `http://localhost:5000/api/notes/${id}`,
      { title, content },
      { headers: { Authorization: token } }
    );

    navigate("/notes");
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-4">Edit Note</h2>

      <input
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={updateNote}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}