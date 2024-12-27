import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllUsers } from "@/api/users";
import { createChat } from "@/api/chat";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addChat } from "@/redux/chatSlice";

export default function CreateChat({ isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    type: "one-to-one",
    groupName: "",
    selectedUsers: [],
  });
  const [users, setUsers] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  const handleUserToggle = (user) => {
    setFormData((prev) => {
      const isSelected = prev.selectedUsers.some((u) => u._id === user._id);
      const updatedUsers =
        prev.type === "one-to-one"
          ? isSelected
            ? []
            : [user] // Only one user allowed for one-to-one
          : isSelected
          ? prev.selectedUsers.filter((u) => u._id !== user._id)
          : [...prev.selectedUsers, user]; // Allow multiple users for group

      return { ...prev, selectedUsers: updatedUsers };
    });
  };

  const handleCreate = async () => {
    setIsPending(true);
    setError("");
    const { type, groupName, selectedUsers } = formData;

    try {
      const chatData = {
        ...(type === "group" && { groupName }),
        participants: selectedUsers.map((user) => user._id),
        type,
      };

      const updatedParticipants = [
        ...new Set([...chatData.participants, user._id]), // Ensure no duplicates
      ];

      console.log("chatData", {
        ...chatData,
        participants: updatedParticipants,
      });
      await createChat({
        ...chatData,
        participants: updatedParticipants,
      });
      // dispatch(addChat(res.data));
      setIsOpen(false); // Close dialog on success
    } catch (err) {
      console.error("Error creating chat:", err);
      setError("Failed to create chat. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const isCreateDisabled =
    (formData.type === "group" && !formData.groupName) ||
    formData.selectedUsers.length === 0;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Chat
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Chat Type Selection */}
            <div className="mt-4">
              <Label htmlFor="chatType">Chat Type</Label>
              <select
                id="chatType"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    type: e.target.value,
                    groupName: "",
                    selectedUsers: [],
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="one-to-one">One-to-One</option>
                <option value="group">Group</option>
              </select>
            </div>

            {/* Group Name Input */}
            {formData.type === "group" && (
              <div className="mt-4">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      groupName: e.target.value,
                    }))
                  }
                  placeholder="Enter group name"
                />
              </div>
            )}

            {/* User Selection */}
            <div className="mt-4">
              <Label>Select Users</Label>
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      formData.selectedUsers.some((u) => u._id === user._id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleUserToggle(user)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedUsers.some(
                        (u) => u._id === user._id
                      )}
                      readOnly
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      {user?.username}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Users Display */}
            <div className="mt-6 flex flex-wrap gap-2">
              {formData.selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-700"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span>{user.username}</span>
                  <button
                    onClick={() => handleUserToggle(user)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    aria-label={`Remove ${user.username}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreateDisabled}>
                {isPending ? "Creating..." : "Create Chat"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
