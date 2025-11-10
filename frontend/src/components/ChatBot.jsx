import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import io from 'socket.io-client';
import './ChatBot.css';

const ChatBot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Chat connected');
      if (user) {
        newSocket.emit('join-room', `user-${user._id}`);
      }
    });

    newSocket.on('receive-message', (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, {
        _id: Date.now(),
        message: data.message,
        sender: data.sender,
        receiver: user,
        createdAt: new Date(data.timestamp)
      }]);
    });

    // Welcome messages
    setTimeout(() => {
      setMessages([
        {
          _id: 'w1',
          message: "👋 Welcome! How can I help you today?",
          sender: { name: 'Support', _id: 'bot' },
          createdAt: new Date()
        },
        {
          _id: 'w2',
          message: "Feel free to ask about properties or chat with our agents!",
          sender: { name: 'Support', _id: 'bot' },
          createdAt: new Date()
        }
      ]);
    }, 500);

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedAgent && user) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAgents = async () => {
    try {
      const response = await API.get('/users?role=agent');
      const agentList = response.data.data;
      setAgents(agentList);
      if (agentList.length > 0) {
        setSelectedAgent(agentList[0]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await API.get(`/chat/messages/${selectedAgent._id}`);
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
    
    if (!inputMessage.trim()) return;

    if (!isAuthenticated) {
      return;
    }

    const agentToMessage = selectedAgent || agents[0];
    if (!agentToMessage) return;

    // Show message immediately
    const optimisticMessage = {
      _id: Date.now(),
      message: inputMessage,
      sender: user,
      receiver: agentToMessage,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const msgText = inputMessage;
    setInputMessage('');

    try {
      // Send to backend
      await API.post('/chat/send', {
        receiver: agentToMessage._id,
        message: msgText
      });

      // Send via socket
      if (socket) {
        socket.emit('send-message', {
          roomId: `user-${agentToMessage._id}`,
          message: msgText,
          sender: user,
          timestamp: new Date()
        });
      }

      console.log('Message sent to agent:', agentToMessage.name);
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  return (
    <>
      <div className={`chat-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="toggle-icon">{isOpen ? '✕' : '💬'}</div>
        {!isOpen && <div className="notification-badge"><span className="pulse-dot"></span></div>}
      </div>

      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="agent-avatar-chat">
              <span>👨‍💼</span>
              <div className="status-dot online"></div>
            </div>
            <div className="agent-info-chat">
              <h4>{selectedAgent?.name || 'Real Estate Support'}</h4>
              <p className="status-text">🟢 Online</p>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {agents.length > 1 && isAuthenticated && (
          <div className="agent-selector">
            <label>Chat with:</label>
            <select 
              value={selectedAgent?._id || ''} 
              onChange={(e) => {
                const agent = agents.find(a => a._id === e.target.value);
                setSelectedAgent(agent);
              }}
              className="agent-select"
            >
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div 
              key={msg._id || idx} 
              className={`message ${msg.sender?._id === user?._id ? 'own' : 'other'}`}
            >
              {msg.sender?._id !== user?._id && (
                <div className="message-avatar">
                  {msg.sender?._id === 'bot' ? '🤖' : '👨‍💼'}
                </div>
              )}
              <div className="message-content">
                {msg.sender?._id !== user?._id && (
                  <div className="message-sender">{msg.sender?.name || 'Support'}</div>
                )}
                <div className="message-bubble">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!isAuthenticated && (
          <div className="login-prompt">
            <p>💡 Please login to chat with our agents!</p>
          </div>
        )}

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isAuthenticated ? "Type your message..." : "Login to chat"}
            className="chat-input"
            disabled={!isAuthenticated}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!inputMessage.trim() || !isAuthenticated}
          >
            <span className="send-icon">📤</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;