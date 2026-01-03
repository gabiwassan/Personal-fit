import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '@/hooks/usePlan';
import { SESSION_DEFINITIONS } from '@/data/sessions';
import { groupByWeek, getWeekLabel, formatDateShort, isToday } from '@/lib/dateUtils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import type { FilterType, Day, SessionKey, Mood } from '@/types';

export function PlanPage() {
  const { planData, updateLog, overrideSession } = usePlan();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  // Filter days
  const filteredDays = planData.days.filter(day => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return day.log?.completed;
    if (filter === 'Pending') return !day.log?.completed;

    const sessionKey = day.overrideSessionKey || day.sessionKey;
    const session = SESSION_DEFINITIONS[sessionKey];

    if (filter === 'Cardio') {
      return session.category === 'Cardio' || session.category === 'Cardio/Base';
    }
    if (filter === 'Strength') return session.category === 'Strength';
    if (filter === 'Recovery') return session.category === 'Recovery';

    return true;
  });

  const weeks = groupByWeek(filteredDays.map(d => d.date));

  return (
    <div className="pb-20 px-4 space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6"
      >
        <h1 className="text-3xl font-bold mb-4">Training Plan</h1>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['All', 'Completed', 'Pending', 'Cardio', 'Strength', 'Recovery'] as FilterType[]).map(
            f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>
      </motion.div>

      <div className="space-y-6">
        {weeks.map((weekDates, weekIdx) => {
          const weekStart = weekDates[0];
          const weekDays = filteredDays.filter(day => weekDates.includes(day.date));

          return (
            <div key={weekIdx}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {getWeekLabel(weekStart)}
              </h3>
              <div className="space-y-2">
                {weekDays.map(day => {
                  const sessionKey = day.overrideSessionKey || day.sessionKey;
                  const session = SESSION_DEFINITIONS[sessionKey];

                  return (
                    <Card
                      key={day.date}
                      onClick={() => setSelectedDay(day)}
                      className={isToday(day.date) ? 'border-primary border-2' : ''}
                    >
                      <div className="p-4 flex items-center gap-3">
                        <span className="text-3xl">{session.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">
                              {formatDateShort(day.date)}
                            </p>
                            {isToday(day.date) && (
                              <Badge variant="default" className="text-xs">
                                Today
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {session.title}
                          </p>
                          {day.log?.minutes && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {day.log.minutes} min
                            </p>
                          )}
                        </div>
                        {day.log?.completed && (
                          <Badge variant="success">✓</Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetailModal
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onSave={(log, newSessionKey) => {
              updateLog(selectedDay.date, log);
              if (newSessionKey) {
                overrideSession(selectedDay.date, newSessionKey);
              }
              setSelectedDay(null);
              showToast('Day updated!', 'success');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DayDetailModalProps {
  day: Day;
  onClose: () => void;
  onSave: (log: Day['log'], newSessionKey?: SessionKey) => void;
}

function DayDetailModal({ day, onClose, onSave }: DayDetailModalProps) {
  const sessionKey = day.overrideSessionKey || day.sessionKey;
  const session = SESSION_DEFINITIONS[sessionKey];

  const [minutes, setMinutes] = useState(
    day.log?.minutes?.toString() || session.defaultMinutes.toString()
  );
  const [rpe, setRpe] = useState(day.log?.rpe?.toString() || '');
  const [mood, setMood] = useState<Mood | ''>(day.log?.mood || '');
  const [notes, setNotes] = useState(day.log?.notes || '');
  const [completed, setCompleted] = useState(day.log?.completed || false);
  const [overrideSessionKey, setOverrideSessionKey] = useState<SessionKey | ''>(
    day.overrideSessionKey || ''
  );

  const handleSave = () => {
    onSave(
      {
        completed,
        minutes: parseInt(minutes) || 0,
        rpe: rpe ? parseInt(rpe) : undefined,
        mood: mood || undefined,
        notes: notes || undefined,
        timestamp: Date.now(),
      },
      overrideSessionKey ? (overrideSessionKey as SessionKey) : undefined
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{formatDateShort(day.date)}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-4">
            <span className="text-4xl">{session.icon}</span>
            <div>
              <p className="font-semibold">{session.title}</p>
              <p className="text-sm text-muted-foreground">{session.category}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-yellow-800 mb-1">
              Override Workout
            </p>
            <Select
              value={overrideSessionKey}
              onChange={e => setOverrideSessionKey(e.target.value as SessionKey | '')}
              options={[
                { value: '', label: 'Use default' },
                ...Object.values(SESSION_DEFINITIONS).map(s => ({
                  value: s.key,
                  label: s.title,
                })),
              ]}
            />
            <p className="text-xs text-yellow-700 mt-1">
              ⚠️ Override affects only this day
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="completed"
                checked={completed}
                onChange={e => setCompleted(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <label htmlFor="completed" className="font-medium">
                Mark as completed
              </label>
            </div>

            <Input
              label="Minutes"
              type="number"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              min="0"
            />

            <Select
              label="RPE"
              value={rpe}
              onChange={e => setRpe(e.target.value)}
              options={[
                { value: '', label: 'Select RPE...' },
                ...Array.from({ length: 10 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1}`,
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
              placeholder="Notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
