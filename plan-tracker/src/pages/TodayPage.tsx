import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlan } from '@/hooks/usePlan';
import { SESSION_DEFINITIONS, TRAINING_RULES } from '@/data/sessions';
import { getToday, formatDateShort } from '@/lib/dateUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import type { Mood } from '@/types';

export function TodayPage() {
  const { planData, updateLog, resetLog } = usePlan();
  const { showToast } = useToast();
  const today = getToday();

  const todayData = planData.days.find(day => day.date === today);
  const sessionKey = todayData?.overrideSessionKey || todayData?.sessionKey || 'rest';
  const session = SESSION_DEFINITIONS[sessionKey];

  const [minutes, setMinutes] = useState(
    todayData?.log?.minutes?.toString() || session.defaultMinutes.toString()
  );
  const [rpe, setRpe] = useState(todayData?.log?.rpe?.toString() || '');
  const [mood, setMood] = useState<Mood | ''>(todayData?.log?.mood || '');
  const [notes, setNotes] = useState(todayData?.log?.notes || '');
  const [completed, setCompleted] = useState(todayData?.log?.completed || false);

  useEffect(() => {
    if (todayData) {
      setMinutes(
        todayData.log?.minutes?.toString() || session.defaultMinutes.toString()
      );
      setRpe(todayData.log?.rpe?.toString() || '');
      setMood(todayData.log?.mood || '');
      setNotes(todayData.log?.notes || '');
      setCompleted(todayData.log?.completed || false);
    }
  }, [todayData, session.defaultMinutes]);

  const handleSave = () => {
    updateLog(today, {
      completed,
      minutes: parseInt(minutes) || 0,
      rpe: rpe ? parseInt(rpe) : undefined,
      mood: mood || undefined,
      notes: notes || undefined,
      timestamp: Date.now(),
    });
    showToast('Workout logged!', 'success');
  };

  const handleToggleComplete = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    updateLog(today, {
      completed: newCompleted,
      minutes: parseInt(minutes) || 0,
      rpe: rpe ? parseInt(rpe) : undefined,
      mood: mood || undefined,
      notes: notes || undefined,
      timestamp: Date.now(),
    });
    showToast(
      newCompleted ? 'Marked as complete!' : 'Marked as incomplete',
      newCompleted ? 'success' : 'info'
    );
  };

  const handleReset = () => {
    if (confirm('Reset today\'s log?')) {
      resetLog(today);
      setMinutes(session.defaultMinutes.toString());
      setRpe('');
      setMood('');
      setNotes('');
      setCompleted(false);
      showToast('Day reset', 'info');
    }
  };

  if (!todayData) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No plan for today</p>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6"
      >
        <h1 className="text-3xl font-bold mb-1">Today</h1>
        <p className="text-muted-foreground">{formatDateShort(today)}</p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="text-4xl">{session.icon}</span>
              <div>
                <CardTitle className="text-xl">{session.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {session.description}
                </p>
              </div>
            </div>
            <Badge
              variant={
                session.intensity === 'Medium'
                  ? 'default'
                  : session.intensity === 'Easy'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {session.intensity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-2">How to do it:</h4>
              <p className="text-sm text-muted-foreground">{session.howTo}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleToggleComplete}
                variant={completed ? 'success' : 'default'}
                className="flex-1"
              >
                {completed ? '✓ Completed' : 'Mark Done'}
              </Button>
              <Button onClick={handleReset} variant="outline" size="default">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Minutes"
              type="number"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              min="0"
              placeholder="0"
            />

            <Select
              label="RPE (Rate of Perceived Exertion)"
              value={rpe}
              onChange={e => setRpe(e.target.value)}
              options={[
                { value: '', label: 'Select RPE...' },
                ...Array.from({ length: 10 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1} - ${
                    i < 3
                      ? 'Very Easy'
                      : i < 5
                      ? 'Easy'
                      : i < 7
                      ? 'Moderate'
                      : i < 9
                      ? 'Hard'
                      : 'Max Effort'
                  }`,
                })),
              ]}
            />

            <Select
              label="Mood"
              value={mood}
              onChange={e => setMood(e.target.value as Mood | '')}
              options={[
                { value: '', label: 'Select mood...' },
                { value: 'good', label: '😊 Good' },
                { value: 'ok', label: '😐 OK' },
                { value: 'bad', label: '😞 Bad' },
              ]}
            />

            <Textarea
              label="Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did it feel? Any observations..."
              rows={3}
            />

            <Button onClick={handleSave} className="w-full">
              Save Log
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TRAINING_RULES.map((rule, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <div>
                  <p className="font-medium text-sm">{rule.title}</p>
                  <p className="text-sm text-muted-foreground">{rule.rule}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
