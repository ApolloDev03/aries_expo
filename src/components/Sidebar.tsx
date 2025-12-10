import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white h-screen p-5">
      <h1 className="text-xl font-bold mb-6 text-orange-500">ECVision Admin</h1>

      <nav className="space-y-4">
        <Link className="block hover:text-orange-400" to="/admin">
          Dashboard
        </Link>

        <Link className="block hover:text-orange-400" to="/admin/city">
          City Master
        </Link>

        <Link className="block hover:text-orange-400" to="/admin/industry">
          Industry Master
        </Link>

        <Link className="block hover:text-orange-400" to="/admin/expo">
          Expo Master
        </Link>

        <Link className="block hover:text-orange-400" to="/admin/users">
          User Master
        </Link>
      </nav>
    </div>
  );
}
