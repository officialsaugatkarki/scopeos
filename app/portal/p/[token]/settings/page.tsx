'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Bell,
  Globe,
  Moon,
  Mail,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export default function PortalSettingsPage() {
  const { project } = usePortal();

  // Local UI state for toggles (cosmetic — no backend persistence for portal settings yet)
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    scopeDecisions: true,
    changeRequests: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!project) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your portal preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="glass-card rounded-xl p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white text-sm">Profile</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-blue-400">
                {project.client_name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">{project.client_name}</p>
              <p className="text-sm text-white/40">{project.client_email || 'No email provided'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.04]">
            <div>
              <label className="text-xs text-white/30 block mb-1.5">Name</label>
              <input
                type="text"
                value={project.client_name}
                readOnly
                className="w-full dark-input rounded-lg px-3 py-2 text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 block mb-1.5">Email</label>
              <input
                type="email"
                value={project.client_email || ''}
                readOnly
                className="w-full dark-input rounded-lg px-3 py-2 text-sm opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <p className="text-[11px] text-white/20 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            Profile details are managed by your agency. Contact them to make changes.
          </p>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="glass-card rounded-xl p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white text-sm">Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailUpdates' as const, label: 'Email Updates', desc: 'Receive email notifications for important updates', icon: Mail },
            { key: 'scopeDecisions' as const, label: 'Scope Decisions', desc: 'Get notified when AI makes a scope decision', icon: CheckCircle2 },
            { key: 'changeRequests' as const, label: 'Change Requests', desc: 'Notifications for new change request actions', icon: Shield },
            { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Receive a weekly summary of project activity', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/70">{item.label}</p>
                    <p className="text-[11px] text-white/30">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    notifications[item.key] ? 'bg-blue-500' : 'bg-white/[0.08]'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    notifications[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Portal Preferences */}
      <Card className="glass-card rounded-xl p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white text-sm">Portal Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/30 block mb-1.5">Language</label>
              <select className="w-full dark-input rounded-lg px-3 py-2 text-sm">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/30 block mb-1.5">Timezone</label>
              <select className="w-full dark-input rounded-lg px-3 py-2 text-sm">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern (EST)</option>
                <option value="PST">Pacific (PST)</option>
                <option value="GMT">Greenwich (GMT)</option>
                <option value="CET">Central European (CET)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Moon className="w-4 h-4 text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">Dark Mode</p>
                <p className="text-[11px] text-white/30">Always enabled for optimal viewing</p>
              </div>
            </div>
            <div className="relative w-11 h-6 rounded-full bg-blue-500 flex-shrink-0 cursor-not-allowed opacity-60">
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm translate-x-[22px]" />
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="btn-gradient text-white border-0 rounded-xl h-10 px-6 text-sm">
          {saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </span>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </div>
  );
}
