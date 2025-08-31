'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { chatAPI } from '@/lib/chat-api';
import { getSpecialtyById } from '@/lib/specialists';
import { User, ChatMessage, MedicalSpecialty } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [specialty, setSpecialty] = useState<MedicalSpecialty | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const specialtyData = getSpecialtyById(params.specialty as string);
    if (!specialtyData) {
      router.push('/dashboard');
      return;
    }
    setSpecialty(specialtyData);

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI ${specialtyData.name} specialist. I'm here to assist you with medical consultations, diagnostic support, and clinical guidance in ${specialtyData.name.toLowerCase()}. 

How can I help you today? You can:
• Ask about symptoms and conditions
• Upload medical images or documents for analysis
• Request treatment recommendations
• Discuss diagnostic approaches
• Get clinical decision support

Please remember that while I provide evidence-based guidance, final clinical decisions should always involve direct patient assessment and your professional judgment.`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [router, params.specialty]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && selectedFiles.length === 0) || isLoading || !specialty) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      attachments: selectedFiles.length > 0 ? selectedFiles.map(file => ({
        id: `file_${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: '',
        uploadedAt: new Date()
      })) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let result;
      if (selectedFiles.length > 0) {
        result = await chatAPI.sendMessageWithFiles([...messages, userMessage], specialty, selectedFiles);
        setSelectedFiles([]);
      } else {
        result = await chatAPI.sendMessage({
          messages: [...messages, userMessage],
          specialty
        });
      }

      if (result.success && result.data) {
        setMessages(prev => [...prev, result.data!.message]);
      } else {
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: `I apologize, but I encountered an error: ${result.error || 'Unknown error occurred'}. Please try again.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered a technical error. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const exportChat = () => {
    const chatData = {
      specialty: specialty?.name,
      timestamp: new Date().toISOString(),
      doctor: user?.name,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${specialty?.name.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user || !specialty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">← Back</Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${specialty.color} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{specialty.icon}</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{specialty.name} AI Assistant</h1>
                <p className="text-sm text-gray-500">{specialty.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportChat}>
              Export Chat
            </Button>
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        <div className="flex-1 bg-white rounded-lg shadow-sm border">
          {/* Messages */}
          <div className="h-96 md:h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((file) => (
                        <Badge key={file.id} variant="secondary" className="text-xs">
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                    <div className="animate-bounce w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            {/* File uploads */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm text-blue-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your medical question or describe symptoms..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[60px] max-h-32 resize-none"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" type="button">
                    📎 Files
                  </Button>
                </Label>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputMessage.trim() && selectedFiles.length === 0)}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}