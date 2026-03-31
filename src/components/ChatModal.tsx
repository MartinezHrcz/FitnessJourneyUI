import {Send, X} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {messageApi} from "../api/messages/messageApi.ts";
import type {FriendDTO} from "../types/social/Friend.ts";
import { Client } from '@stomp/stompjs';
import UserAvatar from "./UserAvatar.tsx";

const ChatModal = ({friend, onClose}: {friend: FriendDTO, userId: string, onClose: () => void}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        if (!currentUserId) return;

        const client = new Client({
            brokerURL: 'ws://localhost:9090/ws-chat',
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log(str),
        });

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);

            client.subscribe(`/user/${currentUserId}/queue/messages`, (message) => {
                if (message.body) {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('Reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [currentUserId]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUserId(parsedUser.id);
        }
    }, []);

    useEffect(() => {
        messageApi.getMessages(friend.userId, friend.friendId)
            .then((res) => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (stompClient.current?.connected && newMessage.trim()) {
            const payload = {
                senderId: currentUserId,
                recipientId: currentUserId === friend.friendId ? friend.userId : friend.friendId,
                content: newMessage,
            };

            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(payload),
            });
            setNewMessage("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">

                <div className="bg-blue-600 dark:bg-blue-700 p-4 text-white flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            name={friend.friendName}
                            imageFilename={friend.friendProfilePicture}
                            className="w-10 h-10 bg-white/20 dark:bg-black/20 border border-white/10"
                            textClassName="text-sm text-white"
                        />
                        <div>
                            <p className="font-bold tracking-tight">{friend.friendName}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] opacity-80 font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-sm transition-colors ${
                                msg.senderId === currentUserId
                                    ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
                            }`}>
                                {msg.content}
                                {msg.sentTime && (
                                    <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter opacity-60 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-center">
                    <input
                        placeholder="Type a message..."
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 dark:bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:grayscale"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatModal;