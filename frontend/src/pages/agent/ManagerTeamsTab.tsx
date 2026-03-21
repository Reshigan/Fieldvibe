import React, { useEffect, useState, useCallback } from 'react'
import { Users, MapPin, Target, TrendingUp, DollarSign, RefreshCw, ChevronDown, ChevronUp, UserCheck, AlertCircle } from 'lucide-react'
import { apiClient } from '../../services/api.service'

interface TeamStat {
  team_lead_id: string
  team_lead_name: string
  agent_count: number
  month_visits: number
  month_registrations: number
  target_visits: number
  actual_visits: number
  achievement: number
}

interface ManagerData {
  total_team_leads: number
  total_agents: number
  unassigned_agents: number
  teams: TeamStat[]
  org_totals: {
    today_visits: number
    month_visits: number
    today_registrations: number
    month_registrations: number
  }
  org_targets: {
    target_visits: number
    actual_visits: number
    achievement: number
  }
  org_commission: {
    pending: number
    approved: number
    paid: number
  }
}

export default function ManagerTeamsTab() {
  const [data, setData] = useState<ManagerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await apiClient.get('/manager/dashboard')
      if (res.data?.success && res.data?.data) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error('Manager dashboard fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00E87B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading organization data...</p>
        </div>
      </div>
    )
  }

  const achievement = data?.org_targets?.achievement || 0
  const totalEarnings = (data?.org_commission?.pending || 0) + (data?.org_commission?.approved || 0) + (data?.org_commission?.paid || 0)

  return (
    <div className="min-h-screen bg-[#06090F] pb-24">
      {/* Header */}
      <div className="bg-[#0A1628] px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Organization</h1>
            <p className="text-xs text-gray-500">{data?.total_team_leads || 0} teams &middot; {data?.total_agents || 0} agents</p>
          </div>
          <button onClick={() => fetchData(true)} className="p-2 rounded-xl bg-white/5" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Org KPIs */}
      <div className="px-5 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10"><MapPin className="w-4 h-4 text-blue-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Today Visits</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.org_totals?.today_visits || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10"><UserCheck className="w-4 h-4 text-purple-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Today Regs</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.org_totals?.today_registrations || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Month Visits</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.org_totals?.month_visits || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10"><Target className="w-4 h-4 text-amber-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Month Regs</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.org_totals?.month_registrations || 0}</p>
          </div>
        </div>
      </div>

      {/* Achievement + Earnings */}
      <div className="px-5 py-2">
        <div className="bg-gradient-to-r from-[#0A1628] to-[#0E1D35] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="#00E87B" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${Math.min(achievement, 100) * 1.634} 163.4`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{achievement}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Org Target</p>
              <p className="text-sm text-white">{data?.org_targets?.actual_visits || 0} / {data?.org_targets?.target_visits || 0} visits</p>
            </div>
            <div className="text-right">
              <DollarSign className="w-5 h-5 text-amber-400 ml-auto mb-0.5" />
              <p className="text-lg font-bold text-white">R{totalEarnings.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">Total Earnings</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs font-semibold text-amber-400">R{(data?.org_commission?.pending || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-blue-400">R{(data?.org_commission?.approved || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#00E87B]">R{(data?.org_commission?.paid || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned agents warning */}
      {(data?.unassigned_agents || 0) > 0 && (
        <div className="px-5 py-2">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">{data?.unassigned_agents} agents not assigned to any team</p>
          </div>
        </div>
      )}

      {/* Team Leads List */}
      <div className="px-5 pt-2 pb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Team Performance</h2>
        {(data?.teams || []).length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No teams found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(data?.teams || []).map((team) => {
              const isExpanded = expandedTeam === team.team_lead_id
              return (
                <div key={team.team_lead_id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedTeam(isExpanded ? null : team.team_lead_id)}
                    className="w-full p-3 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-white truncate">{team.team_lead_name}</p>
                      <p className="text-[10px] text-gray-500">{team.agent_count} agents</p>
                    </div>
                    <div className="text-right mr-1">
                      <span className={`text-xs font-bold ${team.achievement >= 80 ? 'text-[#00E87B]' : team.achievement >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {team.achievement}%
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Month Visits</p>
                          <p className="text-sm font-semibold text-white">{team.month_visits}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Month Regs</p>
                          <p className="text-sm font-semibold text-white">{team.month_registrations}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Target Visits</p>
                          <p className="text-sm font-semibold text-white">{team.actual_visits}/{team.target_visits}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Achievement</p>
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${team.achievement >= 80 ? 'bg-[#00E87B]' : team.achievement >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(team.achievement, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400">{team.achievement}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="px-5 pb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{data?.total_team_leads || 0}</p>
            <p className="text-[10px] text-gray-500">Teams</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{data?.total_agents || 0}</p>
            <p className="text-[10px] text-gray-500">Agents</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">
              {data?.total_agents && data.total_team_leads ? Math.round(data.total_agents / data.total_team_leads) : 0}
            </p>
            <p className="text-[10px] text-gray-500">Avg/Team</p>
          </div>
        </div>
      </div>
    </div>
  )
}
