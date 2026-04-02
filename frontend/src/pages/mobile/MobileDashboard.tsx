import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp, 
  Users, Package, Calendar, ChevronRight, ChevronDown, ChevronUp,
  Wifi, WifiOff, RefreshCw, Target, Store, User
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { isOnline, getSyncQueueCount } from '../../utils/offline-storage'
import { apiClient } from '../../services/api.service'

// MOB-03: Mobile Dashboard with role-aware widgets, period toggle, team lead/manager drill-down

interface QuickAction {
  label: string
  icon: React.ReactNode
  path: string
  color: string
  roles?: string[]
}

interface StatCard {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: { value: number; direction: 'up' | 'down' }
}

type PeriodType = 'day' | 'week' | 'month'

interface AgentPerf {
  agent_id: string
  agent_name: string
  visits: number
  individual_visits: number
  store_visits: number
  conversions: number
  target_visits: number
  target_stores: number
}

interface TeamPerf {
  team_lead_id: string
  team_lead_name: string
  agent_count: number
  visits: number
  individual_visits: number
  store_visits: number
  conversions: number
  target_visits: number
  target_stores: number
  conversion_rate: number
}

interface PerformanceData {
  role: string
  period?: { start: string; end: string; type: string }
  visits?: number
  individual_visits?: number
  store_visits?: number
  conversions?: number
  targets?: { visits: number; conversions: number; individuals: number; stores: number }
  visit_progress?: number
  conversion_rate?: number
  team_size?: number
  total_visits?: number
  total_individual_visits?: number
  total_store_visits?: number
  total_conversions?: number
  total_target_visits?: number
  total_target_stores?: number
  agents?: AgentPerf[]
  total_team_leads?: number
  total_agents?: number
  teams?: TeamPerf[]
  grand_total_visits?: number
  grand_total_individual_visits?: number
  grand_total_store_visits?: number
  grand_total_conversions?: number
  grand_total_target_visits?: number
  grand_total_target_stores?: number
}

export default function MobileDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [online, setOnline] = useState(isOnline())
  const [syncCount, setSyncCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [statsData, setStatsData] = useState<Record<string, unknown>>({
    today_visits: 0,
    month_visits: 0,
    today_stores: 0,
    month_stores: 0,
    today_individual_visits: 0,
    today_store_visits: 0,
    month_individual_visits: 0,
    month_store_visits: 0,
    week_individual_visits: 0,
    week_store_visits: 0,
    week_visits: 0,
    week_stores: 0,
    daily_targets: [],
    monthly_targets: [],
    recent_visits: []
  })
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<PeriodType>('day')
  const [perfData, setPerfData] = useState<PerformanceData | null>(null)
  const [perfLoading, setPerfLoading] = useState(false)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)
  const [teamAgents, setTeamAgents] = useState<Record<string, AgentPerf[]>>({})
  const [teamAgentsLoading, setTeamAgentsLoading] = useState<string | null>(null)

  const role = user?.role || 'agent'
  const isTeamLead = role === 'team_lead'
  const isManager = role === 'manager' || role === 'admin' || role === 'super_admin'

  const fetchStats = useCallback(async () => {
    try {
      const dashRes = await apiClient.get('/agent/dashboard').catch(() => null)
      if (dashRes?.data?.success && dashRes?.data?.data) {
        setStatsData(dashRes.data.data)
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPerformance = useCallback(async (p: PeriodType) => {
    if (!isTeamLead && !isManager) return
    setPerfLoading(true)
    try {
      const res = await apiClient.get(`/field-ops/performance?period=${p}`).catch(() => null)
      if (res?.data) {
        setPerfData(res.data)
      }
    } catch (err) {
      console.error('Performance fetch error:', err)
    } finally {
      setPerfLoading(false)
    }
  }, [isTeamLead, isManager])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    getSyncQueueCount().then(setSyncCount)
    
    fetchStats()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchStats])

  useEffect(() => {
    if (isTeamLead || isManager) {
      fetchPerformance(period)
    }
  }, [period, isTeamLead, isManager, fetchPerformance])

  const getPeriodStats = () => {
    const s = statsData as Record<string, number>
    if (period === 'day') {
      return {
        visits: s.today_individual_visits || s.today_visits || 0,
        stores: s.today_store_visits || s.today_stores || 0,
        label: "Today's"
      }
    } else if (period === 'week') {
      return {
        visits: s.week_individual_visits || s.week_visits || 0,
        stores: s.week_store_visits || s.week_stores || 0,
        label: "This Week's"
      }
    } else {
      return {
        visits: s.month_individual_visits || s.month_visits || 0,
        stores: s.month_store_visits || s.month_stores || 0,
        label: "This Month's"
      }
    }
  }

  const periodStats = getPeriodStats()
  const sd = statsData as Record<string, number>

  const stats: StatCard[] = [
    { label: `${periodStats.label} Visits`, value: periodStats.visits, icon: <MapPin className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: `${periodStats.label} Stores`, value: periodStats.stores, icon: <Store className="w-5 h-5" />, color: 'bg-green-500' },
    { label: 'Month Visits', value: sd.month_individual_visits || sd.month_visits || 0, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Targets', value: (statsData.daily_targets as unknown[])?.length || (statsData.monthly_targets as unknown[])?.length || 0, icon: <Target className="w-5 h-5" />, color: 'bg-orange-500' },
  ]

  const quickActions: QuickAction[] = [
    { label: 'New Visit', icon: <MapPin className="w-6 h-6" />, path: '/field-operations/visits/create', color: 'bg-blue-100 text-blue-700' },
    { label: 'New Order', icon: <Package className="w-6 h-6" />, path: '/orders/create', color: 'bg-green-100 text-green-700' },
    { label: 'Customers', icon: <Users className="w-6 h-6" />, path: '/customers', color: 'bg-purple-100 text-purple-700' },
    { label: 'Reports', icon: <TrendingUp className="w-6 h-6" />, path: '/reports', color: 'bg-orange-100 text-orange-700', roles: ['admin', 'super_admin', 'manager'] },
  ]

  const filteredActions = quickActions.filter(a => !a.roles || a.roles.includes(role))

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchStats(),
        (isTeamLead || isManager) ? fetchPerformance(period) : Promise.resolve()
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const handleExpandTeam = async (teamLeadId: string) => {
    if (expandedTeam === teamLeadId) {
      setExpandedTeam(null)
      return
    }
    setExpandedTeam(teamLeadId)
    if (teamAgents[teamLeadId]) return
    setTeamAgentsLoading(teamLeadId)
    try {
      const res = await apiClient.get(`/field-ops/performance?period=${period}&team_lead_id=${teamLeadId}`).catch(() => null)
      if (res?.data?.agents) {
        setTeamAgents(prev => ({ ...prev, [teamLeadId]: res.data.agents }))
      }
    } catch {
      // fallback
    } finally {
      setTeamAgentsLoading(null)
    }
  }

  const periodLabels: Record<PeriodType, string> = { day: 'Day', week: 'Week', month: 'Month' }
  const dailyTargets = statsData.daily_targets as Array<Record<string, unknown>> | undefined
  const monthlyTargets = statsData.monthly_targets as Array<Record<string, unknown>> | undefined
  const recentVisits = statsData.recent_visits as Array<Record<string, unknown>> | undefined

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-night-300 pb-20">
      {/* Status Bar */}
      <div className="bg-white dark:bg-night-50 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-night-100">
        <div className="flex items-center gap-2">
          {online ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500">{online ? 'Online' : 'Offline'}</span>
          {syncCount > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">{syncCount} pending</span>
          )}
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="p-1">
          <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Greeting */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.first_name || 'User'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Period Toggle */}
      <div className="px-4 py-2">
        <div className="flex bg-gray-200 dark:bg-night-100 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as PeriodType[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white dark:bg-night-50 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-3">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-night-50 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color} text-white`}>{stat.icon}</div>
                {stat.trend && (
                  <span className={`text-xs font-medium ${stat.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend.direction === 'up' ? '+' : '-'}{stat.trend.value}%
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Team Lead: Team Performance */}
      {isTeamLead && (
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" /> Team Performance ({periodLabels[period]})
          </h2>
          {perfLoading ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ) : perfData?.agents && perfData.agents.length > 0 ? (
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{perfData.total_visits || 0}</p>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400">Total Visits</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{perfData.total_conversions || 0}</p>
                    <p className="text-[10px] text-green-700 dark:text-green-400">Conversions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{perfData.team_size || 0}</p>
                    <p className="text-[10px] text-purple-700 dark:text-purple-400">Team Size</p>
                  </div>
                </div>
              </div>
              {perfData.agents.map((agent) => {
                const vPct = agent.target_visits > 0 ? Math.min(100, Math.round((agent.visits / agent.target_visits) * 100)) : 0
                return (
                  <div key={agent.agent_id} className="bg-white dark:bg-night-50 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-night-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{agent.agent_name}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${vPct >= 100 ? 'bg-green-100 text-green-700' : vPct >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {vPct}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{agent.individual_visits || 0}</p>
                        <p className="text-gray-500">Individuals</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{agent.store_visits || 0}</p>
                        <p className="text-gray-500">Stores</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{agent.conversions || 0}</p>
                        <p className="text-gray-500">Conversions</p>
                      </div>
                    </div>
                    {agent.target_visits > 0 && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-night-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${vPct >= 100 ? 'bg-green-500' : vPct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: vPct + '%' }} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{agent.visits}/{agent.target_visits} target visits</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-night-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">No team performance data available</p>
            </div>
          )}
        </div>
      )}

      {/* Manager: All Teams Drill-Down */}
      {isManager && (
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> All Teams ({periodLabels[period]})
          </h2>
          {perfLoading ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ) : perfData?.teams && perfData.teams.length > 0 ? (
            <div className="space-y-2">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 mb-3">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-indigo-600">{perfData.grand_total_visits || perfData.total_visits || 0}</p>
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-400">Visits</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{perfData.grand_total_conversions || perfData.total_conversions || 0}</p>
                    <p className="text-[10px] text-green-700 dark:text-green-400">Conversions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{perfData.total_team_leads || 0}</p>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400">Team Leads</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{perfData.total_agents || 0}</p>
                    <p className="text-[10px] text-purple-700 dark:text-purple-400">Agents</p>
                  </div>
                </div>
              </div>
              {perfData.teams.map((team) => {
                const isExpanded = expandedTeam === team.team_lead_id
                const agents = teamAgents[team.team_lead_id]
                const vPct = team.target_visits > 0 ? Math.min(100, Math.round((team.visits / team.target_visits) * 100)) : 0
                return (
                  <div key={team.team_lead_id} className="bg-white dark:bg-night-50 rounded-xl shadow-sm border border-gray-200 dark:border-night-100 overflow-hidden">
                    <button
                      onClick={() => handleExpandTeam(team.team_lead_id)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{team.team_lead_name}</p>
                            <p className="text-[10px] text-gray-500">{team.agent_count} agents</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${vPct >= 100 ? 'bg-green-100 text-green-700' : vPct >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {vPct}%
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{team.visits}</p>
                          <p className="text-gray-500">Visits</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{team.conversions}</p>
                          <p className="text-gray-500">Conversions</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{team.conversion_rate}%</p>
                          <p className="text-gray-500">Conv Rate</p>
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-night-100 bg-gray-50 dark:bg-night-200/50 p-2 space-y-1.5">
                        {teamAgentsLoading === team.team_lead_id ? (
                          <div className="flex items-center justify-center py-3">
                            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                          </div>
                        ) : agents && agents.length > 0 ? (
                          agents.map((agent) => (
                            <div key={agent.agent_id} className="bg-white dark:bg-night-50 rounded-lg p-2.5">
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-gray-400" />
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{agent.agent_name}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] mt-1.5">
                                <div>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300">{agent.individual_visits || 0}</p>
                                  <p className="text-gray-400">Individuals</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300">{agent.store_visits || 0}</p>
                                  <p className="text-gray-400">Stores</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300">{agent.conversions || 0}</p>
                                  <p className="text-gray-400">Conversions</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-xs text-gray-400 py-2">No agent data available</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-night-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">No team data available</p>
            </div>
          )}
        </div>
      )}

      {/* Company Targets Section */}
      {!loading && ((dailyTargets && dailyTargets.length > 0) || (monthlyTargets && monthlyTargets.length > 0)) && (
        <div className="px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" /> Company Targets
          </h2>
          <div className="space-y-3">
            {/* Daily Targets */}
            {dailyTargets && dailyTargets.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Today's Targets</h3>
                <div className="space-y-2">
                  {dailyTargets.map((target: Record<string, unknown>, i: number) => {
                    const actualVisits = (target.actual_visits ?? target.actual_individual_visits ?? 0) as number
                    const targetVisits = ((target.individual_target_per_week as number) > 0 ? target.individual_target_per_week : (target.target_visits ?? target.individual_target_per_day ?? 0)) as number
                    const targetVisitsDaily = (target.target_visits ?? target.individual_target_per_day ?? 0) as number
                    const actualRegs = (target.actual_stores ?? target.actual_store_visits ?? 0) as number
                    const targetRegs = (target.target_stores ?? target.store_target_per_day ?? 0) as number
                    const vPct = targetVisits > 0 ? Math.min(100, Math.round((actualVisits / targetVisits) * 100)) : 0
                    const rPct = targetRegs > 0 ? Math.min(100, Math.round((actualRegs / targetRegs) * 100)) : 0
                    const hasWeeklyTarget = (target.individual_target_per_week as number) > 0
                    return (
                      <div key={`daily-${i}`} className="bg-white dark:bg-night-50 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-night-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{target.company_name as string}</p>
                          <div className="flex items-center gap-1">
                            {hasWeeklyTarget && (
                              <span className="text-[9px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">Weekly</span>
                            )}
                            <span className="text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded">Today</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Individual Visits</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{actualVisits}/{targetVisits} <span className={vPct >= 100 ? 'text-green-600' : vPct >= 75 ? 'text-amber-500' : 'text-red-500'}>({vPct}%)</span></span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-night-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all bg-blue-500" style={{ width: vPct + '%' }} />
                            </div>
                            {hasWeeklyTarget && targetVisitsDaily > 0 && (
                              <p className="text-[9px] text-gray-500 mt-1">Daily target: {targetVisitsDaily} visits/day</p>
                            )}
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Store Visits</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{actualRegs}/{targetRegs} <span className={rPct >= 100 ? 'text-green-600' : rPct >= 75 ? 'text-amber-500' : 'text-red-500'}>({rPct}%)</span></span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-night-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all bg-purple-500" style={{ width: rPct + '%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {/* Monthly Targets */}
            {monthlyTargets && monthlyTargets.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Monthly Targets</h3>
                <div className="space-y-2">
                  {monthlyTargets.map((target: Record<string, unknown>, i: number) => {
                    const actualVisits = (target.actual_visits ?? target.individual_visits ?? 0) as number
                    const targetVisits = (target.target_visits ?? 0) as number
                    const actualRegs = (target.actual_stores ?? target.store_visits ?? 0) as number
                    const targetRegs = (target.target_stores ?? 0) as number
                    const vPct = targetVisits > 0 ? Math.min(100, Math.round((actualVisits / targetVisits) * 100)) : 0
                    const rPct = targetRegs > 0 ? Math.min(100, Math.round((actualRegs / targetRegs) * 100)) : 0
                    return (
                      <div key={`monthly-${i}`} className="bg-white dark:bg-night-50 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-night-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{target.company_name as string}</p>
                          <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">Month</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Individual Visits</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{actualVisits}/{targetVisits} <span className={vPct >= 100 ? 'text-green-600' : vPct >= 75 ? 'text-amber-500' : 'text-red-500'}>({vPct}%)</span></span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-night-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all bg-blue-500" style={{ width: vPct + '%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Store Visits</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{actualRegs}/{targetRegs} <span className={rPct >= 100 ? 'text-green-600' : rPct >= 75 ? 'text-amber-500' : 'text-red-500'}>({rPct}%)</span></span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-night-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all bg-purple-500" style={{ width: rPct + '%' }} />
                            </div>
                          </div>
                        </div>
                        {(((target.store_visits as number) || 0) > 0 || ((target.individual_visits as number) || 0) > 0) && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {((target.store_visits as number) || 0) > 0 && (
                              <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Store className="w-3 h-3 text-purple-500" />
                                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Store</span>
                                </div>
                                <p className="text-xs text-gray-900 dark:text-gray-100 font-semibold">{target.store_visits as number} visits</p>
                              </div>
                            )}
                            {((target.individual_visits as number) || 0) > 0 && (
                              <div className="bg-cyan-50 dark:bg-cyan-500/10 rounded-lg p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <User className="w-3 h-3 text-cyan-500" />
                                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">Individual</span>
                                </div>
                                <p className="text-xs text-gray-900 dark:text-gray-100 font-semibold">{target.individual_visits as number} visits</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {filteredActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white dark:bg-night-50 shadow-sm active:scale-95 transition-transform"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>{action.icon}</div>
              <span className="text-xs text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Visits */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Visits</h2>
          <button onClick={() => navigate('/field-operations/visits')} className="text-xs text-blue-600 flex items-center">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentVisits && recentVisits.length > 0 ? (
            recentVisits.slice(0, 5).map((visit: Record<string, unknown>, i: number) => (
              <div key={(visit.id as string) || i} className="bg-white dark:bg-night-50 rounded-lg p-3 shadow-sm flex items-center gap-3">
                <div className="text-center min-w-[48px]">
                  <p className="text-xs font-medium text-gray-500">{visit.visit_date ? new Date(visit.visit_date as string).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : ''}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{(visit.customer_name as string) || (visit.visit_type as string) || 'Visit'}</p>
                  <p className="text-xs text-gray-500">{visit.visit_type as string}</p>
                </div>
                <div>
                  {visit.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : visit.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-night-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">No recent visits</p>
            </div>
          )}
        </div>
      </div>

      {/* Offline Alert */}
      {!online && (
        <div className="fixed bottom-20 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 shadow-lg">
          <WifiOff className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">You're offline</p>
            <p className="text-xs text-yellow-600">Changes will sync when you reconnect</p>
          </div>
        </div>
      )}
    </div>
  )
}
