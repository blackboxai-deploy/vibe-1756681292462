import { ChatMessage, MedicalSpecialty, ApiResponse } from '@/types';

export interface ChatRequest {
  messages: ChatMessage[];
  specialty: MedicalSpecialty;
  files?: File[];
}

export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
}

class ChatAPI {
  private readonly baseURL = 'https://oi-server.onrender.com/chat/completions';
  private readonly headers = {
    'CustomerId': 'cus_RuCkUD5gposwKc',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  async sendMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    try {
      // Prepare messages for the AI model
      const formattedMessages = [
        {
          role: 'system' as const,
          content: request.specialty.systemPrompt
        },
        ...request.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: request.specialty.model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        const aiResponse: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };

        return {
          success: true,
          data: {
            message: aiResponse,
            sessionId: `session_${Date.now()}`
          }
        };
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      console.error('Chat API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async uploadFile(file: File): Promise<ApiResponse<{ url: string; id: string }>> {
    try {
      // For this demo, we'll simulate file upload
      // In production, implement proper file upload to cloud storage
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve({
            success: true,
            data: {
              id: `file_${Date.now()}`,
              url: base64
            }
          });
        };
        
        reader.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to read file'
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File upload failed'
      };
    }
  }

  async sendMessageWithFiles(
    messages: ChatMessage[],
    specialty: MedicalSpecialty,
    files: File[]
  ): Promise<ApiResponse<ChatResponse>> {
    try {
      // Process files and convert to base64
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const uploadResult = await this.uploadFile(file);
          return uploadResult.success ? {
            filename: file.name,
            file_data: uploadResult.data!.url,
            type: file.type
          } : null;
        })
      );

      const validFiles = processedFiles.filter(Boolean);
      
      // Prepare messages with multimodal content
      const lastMessage = messages[messages.length - 1];
      const multimodalContent: any[] = [
        { type: 'text', text: lastMessage.content }
      ];

      // Add files to the content
      validFiles.forEach((file) => {
        if (file && file.type.startsWith('image/')) {
          multimodalContent.push({
            type: 'image_url',
            image_url: { url: file.file_data }
          });
        } else if (file) {
          multimodalContent.push({
            type: 'file',
            file: {
              filename: file.filename,
              file_data: file.file_data
            }
          });
        }
      });

      // Format messages for API
      const formattedMessages = [
        {
          role: 'system' as const,
          content: specialty.systemPrompt
        },
        ...messages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: multimodalContent
        }
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: specialty.model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        const aiResponse: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };

        return {
          success: true,
          data: {
            message: aiResponse,
            sessionId: `session_${Date.now()}`
          }
        };
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      console.error('Chat API with files error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const chatAPI = new ChatAPI();