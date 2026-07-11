export interface User {
  id: string;
  email: string;
  name: string;
  agencyName?: string;
  role?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
  requestCount: number;
  taskCount: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  scopeBaseline: string;
  portalUrl: string;
  scopeAnalytics: {
    totalRequests: number;
    inScope: number;
    outOfScope: number;
    needsInfo: number;
  };
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  client: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  createdAt: string;
  estimatedHours: number;
}

export interface AIAnalysis {
  decision: 'in-scope' | 'out-of-scope' | 'needs-info';
  confidence: number;
  reasoning: string[];
  suggestedTasks?: string[];
  clarificationQuestions?: Array<{ question: string; context: string }>;
  estimatedHours?: string;
  acceptanceCriteria?: string[];
  baselineReference?: {
    section: string;
    text: string;
    note?: string;
  };
  costImpact?: string;
  suggestedAction: 'CREATE_TASK' | 'GENERATE_CHANGE_REQUEST' | 'ASK_QUESTIONS';
  changeRequestDraft?: {
    title: string;
    summary: string;
    impactAnalysis: string;
    acceptanceCriteria: string[];
  };
}

export interface ScopeDocument {
  id: string;
  projectId: string;
  title: string;
  sections: Array<{
    number: string;
    title: string;
    content: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeRequest {
  id: string;
  projectId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  attachments?: string[];
  status: 'submitted' | 'reviewing' | 'clarification' | 'decision' | 'completed';
  submittedAt: string;
  aiAnalysis?: AIAnalysis;
  pmNotes?: string;
  createdDraftAt?: string;
  completedAt?: string;
  history: Array<{
    timestamp: string;
    action: string;
    actor: string;
    details?: string;
  }>;
}

export interface Integration {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'coming-soon';
  category: 'project-management' | 'documentation' | 'communication' | 'analytics';
  connectedAt?: string;
  settings?: Record<string, string>;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@agency.com',
    name: 'Demo User',
    agencyName: 'Demo Agency',
    role: 'Agency Owner',
  },
];

const STORAGE_PREFIX = 'scopeguard_';
const ACCOUNT_DATA_PREFIX = `${STORAGE_PREFIX}account_`;

export function getMockProjects(userId: string): Project[] {
  if (typeof window === 'undefined') return [];

  const storageKey = `${ACCOUNT_DATA_PREFIX}${userId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      return JSON.parse(stored).projects || [];
    } catch {
      return [];
    }
  }

  return [];
}

export function getUserProjectUsage(userId: string): { used: number; total: number } {
  const projects = getMockProjects(userId);
  return {
    used: projects.length,
    total: 15,
  };
}

export function saveUserProjects(userId: string, projects: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${ACCOUNT_DATA_PREFIX}${userId}`, JSON.stringify({ projects }));
}

export function initializeUserAccountData(user: { id: string; email: string; name: string; plan?: string }) {
  if (typeof window === 'undefined') return;

  const storageKey = `${ACCOUNT_DATA_PREFIX}${user.id}`;
  if (!localStorage.getItem(storageKey)) {
    const accountData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        agencyName: `${user.name.split(' ')[0] || 'Studio'} Studio`,
        role: 'Agency Owner',
        plan: user.plan || 'free',
      },
      projects: [],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(accountData));
  }
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Rebuild',
    description: 'Responsive website with 5 pages, contact form, blog system',
    clientName: 'Acme Corp',
    clientEmail: 'contact@acme.com',
    requestCount: 23,
    taskCount: 45,
    status: 'active',
    createdAt: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    budget: 50000,
    spent: 32000,
    scopeBaseline: 'Homepage, About, Services, Blog, Contact pages - React frontend with WordPress backend',
    portalUrl: 'https://portal.scopeos.ai/projects/proj-1',
    scopeAnalytics: {
      totalRequests: 23,
      inScope: 18,
      outOfScope: 5,
      needsInfo: 0,
    },
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS/Android app for task management with offline sync',
    clientName: 'TechStart Inc',
    clientEmail: 'hello@techstartup.com',
    requestCount: 31,
    taskCount: 67,
    status: 'active',
    createdAt: '2024-02-20',
    startDate: '2024-02-20',
    endDate: '2024-06-20',
    budget: 45000,
    spent: 48000,
    scopeBaseline: 'iOS/Android app MVP with offline sync, task creation/editing, notifications',
    portalUrl: 'https://portal.scopeos.ai/projects/proj-2',
    scopeAnalytics: {
      totalRequests: 31,
      inScope: 22,
      outOfScope: 9,
      needsInfo: 0,
    },
  },
  {
    id: '3',
    name: 'Dashboard Redesign',
    description: 'UI/UX refresh of admin dashboard, no new features',
    clientName: 'FinanceHub',
    clientEmail: 'dev@financehub.com',
    requestCount: 12,
    taskCount: 28,
    status: 'paused',
    createdAt: '2024-03-10',
    startDate: '2024-03-10',
    budget: 25000,
    spent: 12000,
    scopeBaseline: 'Admin dashboard UI/UX refresh - new design system, improved navigation',
    portalUrl: 'https://portal.scopeos.ai/projects/proj-3',
    scopeAnalytics: {
      totalRequests: 12,
      inScope: 10,
      outOfScope: 2,
      needsInfo: 0,
    },
  },
];

export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: '1',
    projectId: '1',
    client: 'Acme Corp',
    description: 'Add animated hero section',
    status: 'pending',
    createdAt: '2024-04-12',
    estimatedHours: 8,
  },
  {
    id: '2',
    projectId: '1',
    client: 'Tech Startup',
    description: 'Update color scheme to brand guidelines',
    status: 'in-review',
    createdAt: '2024-04-10',
    estimatedHours: 4,
  },
  {
    id: '3',
    projectId: '2',
    client: 'Design Studio',
    description: 'Add dark mode toggle',
    status: 'approved',
    createdAt: '2024-04-08',
    estimatedHours: 6,
  },
  {
    id: '4',
    projectId: '3',
    client: 'E-commerce Co',
    description: 'Optimize homepage performance',
    status: 'rejected',
    createdAt: '2024-04-06',
    estimatedHours: 12,
  },
];

export const MOCK_SCOPE_DOCUMENTS: ScopeDocument[] = [
  {
    id: 'scope-1',
    projectId: '1',
    title: 'ACME CORP WEBSITE REBUILD - PROJECT SCOPE',
    sections: [
      {
        number: '2.0',
        title: 'DELIVERABLES',
        content: 'Homepage, About Us page, Services page (3 sub-services), Blog listing + individual post pages, Contact page',
      },
      {
        number: '2.1',
        title: 'Website Structure',
        content: 'Homepage, About Us page, Services page (3 sub-services), Blog listing + individual post pages, Contact page',
      },
      {
        number: '2.2',
        title: 'Core Features',
        content: 'Responsive design (mobile, tablet, desktop), Contact form (name, email, message, phone), Blog CMS integration (WordPress), Newsletter signup form, Social media icon links',
      },
      {
        number: '2.3',
        title: 'Technical Requirements',
        content: 'React frontend, WordPress backend, Hosting setup on client\'s AWS account, SSL certificate, Google Analytics integration',
      },
      {
        number: '3.0',
        title: 'EXCLUSIONS',
        content: 'E-commerce functionality, User authentication/login, Payment processing, Multi-language support, Video hosting, Custom animations (beyond standard UI transitions)',
      },
      {
        number: '4.0',
        title: 'TIMELINE',
        content: '12 weeks from kickoff to launch',
      },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
];

export const MOCK_SCOPE_REQUESTS: ScopeRequest[] = [
  {
    id: 'req-1',
    projectId: '1',
    clientId: 'client-1',
    clientName: 'John Smith',
    clientEmail: 'john@acme.com',
    title: 'Fix mobile menu not closing',
    description: 'On iPhone, the hamburger menu stays open after clicking a link',
    status: 'decision',
    submittedAt: '2024-04-18T09:00:00Z',
    aiAnalysis: {
      decision: 'in-scope',
      confidence: 95,
      reasoning: [
        'Clear bug fix related to existing navigation component',
        'Mentioned as part of responsive design in scope baseline',
        'Estimated effort (15-30 minutes) is minor maintenance task',
      ],
      baselineReference: {
        section: '2.2 Core Features',
        text: 'Responsive design (mobile, tablet, desktop)',
      },
      suggestedAction: 'CREATE_TASK',
      estimatedHours: '0.5',
      acceptanceCriteria: [
        'Menu closes when user clicks a navigation link',
        'Menu closes when user clicks outside the menu',
        'Animation is smooth on all mobile devices',
        'No console errors in browser dev tools',
      ],
    },
    history: [
      {
        timestamp: '2024-04-18T09:00:00Z',
        action: 'submitted',
        actor: 'Client',
      },
      {
        timestamp: '2024-04-18T09:05:00Z',
        action: 'ai_analysis_complete',
        actor: 'ScopeOS',
        details: 'Quick fix detected',
      },
    ],
  },
  {
    id: 'req-2',
    projectId: '1',
    clientId: 'client-2',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@techstartup.com',
    title: 'Add user authentication system',
    description: 'We need users to be able to create accounts and log in to access premium content',
    status: 'decision',
    submittedAt: '2024-04-17T14:30:00Z',
    aiAnalysis: {
      decision: 'out-of-scope',
      confidence: 92,
      reasoning: [
        'User authentication system not mentioned in original scope',
        'Requires additional backend infrastructure not included',
        'Estimated effort (16-24 hours) significantly exceeds typical scope additions',
      ],
      baselineReference: {
        section: '3.0 EXCLUSIONS',
        text: 'User authentication/login',
        note: 'Explicitly listed as out of scope',
      },
      suggestedAction: 'GENERATE_CHANGE_REQUEST',
      estimatedHours: '16-24',
      costImpact: '$2,400 - $3,600',
      changeRequestDraft: {
        title: 'Add user authentication and premium content system',
        summary: 'Implementation of user registration, login, and role-based access control for premium content areas',
        impactAnalysis: 'Requires backend database schema changes, authentication middleware, frontend forms, and security implementation',
        acceptanceCriteria: [
          'Users can register with email and password',
          'Users can log in securely',
          'Password reset functionality works',
          'Premium content is protected behind authentication',
        ],
      },
    },
    history: [
      {
        timestamp: '2024-04-17T14:30:00Z',
        action: 'submitted',
        actor: 'Client',
      },
      {
        timestamp: '2024-04-17T14:35:00Z',
        action: 'ai_analysis_complete',
        actor: 'ScopeOS',
        details: 'Out-of-scope feature detected',
      },
    ],
  },
  {
    id: 'req-3',
    projectId: '1',
    clientId: 'client-3',
    clientName: 'Mike Chen',
    clientEmail: 'mike@designstudio.com',
    title: 'Make the site faster',
    description: 'It\'s loading slow, can you speed it up? Maybe optimize images or something?',
    status: 'clarification',
    submittedAt: '2024-04-16T11:15:00Z',
    aiAnalysis: {
      decision: 'needs-info',
      confidence: 38,
      reasoning: [
        'Request lacks technical specificity and measurable criteria',
        'Multiple possible solutions without knowing current performance metrics',
        'Need client input to determine scope impact and priorities',
      ],
      suggestedAction: 'ASK_QUESTIONS',
      questions: [
        {
          question: 'What is the current page load time, and what target load time would satisfy your requirements?',
          context: 'Knowing baseline helps determine if optimization is feasible within scope',
        },
        {
          question: 'Which specific pages are loading slowly? (Homepage, blog posts, services page, etc.)',
          context: 'Different pages may require different optimization strategies',
        },
        {
          question: 'Have you noticed performance issues on specific devices or browsers?',
          context: 'Mobile vs desktop vs specific browsers affects optimization approach',
        },
      ],
    },
    history: [
      {
        timestamp: '2024-04-16T11:15:00Z',
        action: 'submitted',
        actor: 'Client',
      },
      {
        timestamp: '2024-04-16T11:20:00Z',
        action: 'ai_analysis_complete',
        actor: 'ScopeOS',
        details: 'Ambiguous request - needs clarification',
      },
    ],
  },
  {
    id: 'req-4',
    projectId: '1',
    clientId: 'client-4',
    clientName: 'Emma Wilson',
    clientEmail: 'emma@acme.com',
    title: 'Change button color from blue to green',
    description: 'On the homepage CTA button, please change the color from our old blue to our new brand green',
    status: 'decision',
    submittedAt: '2024-04-15T16:45:00Z',
    aiAnalysis: {
      decision: 'in-scope',
      confidence: 88,
      reasoning: [
        'Minor styling change to existing component',
        'Color changes mentioned as part of brand guidelines update in scope',
        'Quick change with minimal risk of side effects',
      ],
      baselineReference: {
        section: '2.2 Core Features',
        text: 'Responsive design (mobile, tablet, desktop)',
      },
      suggestedAction: 'CREATE_TASK',
      estimatedHours: '0.25',
      acceptanceCriteria: [
        'CTA button displays in new brand green color',
        'Button color consistent across all pages',
        'Hover state updated to darker shade of green',
        'Accessibility contrast ratio maintained (WCAG AA)',
      ],
    },
    history: [
      {
        timestamp: '2024-04-15T16:45:00Z',
        action: 'submitted',
        actor: 'Client',
      },
      {
        timestamp: '2024-04-15T16:50:00Z',
        action: 'ai_analysis_complete',
        actor: 'ScopeOS',
        details: 'Straightforward styling task',
      },
    ],
  },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'linear',
    name: 'Linear',
    slug: 'linear',
    description: 'Sync scope decisions and tasks to Linear issues',
    icon: '📋',
    status: 'connected',
    category: 'project-management',
    connectedAt: '2024-04-01T10:30:00Z',
    settings: {
      apiKey: 'lin_xxx...xxx',
      teamId: 'team-123',
    },
  },
  {
    id: 'notion',
    name: 'Notion',
    slug: 'notion',
    description: 'Create scope baseline documents in Notion',
    icon: '📄',
    status: 'connected',
    category: 'documentation',
    connectedAt: '2024-04-02T14:20:00Z',
    settings: {
      apiKey: 'ntn_xxx...xxx',
      workspaceId: 'ws-456',
    },
  },
  {
    id: 'jira',
    name: 'Jira',
    slug: 'jira',
    description: 'Sync change requests to Jira projects',
    icon: '🎯',
    status: 'disconnected',
    category: 'project-management',
  },
  {
    id: 'slack',
    name: 'Slack',
    slug: 'slack',
    description: 'Get instant notifications for scope decisions',
    icon: '💬',
    status: 'disconnected',
    category: 'communication',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    slug: 'zapier',
    description: 'Connect to 1000+ apps with Zapier',
    icon: '⚡',
    status: 'coming-soon',
    category: 'communication',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    slug: 'hubspot',
    description: 'Sync client data to HubSpot CRM',
    icon: '🔗',
    status: 'coming-soon',
    category: 'analytics',
  },
];

export const MOCK_STATS = {
  activeRequests: 12,
  completedTasks: 84,
  inProgress: 28,
  monthlyRevenue: '$12,450',
  totalProjects: 3,
  avgTimePerRequest: 6.5,
};

export function getMockUserData(userId: string): User | null {
  return MOCK_USERS.find((u) => u.id === userId) || null;
}

export function getMockChangeRequests(projectId?: string): ChangeRequest[] {
  if (!projectId) return MOCK_CHANGE_REQUESTS;
  return MOCK_CHANGE_REQUESTS.filter((r) => r.projectId === projectId);
}

export function getMockScopeRequests(projectId?: string): ScopeRequest[] {
  if (!projectId) return MOCK_SCOPE_REQUESTS;
  return MOCK_SCOPE_REQUESTS.filter((r) => r.projectId === projectId);
}

export function getMockScopeRequest(id: string): ScopeRequest | null {
  return MOCK_SCOPE_REQUESTS.find((r) => r.id === id) || null;
}

export function getMockProject(id: string): Project | null {
  return MOCK_PROJECTS.find((p) => p.id === id) || null;
}

export function getMockIntegrations(): Integration[] {
  return MOCK_INTEGRATIONS;
}

export function getMockIntegration(id: string): Integration | null {
  return MOCK_INTEGRATIONS.find((i) => i.id === id) || null;
}

export function getMockScopeDocument(projectId: string): ScopeDocument | null {
  return MOCK_SCOPE_DOCUMENTS.find((d) => d.projectId === projectId) || null;
}

export function saveUserSettings(userId: string, settings: Record<string, any>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}user_settings_${userId}`, JSON.stringify(settings));
}

export function getUserSettings(userId: string): Record<string, any> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(`${STORAGE_PREFIX}user_settings_${userId}`);
  return data ? JSON.parse(data) : {};
}

export function initializeMockData() {
  if (typeof window === 'undefined') return;
  
  // Check if mock data is already initialized
  const isInitialized = localStorage.getItem(`${STORAGE_PREFIX}initialized`);
  
  if (!isInitialized) {
    // Initialize any app-level settings
    localStorage.setItem(`${STORAGE_PREFIX}initialized`, 'true');
  }
}
