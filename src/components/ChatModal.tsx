import {Send, X} from "lucide-react";
import {useEffect, useState} from "react";
import type {MessageDto} from "../types/social/Message.ts";
import {messageApi} from "../api/messages/messageApi.ts";
import type {FriendDTO} from "../types/social/Friend.ts";


const ChatModal = ({friend, onClose}: {friend: FriendDTO, userId: string, onClose: () => void}) => {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [friendId, setFriendId] = useState("");

    useEffect(() => {
        if (friend)
        {
            if (friend.isRequester)
            {
                setUserId(friend.userId);
                setFriendId(friend.friendId);
            }
            else {
                setUserId(friend.friendId);
                setFriendId(friend.userId);
            }
            messageApi.getMessages(friend.userId, friend.friendId)
                .then((res) => {
                    setMessages(res.data);
                    setLoading(false);
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const payload: MessageDto = {
            senderId: userId,
            recipientId: friendId,
            content: newMessage
        };

        try {
            const res = await messageApi.create(payload);
            setMessages([...messages, res.data]);
            setNewMessage("");
        }
        catch (error) {
            console.log("Failed to send message:", error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            {friend.friendName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold">{friend.friendName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                                msg.senderId === userId
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
                    <input
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatModal;