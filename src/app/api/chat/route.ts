import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, specialty } = body;

    if (!messages || !specialty) {
      return NextResponse.json(
        { error: 'Messages and specialty are required' },
        { status: 400 }
      );
    }

    // Prepare messages for the AI model
    const formattedMessages = [
      {
        role: 'system',
        content: specialty.systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenRouter API
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_RuCkUD5gposwKc',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: specialty.model || 'openrouter/anthropic/claude-sonnet-4',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.content) {
      return NextResponse.json({
        message: {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date().toISOString()
        },
        sessionId: `session_${Date.now()}`
      });
    } else {
      throw new Error('Invalid response format from AI service');
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to process chat request'
      },
      { status: 500 }
    );
  }
}