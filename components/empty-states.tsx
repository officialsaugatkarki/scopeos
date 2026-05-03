'use client';

import { Button } from '@/components/ui/button';
import { FolderPlus, Inbox, Users, Search } from 'lucide-react';
import Link from 'next/link';

export function EmptyProjects() {
  return (
    <div className="text-center py-12">
      <div className="mb-4 flex justify-center">
        <div className="p-4 rounded-full bg-primary/10">
          <FolderPlus size={40} className="text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Create your first project</h3>
      <p className="text-muted-foreground mb-6">It only takes 2 minutes to get started</p>
      <Link href="/dashboard/projects/new">
        <Button className="bg-primary hover:bg-primary/90">New Project</Button>
      </Link>
    </div>
  );
}

export function EmptyRequests() {
  return (
    <div className="text-center py-12">
      <div className="mb-4 flex justify-center">
        <div className="p-4 rounded-full bg-primary/10">
          <Inbox size={40} className="text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">No requests yet</h3>
      <p className="text-muted-foreground mb-6">Share your portal with clients to get started</p>
      <Button variant="outline" className="mb-4">
        Copy Portal Link
      </Button>
      <p className="text-sm text-muted-foreground">Or forward emails to: requests@scopeguard.io</p>
    </div>
  );
}

export function EmptyTeam() {
  return (
    <div className="text-center py-12">
      <div className="mb-4 flex justify-center">
        <div className="p-4 rounded-full bg-primary/10">
          <Users size={40} className="text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">You&apos;re flying solo</h3>
      <p className="text-muted-foreground mb-6">Invite team members to collaborate on projects</p>
      <Button className="bg-primary hover:bg-primary/90">Invite Team Member</Button>
    </div>
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="mb-4 flex justify-center">
        <div className="p-4 rounded-full bg-muted">
          <Search size={40} className="text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No matches for &quot;{query}&quot;</h3>
      <p className="text-muted-foreground">Try different keywords or check spelling</p>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-2">This page took a vacation</h2>
      <p className="text-muted-foreground mb-6">Let&apos;s get you back on track</p>
      <Link href="/dashboard">
        <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
