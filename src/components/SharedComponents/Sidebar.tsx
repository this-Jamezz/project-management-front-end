import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">MyApp</h1>
      </div>

      <nav className="space-y-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? "bg-gray-100 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}