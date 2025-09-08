"use client"

import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout";
import { connectedListeners, startDirectChat, getMessages } from "@/utils/api";
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Send, 
  MoreVertical,
  Search,
  X
} from "lucide-react";

// Define proper TypeScript interfaces
interface ConnectedListener {
  connection_id: number;
  user_id: string;
  username: string;
  role: string;
  status: string;
  listener_profile: {
    l_id: string;
    specialty: string;
    avatar?: string;
    lastMessage?: string;
    lastActive?: string;
    unreadCount?: number;
  };
}

interface Message {
  id: number;
  content: string;
  author_username: string;
  timestamp: string;
}

export default function SeekerChatsPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedListenersData, setConnectedListeners] = useState<ConnectedListener[]>([]);
  const [messagesData, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  // Get current user from localStorage or API
  const getCurrentUser = () => {
    // Try to get username from localStorage first
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      return storedUser;
    }
    
    // Try to get from stored user data
    const storedUserData = localStorage.getItem('elysian_user');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        return userData.name || userData.username || 'user';
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    
    // Fallback to 'user' if nothing is found
    return 'user';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set current user
        const user = getCurrentUser();
        setCurrentUser(user);
        
        const connectedUsers = await connectedListeners();
        if (connectedUsers.success && connectedUsers.data) {
          setConnectedListeners(connectedUsers.data);
          console.log("Connected Listeners:", connectedUsers.data);
        } else {
          setError("Failed to fetch connected listeners");
        }
      } catch (err) {
        console.error("Error fetching connected listeners:", err);
        setError("Error fetching connected listeners");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // WebSocket connection function
  const connectToChat = (roomId: number) => {
    const accessToken = localStorage.getItem('adminToken');
    
    if (!accessToken) {
      setError("No access token found. Please login again.");
      return;
    }

    // Close existing socket if any
    if (chatSocket) {
      chatSocket.close();
    }

    // Create new WebSocket connection
    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomId}/?token=${accessToken}`
    );

    socket.onopen = () => {
      console.log("Connected to chat room:", roomId);
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        
        // Determine if this message is from the current user or the other user
        const messageAuthor = data.author_username || data.author;
        const isFromCurrentUser = messageAuthor === currentUser;
        
        // Add new message to the messages array
        const newMessage: Message = {
          id: Date.now(),
          content: data.message,
          author_username: messageAuthor,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, newMessage]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = (event) => {
      console.log("Chat socket closed:", event.code, event.reason);
      setIsConnected(false);
      if (event.code !== 1000) { // Not a normal closure
        setError("Connection lost. Trying to reconnect...");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error occurred");
      setIsConnected(false);
    };

    setChatSocket(socket);
  };

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [chatSocket]);

  const onStartChat = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting chat with user ID:", userId);
      const rooms = await startDirectChat(userId);

    if (rooms.success) {
      const roomId = rooms.data.id;
      setSelectedChat(roomId);

        // Fetch existing messages
      const messages = await getMessages(roomId);
        if (messages.success && messages.data) {
      setMessages(messages.data);
          console.log("Chat room created or fetched successfully:", messages.data);
        } else {
          setError("Failed to fetch messages");
        }

        // Connect to WebSocket for real-time messaging
        connectToChat(roomId);
    } else {
        setError("Failed to start chat");
      console.error("Failed to start chat:", rooms);
    }
  } catch (error) {
    console.error("Error starting chat:", error);
      setError("Error starting chat");
    } finally {
      setLoading(false);
  }
};


  const getSelectedListener = () => {
    return connectedListenersData.find(listener => listener.connection_id === selectedChat);
  };

  const filteredListeners = connectedListenersData.filter(listener =>
    listener.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listener.listener_profile.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !chatSocket || !isConnected) return;
    
    try {
      setLoading(true);
      
      // Send message via WebSocket with current user info
      chatSocket.send(JSON.stringify({
        'message': newMessage.trim(),
        'author_username': currentUser
      }));
      
      // Clear the input field immediately for better UX
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChat = () => {
    if (chatSocket) {
      chatSocket.close();
      setChatSocket(null);
    }
    setSelectedChat(null);
    setMessages([]);
    setIsConnected(false);
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="h-[calc(100vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Panel - Chat List */}
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-black mb-4">Your Conversations</h3>
                      
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {loading ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-gray-500">Loading conversations...</div>
                        </div>
                      ) : error ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-red-500">{error}</div>
                        </div>
                      ) : filteredListeners.length === 0 ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="text-gray-500">No conversations found</div>
                        </div>
                      ) : (
                        filteredListeners.map((listener) => (
                          <div
                            key={listener.connection_id}
                            onClick={() => onStartChat(listener.user_id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                              selectedChat === listener.connection_id ? 'bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] border border-orange-300' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {listener.listener_profile.avatar || listener.username.charAt(0).toUpperCase()}
                              </div>
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  listener.status === 'Accepted' ? 'bg-green-500' : 'bg-gray-400'
                              }`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-black truncate">{listener.username}</h4>
                                  {listener.listener_profile.unreadCount && listener.listener_profile.unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                      {listener.listener_profile.unreadCount}
                                  </span>
                                )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{listener.listener_profile.specialty}</p>
                                <p className="text-xs text-gray-500">{listener.status}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Chat Area */}
                <div className="lg:col-span-2">
                  {selectedChat ? (
                    /* Chat Interface */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full overflow-hidden flex flex-col">
                      {/* Chat Header */}
                      <div className="bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] p-4 border-b border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {getSelectedListener()?.listener_profile.avatar || getSelectedListener()?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-black">{getSelectedListener()?.username}</h4>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              </div>
                              <p className="text-sm text-black/70">{getSelectedListener()?.listener_profile.specialty}</p>
                              <p className="text-xs text-black/50">
                                {isConnected ? 'Connected' : 'Disconnected'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <Phone className="w-4 h-4 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <Video className="w-4 h-4 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-black" />
                            </button>
                            <button 
                              onClick={handleCloseChat}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                              title="Close chat"
                            >
                              <X className="w-4 h-4 text-black" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messagesData.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>No messages yet. Start the conversation!</p>
                            </div>
                          </div>
                        ) : (
                          messagesData.map((message) => {
                            // Determine if this message is from the current user
                            const isFromCurrentUser = message.author_username === currentUser;
                            
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                                    isFromCurrentUser
                                      ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    isFromCurrentUser ? 'text-white/70' : 'text-gray-500'
                                  }`}>
                                    {message?.timestamp}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newMessage.trim()) {
                                handleSendMessage();
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          />
                          <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || loading || !isConnected}
                            className="p-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white rounded-full hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!isConnected ? "Not connected to chat" : "Send message"}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Placeholder when no chat is selected */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">Select a Conversation</h3>
                        <p className="text-gray-600">Choose a conversation from the left panel to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
      </div>
    </DashboardLayout>
  );
}
