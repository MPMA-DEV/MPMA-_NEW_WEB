import { useState, useEffect, useRef } from "react";
import { Send, Search, MoreVertical, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToastHelpers } from "../../hooks/useToast";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import api from "../../api";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  content: string;
  createdAt: string;
  type: "text" | "file" | "image";
}

interface Contact {
  id: string;
  nickname: string;
  username: string;
  role: "admin" | "trainee";
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  isOnline: boolean;
}

export default function TraineeChat() {
  const { user } = useAuth();
  const { success, error } = useToastHelpers();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle clear chat
  const handleClearChat = async () => {
    if (!selectedContact) return;

    const currentContact = contacts.find((c) => c.id.toString() === selectedContact);
    const confirmed = await ConfirmationModal.showWarning({
      title: "Clear Chat",
      message: `Are you sure you want to clear all messages with ${currentContact?.nickname || currentContact?.username}? This action cannot be undone.`,
      confirmText: "Clear Chat",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/chat/clear/${selectedContact}`);
      setMessages([]);
      // Update contact's last message
      setContacts(prev => prev.map(c =>
        c.id.toString() === selectedContact
          ? { ...c, lastMessage: null, lastMessageTime: null, unreadCount: 0 }
          : c
      ));
      success("Chat cleared successfully");
    } catch (e) {
      console.error("Failed to clear chat:", e);
      error("Failed to clear chat. Please try again.");
    }
    setShowMenuDropdown(false);
  };

  // Polling for Contacts
  const fetchContacts = async () => {
    try {
      const response = await api.get("/api/chat/contacts", {
        params: { search: searchQuery }
      });

      const contactsData = response.data.contacts || [];
      setContacts(contactsData.map((c: any) => ({
        ...c,
        role: c.id === 1 ? 'admin' : 'trainee',
        isOnline: false, // Online status disabled without sockets
      })));
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    setIsLoadingContacts(true);
    fetchContacts();

    const interval = setInterval(() => {
      fetchContacts();
    }, 15000); // Poll contacts every 15 seconds

    return () => clearInterval(interval);
  }, [searchQuery]);

  // Polling for Messages
  const fetchMessages = async () => {
    if (!selectedContact) return;
    try {
      const response = await api.get(`/api/chat/messages/${selectedContact}`);
      setMessages(response.data);

      // Reset unread count locally
      setContacts(prev => prev.map(c =>
        String(c.id) === selectedContact ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    if (!selectedContact) return;
    
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Poll messages every 5 seconds when chat is open

    return () => clearInterval(interval);
  }, [selectedContact]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const messageData = {
      receiverId: selectedContact,
      content: messageInput,
      type: "text",
    };

    try {
      const response = await api.post("/api/chat/send", messageData);
      setMessages(prev => [...prev, response.data]);
      setMessageInput("");
      scrollToBottom();
      fetchContacts(); // Update contacts list (last message)
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentContact = contacts.find((c) => c.id.toString() === selectedContact);

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row">
      <div
        className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 transition-all duration-300
          ${selectedContact ? "hidden md:flex" : "flex"}
        `}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          {isLoadingContacts ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="ml-3 flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {searchQuery ? "No contacts found" : "Start a conversation"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Search for a trainee by name to start chatting"}
              </p>
            </div>
          ) : (
            contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact.id.toString())}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${selectedContact === contact.id.toString() ? "bg-blue-50 shadow-sm ring-1 ring-blue-100" : "hover:bg-white hover:shadow-sm"
                  }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm shrink-0
                     ${contact.role === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                    {(contact.nickname || contact.username || "?").charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3 text-left flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className={`text-sm font-semibold truncate ${selectedContact === contact.id.toString() ? 'text-blue-900' : 'text-gray-900'}`}>
                      {contact.nickname || contact.username}
                    </h4>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${selectedContact === contact.id.toString() ? 'text-blue-600' : 'text-gray-500'}`}>
                    {contact.lastMessage || "No messages yet"}
                  </p>
                </div>
                {contact.unreadCount > 0 && (
                  <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                    {contact.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col bg-white transition-all duration-300
          ${!selectedContact ? "hidden md:flex" : "flex"}
        `}
      >
        {selectedContact ? (
          <>
            <div className="h-16 px-4 md:px-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shadow-sm shrink-0
                    ${currentContact?.role === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                  {(currentContact?.nickname || currentContact?.username || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">{currentContact?.nickname || currentContact?.username}</h3>
                </div>
              </div>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {showMenuDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    <button
                      onClick={handleClearChat}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-3" />
                      Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId == user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 md:px-5 md:py-3.5 rounded-2xl shadow-sm overflow-hidden ${msg.senderId == user?.id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-all">{msg.content}</p>
                    <p className={`text-[10px] mt-1.5 text-right ${msg.senderId == user?.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 px-2 text-sm min-w-0"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-gray-300" />
            </div>
            <p className="font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
