import {Send, X} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {messageApi} from "../api/messages/messageApi.ts";
import type {FriendDTO} from "../types/social/Friend.ts";
import { Client } from '@stomp/stompjs';

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
            console.error('Broker reported error: ' + frame.headers['message']);
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
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                                msg.senderId === currentUserId
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                            }`}>
                                {msg.content}
                                {msg.sentTime && (
                                    <div className={`text-[10px] mt-1 opacity-70 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
                    <input
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
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