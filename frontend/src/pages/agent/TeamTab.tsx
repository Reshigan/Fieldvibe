import React, { useEffect, useState, useCallback } from 'react'
import { Users, MapPin, Target, TrendingUp, DollarSign, RefreshCw, ChevronDown, ChevronUp, UserCheck } from 'lucide-react'
import { apiClient } from '../../services/api.service'

interface AgentStat {
  id: string
  first_name: string
  last_name: string
  role: string
  today_visits: number
  month_visits: number
  today_registrations: number
  month_registrations: number
  target_visits: number
  actual_visits: number
  achievement: number
}

interface TeamData {
  team_size: number
  agents: AgentStat[]
  team_totals: {
    today_visits: number
    month_visits: number
    today_registrations: number
    month_registrations: number
  }
  team_targets: {
    target_visits: number
    actual_visits: number
    achievement: number
  }
  team_commission: {
    pending: number
    approved: number
    paid: number
  }
}

export default function TeamTab() {
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await apiClient.get('/team-lead/dashboard')
      if (res.data?.success && res.data?.data) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error('Team dashboard fetch error:', err)
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
          <p className="text-gray-400 text-sm">Loading team data...</p>
        </div>
      </div>
    )
  }

  const achievement = data?.team_targets?.achievement || 0
  const totalEarnings = (data?.team_commission?.pending || 0) + (data?.team_commission?.approved || 0) + (data?.team_commission?.paid || 0)

  return (
    <div className="min-h-screen bg-[#06090F] pb-24">
      {/* Header */}
      <div className="bg-[#0A1628] px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">My Team</h1>
            <p className="text-xs text-gray-500">{data?.team_size || 0} agents</p>
          </div>
          <button onClick={() => fetchData(true)} className="p-2 rounded-xl bg-white/5" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="px-5 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10"><MapPin className="w-4 h-4 text-blue-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Today Visits</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.team_totals?.today_visits || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10"><UserCheck className="w-4 h-4 text-purple-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Today Regs</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.team_totals?.today_registrations || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Month Visits</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.team_totals?.month_visits || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10"><Target className="w-4 h-4 text-amber-400" /></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Month Regs</span>
            </div>
            <p className="text-xl font-bold text-white">{data?.team_totals?.month_registrations || 0}</p>
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
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Team Target</p>
              <p className="text-sm text-white">{data?.team_targets?.actual_visits || 0} / {data?.team_targets?.target_visits || 0} visits</p>
            </div>
            <div className="text-right">
              <DollarSign className="w-5 h-5 text-amber-400 ml-auto mb-0.5" />
              <p className="text-lg font-bold text-white">R{totalEarnings.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">Total Earnings</p>
            </div>
          </div>
          {/* Earnings breakdown */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs font-semibold text-amber-400">R{(data?.team_commission?.pending || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-blue-400">R{(data?.team_commission?.approved || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#00E87B]">R{(data?.team_commission?.paid || 0).toLocaleString()}</p>
              <p className="text-[9px] text-gray-500">Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="px-5 pt-2 pb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent Performance</h2>
        {(data?.agents || []).length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No agents assigned to your team</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(data?.agents || []).map((agent) => {
              const isExpanded = expandedAgent === agent.id
              return (
                <div key={agent.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                    className="w-full p-3 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{(agent.first_name?.[0] || '') + (agent.last_name?.[0] || '')}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-white truncate">{agent.first_name} {agent.last_name}</p>
                      <p className="text-[10px] text-gray-500">{agent.today_visits} visits today</p>
                    </div>
                    <div className="text-right mr-1">
                      <span className={`text-xs font-bold ${agent.achievement >= 80 ? 'text-[#00E87B]' : agent.achievement >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {agent.achievement}%
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Month Visits</p>
                          <p className="text-sm font-semibold text-white">{agent.month_visits}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Month Regs</p>
                          <p className="text-sm font-semibold text-white">{agent.month_registrations}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Target Visits</p>
                          <p className="text-sm font-semibold text-white">{agent.actual_visits}/{agent.target_visits}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-[10px] text-gray-500">Achievement</p>
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${agent.achievement >= 80 ? 'bg-[#00E87B]' : agent.achievement >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(agent.achievement, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400">{agent.achievement}%</span>
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
    </div>
  )
}
