'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIntegrations } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Integration } from '@/lib/supabase';
import { CheckCircle2, Circle, Clock, Settings } from 'lucide-react';

export default function IntegrationsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const data = await getIntegrations(userId);
        setIntegrations(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (!mounted || isLoading) return null;

  const connectedIntegrations = integrations.filter(
    (i) => i.status === 'connected'
  );
  const availableIntegrations = integrations.filter(
    (i) => i.status === 'disconnected'
  );
  const comingSoonIntegrations = integrations.filter(
    (i) => i.status === 'coming-soon'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            Disconnected
          </Badge>
        );
      case 'coming-soon':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  const categoryColors: Record<string, string> = {
    'project-management': 'bg-blue-100 text-blue-700',
    documentation: 'bg-purple-100 text-purple-700',
    communication: 'bg-pink-100 text-pink-700',
    analytics: 'bg-orange-100 text-orange-700',
  };

  const IntegrationCard = ({ integration }: any) => (
    <Card className="p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="text-4xl">{integration.icon}</div>
        {getStatusBadge(integration.status)}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        {integration.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {integration.description}
      </p>

      <Badge className={categoryColors[integration.category]} variant="outline">
        {integration.category}
      </Badge>

      <div className="mt-6 flex gap-2">
        {integration.status === 'connected' ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="destructive" size="sm" className="flex-1">
              Disconnect
            </Button>
          </>
        ) : integration.status === 'coming-soon' ? (
          <Button disabled className="w-full" size="sm">
            Coming Soon
          </Button>
        ) : (
          <Button className="w-full" size="sm">
            Connect
          </Button>
        )}
      </div>

      {integration.status === 'connected' && integration.connected_at && (
        <p className="text-xs text-muted-foreground mt-3">
          Connected {new Date(integration.connected_at).toLocaleDateString()}
        </p>
      )}
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools to automate your workflow
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">
            Connected ({connectedIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="mt-6">
          {connectedIntegrations.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No integrations connected yet
              </p>
              <p className="text-sm text-muted-foreground">
                Connect your first integration to get started
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          {availableIntegrations.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                All available integrations are already connected
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {comingSoonIntegrations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoonIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
