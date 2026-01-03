import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlan } from '@/hooks/usePlan';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export function SettingsPage() {
  const {
    planData,
    regenerate,
    resetPlan,
    resetLogs,
    factoryResetAll,
    exportJSON,
    importReplace,
    importMerge,
  } = usePlan();

  const { showToast } = useToast();

  const [startDate, setStartDate] = useState(planData.rangeStart);
  const [endDate, setEndDate] = useState(planData.rangeEnd);

  const handleRegeneratePlan = () => {
    if (confirm('Regenerate plan? (Existing logs will be preserved)')) {
      try {
        regenerate(startDate, endDate);
        showToast('Plan regenerated!', 'success');
      } catch (error) {
        showToast('Error regenerating plan', 'error');
      }
    }
  };

  const handleResetPlan = () => {
    if (confirm('Reset plan structure? (Logs will be kept)')) {
      resetPlan();
      showToast('Plan reset', 'info');
    }
  };

  const handleResetLogs = () => {
    if (confirm('Delete all logs? (Plan structure will be kept)')) {
      resetLogs();
      showToast('Logs reset', 'info');
    }
  };

  const handleFactoryReset = () => {
    if (
      confirm(
        'Factory reset? This will delete ALL data (plan + logs). This cannot be undone!'
      )
    ) {
      factoryResetAll();
      showToast('Factory reset complete', 'info');
    }
  };

  const handleExport = () => {
    try {
      const json = exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan-tracker-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported!', 'success');
    } catch (error) {
      showToast('Error exporting data', 'error');
    }
  };

  const handleImportReplace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      try {
        const file = e.target.files[0];
        const text = await file.text();
        importReplace(text);
        showToast('Data imported (replaced)!', 'success');
      } catch (error) {
        showToast('Error importing data', 'error');
      }
    };
    input.click();
  };

  const handleImportMerge = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      try {
        const file = e.target.files[0];
        const text = await file.text();
        importMerge(text);
        showToast('Data imported (merged)!', 'success');
      } catch (error) {
        showToast('Error importing data', 'error');
      }
    };
    input.click();
  };

  // Check if offline
  const isOffline = !navigator.onLine;

  return (
    <div className="pb-20 px-4 space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6"
      >
        <h1 className="text-3xl font-bold">Settings</h1>
      </motion.div>

      {/* Offline Indicator */}
      {isOffline && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📡</span>
              <p className="text-sm font-medium text-yellow-800">
                Offline Mode - All data stored locally
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plan Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
            <Button onClick={handleRegeneratePlan} className="w-full">
              Regenerate Plan
            </Button>
            <p className="text-xs text-muted-foreground">
              Regenerating will rebuild the plan from the weekly template while
              preserving your existing logs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reset Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reset Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button onClick={handleResetPlan} variant="outline" className="w-full">
              Reset Plan Only
            </Button>
            <p className="text-xs text-muted-foreground -mt-1">
              Rebuild plan structure, keep all logs
            </p>

            <Button onClick={handleResetLogs} variant="outline" className="w-full">
              Reset Logs Only
            </Button>
            <p className="text-xs text-muted-foreground -mt-1">
              Delete all workout logs, keep plan structure
            </p>

            <Button
              onClick={handleFactoryReset}
              variant="destructive"
              className="w-full"
            >
              Factory Reset
            </Button>
            <p className="text-xs text-muted-foreground -mt-1">
              ⚠️ Delete everything - cannot be undone!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export/Import */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button onClick={handleExport} variant="default" className="w-full">
              📥 Export Data (JSON)
            </Button>

            <div className="border-t pt-3">
              <p className="text-sm font-medium mb-2">Import Data</p>
              <div className="space-y-2">
                <Button
                  onClick={handleImportReplace}
                  variant="outline"
                  className="w-full"
                >
                  Import & Replace
                </Button>
                <p className="text-xs text-muted-foreground -mt-1">
                  Replace all current data
                </p>

                <Button
                  onClick={handleImportMerge}
                  variant="outline"
                  className="w-full"
                >
                  Import & Merge
                </Button>
                <p className="text-xs text-muted-foreground -mt-1">
                  Keep existing logs, merge imported ones
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            🔒 All data stays on this device (localStorage). No data is sent to any
            server. This app works completely offline.
          </p>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Start</span>
              <span className="font-medium">{planData.rangeStart}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan End</span>
              <span className="font-medium">{planData.rangeEnd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Days</span>
              <span className="font-medium">{planData.days.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
