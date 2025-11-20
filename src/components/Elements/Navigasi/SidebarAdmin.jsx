import {
  UserCircleIcon,
  PencilSquareIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function SidebarAdmin({
  user,
  isOpen,
  toggle,
  onEditProfile,
  onLogout,
  isMobile,
}) {
  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition"
      >
        <UserCircleIcon className="w-6 h-6 text-white" />
        {!isMobile && <span className="text-white">{user?.email}</span>}
      </button>

      {isOpen && (
        <div
          className="
            absolute 
            bottom-full mb-2 
            left-0 
            bg-white shadow-xl rounded-xl overflow-hidden z-50 min-w-[180px]
          "
        >
          <button
            onClick={onEditProfile}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <PencilSquareIcon className="w-5 h-5 text-yellow-500" />
            <span>Ubah Profil</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
