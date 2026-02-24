import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-primary text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">Va Nanba</h1>
      <ul className="space-y-4">
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/upload">Upload</Link></li>
      </ul>
    </div>
  );
}