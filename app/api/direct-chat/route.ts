import { NextRequest, NextResponse } from 'next/server';
import { sendDirectMessage, getDirectMessages, markDirectMessagesRead, getProjectByToken } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const token = searchParams.get('token');
  const role = searchParams.get('role') as 'client' | 'pm' | null;

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  // If token is provided, validate it matches the project (portal access)
  if (token) {
    const project = await getProjectByToken(token);
    if (!project || project.id !== projectId) {
      return NextResponse.json({ error: 'Invalid portal token' }, { status: 403 });
    }
  }

  // Mark messages as read for the requesting role
  if (role) {
    await markDirectMessagesRead(projectId, role);
  }

  const messages = await getDirectMessages(projectId);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, token, senderRole, senderName, content } = body;

    if (!projectId || !senderRole || !senderName || !content) {
      return NextResponse.json(
        { error: 'projectId, senderRole, senderName, and content are required' },
        { status: 400 }
      );
    }

    // If token is provided (portal access), validate it
    if (token) {
      const project = await getProjectByToken(token);
      if (!project || project.id !== projectId) {
        return NextResponse.json({ error: 'Invalid portal token' }, { status: 403 });
      }
    }

    const message = await sendDirectMessage({
      project_id: projectId,
      sender_role: senderRole,
      sender_name: senderName,
      content: content.trim(),
    });

    if (!message) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Direct chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
