import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllConnectedUsers, getAllUsers } from "@/api/users";
// import { createBroadcast } from "@/api/chat"; // API to handle broadcast
import { useAppDispatch } from "@/hooks/useRedux";
import { addChat } from "@/redux/chatSlice";
import { createBroadCast, createChat } from "@/api/chat";

export default function CreateBroadcast({ isOpen, setIsOpen }) {
  const [broadcastName, setBroadcastName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllConnectedUsers();
        console.log("connected users: ", res.data);
        
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again.");
      }
    };
    fetchUsers();
  }, []);

  // Toggle user selection for the broadcast list
  const handleUserToggle = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u._id === user._id);
      return isSelected
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user];
    });
  };

  // Create a new broadcast
  const handleCreate = async () => {
    setIsPending(true);
    setError("");

    try {
      if (!broadcastName || selectedUsers.length === 0) {
        setError("Broadcast name and at least one recipient are required.");
        return;
      }

      const broadcastData = {
        broadCastName: broadcastName,
        participants: selectedUsers.map((user) => user._id),
      };

      const res = await createBroadCast(broadcastData);
      console.log("broad resss: ", res.data);

      dispatch(addChat(res.data)); // Add the broadcast to the chat list if needed
      // setIsOpen(false); // Close the dialog
      //   console.log("broadcastData: ", broadcastData);
    } catch (err) {
      console.error("Error creating broadcast:", err);
      setError("Failed to create broadcast. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

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
              Create Broadcast
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Broadcast Name Input */}
            <div className="mt-4">
              <Label htmlFor="broadcastName">Broadcast Name</Label>
              <Input
                id="broadcastName"
                value={broadcastName}
                onChange={(e) => setBroadcastName(e.target.value)}
                placeholder="Enter broadcast name"
              />
            </div>

            {/* User Selection */}
            <div className="mt-4">
              <Label>Select Users</Label>
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedUsers.some((u) => u._id === user._id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleUserToggle(user)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.some((u) => u._id === user._id)}
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

            {/* Error Message */}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!broadcastName || selectedUsers.length === 0}
              >
                {isPending ? "Creating..." : "Create Broadcast"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
