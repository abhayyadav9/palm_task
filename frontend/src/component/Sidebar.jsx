import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersApi, logoutApi } from "../services/api";
import axios from "axios";

const Sidebar = ({ user, selectedUser, onSelectUser, className = "" }) => {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setUsersLoading(true);

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
      } catch (err) {
        console.log(err);
      } finally {
        setUsersLoading(false);
      }
    };

    const timer = setTimeout(getUsers, 300);

    return () => clearTimeout(timer);
  }, [limit, search]);

  const logout = async () => {
    setLoading(true);

    try {
      await axios.post(logoutApi, null, {
        withCredentials: true,
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=random&color=fff&size=128`;
  };

  return (
    <aside
      className={`w-full md:w-[340px] md:shrink-0 h-screen bg-white border-r border-gray-200 flex-col ${className}`}
    >

      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>

            <div>
              <h1 className="font-bold text-lg text-gray-900">
                Palm Chat
              </h1>

              <p className="text-xs text-gray-500">
                Messages
              </p>
            </div>
          </div>

          <button
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            title="New chat"
          >
            +
          </button>

        </div>

        {/* Search */}
        <div className="relative mt-5">

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setLimit(10);
            }}
            placeholder="Search people..."
            className="w-full bg-gray-100 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 transition"
          />

        </div>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">

        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Conversations
            </p>

            <span className="text-xs text-gray-400">
              {totalUsers}
            </span>
          </div>
        </div>

        {usersLoading && allUsers.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">
              Loading conversations...
            </p>
          </div>
        ) : allUsers.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">
              No users found
            </p>
          </div>
        ) : (
          <div className="px-3">

            {allUsers.map((listedUser) => {

              const isSelected =
                selectedUser?._id === listedUser._id;

              const isCurrentUser =
                user?._id === listedUser._id;

              return (
                <button
                  key={listedUser._id}
                  type="button"
                  onClick={() => onSelectUser(listedUser)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition mb-1 ${
                    isSelected
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >

                  {/* Avatar */}
                  <div className="relative shrink-0">

                    <img
                      src={getAvatar(listedUser.name)}
                      alt={listedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* Online */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />

                  </div>

                  {/* User information */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <h3
                        className={`font-medium truncate ${
                          isSelected
                            ? "text-blue-700"
                            : "text-gray-900"
                        }`}
                      >
                        {listedUser.name}

                        {isCurrentUser && (
                          <span className="text-xs text-gray-400 ml-1">
                            (You)
                          </span>
                        )}
                      </h3>

                    </div>

                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      Start a conversation
                    </p>

                  </div>

                </button>
              );
            })}

          </div>
        )}

        {/* Load more */}
        {allUsers.length < totalUsers && (
          <div className="px-4 py-3">

            <button
              type="button"
              onClick={() =>
                setLimit((currentLimit) => currentLimit + 10)
              }
              disabled={usersLoading}
              className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
            >
              {usersLoading ? "Loading..." : "Load more"}
            </button>

          </div>
        )}

      </div>

      {/* Current User */}
      <div className="border-t border-gray-200 p-4">

        <div className="flex items-center gap-3">

          <img
            src={getAvatar(user?.name)}
            alt={user?.name}
            className="w-11 h-11 rounded-full"
          />

          <div className="flex-1 min-w-0">

            <p className="font-semibold text-sm text-gray-900 truncate">
              {user?.name || "Guest"}
            </p>

            <p className="text-xs text-green-600">
              ● Online
            </p>

          </div>

          <button
            onClick={logout}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            {loading ? "..." : "Logout"}
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;