'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Edit,
  Star,
  Calendar,
  BarChart3,
  Download,
} from 'lucide-react';

export interface SavedIdea {
  id: string;
  title: string;
  description: string;
  score: number;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  previousScore?: number;
  dimensions: {
    marketOpportunity: number;
    problemSeverity: number;
    technicalFeasibility: number;
    marketTiming: number;
    founderFit: number;
    monetizationPotential: number;
  };
  isFavorite?: boolean;
}

interface IdeaPortfolioProps {
  ideas: SavedIdea[];
  onSelectIdea: (idea: SavedIdea) => void;
  onDeleteIdea: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNewIdea: () => void;
}

export function IdeaPortfolio({
  ideas,
  onSelectIdea,
  onDeleteIdea,
  onToggleFavorite,
  onNewIdea,
}: IdeaPortfolioProps) {
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'improvement'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'BUILD' | 'PIVOT' | 'SKIP'>('all');

  const sortedIdeas = [...ideas].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'improvement':
        const aImprovement = a.previousScore ? a.score - a.previousScore : 0;
        const bImprovement = b.previousScore ? b.score - b.previousScore : 0;
        return bImprovement - aImprovement;
      case 'date':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  const filteredIdeas =
    filterBy === 'all' ? sortedIdeas : sortedIdeas.filter(i => i.verdict === filterBy);

  const stats = {
    total: ideas.length,
    build: ideas.filter(i => i.verdict === 'BUILD').length,
    pivot: ideas.filter(i => i.verdict === 'PIVOT').length,
    skip: ideas.filter(i => i.verdict === 'SKIP').length,
    avgScore: ideas.length > 0 ? Math.round(ideas.reduce((acc, i) => acc + i.score, 0) / ideas.length) : 0,
    bestIdea: ideas.reduce((best, idea) => (idea.score > best.score ? idea : best), ideas[0]),
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-white/10 p-4">
          <p className="text-xs text-gray-500 mb-1">Total Ideas</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </Card>
        <Card className="glass border-white/10 p-4">
          <p className="text-xs text-gray-500 mb-1">Avg Score</p>
          <p className="text-3xl font-bold text-blue-400">{stats.avgScore}</p>
        </Card>
        <Card className="glass border-green-500/30 p-4">
          <p className="text-xs text-gray-500 mb-1">Build Ready</p>
          <p className="text-3xl font-bold text-green-400">{stats.build}</p>
        </Card>
        <Card className="glass border-yellow-500/30 p-4">
          <p className="text-xs text-gray-500 mb-1">Need Work</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.pivot}</p>
        </Card>
      </div>

      {/* Best Idea Highlight */}
      {stats.bestIdea && (
        <Card className="glass border-yellow-500/50 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Your Best Idea</p>
              <p className="text-white font-semibold">{stats.bestIdea.title}</p>
            </div>
            <Badge variant="secondary" className="text-lg">
              {stats.bestIdea.score}/100
            </Badge>
          </div>
        </Card>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <Button
            variant={filterBy === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterBy('all')}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filterBy === 'BUILD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterBy('BUILD')}
            className={filterBy === 'BUILD' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            BUILD ({stats.build})
          </Button>
          <Button
            variant={filterBy === 'PIVOT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterBy('PIVOT')}
            className={filterBy === 'PIVOT' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            PIVOT ({stats.pivot})
          </Button>
        </div>

        <div className="ml-auto flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-white/10 rounded-md px-3 py-1 text-sm text-white"
          >
            <option value="date">Latest First</option>
            <option value="score">Highest Score</option>
            <option value="improvement">Most Improved</option>
          </select>

          <Button size="sm" variant="default" className="gap-2" onClick={onNewIdea}>
            <Plus className="w-4 h-4" />
            New Idea
          </Button>
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <Card className="glass border-white/10 p-12 text-center">
          <p className="text-gray-400 mb-4">No ideas yet. Start validating your first idea!</p>
          <Button onClick={onNewIdea}>
            <Plus className="w-4 h-4 mr-2" />
            Validate New Idea
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, index) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelect={() => onSelectIdea(idea)}
              onDelete={() => onDeleteIdea(idea.id)}
              onToggleFavorite={() => onToggleFavorite(idea.id)}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}

      {/* Export Options */}
      {ideas.length > 0 && (
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Export Your Portfolio</p>
              <p className="text-xs text-gray-400">Download all ideas as PDF or CSV</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

interface IdeaCardProps {
  idea: SavedIdea;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  delay?: number;
}

function IdeaCard({ idea, onSelect, onDelete, onToggleFavorite, delay = 0 }: IdeaCardProps) {
  const verdictColors = {
    BUILD: 'border-green-500/50 bg-green-500/5',
    PIVOT: 'border-yellow-500/50 bg-yellow-500/5',
    SKIP: 'border-red-500/50 bg-red-500/5',
  };

  const improvement = idea.previousScore ? idea.score - idea.previousScore : 0;
  const showImprovement = idea.previousScore && improvement !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className={`${verdictColors[idea.verdict]} border p-4 cursor-pointer hover:scale-[1.02] transition-transform relative group`}
        onClick={onSelect}
      >
        {/* Favorite Star */}
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star
            className={`w-4 h-4 ${
              idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
            }`}
          />
        </button>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white line-clamp-1">{idea.title}</h3>
              {idea.version > 1 && (
                <Badge variant="outline" className="text-xs">
                  v{idea.version}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{idea.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{idea.score}</p>
              <p className="text-xs text-gray-500">Overall Score</p>
            </div>
            <Badge variant={idea.verdict === 'BUILD' ? 'default' : 'secondary'}>
              {idea.verdict}
            </Badge>
          </div>

          {showImprovement && (
            <div className="flex items-center gap-1 text-sm">
              {improvement > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">+{improvement} points</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{improvement} points</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {idea.updatedAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {idea.category}
            </div>
          </div>
        </div>

        {/* Delete button (shown on hover) */}
        <button
          onClick={e => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this idea?')) {
              onDelete();
            }
          }}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
        </button>
      </Card>
    </motion.div>
  );
}

// Hook to manage idea portfolio
export function useIdeaPortfolio() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);

  const saveIdea = (idea: Omit<SavedIdea, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newIdea: SavedIdea = {
      ...idea,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    setIdeas(prev => [newIdea, ...prev]);
    return newIdea;
  };

  const updateIdea = (id: string, updates: Partial<SavedIdea>) => {
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id === id) {
          const previousScore = idea.score;
          return {
            ...idea,
            ...updates,
            updatedAt: new Date(),
            version: idea.version + 1,
            previousScore,
          };
        }
        return idea;
      })
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
      )
    );
  };

  return {
    ideas,
    saveIdea,
    updateIdea,
    deleteIdea,
    toggleFavorite,
  };
}
