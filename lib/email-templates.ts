export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  category: 'client' | 'pm' | 'status';
}

export interface EmailContext {
  clientName: string;
  agencyName: string;
  pmName: string;
  projectName: string;
  portalLink: string;
  magicEmail: string;
  requestTitle?: string;
  requestDescription?: string;
  changeRequestNumber?: string;
  estimatedHours?: string;
  costImpact?: string;
  timelineImpact?: string;
  approvalLink?: string;
  calendarLink?: string;
  weekNumber?: string;
  weekTotal?: string;
  completedTasks?: string[];
  inProgressTasks?: Array<{ name: string; progress: number; dueDate: string }>;
  nextTasks?: string[];
  budgetUsed?: string;
  budgetTotal?: string;
  budgetPercentage?: number;
  timelineStatus?: string;
  deliveryDate?: string;
  scopeChanges?: number;
  scopeChangeAmount?: string;
  clarificationQuestions?: Array<{ question: string; context: string }>;
  acceptanceCriteria?: string[];
  kickoffDate?: string;
  launchDate?: string;
  projectDuration?: string;
  assetsNeeded?: string;
  assetsDueDate?: string;
  crAmount?: string;
  newDeliveryDate?: string;
  newProjectTotal?: string;
}

const baseHtmlStyles = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .button.secondary {
      background: #e5e7eb;
      color: #1f2937;
    }
    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 20px;
      border-radius: 6px;
      margin: 15px 0;
    }
    .card strong {
      display: block;
      margin-bottom: 10px;
      color: #1f2937;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 25px 0 15px 0;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    .progress-bar {
      background: #e5e7eb;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      background: #3b82f6;
      height: 100%;
      transition: width 0.3s ease;
    }
    ul {
      margin: 15px 0;
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
    }
    .highlight {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 15px 0;
    }
    .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 15px 0;
    }
    .success {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 15px 0;
    }
    @media (max-width: 600px) {
      .container { padding: 10px; }
      .content { padding: 20px 15px; }
      .button { display: block; text-align: center; }
    }
  </style>
`;

export const emailTemplates: Record<string, EmailTemplate> = {
  clientInvitation: {
    id: 'client-invitation',
    name: 'Client Invitation Email',
    subject: '[{{agencyName}}] invited you to their project portal',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Welcome to Your Project Portal</h1>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <p>{{agencyName}} has set up a dedicated portal for your project: <strong>{{projectName}}</strong>.</p>
          
          <p>This portal makes it easy to:</p>
          <ul>
            <li>Submit requests and feedback</li>
            <li>Track what's being worked on</li>
            <li>Get quick updates</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="{{portalLink}}" class="button">View Your Portal</a>
          </div>
          
          <p>You can also email requests directly to:</p>
          <div class="card">
            <strong>{{magicEmail}}</strong>
          </div>
          
          <p>We'll review everything and keep you updated on progress.</p>
          <p>Questions? Just reply to this email.</p>
          
          <p>{{pmName}}<br/>{{agencyName}}</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please don't reply with sensitive information.</p>
        </div>
      </div>`,
    textBody: `Welcome to Your Project Portal\n\nHi {{clientName}},\n\n{{agencyName}} has set up a dedicated portal for your project: {{projectName}}.\n\nPortal: {{portalLink}}\nEmail requests to: {{magicEmail}}\n\n{{pmName}}\n{{agencyName}}`,
    variables: ['clientName', 'agencyName', 'projectName', 'portalLink', 'magicEmail', 'pmName'],
    category: 'client',
  },
  
  requestReceived: {
    id: 'request-received',
    name: 'Request Received Confirmation',
    subject: 'We received your request: {{requestTitle}}',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Request Received</h1>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <p>Thanks for submitting: <strong>{{requestTitle}}</strong></p>
          
          <p>We're reviewing this now and will let you know:</p>
          <ul>
            <li>If it's covered in the current scope</li>
            <li>Estimated timeline</li>
            <li>Any questions we have</li>
          </ul>
          
          <div class="card">
            <strong>What you submitted:</strong>
            {{requestDescription}}
          </div>
          
          <p>Typically we respond within 4 business hours.</p>
          
          <div style="text-align: center;">
            <a href="{{portalLink}}" class="button">Track Status</a>
          </div>
          
          <p>{{agencyName}}</p>
        </div>
        <div class="footer">
          <p>Automatically generated confirmation email</p>
        </div>
      </div>`,
    textBody: `Request Received\n\nHi {{clientName}},\n\nWe received your request: {{requestTitle}}\n\nWe're reviewing this and will respond within 4 business hours.\n\nTrack status: {{portalLink}}\n\n{{agencyName}}`,
    variables: ['clientName', 'requestTitle', 'requestDescription', 'portalLink', 'agencyName'],
    category: 'client',
  },

  clarificationNeeded: {
    id: 'clarification-needed',
    name: 'Clarification Questions Needed',
    subject: 'Quick questions about: {{requestTitle}}',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Need More Details</h1>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <p>We need a bit more detail to move forward with: <strong>{{requestTitle}}</strong></p>
          
          <div class="section-title">Please answer these questions:</div>
          
          {{#clarificationQuestions}}
          <div class="highlight">
            <strong>{{question}}</strong>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">{{context}}</p>
          </div>
          {{/clarificationQuestions}}
          
          <p><strong>Reply directly to this email</strong> or answer in your portal: <a href="{{portalLink}}">{{portalLink}}</a></p>
          
          <p>Once we have these details, we can provide an accurate timeline and next steps.</p>
          
          <p>{{pmName}}</p>
        </div>
        <div class="footer">
          <p>Questions? Reply to this email</p>
        </div>
      </div>`,
    textBody: `Need More Details\n\nWe need clarification on: {{requestTitle}}\n\n{{#clarificationQuestions}}\nQ: {{question}}\nWhy: {{context}}\n\n{{/clarificationQuestions}}\nReply to this email or visit: {{portalLink}}\n\n{{pmName}}`,
    variables: ['clientName', 'requestTitle', 'clarificationQuestions', 'portalLink', 'pmName'],
    category: 'client',
  },

  approvedInScope: {
    id: 'approved-in-scope',
    name: 'Request Approved - In Scope',
    subject: 'Approved: {{requestTitle}}',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Great News!</h1>
        </div>
        <div class="content">
          <div class="success">
            <strong style="color: #047857;">✓ {{requestTitle}} is covered in our current scope</strong>
          </div>
          
          <p>Hi {{clientName}},</p>
          
          <div class="section-title">What's Next</div>
          <ul>
            <li>We've added it to our sprint</li>
            <li>Estimated completion: {{estimatedHours}} hours of work</li>
            <li>You'll get updates in our weekly summary</li>
          </ul>
          
          <div class="section-title">What We're Building</div>
          {{#acceptanceCriteria}}
          <ul>
            {{#acceptanceCriteria}}<li>{{.}}</li>{{/acceptanceCriteria}}
          </ul>
          {{/acceptanceCriteria}}
          
          <div style="text-align: center;">
            <a href="{{portalLink}}" class="button">Track Progress</a>
          </div>
          
          <p>{{pmName}}</p>
        </div>
        <div class="footer">
          <p>This request is now part of your project</p>
        </div>
      </div>`,
    textBody: `Approved: {{requestTitle}}\n\nGood news! This request is covered in the current scope.\n\nEstimated work: {{estimatedHours}} hours\n\nWhat we're building:\n{{#acceptanceCriteria}}\n{{#acceptanceCriteria}}- {{.}}\n{{/acceptanceCriteria}}\n{{/acceptanceCriteria}}\nTrack progress: {{portalLink}}\n\n{{pmName}}`,
    variables: ['clientName', 'requestTitle', 'estimatedHours', 'acceptanceCriteria', 'portalLink', 'pmName'],
    category: 'client',
  },

  changeRequest: {
    id: 'change-request',
    name: 'Change Request - Out of Scope',
    subject: 'Change request for your review: {{requestTitle}}',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Change Request</h1>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <p>We reviewed <strong>{{requestTitle}}</strong> and it falls outside our current scope.</p>
          
          <div class="section-title">Change Request #{{changeRequestNumber}}</div>
          
          <div class="highlight">
            <strong>Summary:</strong>
            <p>{{requestDescription}}</p>
          </div>
          
          <p><strong>Why it's out of scope:</strong></p>
          <div class="card">This feature wasn't included in the original project agreement and requires additional development beyond the agreed scope.</div>
          
          <div class="section-title">What It Requires</div>
          <ul>
            <li>Development and integration of new functionality</li>
            <li>Testing and quality assurance</li>
            <li>Deployment and documentation</li>
          </ul>
          
          <div class="section-title">Investment</div>
          <div class="card">
            <strong>Estimated Cost:</strong> {{costImpact}}<br/>
            <strong>Timeline Impact:</strong> {{timelineImpact}}
          </div>
          
          <div class="section-title">What You'll Get</div>
          {{#acceptanceCriteria}}
          <ul>
            {{#acceptanceCriteria}}<li>✓ {{.}}</li>{{/acceptanceCriteria}}
          </ul>
          {{/acceptanceCriteria}}
          
          <p><strong>Ready to move forward?</strong></p>
          <div style="text-align: center;">
            <a href="{{approvalLink}}" class="button">Approve Change Request</a>
            <a href="{{calendarLink}}" class="button secondary" style="margin-left: 10px;">Let's Discuss This</a>
          </div>
          
          <div class="warning">
            <strong>Note:</strong> Work won't begin until approved. Your current project continues as planned.
          </div>
          
          <p>Questions? Reply to this email or schedule a call: <a href="{{calendarLink}}">{{calendarLink}}</a></p>
          
          <p>{{pmName}}</p>
        </div>
        <div class="footer">
          <p>This is a change request for scope expansion</p>
        </div>
      </div>`,
    textBody: `Change Request #{{changeRequestNumber}}: {{requestTitle}}\n\nThis request falls outside the current scope.\n\nCost: {{costImpact}}\nTimeline Impact: {{timelineImpact}}\n\nTo approve: {{approvalLink}}\nTo discuss: {{calendarLink}}\n\nNote: Work won't begin until approved.\n\n{{pmName}}`,
    variables: ['clientName', 'requestTitle', 'requestDescription', 'changeRequestNumber', 'costImpact', 'timelineImpact', 'acceptanceCriteria', 'approvalLink', 'calendarLink', 'pmName'],
    category: 'client',
  },

  changeRequestApproved: {
    id: 'change-request-approved',
    name: 'Change Request Approved',
    subject: 'Change request approved - work starting soon',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Thank You!</h1>
        </div>
        <div class="content">
          <div class="success">
            <strong style="color: #047857;">✓ Change Request #{{changeRequestNumber}} approved</strong>
          </div>
          
          <p>Hi {{clientName}},</p>
          
          <p>Thanks for approving <strong>Change Request #{{changeRequestNumber}}: {{requestTitle}}</strong></p>
          
          <div class="section-title">What Happens Next</div>
          <ul>
            <li>We'll add this to our next sprint</li>
            <li>Updated delivery date: {{newDeliveryDate}}</li>
            <li>Updated project total: {{newProjectTotal}}</li>
          </ul>
          
          <div class="highlight">
            <strong>Invoice:</strong> You'll receive a separate invoice for {{crAmount}} within 24 hours.
          </div>
          
          <div style="text-align: center;">
            <a href="{{portalLink}}" class="button">View Project Dashboard</a>
          </div>
          
          <p>{{pmName}}</p>
        </div>
        <div class="footer">
          <p>Change request has been approved</p>
        </div>
      </div>`,
    textBody: `Change Request Approved\n\nChange Request #{{changeRequestNumber}}: {{requestTitle}} has been approved.\n\nNew delivery date: {{newDeliveryDate}}\nNew project total: {{newProjectTotal}}\n\nInvoice for {{crAmount}} coming within 24 hours.\n\n{{pmName}}`,
    variables: ['clientName', 'changeRequestNumber', 'requestTitle', 'newDeliveryDate', 'newProjectTotal', 'crAmount', 'portalLink', 'pmName'],
    category: 'client',
  },

  weeklyStatusUpdate: {
    id: 'weekly-status-update',
    name: 'Weekly Status Update',
    subject: 'Weekly Update: {{projectName}} - Week {{weekNumber}} of {{weekTotal}}',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Weekly Update</h1>
          <p>{{projectName}} - Week {{weekNumber}}</p>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <div class="section-title">✓ Completed This Week</div>
          {{#completedTasks}}
          <ul>
            {{#completedTasks}}<li>{{.}}</li>{{/completedTasks}}
          </ul>
          {{/completedTasks}}
          
          <div class="section-title">🚧 In Progress</div>
          {{#inProgressTasks}}
          {{#inProgressTasks}}
          <div class="card">
            <strong>{{name}}</strong>
            <p style="margin: 8px 0 0 0;">{{progress}}% complete, due {{dueDate}}</p>
            <div class="progress-bar"><div class="progress-fill" style="width: {{progress}}%"></div></div>
          </div>
          {{/inProgressTasks}}
          {{/inProgressTasks}}
          
          <div class="section-title">📋 Up Next</div>
          {{#nextTasks}}
          <ul>
            {{#nextTasks}}<li>{{.}}</li>{{/nextTasks}}
          </ul>
          {{/nextTasks}}
          
          <div class="section-title">📊 Project Health</div>
          
          <div class="card">
            <strong>Budget: {{budgetUsed}} of {{budgetTotal}} ({{budgetPercentage}}%)</strong>
            <div class="progress-bar"><div class="progress-fill" style="width: {{budgetPercentage}}%"></div></div>
          </div>
          
          <div class="card">
            <strong>Timeline:</strong> On track for {{deliveryDate}}
          </div>
          
          {{#scopeChanges}}
          <div class="card">
            <strong>Scope Changes:</strong> {{scopeChanges}} approved this month (+{{scopeChangeAmount}})
          </div>
          {{/scopeChanges}}
          
          <div class="section-title">❓ We Need From You</div>
          <ul>
            <li>Review latest designs (due Friday)</li>
            <li>Provide feedback on new features</li>
          </ul>
          
          <p><strong>Questions or concerns?</strong> Just reply to this email.</p>
          
          <p>See you next week!<br/>{{pmName}}</p>
        </div>
        <div class="footer">
          <p><a href="#" style="color: #6b7280; text-decoration: underline;">Unsubscribe from weekly updates</a> | <a href="#" style="color: #6b7280; text-decoration: underline;">Adjust frequency</a></p>
        </div>
      </div>`,
    textBody: `Weekly Update: {{projectName}} - Week {{weekNumber}}\n\nCompleted:\n{{#completedTasks}}{{#completedTasks}}- {{.}}\n{{/completedTasks}}{{/completedTasks}}\nIn Progress:\n{{#inProgressTasks}}{{#inProgressTasks}}- {{name}} ({{progress}}% complete)\n{{/inProgressTasks}}{{/inProgressTasks}}\nBudget: {{budgetUsed}} of {{budgetTotal}}\nTimeline: On track for {{deliveryDate}}\n\n{{pmName}}`,
    variables: ['clientName', 'projectName', 'weekNumber', 'weekTotal', 'completedTasks', 'inProgressTasks', 'nextTasks', 'budgetUsed', 'budgetTotal', 'budgetPercentage', 'deliveryDate', 'scopeChanges', 'scopeChangeAmount', 'pmName'],
    category: 'client',
  },

  projectKickoff: {
    id: 'project-kickoff',
    name: 'Project Kickoff',
    subject: 'Kick off {{projectName}}!',
    htmlBody: `${baseHtmlStyles}
      <div class="container">
        <div class="header">
          <h1>Let's Get Started!</h1>
        </div>
        <div class="content">
          <p>Hi {{clientName}},</p>
          
          <p>Excited to start working together on <strong>{{projectName}}</strong>!</p>
          
          <div class="section-title">Here's Everything You Need</div>
          
          <div class="card">
            <strong>Your Project Portal</strong>
            <p><a href="{{portalLink}}">{{portalLink}}</a></p>
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Submit requests, track progress, see updates</p>
          </div>
          
          <div class="card">
            <strong>Your Magic Email</strong>
            <p>{{magicEmail}}</p>
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Send requests directly via email - we'll handle the rest</p>
          </div>
          
          <div class="section-title">How This Works</div>
          <ol>
            <li>You submit requests through portal or email</li>
            <li>We review and confirm if it's in scope</li>
            <li>If out-of-scope, we send a change request for approval</li>
            <li>You get weekly updates every Friday</li>
          </ol>
          
          <div class="section-title">Project Timeline</div>
          <ul>
            <li><strong>Start:</strong> {{kickoffDate}}</li>
            <li><strong>Launch:</strong> {{launchDate}}</li>
            <li><strong>Duration:</strong> {{projectDuration}}</li>
          </ul>
          
          <div class="section-title">Your PM</div>
          <div class="card">
            <strong>{{pmName}}</strong><br/>
            Email: {{pmName}}@{{agencyName}}<br/>
            <a href="{{calendarLink}}">Schedule a call</a>
          </div>
          
          <div class="section-title">Next Steps</div>
          <ul>
            <li>☐ Review scope document (link in portal)</li>
            <li>☐ Provide {{assetsNeeded}} - Due {{assetsDueDate}}</li>
            <li>☐ Kickoff call: [Scheduled Date/Time]</li>
          </ul>
          
          <p>Let's build something great!</p>
          
          <p>{{pmName}}<br/>{{agencyName}}</p>
        </div>
        <div class="footer">
          <p>Project kickoff email</p>
        </div>
      </div>`,
    textBody: `Let's Get Started!\n\nExcited to start {{projectName}}.\n\nPortal: {{portalLink}}\nEmail: {{magicEmail}}\n\nProject Timeline:\nStart: {{kickoffDate}}\nLaunch: {{launchDate}}\nDuration: {{projectDuration}}\n\nYour PM: {{pmName}}\nSchedule call: {{calendarLink}}\n\nLet's build something great!\n\n{{pmName}}`,
    variables: ['clientName', 'projectName', 'portalLink', 'magicEmail', 'kickoffDate', 'launchDate', 'projectDuration', 'pmName', 'agencyName', 'calendarLink', 'assetsNeeded', 'assetsDueDate'],
    category: 'client',
  },
};

export const pmNotificationTemplates = {
  newRequest: {
    id: 'pm-new-request',
    subject: 'New request from {{clientName}}: {{requestTitle}}',
    text: 'New request from {{clientName}}: {{requestTitle}}\n\nReview in dashboard: {{portalLink}}\n\nThis is an automated notification.',
  },
  outOfScopeDetected: {
    id: 'pm-out-of-scope',
    subject: 'Out-of-scope detected: {{requestTitle}} - Review needed',
    text: 'Out-of-scope request detected from {{clientName}}: {{requestTitle}}\n\nThis requires review and a change request. Review in dashboard: {{portalLink}}',
  },
  changeRequestApproved: {
    id: 'pm-cr-approved',
    subject: 'Change Request #{{changeRequestNumber}} approved - ${{crAmount}}',
    text: '{{clientName}} approved Change Request #{{changeRequestNumber}}: {{requestTitle}}\n\nAmount: ${{crAmount}}\nStart work: {{portalLink}}',
  },
};

export function interpolateTemplate(template: string, context: Partial<EmailContext>): string {
  let result = template;
  
  Object.entries(context).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    if (Array.isArray(value)) {
      result = result.replace(regex, value.join(', '));
    } else if (typeof value === 'object' && value !== null) {
      result = result.replace(regex, JSON.stringify(value));
    } else {
      result = result.replace(regex, String(value || ''));
    }
  });
  
  // Remove unused template variables
  result = result.replace(/{{[^}]+}}/g, '');
  
  return result;
}
