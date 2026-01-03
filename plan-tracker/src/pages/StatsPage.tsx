import { motion } from 'framer-motion';
import { usePlan } from '@/hooks/usePlan';
import { calculateStats, generateInsights } from '@/lib/analytics';
import { getWeekLabel } from '@/lib/dateUtils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export function StatsPage() {
  const { planData } = usePlan();
  const stats = calculateStats(planData);
  const insights = generateInsights(planData, stats);

  // Prepare chart data
  const weeklyData = stats.weeklyMinutes.slice(-6).map(week => ({
    week: getWeekLabel(week.weekStart).replace('Week of ', ''),
    minutes: week.totalMinutes,
    avgRpe: week.avgRpe || 0,
  }));

  const sessionTypeData = Object.entries(stats.sessionsByType).map(
    ([key, count]) => ({
      name: key,
      value: count,
    })
  );


  return (
    <div className="pb-20 px-4 space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6"
      >
        <h1 className="text-3xl font-bold">Statistics</h1>
      </motion.div>

      {/* Insights */}
      <div className="space-y-3">
        {insights.map(insight => (
          <Card
            key={insight.id}
            className={
              insight.type === 'success'
                ? 'border-green-200 bg-green-50'
                : insight.type === 'warning'
                ? 'border-yellow-200 bg-yellow-50'
                : ''
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {insight.type === 'success'
                    ? '🎉'
                    : insight.type === 'warning'
                    ? '⚠️'
                    : '💡'}
                </span>
                <div>
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Minutes</p>
            <p className="text-3xl font-bold">{stats.totalMinutes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Training Compliance</p>
            <p className="text-3xl font-bold">
              {Math.round(stats.trainingCompliance)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-3xl font-bold">{stats.currentStreak}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Best Streak</p>
            <p className="text-3xl font-bold">{stats.bestStreak}</p>
          </CardContent>
        </Card>
      </div>

      {/* Consistency Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consistency Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${stats.consistencyScore}%` }}
                />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.consistencyScore}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on compliance (60%), stability (20%), and streak (20%)
          </p>
        </CardContent>
      </Card>

      {/* Weekly Minutes Chart */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Minutes (Last 6 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="minutes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Average RPE Trend */}
      {weeklyData.some(w => w.avgRpe > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average RPE Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgRpe"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Sessions by Type */}
      {sessionTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sessions by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Cardio vs Strength */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cardio vs Strength</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cardio</span>
                <span className="text-sm font-bold">{stats.cardioMinutes} min</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${
                      (stats.cardioMinutes /
                        (stats.cardioMinutes + stats.strengthMinutes || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Strength</span>
                <span className="text-sm font-bold">{stats.strengthMinutes} min</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${
                      (stats.strengthMinutes /
                        (stats.cardioMinutes + stats.strengthMinutes || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed Sessions</span>
              <span className="font-medium">{stats.completedSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Training Days</span>
              <span className="font-medium">{stats.totalTrainingSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overall Compliance</span>
              <span className="font-medium">
                {Math.round(stats.overallCompliance)}%
              </span>
            </div>
            {stats.avgRpe && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average RPE</span>
                <span className="font-medium">{stats.avgRpe.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
