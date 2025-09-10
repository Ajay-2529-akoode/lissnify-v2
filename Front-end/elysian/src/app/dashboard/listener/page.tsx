"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/Components/DashboardLayout";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { connectedListeners, acceptConnection, connectionList,listener } from "@/utils/api";
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  UserCheck, 
  MessageCircle, 
  ArrowRight, 
  Calendar,
  Play,
  Plus,
  User,
  Settings,
  Check,
  X,
  Bell,
  Phone,
  Video,
  Send,
  MessageSquare
} from "lucide-react";
import { count } from "console";

interface ConnectedSeeker {
  connection_id: number;
  user_id: string;
  username: string;
  role: string;
  status: string;
  seeker_profile: {
    s_id: string;
    specialty: string;
    avatar?: string;
    lastMessage?: string;
    lastActive?: string;
    unreadCount?: number;
  };
}

interface PendingConnection {
  connection_id: number;
  user_id: string;
  username: string;
  role: string;
  status: string;
  seeker_profile: {
    s_id: string;
    specialty: string;
    avatar?: string;
    lastMessage?: string;
    lastActive?: string;
    unreadCount?: number;
  };
}

interface SessionRequest {
  id: string;
  seekerName: string;
  seekerAvatar: string;
  category: string;
  message: string;
  requestedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface UpcomingSession {
  id: string;
  seekerName: string;
  seekerAvatar: string;
  category: string;
  date: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
}

export default function ListenerDashboard() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [connectedSeekersData, setConnectedSeekers] = useState<ConnectedSeeker[]>([]);
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [activeSeeker,setActiveSeeker]=useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const connectedUsers = await connectionList();
        const seekerCount= connectedUsers.data.length
        setActiveSeeker(seekerCount)
        const listener_id = localStorage.getItem('elysian_user_id') || "";
        const listenerData = await listener(listener_id);
        // const ListenerProfile = await ();
        if (connectedUsers.success && connectedUsers.data) {
          // Transform the backend response to match frontend interface
          const transformedConnections = connectedUsers.data.map((conn: any) => ({
            connection_id: conn.id,
            user_id: conn.username, // Using username as user_id for now
            username: conn.username,
            role: "Seeker",
            status: conn.status,
            seeker_profile: {
              s_id: conn.id,
              specialty: "General Support", // Default value since backend doesn't provide this
              avatar: conn.username.charAt(0).toUpperCase(),
            }
          }));
          
          // Filter accepted connections
          const acceptedConnections = transformedConnections.filter((connection: any) => connection.status === 'Accepted');
          setConnectedSeekers(acceptedConnections);
          
          // Filter pending connections
          const pendingConnectionsData = transformedConnections.filter((connection: any) => connection.status === 'Pending');
          setPendingConnections(pendingConnectionsData);
          
          console.log("Connected Seekers:", acceptedConnections);
          console.log("Pending Connections:", pendingConnectionsData);
        } else {
          setError("Failed to fetch connections");
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
        setError("Error fetching connections");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([
    {
      id: 'session-1',
      seekerName: 'Vikram Singh',
      seekerAvatar: 'VS',
      category: 'Loneliness',
      date: 'Today',
      time: '2:00 PM'
    },
    {
      id: 'session-2',
      seekerName: 'Maya Rao',
      seekerAvatar: 'MR',
      category: 'Depression',
      date: 'Tomorrow',
      time: '10:00 AM'
    }
  ]);


  const chats: Chat[] = [
    { id: 1, name: "Priya Sharma", lastMessage: "Thank you for the breathing exercise", time: "5 min ago", unread: 2, status: 'online' },
    { id: 2, name: "Rahul Patel", lastMessage: "I tried setting that boundary today", time: "2 hours ago", unread: 0, status: 'offline' },
    { id: 3, name: "Anjali Desai", lastMessage: "The career advice really helped", time: "1 day ago", unread: 1, status: 'offline' },
    { id: 4, name: "Vikram Singh", lastMessage: "I joined a local meetup group", time: "3 days ago", unread: 0, status: 'online' },
  ];

  const stats = [
    { label: "Total Sessions", value: "47", icon: Clock, color: "from-blue-400 to-blue-600" },
    { label: "Active Seekers", value: `${activeSeeker}`, icon: Users, color: "from-green-400 to-green-600" },
    { label: "Rating", value: "4.9", icon: Star, color: "from-yellow-400 to-yellow-600" },
    // { label: "Hours Listened", value: "89", icon: Heart, color: "from-pink-400 to-pink-600" },
  ];

  const handleAcceptRequest = async (connectionId: number) => {
    try {
      setPendingLoading(true);
      const response = await acceptConnection(connectionId, 'accept');
      
      if (response.success) {
        // Remove from pending connections
        setPendingConnections(prev => prev.filter(conn => conn.connection_id !== connectionId));
        
        // Add to connected seekers
        const acceptedConnection = pendingConnections.find(conn => conn.connection_id === connectionId);
        if (acceptedConnection) {
          const updatedConnection = { ...acceptedConnection, status: 'Accepted' };
          setConnectedSeekers(prev => [...prev, updatedConnection]);
        }
        
        toast.success('Connection request accepted successfully!');
      } else {
        toast.error(response.error || 'Failed to accept connection request');
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      toast.error('Error accepting connection request');
    } finally {
      setPendingLoading(false);
    }
  };

  const handleRejectRequest = async (connectionId: number) => {
    try {
      setPendingLoading(true);
      const response = await acceptConnection(connectionId, 'reject');
      
      if (response.success) {
        // Remove from pending connections
        setPendingConnections(prev => prev.filter(conn => conn.connection_id !== connectionId));
        
        toast.success('Connection request rejected');
      } else {
        toast.error(response.error || 'Failed to reject connection request');
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
      toast.error('Error rejecting connection request');
    } finally {
      setPendingLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Message') {
      router.push('/dashboard/listener/chats');
    } else {
      toast.success(`${action} action triggered!`);
    }
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

    return (
    <DashboardLayout userType="listener">
      <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Listener Dashboard
                  </h1>
                  <p className="text-xl text-black/80 max-w-2xl mx-auto">
                    Support seekers, track your impact, and grow your listening practice
                  </p>
                </div>

                {/* Stats Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </section>

                {/* Connected Seekers Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Connected Seekers</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {loading ? (
                      <div className="col-span-2 flex items-center justify-center p-8">
                        <div className="text-gray-500">Loading connected seekers...</div>
                      </div>
                    ) : error ? (
                      <div className="col-span-2 flex items-center justify-center p-8">
                        <div className="text-red-500">{error}</div>
                      </div>
                    ) : connectedSeekersData.length === 0 ? (
                      <div className="col-span-2 flex items-center justify-center p-8">
                        <div className="text-gray-500">No connected seekers found</div>
                      </div>
                    ) : (
                      connectedSeekersData.map((seeker) => (
                        <div key={seeker.connection_id} className="bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFB88C]/30 rounded-2xl p-6 border border-[#FFB88C]/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {seeker.seeker_profile?.avatar || seeker.username.charAt(0).toUpperCase()}
                              </div>
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                seeker.status === 'Accepted' ? 'bg-green-500' : 'bg-gray-400'
                              }`}></span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-black">{seeker.username}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  seeker.status === 'Accepted' 
                                    ? 'bg-[#E8F5E8] text-[#4CAF50] border border-[#C8E6C9]' 
                                    : 'bg-[#FFF0E8] text-[#FF8C5A] border border-[#FFD8C7]'
                                }`}>
                                  {seeker.status}
                                </span>
                              </div>
                              <p className="text-[#8B4513] font-medium mb-2">{seeker.seeker_profile?.specialty}</p>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">Connected seeker looking for support</p>
                              <p className="text-xs text-gray-500">Status: {seeker.status}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={() => handleQuickAction('Message')}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Quick Actions Section */}
                {/* <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <button 
                      onClick={() => handleQuickAction('Start Session')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Start Session
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Create Availability')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Create Availability
                    </button>
                    <button 
                      onClick={() => handleQuickAction('View Profile')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Manage Categories')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Manage Categories
                    </button>
                  </div>
                </section> */}

                {/* Pending Connection Requests Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Pending Connection Requests</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {pendingLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-gray-500">Processing request...</div>
                      </div>
                    ) : pendingError ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-red-500">{pendingError}</div>
                      </div>
                    ) : pendingConnections.length > 0 ? (
                      pendingConnections.map((connection) => (
                        <div key={connection.connection_id} className="bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {connection.seeker_profile?.avatar || connection.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-black">{connection.username}</h4>
                                <span className="text-sm text-black/70">{connection.seeker_profile?.specialty || 'General Support'}</span>
                              </div>
                              <p className="text-sm text-black/80 mb-3">Wants to connect with you for support</p>
                              <p className="text-xs text-black/60">Status: {connection.status}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleAcceptRequest(connection.connection_id)}
                                disabled={pendingLoading}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(connection.connection_id)}
                                disabled={pendingLoading}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">No Pending Requests</h3>
                        <p className="text-gray-600">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Upcoming Sessions Section */}
                {/* <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Upcoming Sessions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {session?.seekerAvatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-black">{session.seekerName}</h4>
                            <p className="text-sm text-black/70">{session.category} Support Session</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">{session.date}</p>
                          <p className="text-sm text-black/70">{session.time}</p>
                        </div>
                      </div>
                    ))}
                    
                    {upcomingSessions.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">No Upcoming Sessions</h3>
                        <p className="text-gray-600">Schedule some sessions to get started</p>
                      </div>
                    )}
                  </div>
                </section> */}
      </div>
    </DashboardLayout>
  );
}
