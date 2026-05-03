'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AILoadingState } from '@/components/ai-loading-state';
import { AIAnalysisResult } from '@/components/ai-analysis-result';
import { getScopeRequests } from '@/lib/database';
import type { ScopeRequest } from '@/lib/supabase';

export default function AIAnalysisDemo() {
  const [showLoading, setShowLoading] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [requests, setRequests] = useState<ScopeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getScopeRequests();
      setRequests(data);
      if (data.length > 0) {
        setSelectedRequestId(data[0].id);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const handleAnalyzeClick = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  };

  if (isLoading) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">AI Analysis Engine Demo</h1>
        <p className="text-muted-foreground">See how ScopeGuard AI analyzes scope requests in real-time</p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="all-results">All Analysis Results</TabsTrigger>
        </TabsList>

        {/* LIVE DEMO TAB */}
        <TabsContent value="demo" className="space-y-6 mt-6">
          {/* Request Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Select a Request to Analyze</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requests.slice(0, 4).map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedRequestId(req.id);
                    setShowLoading(false);
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedRequestId === req.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{req.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Selected Request Details */}
          {selectedRequest && (
            <Card className="p-6 bg-muted/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedRequest.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequest.description}</p>
                </div>
                {selectedRequest.ai_analysis && (
                  <Badge className="bg-primary">{selectedRequest.ai_analysis.confidence}%</Badge>
                )}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  From
                </p>
                <p className="text-sm text-foreground font-medium">{selectedRequest.client_name}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.client_email}</p>
              </div>
            </Card>
          )}

          {/* Analysis State */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">AI Analysis</h2>
              {!showLoading && selectedRequest?.ai_analysis && (
                <Button onClick={handleAnalyzeClick} variant="outline" size="sm">
                  Re-analyze
                </Button>
              )}
            </div>

            {showLoading ? (
              <AILoadingState />
            ) : selectedRequest?.ai_analysis ? (
              <AIAnalysisResult analysis={selectedRequest.ai_analysis} />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Click a request above to view its AI analysis</p>
                <Button onClick={handleAnalyzeClick}>Analyze Request</Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ALL RESULTS TAB */}
        <TabsContent value="all-results" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{request.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                  </div>
                  {request.ai_analysis && (
                    <Badge
                      className={
                        request.ai_analysis.decision === 'in-scope'
                          ? 'bg-emerald-500'
                          : request.ai_analysis.decision === 'out-of-scope'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }
                    >
                      {request.ai_analysis.confidence}%
                    </Badge>
                  )}
                </div>

                {request.ai_analysis && (
                  <div className="space-y-4 mt-6 pt-6 border-t">
                    <AIAnalysisResult analysis={request.ai_analysis} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
