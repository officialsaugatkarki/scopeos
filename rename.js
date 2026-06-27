const fs = require('fs');
const path = require('path');

const directory = '/Users/aaryankarki_01/Downloads/scopeOS';

const filesToUpdate = [
  'app/demo/ai-analysis/page.tsx',
  'app/demo/emails/page.tsx',
  'app/demo/page.tsx',
  'app/portal/page.tsx',
  'app/signup/page.tsx',
  'app/dashboard/settings/page.tsx',
  'app/dashboard/emails/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'app/login/page.tsx',
  'components/empty-states.tsx',
  'components/pricing-section.tsx',
  'components/ai-analysis-card.tsx',
  'components/footer.tsx',
  'components/testimonials.tsx',
  'components/how-it-works.tsx',
  'components/header.tsx',
  'components/dashboard-sidebar.tsx',
  'components/features-section.tsx',
  'components/cta-section.tsx',
  'lib/mock-data.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(directory, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace ScopeGuard -> ScopeOS
    content = content.replace(/ScopeGuard/g, 'ScopeOS');
    content = content.replace(/Scopeguard/g, 'Scopeos');
    content = content.replace(/scopeguard\.ai/g, 'scopeos.ai');
    content = content.replace(/scopeguard\.io/g, 'scopeos.io');
    
    // Specifically fix the storage prefix if it was modified
    content = content.replace(/const STORAGE_PREFIX = 'scopeos_';/g, "const STORAGE_PREFIX = 'scopeguard_';");

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
