// import { useEffect, useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { X, Check, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getAllUsers } from "@/api/users";
// import { createGroupChat } from "@/api/chat";
// import { useAppDispatch } from "@/hooks/useRedux";
// import { addChat } from "@/redux/chatSlice";

// // interface User {
// //   _id: number;
// //   name: string;
// // }

// // interface CreateGroupFormData {
// //   groupName: string;
// //   selectedUsers: User[];
// // }

// // interface CreateGroupProps {
// //   isOpen: boolean;
// //   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// // }

// // Mock user data (replace with actual data fetching in a real application)
// // const users: User[] = [
// //   { id: 1, name: "Alice Johnson" },
// //   { id: 2, name: "Bob Smith" },
// //   { id: 3, name: "Charlie Brown" },
// //   { id: 4, name: "Diana Prince" },
// // ];

// export default function CreateGroupPage({ isOpen, setIsOpen }) {
//   const [formData, setFormData] = useState({
//     type: "one-to-one",
//     groupName: "",
//     selectedUsers: [],
//   });

//   const [users, setUsers] = useState([]);
//   const [isPending, setIsPending] = useState(false);

//   const dispatch = useAppDispatch();

//   const fetchAllUsers = async () => {
//     try {
//       const res = await getAllUsers();
//       setUsers(res.data);
//       console.log(res.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   const handleClose = () => setIsOpen(false);
//   const handleCreate = async () => {
//     // Implement group creation logic here
//     const data = {
//       // groupName: formData.groupName,
//       ...(formData.type === "group" && { groupName: formData.groupName }), // Add groupName only if it's a group chat
//       participants: formData.selectedUsers.map((user) => user._id),
//       type: formData.type,
//     };
//     console.log("Creating group:", data);
//     console.log("data users:", data);
//     setIsPending(true);
//     try {
//       const res = await createGroupChat(data);
//       console.log("res:", res);
//       dispatch(addChat(res.data));
//     } catch (error) {
//       console.error(error);
//     }

//     setIsPending(false);

//     // handleClose();
//   };

//   const handleUserToggle = (user) => {
//     setFormData((prev) => {
//       const isSelected = prev.selectedUsers.some((u) => u._id === user._id);
//       return {
//         ...prev,
//         selectedUsers: isSelected
//           ? prev.selectedUsers.filter((u) => u._id !== user._id)
//           : [...prev.selectedUsers, user],
//       };
//     });
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={handleClose}
//       className="fixed inset-0 z-10 overflow-y-auto"
//     >
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//           <div className="p-6">
//             <Dialog.Title className="text-lg font-medium text-gray-900">
//               Create New Group
//             </Dialog.Title>
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
//             >
//               <X className="h-6 w-6" aria-hidden="true" />
//               <span className="sr-only">Close</span>
//             </button>

//             <div className="mt-4">
//               <Label htmlFor="groupName">Group Name</Label>
//               <Input
//                 type="text"
//                 id="groupName"
//                 value={formData.groupName}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     groupName: e.target.value,
//                   }))
//                 }
//                 className="mt-1"
//                 placeholder="Enter group name"
//               />
//             </div>

//             <div className="mt-4">
//               <Label>Select Users</Label>
//               <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
//                 {users.map((user) => (
//                   <div
//                     key={user._id}
//                     className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
//                       formData.selectedUsers.some((u) => u._id === user._id)
//                         ? "bg-blue-50"
//                         : ""
//                     }`}
//                     onClick={() => handleUserToggle(user)}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedUsers.some(
//                         (u) => u._id === user._id
//                       )}
//                       onChange={() => {}}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label className="ml-3 block text-sm font-medium text-gray-700">
//                       {user?.username}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6 flex flex-wrap gap-2">
//               {formData.selectedUsers.map((user) => (
//                 <div
//                   key={user._id}
//                   className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-700"
//                 >
//                   <User className="h-4 w-4 mr-1" />
//                   <span>{user.username}</span>
//                   <button
//                     onClick={() => handleUserToggle(user)}
//                     className="ml-1 text-blue-500 hover:text-blue-700"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 flex justify-end space-x-3">
//               <Button variant="outline" onClick={handleClose}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleCreate}
//                 disabled={
//                   !formData.groupName || formData.selectedUsers.length === 0
//                 }
//               >
//                 {isPending ? "Creating..." : "Create Group"}{" "}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// }

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllUsers } from "@/api/users";
import { createGroupChat } from "@/api/chat";
import { useAppDispatch } from "@/hooks/useRedux";
import { addChat } from "@/redux/chatSlice";

export default function CreatePage({ isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    type: "one-to-one", // Default type
    groupName: "",
    selectedUsers: [],
  });

  const [users, setUsers] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const dispatch = useAppDispatch();

  const fetchAllUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleCreate = async () => {
    const data = {
      ...(formData.type === "group" && { groupName: formData.groupName }), // Add groupName only if it's a group chat
      participants: formData.selectedUsers.map((user) => user._id),
      type: formData.type,
    };
    console.log("Creating group:", data);
    console.log("data users:", data);
    setIsPending(true);
    try {
      const res = await createGroupChat(data);
      console.log("res:", res);
      dispatch(addChat(res.data));
    } catch (error) {
      console.error(error);
    }

    setIsPending(false);
  };

  // const handleUserToggle = (user) => {
  //   setFormData((prev) => {
  //     const isSelected = prev.selectedUsers.some((u) => u._id === user._id);
  //     return {
  //       ...prev,
  //       selectedUsers: isSelected
  //         ? prev.selectedUsers.filter((u) => u._id !== user._id)
  //         : [...prev.selectedUsers, user],
  //     };
  //   });
  // };

  const handleUserToggle = (user) => {
    setFormData((prev) => {
      let updatedSelectedUsers;

      // If it's a one-to-one chat, only allow selecting 2 users
      if (formData.type === "one-to-one") {
        // If no user is selected yet, add the clicked user
        if (prev.selectedUsers.length === 0) {
          updatedSelectedUsers = [user];
        }
        // If only one user is selected, add the second user
        else if (
          prev.selectedUsers.length === 1 &&
          !prev.selectedUsers.some((u) => u._id === user._id)
        ) {
          updatedSelectedUsers = [...prev.selectedUsers, user];
        }
        // If two users are already selected, prevent adding more
        else {
          updatedSelectedUsers = prev.selectedUsers;
        }
      } else {
        const isSelected = prev.selectedUsers.some((u) => u._id === user._id);
        updatedSelectedUsers = isSelected
          ? prev.selectedUsers.filter((u) => u._id !== user._id)
          : [...prev.selectedUsers, user];
      }

      return {
        ...prev,
        selectedUsers: updatedSelectedUsers,
      };
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Chat
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>

            {/* Select Chat Type */}
            <div className="mt-4">
              <Label htmlFor="chatType">Chat Type</Label>
              <select
                id="chatType"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="one-to-one">One-to-One</option>
                <option value="group">Group</option>
              </select>
            </div>

            {/* Group Name (only for Group chat type) */}
            {formData.type === "group" && (
              <div className="mt-4">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  type="text"
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      groupName: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Enter group name"
                />
              </div>
            )}

            {/* Select Users */}
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
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      {user?.username}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Users */}
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
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  (formData.type === "group" && !formData.groupName) ||
                  formData.selectedUsers.length === 0
                }
              >
                {isPending ? "Creating..." : "Create Chat"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
