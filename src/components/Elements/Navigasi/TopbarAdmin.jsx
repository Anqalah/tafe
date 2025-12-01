import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export const TopbarAdmin = ({ user, onEditProfile, onLogout }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      {/* Avatar */}
      <div className="relative group">
        <button className="flex items-center">
          <UserCircleIcon className="h-10 w-10 text-gray-700 hover:text-gray-900 transition" />
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-200 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
          <Link to={`admin/edit/${user.uuid}`}>
            <button
              onClick={onEditProfile}
              className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Edit Profile
            </button>
          </Link>

          <button
            onClick={onLogout}
            className="w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
