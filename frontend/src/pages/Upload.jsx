import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Upload() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/upload",
        {
          headers: { Authorization: token }
        }
      );
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token]);

  const uploadFile = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Uploaded Successfully");
      setFile(null);
      fetchFiles(); // 🔥 refresh list

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };


const deleteFile = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/upload/${id}`,
      {
        headers: { Authorization: token }
      }
    );

    alert("File Deleted");
    fetchFiles(); // refresh list

  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
  

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-blue-600">
          Upload Files
        </h2>

        <input
          type="file"
          className="mt-4 border p-2 rounded"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={uploadFile}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Upload
        </button>

        {/* 🔥 FILE LIST */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {files.length === 0 ? (
            <p>No files uploaded</p>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="bg-white p-4 rounded shadow"
              >
                <p className="font-semibold">
                  {file.originalname}
                </p>

                <a
                  href={`http://localhost:5000/uploads/${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline mt-2 block"
                >
                  View File
                </a>

                 {/* 🔥 DELETE BUTTON */}
    <button
      onClick={() => deleteFile(file._id)}
      className="bg-red-500 text-white px-3 py-1 rounded mt-3"
    >
      Delete
    </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}