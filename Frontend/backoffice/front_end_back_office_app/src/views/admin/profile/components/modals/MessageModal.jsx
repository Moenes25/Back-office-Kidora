import React, { useState } from "react";

const MessageModal = ({ admin, onClose }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="p-6 bg-white shadow-lg w-80 rounded-xl">
        <h3 className="mb-4 text-lg font-bold">Message {admin.nom}</h3>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-24 p-2 border rounded"
          placeholder="Type your message..."
        ></textarea>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => { console.log(message); onClose(); }}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
