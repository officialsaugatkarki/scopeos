'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Copy, Trash2, Plus, Download, Check, AlertCircle } from 'lucide-react';
import { getCurrentUserId, getSession } from '@/lib/auth';
import { getAgencyPricing, upsertAgencyPricing } from '@/lib/database';
import { supabase } from '@/lib/supabase';

// Plan display names and project limits
const PLAN_META: Record<string, { label: string; price: string; maxProjects: number; maxRequests: number }> = {
  free:       { label: 'Free Plan',       price: '$0/month', maxProjects: 3,   maxRequests: 50 },
  pro:        { label: 'Pro Plan',        price: '$0/month (Beta)', maxProjects: 999, maxRequests: 9999 },
  enterprise: { label: 'Enterprise Plan', price: 'Custom',   maxProjects: 999, maxRequests: 9999 },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKeys] = useState([
    { id: '1', name: 'Production Key', created: 'Jan 15, 2024', lastUsed: '2 hours ago' },
  ]);
  const [notifications, setNotifications] = useState({
    newRequest: true,
    clarification: true,
    outOfScope: true,
    approved: true,
    weeklySummary: false,
    mentions: false,
  });
  const [pricingForm, setPricingForm] = useState({
    hourly_rate: '150',
    currency: 'USD',
    min_hours: '1',
    overage_multiplier: '1.5',
    notes: '',
  });
  const [pricingSaved, setPricingSaved] = useState(false);
  const [planLabel, setPlanLabel] = useState('Free Plan');
  const [planPrice, setPlanPrice] = useState('$0/month');
  const [usedProjects, setUsedProjects] = useState(0);
  const [maxProjects, setMaxProjects] = useState(3);
  const [usedRequests, setUsedRequests] = useState(0);
  const [maxRequests, setMaxRequests] = useState(50);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const auth = await getSession();
      if (!auth.user?.id) return;
      const uid = auth.user.id;

      setUserName(auth.user.name || '');
      setUserEmail(auth.user.email || '');

      // Load pricing
      const pricing = await getAgencyPricing(uid);
      if (pricing) {
        setPricingForm({
          hourly_rate: String(pricing.hourly_rate),
          currency: pricing.currency,
          min_hours: String(pricing.min_hours),
          overage_multiplier: String(pricing.overage_multiplier),
          notes: pricing.notes || '',
        });
      }

      // Load real plan from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_plan')
        .eq('id', uid)
        .single();

      const slug = profile?.current_plan || 'free';
      const meta = PLAN_META[slug] ?? PLAN_META.free;
      setPlanLabel(meta.label);
      setPlanPrice(meta.price);
      setMaxProjects(meta.maxProjects);
      setMaxRequests(meta.maxRequests);

      // Count user's projects
      const { count: pCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', uid);
      setUsedProjects(pCount ?? 0);

      // Count user's requests (via projects)
      const { data: userProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', uid);
        
      const projectIds = (userProjects || []).map((p: any) => p.id);
      if (projectIds.length > 0) {
        const { count: rCount } = await supabase
          .from('requests')
          .select('id', { count: 'exact', head: true })
          .in('project_id', projectIds);
        setUsedRequests(rCount ?? 0);
      }
    };
    loadData();
  }, []);

  const savePricing = async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    await upsertAgencyPricing(userId, {
      hourly_rate: parseFloat(pricingForm.hourly_rate) || 150,
      currency: pricingForm.currency,
      min_hours: parseFloat(pricingForm.min_hours) || 1,
      overage_multiplier: parseFloat(pricingForm.overage_multiplier) || 1.5,
      notes: pricingForm.notes,
    });
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2000);
  };

  const projectPct = maxProjects >= 999 ? 0 : Math.min(100, (usedProjects / maxProjects) * 100);
  const requestPct = maxRequests >= 9999 ? 0 : Math.min(100, (usedRequests / maxRequests) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-white/60">Manage your account and workspace preferences</p>
      </div>

      {/* TABS CONTAINER */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 p-1 rounded-xl mb-6 border border-white/10 text-white/70">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-[#0D1526] rounded-lg text-sm font-medium transition-all">Profile</TabsTrigger>
          <TabsTrigger value="agency" className="data-[state=active]:bg-white data-[state=active]:text-[#0D1526] rounded-lg text-sm font-medium transition-all">Agency</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white data-[state=active]:text-[#0D1526] rounded-lg text-sm font-medium transition-all">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-[#0D1526] rounded-lg text-sm font-medium transition-all">Notifications</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-white data-[state=active]:text-[#0D1526] rounded-lg text-sm font-medium transition-all">API Keys</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 md:p-8 bg-white border border-[#E2E8F4] shadow-sm rounded-2xl text-[#0D1526]">
            <h2 className="text-2xl font-bold text-[#0D1526] mb-6 tracking-tight">Personal Information</h2>

            <div className="space-y-8">
              {/* Avatar Upload */}
              <div>
                <label className="text-sm font-semibold text-[#0D1526] mb-3 block">Avatar</label>
                <div className="flex items-end gap-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1A56DB] flex items-center justify-center text-white text-2xl font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-2 text-[#0D1526] border-[#E2E8F4] hover:bg-slate-50">
                      <Upload size={16} />
                      Upload New
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#64748B] hover:text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Full Name</label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-white border-[#E2E8F4] text-[#0D1526]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Email</label>
                  <Input value={userEmail} disabled className="bg-slate-50 border-[#E2E8F4] text-[#64748B]" type="email" />
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-[#E2E8F4] pt-8">
                <h3 className="text-lg font-semibold text-[#0D1526] mb-5">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Timezone</label>
                    <select className="w-full px-3 py-2.5 border border-[#E2E8F4] bg-white rounded-xl text-sm text-[#0D1526] outline-none focus:border-blue-500">
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Date Format</label>
                    <select className="w-full px-3 py-2.5 border border-[#E2E8F4] bg-white rounded-xl text-sm text-[#0D1526] outline-none focus:border-blue-500">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-[#2563EB] hover:bg-[#1A56DB] text-white rounded-xl px-6">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AGENCY SETTINGS TAB */}
        <TabsContent value="agency" className="space-y-6">
          <Card className="p-6 md:p-8 bg-white border border-[#E2E8F4] shadow-sm rounded-2xl text-[#0D1526]">
            <h2 className="text-2xl font-bold text-[#0D1526] mb-6 tracking-tight">Agency Settings</h2>

            <div className="space-y-8">
              {/* Agency Info */}
              <div>
                <h3 className="text-lg font-semibold text-[#0D1526] mb-4">Agency Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Agency Name</label>
                    <Input placeholder="Your Agency Name" className="bg-white border-[#E2E8F4] text-[#0D1526]" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Website</label>
                    <Input placeholder="https://youragency.com" className="bg-white border-[#E2E8F4] text-[#0D1526]" />
                  </div>
                </div>
              </div>

              {/* Pricing Rules */}
              <div className="border-t border-[#E2E8F4] pt-8">
                <h3 className="text-lg font-semibold text-[#0D1526] mb-2">Pricing Rules</h3>
                <p className="text-xs text-[#64748B] mb-5">These values are used by AI to calculate costs for out-of-scope change requests.</p>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Hourly Rate</label>
                      <Input
                        type="number"
                        placeholder="150"
                        value={pricingForm.hourly_rate}
                        onChange={(e) => setPricingForm({ ...pricingForm, hourly_rate: e.target.value })}
                        className="bg-white border-[#E2E8F4] text-[#0D1526]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Currency</label>
                      <select
                        className="w-full px-3 py-2.5 border border-[#E2E8F4] bg-white rounded-xl text-sm text-[#0D1526] outline-none focus:border-blue-500"
                        value={pricingForm.currency}
                        onChange={(e) => setPricingForm({ ...pricingForm, currency: e.target.value })}
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Minimum Billable Hours</label>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="1"
                        value={pricingForm.min_hours}
                        onChange={(e) => setPricingForm({ ...pricingForm, min_hours: e.target.value })}
                        className="bg-white border-[#E2E8F4] text-[#0D1526]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Rush Multiplier</label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        value={pricingForm.overage_multiplier}
                        onChange={(e) => setPricingForm({ ...pricingForm, overage_multiplier: e.target.value })}
                        className="bg-white border-[#E2E8F4] text-[#0D1526]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0D1526] mb-2 block">Pricing Notes (for AI context)</label>
                    <textarea
                      className="w-full px-3 py-3 border border-[#E2E8F4] rounded-xl text-sm bg-white text-[#0D1526] outline-none focus:border-blue-500"
                      rows={3}
                      placeholder="e.g., First 10 hours included in monthly retainer..."
                      value={pricingForm.notes}
                      onChange={(e) => setPricingForm({ ...pricingForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E2E8F4]">
                <Button onClick={savePricing} className="bg-[#2563EB] hover:bg-[#1A56DB] text-white rounded-xl px-6 flex items-center gap-2">
                  {pricingSaved ? <><Check size={16} /> Saved!</> : 'Save Agency Settings'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* BILLING TAB - FIXED TO REAL DATA */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-100 shadow-sm rounded-2xl">
              <h3 className="text-lg font-bold text-[#0D1526] mb-4">Current Plan</h3>
              <div className="mb-6">
                <p className="text-3xl font-black text-[#0D1526] tracking-tight">{planLabel}</p>
                <p className="text-lg text-[#2563EB] font-semibold mt-1">{planPrice}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#64748B]">Projects</span>
                    <span className="text-sm font-bold text-[#0D1526]">
                      {maxProjects >= 999 ? `${usedProjects} / Unlimited` : `${usedProjects} / ${maxProjects}`}
                    </span>
                  </div>
                  <div className="h-2 bg-blue-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${projectPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[#64748B]">Requests</span>
                    <span className="text-sm font-bold text-[#0D1526]">
                      {maxRequests >= 9999 ? `${usedRequests} / Unlimited` : `${usedRequests} / ${maxRequests}`}
                    </span>
                  </div>
                  <div className="h-2 bg-blue-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${requestPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {planLabel === 'Free Plan' && (
                  <Button onClick={() => window.location.href='/onboarding/plan'} className="flex-1 bg-[#2563EB] hover:bg-[#1A56DB] text-white shadow-sm rounded-xl">
                    Upgrade to Pro
                  </Button>
                )}
                <Button variant="outline" className="flex-1 bg-white border-blue-200 text-[#2563EB] hover:bg-blue-50 rounded-xl">
                  Contact Support
                </Button>
              </div>
            </Card>

            {/* Payment Method - Removed fake data */}
            <Card className="p-6 md:p-8 bg-white border border-[#E2E8F4] shadow-sm rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <h3 className="text-lg font-bold text-[#0D1526] mb-2">Billing Managed via Stripe</h3>
              <p className="text-[#64748B] text-sm mb-6 max-w-[250px]">
                Payment methods and invoicing will be available in the upcoming beta release.
              </p>
              <Button disabled variant="outline" className="border-[#E2E8F4] text-[#64748B] bg-slate-50 rounded-xl">
                Coming Soon
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 md:p-8 bg-white border border-[#E2E8F4] shadow-sm rounded-2xl text-[#0D1526]">
            <h2 className="text-2xl font-bold text-[#0D1526] mb-6 tracking-tight">Notification Preferences</h2>

            <div className="space-y-8">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-[#0D1526] mb-4">Email Alerts</h3>
                <div className="space-y-2">
                  {[
                    { key: 'newRequest', label: 'New request received' },
                    { key: 'clarification', label: 'Request needs clarification' },
                    { key: 'outOfScope', label: 'Out-of-scope request detected' },
                    { key: 'approved', label: 'Change request approved by client' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-3 rounded-xl border border-transparent hover:border-[#E2E8F4] transition-all">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-[#C8D6F0] text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span className="text-sm font-medium text-[#0D1526]">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* API KEYS TAB */}
        <TabsContent value="api" className="space-y-6">
          <Card className="p-6 md:p-8 bg-white border border-[#E2E8F4] shadow-sm rounded-2xl text-[#0D1526]">
            <div className="flex items-center justify-between mb-8 border-b border-[#E2E8F4] pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0D1526] tracking-tight">API Keys</h2>
                <p className="text-[#64748B] text-sm mt-1">Manage keys for programmatic access.</p>
              </div>
              <Button className="bg-[#2563EB] hover:bg-[#1A56DB] text-white rounded-xl shadow-sm flex gap-2">
                <Plus size={16} /> Generate Key
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E2E8F4]">
                  <tr>
                    <th className="text-left py-3 text-[#64748B] font-semibold text-xs uppercase tracking-wider">Key Name</th>
                    <th className="text-left py-3 text-[#64748B] font-semibold text-xs uppercase tracking-wider">Created</th>
                    <th className="text-right py-3 text-[#64748B] font-semibold text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-[#E2E8F4] hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-semibold text-[#0D1526]">{key.name}</td>
                      <td className="py-4 text-[#64748B]">{key.created}</td>
                      <td className="py-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-[#64748B] hover:text-[#0D1526] hover:bg-slate-100">
                          <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
