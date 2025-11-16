'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, DollarSign, Target } from "lucide-react";

interface GTMChannel {
  name: string;
  cac: number; // Customer Acquisition Cost in $
  conversionRate: number; // Percentage
  timeToROI: number; // Months
  difficulty: 'easy' | 'medium' | 'hard';
  effectiveness: number; // 0-100 score
}

interface GTMChannelChartProps {
  channels: GTMChannel[];
  recommendedChannel?: string;
}

export function GTMChannelChart({ channels, recommendedChannel }: GTMChannelChartProps) {
  // Prepare data for bar chart (CAC comparison)
  const cacData = channels.map(channel => ({
    name: channel.name,
    CAC: channel.cac,
    'Conversion %': channel.conversionRate,
  }));

  // Prepare data for radar chart (overall effectiveness)
  const radarData = channels.map(channel => ({
    channel: channel.name,
    Effectiveness: channel.effectiveness,
    'Speed to ROI': 100 - (channel.timeToROI * 10), // Inverse scale
    'Ease of Setup': channel.difficulty === 'easy' ? 100 : channel.difficulty === 'medium' ? 60 : 30,
  }));

  const difficultyColors = {
    easy: 'bg-green-500/20 border-green-500/50 text-green-400',
    medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    hard: 'bg-red-500/20 border-red-500/50 text-red-400',
  };

  return (
    <Card className="glass border-white/10 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">📊 GTM Channel Analysis</h3>
        {recommendedChannel && (
          <Badge variant="secondary" className="gap-2">
            <Target className="w-4 h-4" />
            Recommended: {recommendedChannel}
          </Badge>
        )}
      </div>

      {/* Channel Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {channels.map((channel, index) => {
          const isRecommended = channel.name === recommendedChannel;
          return (
            <div
              key={index}
              className={`glass border rounded-lg p-4 ${
                isRecommended ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{channel.name}</h4>
                <Badge className={difficultyColors[channel.difficulty]}>
                  {channel.difficulty}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    CAC
                  </span>
                  <span className="text-white font-bold">${channel.cac}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Conversion
                  </span>
                  <span className="text-white font-bold">{channel.conversionRate}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Time to ROI
                  </span>
                  <span className="text-white font-bold">{channel.timeToROI}mo</span>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Effectiveness</span>
                    <span className="text-white font-bold">{channel.effectiveness}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${channel.effectiveness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CAC vs Conversion Rate Chart */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">💰 CAC vs Conversion Rate</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cacData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar dataKey="CAC" fill="#3B82F6" />
            <Bar dataKey="Conversion %" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart - Overall Comparison */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">🎯 Channel Comparison Matrix</h4>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="channel" stroke="#9CA3AF" />
            <PolarRadiusAxis stroke="#9CA3AF" />
            <Radar
              name="Overall Score"
              dataKey="Effectiveness"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="glass border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">💡 Key Insights</h4>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Lower CAC channels may have slower ROI timelines</li>
          <li>• Consider your team's capabilities when choosing difficulty level</li>
          <li>• Multi-channel approach often yields best long-term results</li>
          <li>• Start with recommended channel, then expand to secondary options</li>
        </ul>
      </div>
    </Card>
  );
}
