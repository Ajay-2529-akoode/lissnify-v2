"use client"

import { useState } from "react";
import { 
  Send, 
  Users, 
  MessageCircle, 
  Heart,
  Reply
} from "lucide-react";

interface CommunityMessage {
  id: string;
  username: string;
  role: 'seeker' | 'listener';
  message: string;
  timestamp: string;
  category: string;
  likes: number;
  isLiked: boolean;
  replies: number;
}

interface CommunitySectionProps {
  userType: 'seeker' | 'listener';
  currentUser: { username: string; role: 'seeker' | 'listener' };
}

export default function CommunitySection({ userType, currentUser }: CommunitySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newMessage, setNewMessage] = useState('');

  // Debug logging
  console.log('CommunitySection - userType:', userType, 'currentUser:', currentUser);

  const categories = [
    'All', 'Breakup', 'Relationship Issues', 'Divorce', 'Loneliness', 
    'Career Stress', 'Anxiety', 'Depression', 'Family Issues', 'Self-Care'
  ];

  const [messages, setMessages] = useState<CommunityMessage[]>([
    {
      id: '1',
      username: 'Sarah M.',
      role: 'seeker',
      message: 'Going through a really tough breakup and feeling lost. Anyone else been through this? How did you cope?',
      timestamp: '5 min ago',
      category: 'Breakup',
      likes: 12,
      isLiked: false,
      replies: 3
    },
    {
      id: '2',
      username: 'Dr. Lisa Chen',
      role: 'listener',
      message: 'Breakups can be incredibly painful. Remember that it\'s okay to grieve the relationship. Focus on self-care and lean on your support system. You\'re not alone in this.',
      timestamp: '8 min ago',
      category: 'Breakup',
      likes: 8,
      isLiked: true,
      replies: 1
    },
    {
      id: '3',
      username: 'Mike R.',
      role: 'seeker',
      message: 'Feeling overwhelmed with work stress lately. The pressure is getting to me and affecting my relationships. Any advice?',
      timestamp: '15 min ago',
      category: 'Career Stress',
      likes: 6,
      isLiked: false,
      replies: 2
    },
    {
      id: '4',
      username: 'Dr. Priya Patel',
      role: 'listener',
      message: 'Work stress is so common these days. Have you tried setting boundaries with work hours? Sometimes we need to protect our personal time to maintain healthy relationships.',
      timestamp: '20 min ago',
      category: 'Career Stress',
      likes: 10,
      isLiked: false,
      replies: 0
    },
    {
      id: '5',
      username: 'Alex T.',
      role: 'seeker',
      message: 'Struggling with anxiety about social situations. Even going to the grocery store feels overwhelming. Anyone have tips for managing social anxiety?',
      timestamp: '1 hour ago',
      category: 'Anxiety',
      likes: 15,
      isLiked: true,
      replies: 5
    },
    {
      id: '6',
      username: 'Dr. Michael Rodriguez',
      role: 'listener',
      message: 'Social anxiety is very treatable. Start with small exposures - maybe just walking into the store for 5 minutes. Gradual exposure can help build confidence. Consider breathing exercises too.',
      timestamp: '1 hour ago',
      category: 'Anxiety',
      likes: 18,
      isLiked: false,
      replies: 2
    }
  ]);

  const filteredMessages = selectedCategory === 'All' 
    ? messages 
    : messages.filter(msg => msg.category === selectedCategory);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: CommunityMessage = {
        id: Date.now().toString(),
        username: currentUser.username,
        role: currentUser.role,
        message: newMessage.trim(),
        timestamp: 'Just now',
        category: selectedCategory === 'All' ? 'General' : selectedCategory,
        likes: 0,
        isLiked: false,
        replies: 0
      };
      setMessages(prev => [newMsg, ...prev]);
      setNewMessage('');
    }
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
            isLiked: !msg.isLiked 
          }
        : msg
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
          <Users className="w-6 h-6 text-[#8B4513]" />
        </div>
        <h2 className="text-3xl font-bold text-black">Community</h2>
      </div>

      {/* Category Tags */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Discussion Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white shadow-lg'
                  : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">
            {selectedCategory === 'All' ? 'All Discussions' : `${selectedCategory} Discussions`}
          </h3>
          <span className="text-sm text-gray-600">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Messages List */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-2xl transition-all duration-200 hover:shadow-md ${
                message.role === 'seeker'
                  ? 'bg-orange-100 border-l-4 border-orange-400'
                  : 'bg-yellow-100 border-l-4 border-yellow-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    message.role === 'seeker'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                      : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                  }`}>
                    {message.username.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-black">{message.username}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      message.role === 'seeker'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-green-200 text-green-800'
                    }`}>
                      {message.role === 'seeker' ? 'Seeker' : 'Listener'}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {message.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 mb-3 leading-relaxed">{message.message}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(message.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 ${
                        message.isLiked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${message.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{message.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <Reply className="w-4 h-4" />
                      <span className="text-sm">{message.replies}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No messages yet</h3>
              <p className="text-gray-600">Be the first to start a discussion in this category!</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            currentUser.role === 'seeker'
              ? 'bg-gradient-to-br from-orange-400 to-orange-600'
              : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
          }`}>
            {currentUser.username.charAt(0)}
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts with the community..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white rounded-full hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <span>Posting as:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            currentUser.role === 'seeker'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-green-200 text-green-800'
          }`}>
            {currentUser.role === 'seeker' ? 'Seeker' : 'Listener'}
          </span>
          <span>•</span>
          <span>Category: {selectedCategory === 'All' ? 'General' : selectedCategory}</span>
        </div>
      </div>
    </section>
  );
}
