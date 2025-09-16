"use client"

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
  full_name: string;
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
  author_full_name: string;
  timestamp: string;
}

export default function SeekerChatsPage() {
  const searchParams = useSearchParams();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Get current user from localStorage or API
  const getCurrentUser = () => {
    // Try to get full_name from localStorage first
    const storedUser = localStorage.getItem('full_name');
    if (storedUser) {
      return storedUser;
    }
    
    // Try to get from stored user data
    const storedUserData = localStorage.getItem('elysian_user');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        return userData.full_name || userData.name || 'user';
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
          // Transform the backend response to match frontend interface
          const transformedConnections = connectedUsers.data.map((conn: any) => ({
            connection_id: conn.connection_id,
            user_id: conn.user_id, // Using full_name as user_id for now
            full_name: conn.full_name,
            role: "Listener",
            status: conn.status,
            listener_profile: {
              l_id: conn.id,
              specialty: conn.specialty || "General Support", // Use actual specialty if available
              avatar: conn.avatar || conn.full_name.charAt(0).toUpperCase(),
            }
          }));
          
          // Filter out pending connections - only show accepted connections in conversations
          const acceptedConnections = transformedConnections.filter((conn: any) => conn.status === 'Accepted');
          setConnectedListeners(acceptedConnections);
          console.log("Accepted Listeners for Conversations:", acceptedConnections);
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

  // Handle URL parameter for pre-selected chat
  useEffect(() => {
    const connectionId = searchParams.get('connectionId');
    if (connectionId && connectedListenersData.length > 0) {
      const connectionIdNum = parseInt(connectionId);
      const listener = connectedListenersData.find(l => l.connection_id === connectionIdNum);
      if (listener) {
        onStartChat(listener);
      }
    }
  }, [searchParams, connectedListenersData]);

  // WebSocket connection function with retry logic
  const connectToChat = (roomId: number, retryCount = 0) => {
    const accessToken = localStorage.getItem('adminToken');
    
    if (!accessToken) {
      setError("No access token found. Please login again.");
      return;
    }

    // Close existing socket if any
    if (chatSocket) {
      chatSocket.close();
    }

    console.log(`🔄 Attempting to connect to chat room ${roomId} (attempt ${retryCount + 1})`);

    // Add a small delay before creating the WebSocket connection
    setTimeout(() => {
      // Create new WebSocket connection
      const socket = new WebSocket(
        `ws://localhost:8000/ws/chat/${roomId}/?token=${accessToken}`
      );

    socket.onopen = () => {
      console.log("✅ Connected to chat room:", roomId);
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Received message:", data);
        
        // Determine if this message is from the current user or the other user
        // Backend sends author.full_name, so we need to handle both formats
        const messageAuthor = data.author?.full_name || data.author_full_name || data.author;
        const isFromCurrentUser = messageAuthor?.trim().toLowerCase() === currentUser?.trim().toLowerCase();
        
        console.log('WebSocket message alignment check:', {
          messageAuthor: messageAuthor?.trim().toLowerCase(),
          currentUser: currentUser?.trim().toLowerCase(),
          isFromCurrentUser,
          message: data.message
        });
        
        // Add new message to the messages array
        const newMessage: Message = {
          id: Date.now(),
          content: data.message,
          author_full_name: messageAuthor,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, newMessage]);
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = (event) => {
      console.log("🔌 Chat socket closed:", event.code, event.reason);
      setIsConnected(false);
      
      // Only attempt reconnection if it's not a normal closure and we haven't exceeded max retries
      if (event.code !== 1000 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`🔄 Connection lost. Retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);
        setTimeout(() => {
          connectToChat(roomId, retryCount + 1);
        }, delay);
      } else if (retryCount >= 3) {
        setError("Failed to connect to chat. Please refresh the page.");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      // Don't set error immediately on first attempt - let onclose handle retry logic
      if (retryCount === 0) {
        console.log("🔄 Initial connection failed, will retry...");
      } else {
        setError("Connection error occurred");
        setIsConnected(false);
      }
    };

      setChatSocket(socket);
    }, retryCount === 0 ? 300 : 0); // Add extra delay only on first attempt
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [chatSocket]);

  const onStartChat = async (listener: ConnectedListener) => {
    try {
      if(listener.status !== "Accepted"){
        alert("Connection not accepted yet.");
        return;
      }
      setLoading(true);
      setError(null);
      console.log("Starting chat with listener:", listener);
      const rooms = await startDirectChat(listener.user_id);

    if (rooms.success) {
      const roomId = rooms.data.id;
      setSelectedChat(listener.connection_id);

        // Fetch existing messages
      const messages = await getMessages(roomId);
        if (messages.success && messages.data) {
      setMessages(messages.data);
          console.log("Chat room created or fetched successfully:", messages.data);
        } else {
          setError("Failed to fetch messages");
        }

        // Connect to WebSocket for real-time messaging with a delay
        setTimeout(() => {
          connectToChat(roomId);
        }, 800);
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
    listener.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (listener.listener_profile?.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !chatSocket || !isConnected) return;
    
    try {
      setLoading(true);
      
      // Send message via WebSocket with current user info
      chatSocket.send(JSON.stringify({
        'message': newMessage.trim(),
        'author_full_name': currentUser
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
  const handleClick=()=>{
    alert("Feature coming soon")
  }
  return (
    <DashboardLayout userType="seeker">
      <div className="h-[calc(100vh-120px)]">
        {/* Top Header - Always Visible */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
                {/* Left Panel - Chat List */}
                <div className="lg:col-span-1">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-orange-100 h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Active Conversations</h3>
                      
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-200 bg-white shadow-sm"
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
                          <div className="text-gray-500">No active conversations found</div>
                        </div>
                      ) : (
                        filteredListeners.map((listener) => (
                          <div
                            key={listener.connection_id}
                            onClick={() => onStartChat(listener)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-orange-50 ${
                              selectedChat === listener.connection_id ? 'bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 shadow-md' : 'hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                  {listener.listener_profile.avatar || listener.full_name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  listener.status === 'Accepted' ? 'bg-green-400' : 'bg-gray-400'
                                }`}></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-800 truncate">{listener.full_name}</h4>
                                  {listener.listener_profile.unreadCount && listener.listener_profile.unreadCount > 0 && (
                                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                                      {listener.listener_profile.unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{listener.listener_profile.specialty}</p>
                                <p className="text-xs text-orange-500 font-medium">{listener.status}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Chat Area */}
                <div className="lg:col-span-2 h-full">
                  {selectedChat ? (
                    /* Chat Interface */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full flex flex-col">
                      {/* Chat Header */}
                      <div className="bg-gradient-to-r from-orange-400 to-orange-300 p-6 border-b border-orange-200 flex-shrink-0 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-lg shadow-md">
                              {getSelectedListener()?.listener_profile.avatar || getSelectedListener()?.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-white text-lg">{getSelectedListener()?.full_name}</h4>
                                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} shadow-sm`}></div>
                              </div>
                              <p className="text-sm text-white/90 font-medium">{getSelectedListener()?.listener_profile.specialty}</p>
                              <p className="text-xs text-white/70">
                                {isConnected ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={handleClick} className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                              <Phone className="w-5 h-5 text-white" />
                            </button>
                            <button onClick={handleClick} className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                              <Video className="w-5 h-5 text-white" />
                            </button>
                            <button onClick={handleClick} className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105">
                              <MoreVertical className="w-5 h-5 text-white" />
                            </button>
                            <button 
                              onClick={handleCloseChat}
                              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                              title="Close chat"
                            >
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-6 min-h-0 max-h-[calc(100vh-300px)] bg-gradient-to-b from-orange-50/30 to-white">
                        {messagesData.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>No messages yet. Start the conversation!</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {messagesData.map((message, index) => {
                              // Determine if this message is from the current user
                              const messageAuthor = message.author_full_name?.trim().toLowerCase();
                              const currentUserName = currentUser?.trim().toLowerCase();
                              const isFromCurrentUser = messageAuthor === currentUserName;
                              
                              return (
                                <div
                                  key={message.id}
                                  className={`flex items-start gap-3 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                  {/* Avatar for receiver messages (left side) */}
                                  {!isFromCurrentUser && (
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {message.author_full_name?.charAt(0)?.toUpperCase() || 'U'}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Message content */}
                                  <div className={`flex flex-col max-w-xs lg:max-w-md ${isFromCurrentUser ? 'items-end' : 'items-start'}`}>
                                    {/* Name display */}
                                    <div className={`text-xs mb-2 px-1 ${isFromCurrentUser ? 'text-right' : 'text-left'}`}>
                                      <span className="font-medium text-gray-600">
                                        {message.author_full_name}
                                      </span>
                                    </div>
                                    
                                    {/* Message bubble */}
                                    <div
                                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                                        isFromCurrentUser
                                          ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                                          : 'bg-white text-gray-800 border border-gray-100'
                                      }`}
                                    >
                                      <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                    
                                    {/* Timestamp */}
                                    <div className={`text-xs mt-1 px-1 ${isFromCurrentUser ? 'text-right' : 'text-left'}`}>
                                      <span className="text-gray-400">
                                        {message?.timestamp}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Avatar for sender messages (right side) */}
                                  {isFromCurrentUser && (
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {message.author_full_name?.charAt(0)?.toUpperCase() || 'U'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="p-6 border-t border-orange-100 flex-shrink-0 bg-white">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
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
                              className="w-full px-6 py-4 pr-16 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all duration-200 bg-white shadow-sm text-gray-700 placeholder-gray-400"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            </div>
                          </div>
                          <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || loading || !isConnected}
                            className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                            title={!isConnected ? "Not connected to chat" : "Send message"}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                        {!isConnected && (
                          <div className="mt-3 text-center">
                            <span className="text-xs text-red-400 bg-red-50 px-3 py-1 rounded-full">Disconnected from chat</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Placeholder when no chat is selected */
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100 h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <MessageCircle className="w-10 h-10 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Select a Conversation</h3>
                        <p className="text-gray-600 max-w-sm">Choose a conversation from the left panel to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
      </div>
    </DashboardLayout>
  );
}
