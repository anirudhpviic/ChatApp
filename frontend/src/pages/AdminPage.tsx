import { apiClient } from "@/api/config";
import { AdminChatList } from "../components/AdminChatList";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [details, setDetails] = useState([]);
  const getAllChatDetails = async () => {
    try {
      const res = await apiClient.get("http://localhost:3000/admin/details");
      console.log("admin:", res.data);
      setDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllChatDetails();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Admin Panel</h1>
      <AdminChatList details={details} />
    </div>
  );
}
