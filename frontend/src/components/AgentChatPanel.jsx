import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import io from 'socket.io-client';
import './AgentChatPanel.css';

const AgentChatPanel = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Agent chat connected');
      if (user) {
        newSocket.emit('join-room', `user-${user._id}`);
      }
    });

    newSocket.on('receive-message', (data) => {
      console.log('Agent received message:', data);
      setMessages(prev => [...prev, {
        _id: Date.now(),
        message: data.message,
        sender: data.sender,
        receiver: user,
        createdAt: new Date(data.timestamp)
      }]);
      loadConversations(); // Refresh conversation list
    });

    if (user) {
      loadConversations();
    }

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (selectedConv) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await API.get('/chat/conversations');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await API.get(`/chat/messages/${selectedConv.user._id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !selectedConv) return;

    // Show message immediately
    const optimisticMessage = {
      _id: Date.now(),
      message: inputMessage,
      sender: user,
      receiver: selectedConv.user,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const msgText = inputMessage;
    setInputMessage('');

    try {
      // Send to backend
      await API.post('/chat/send', {
        receiver: selectedConv.user._id,
        message: msgText
      });

      // Send via socket
      if (socket) {
        socket.emit('send-message', {
          roomId: `user-${selectedConv.user._id}`,
          message: msgText,
          sender: user,
          timestamp: new Date()
        });
      }

      console.log('Message sent to customer:', selectedConv.user.name);
      loadConversations();
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  return (
    <div className="agent-chat-panel">
      <div className="chat-panel-header">
        <h2>💬 Customer Messages</h2>
        <div className="connection-status">
          <span className="status-indicator connected"></span>
          Connected
        </div>
      </div>

      <div className="chat-panel-layout">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Conversations ({conversations.length})</h3>
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>No customer messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user._id}
                  className={`conversation-item ${selectedConv?.user._id === conv.user._id ? 'active' : ''}`}
                  onClick={() => setSelectedConv(conv)}
                >
                  <div className="conv-avatar">
                    {conv.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.user.name}</div>
                    <div className="conv-last-message">{conv.lastMessage}</div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="unread-badge">{conv.unreadCount}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="messages-panel">
          {selectedConv ? (
            <>
              <div className="messages-header">
                <div className="customer-info">
                  <div className="customer-avatar-large">
                    {selectedConv.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConv.user.name}</h3>
                    <p>{selectedConv.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <div className="no-msg-icon">💬</div>
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div 
                      key={msg._id || idx} 
                      className={`message-agent ${msg.sender._id === user._id ? 'own' : 'customer'}`}
                    >
                      {msg.sender._id !== user._id && (
                        <div className="msg-avatar">
                          {msg.sender.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="msg-content">
                        {msg.sender._id !== user._id && (
                          <div className="msg-sender">{msg.sender.name}</div>
                        )}
                        <div className="msg-bubble">{msg.message}</div>
                        <div className="msg-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="message-input-agent"
                />
                <button 
                  type="submit" 
                  className="send-btn-agent"
                  disabled={!inputMessage.trim()}
                >
                  Send 📤
                </button>
              </form>
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a customer from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentChatPanel;