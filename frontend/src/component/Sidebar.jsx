import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersApi, logoutApi, updateUserApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Sidebar = ({
  user,
  selectedUser,
  onSelectUser,
  onlineUsers = [],
  stats = { totalUsers: 0, totalMessages: 0, totalChats: 0 },
  onStatsUpdate,
  className = "",
}) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      setUsersLoading(true);
      setUsersError("");

      try {
        const response = await axios.get(
          getUsersApi({
            limit,
            query: search,
          }),
          {
            withCredentials: true,
          }
        );

        setAllUsers(response.data.data ?? []);
        setTotalUsers(response.data.pagination?.totalUsers ?? 0);
        if (response.data.stats && onStatsUpdate) {
          onStatsUpdate(response.data.stats);
        }
      } catch (err) {
        setUsersError(err.response?.data?.message || "Unable to load users");
      } finally {
        setUsersLoading(false);
      }
    };

    const timer = setTimeout(getUsers, 300);
    return () => clearTimeout(timer);
  }, [limit, search, onStatsUpdate]);

  const logout = async () => {
    setLoading(true);

    try {
      await axios.post(logoutApi, null, {
        withCredentials: true,
      });

      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=2563eb&color=fff&size=128&bold=true`;
  };

  const handleOpenProfileModal = () => {
    setProfileName(user?.name || "");
    setProfilePhone(user?.phone || "");
    setProfileError("");
    setProfileSuccess("");
    setIsProfileModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!profileName.trim()) {
      setProfileError("Name is required");
      return;
    }

    if (!profilePhone.trim()) {
      setProfileError("Phone number is required");
      return;
    }

    try {
      setProfileUpdating(true);
      const response = await axios.patch(
        updateUserApi,
        {
          name: profileName.trim(),
          phone: profilePhone.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status || response.data.data) {
        const updatedUser = response.data.data || { ...user, name: profileName.trim(), phone: profilePhone.trim() };
        setUser(updatedUser);
        setProfileSuccess("Profile updated successfully!");

        setAllUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? { ...u, name: updatedUser.name, phone: updatedUser.phone } : u))
        );

        setTimeout(() => {
          setIsProfileModalOpen(false);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileUpdating(false);
    }
  };

  return (
    <>
      <aside
        className={`w-full md:w-80 lg:w-90 md:shrink-0 h-full bg-white border-r border-slate-200 flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 leading-tight">Palm Chat</h1>
                <p className="text-xs text-slate-500">Real-time messaging</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {onlineUsers.length || 1} online
            </span>
          </div>

          {/* Search */}
          <div className="relative mt-3.5">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setLimit(10);
              }}
              placeholder="Search contacts..."
              className="w-full bg-slate-100 border border-transparent rounded-xl py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="px-3 pt-1.5 pb-1 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Contacts ({totalUsers})</span>
            <span>{allUsers.length} shown</span>
          </div>

          {usersError ? (
            <div className="p-6 text-center">
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-200/80">{usersError}</p>
            </div>
          ) : usersLoading && allUsers.length === 0 ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-3 p-2.5 rounded-xl animate-pulse">
                  <div className="w-11 h-11 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : allUsers.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try a different search query</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {allUsers.map((listedUser) => {
                const isSelected = selectedUser?._id === listedUser._id;
                const isCurrentUser = user?._id === listedUser._id;
                const isOnline = onlineUsers.includes(listedUser._id);

                return (
                  <button
                    key={listedUser._id}
                    type="button"
                    onClick={() => onSelectUser(listedUser)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-medium shadow-2xs"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={getAvatar(listedUser.name)}
                        alt={listedUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200/80"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                          isOnline ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm truncate ${isSelected ? "font-semibold text-blue-900" : "font-medium text-slate-800"}`}>
                          {listedUser.name}
                          {isCurrentUser && (
                            <span className="text-[11px] font-normal text-slate-400 ml-1.5">(You)</span>
                          )}
                        </h3>
                        {isOnline && (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            online
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {listedUser.email || "Click to message"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Load more */}
          {allUsers.length < totalUsers && (
            <div className="p-3">
              <button
                type="button"
                onClick={() => setLimit((currentLimit) => currentLimit + 10)}
                disabled={usersLoading}
                className="w-full py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {usersLoading ? "Loading more..." : "Load more contacts"}
              </button>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {!usersError && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{stats.totalUsers ?? totalUsers} Users</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{stats.totalChats ?? 0} Chats</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{stats.totalMessages ?? 0} Messages</span>
            </span>
          </div>
        )}

        {/* Current User profile footer */}
        <div className="p-3 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="flex items-center gap-3 flex-1 min-w-0 text-left p-1 rounded-lg hover:bg-white transition-colors cursor-pointer group"
              title="Click to edit profile"
            >
              <div className="relative shrink-0">
                <img
                  src={getAvatar(user?.name)}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-400 transition-all"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                    {user?.name || "User"}
                  </p>
                  <svg
                    className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || "Online"}
                </p>
              </div>
            </button>

            <button
              onClick={logout}
              disabled={loading}
              title="Sign out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => !profileUpdating && setIsProfileModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Profile Settings</h3>
                <p className="text-xs text-slate-500">Update your personal account details</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                disabled={profileUpdating}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center justify-center pb-1">
                <div className="relative">
                  <img
                    src={getAvatar(profileName || user?.name)}
                    alt={profileName || user?.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50 shadow-sm"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <p className="text-xs text-slate-400 mt-2">Avatar generated automatically from your name</p>
              </div>

              {profileError && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{profileSuccess}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2.5 text-sm text-slate-500 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Email is linked to your login and cannot be modified.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  disabled={profileUpdating}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {profileUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

