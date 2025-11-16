'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  Heart,
  Lightbulb,
  Share2,
  Eye,
  Copy,
  Check,
  Activity,
  Clock,
  Send,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'collaborator' | 'viewer';
  isOnline: boolean;
  lastSeen?: Date;
}

interface Reaction {
  id: string;
  userId: string;
  userName: string;
  type: 'like' | 'love' | 'idea' | 'question';
  timestamp: Date;
  target?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details?: string;
}

interface CollaborationHubProps {
  ideaId: string;
  ideaTitle: string;
  onInvite?: (email: string) => void;
}

export function CollaborationHub({ ideaId, ideaTitle, onInvite }: CollaborationHubProps) {
  const [shareLink] = useState(`https://gtmvp.com/validate/${ideaId}`);
  const [copied, setCopied] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

  // Mock data - in production, this would come from real-time database
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      avatar: '👤',
      role: 'owner',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: '👩',
      role: 'collaborator',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: '👨',
      role: 'viewer',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000),
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Chen',
      userAvatar: '👩',
      content: 'Love the market opportunity score! Have you considered the B2B angle as well?',
      timestamp: new Date(Date.now() - 7200000),
      reactions: [
        {
          id: 'r1',
          userId: '1',
          userName: 'You',
          type: 'like',
          timestamp: new Date(Date.now() - 7000000),
        },
      ],
    },
    {
      id: '2',
      userId: '1',
      userName: 'You',
      userAvatar: '👤',
      content: 'Great point! We could start with B2C and pivot to B2B once we validate the core value prop.',
      timestamp: new Date(Date.now() - 3600000),
      reactions: [
        {
          id: 'r2',
          userId: '2',
          userName: 'Sarah Chen',
          type: 'love',
          timestamp: new Date(Date.now() - 3500000),
        },
      ],
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'a1',
      userId: '1',
      userName: 'You',
      action: 'created',
      timestamp: new Date(Date.now() - 86400000),
      details: 'idea validation',
    },
    {
      id: 'a2',
      userId: '2',
      userName: 'Sarah Chen',
      action: 'joined',
      timestamp: new Date(Date.now() - 43200000),
      details: 'as collaborator',
    },
    {
      id: 'a3',
      userId: '2',
      userName: 'Sarah Chen',
      action: 'added comment',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: 'a4',
      userId: '3',
      userName: 'Mike Johnson',
      action: 'joined',
      timestamp: new Date(Date.now() - 3700000),
      details: 'as viewer',
    },
  ]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (inviteEmail && onInvite) {
      onInvite(inviteEmail);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'You',
      userAvatar: '👤',
      content: newComment,
      timestamp: new Date(),
      reactions: [],
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');

    // Add activity
    const activity: Activity = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'You',
      action: 'added comment',
      timestamp: new Date(),
    };
    setActivities(prev => [activity, ...prev]);
  };

  const handleReact = (commentId: string, type: Reaction['type']) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          const existingReaction = comment.reactions.find(r => r.userId === '1');
          if (existingReaction) {
            return {
              ...comment,
              reactions: comment.reactions.filter(r => r.userId !== '1'),
            };
          } else {
            return {
              ...comment,
              reactions: [
                ...comment.reactions,
                {
                  id: Date.now().toString(),
                  userId: '1',
                  userName: 'You',
                  type,
                  timestamp: new Date(),
                },
              ],
            };
          }
        }
        return comment;
      })
    );
  };

  const reactionIcons = {
    like: '👍',
    love: '❤️',
    idea: '💡',
    question: '❓',
  };

  const roleColors = {
    owner: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    collaborator: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass border-blue-500/30 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-white">Collaboration Hub</h3>
              <p className="text-xs text-gray-400">Work together on "{ideaTitle}"</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3" />
            {teamMembers.filter(m => m.isOnline).length} online
          </Badge>
        </div>
      </Card>

      {/* Team Members */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-white">Team ({teamMembers.length})</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>

        {/* Invite Form */}
        <AnimatePresence>
          {showInviteForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 border border-white/10 rounded-lg bg-white/5"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="teammate@email.com"
                  className="flex-1 bg-gray-800 border border-white/10 rounded px-3 py-2 text-sm text-white"
                  onKeyDown={e => e.key === 'Enter' && handleInvite()}
                />
                <Button size="sm" onClick={handleInvite}>
                  Send
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Member List */}
        <div className="space-y-2">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-2xl">{member.avatar}</span>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  {!member.isOnline && member.lastSeen && (
                    <p className="text-xs text-gray-500">
                      Last seen {Math.floor((Date.now() - member.lastSeen.getTime()) / 60000)}m ago
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${roleColors[member.role]}`}>
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Share Link */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-white">Share Link</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-800 border border-white/10 rounded px-3 py-2">
            <p className="text-sm text-gray-400 truncate">{shareLink}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <Eye className="w-3 h-3" />
          Anyone with the link can view
        </div>
      </Card>

      {/* Comments & Activity */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${activeTab === 'comments' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${activeTab === 'activity' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Activity className="w-4 h-4" />
            Activity ({activities.length})
          </Button>
        </div>

        {activeTab === 'comments' ? (
          <div className="space-y-4">
            {/* Comment Input */}
            <div className="flex gap-2">
              <span className="text-2xl">👤</span>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-800 border border-white/10 rounded px-3 py-2 text-sm text-white resize-none"
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAddComment();
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Ctrl+Enter to send</span>
                  <Button size="sm" onClick={handleAddComment} className="gap-2">
                    <Send className="w-3 h-3" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {comments.map(comment => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-2xl">{comment.userAvatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {Math.floor((Date.now() - comment.timestamp.getTime()) / 60000)}m ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        {(['like', 'love', 'idea'] as const).map(type => {
                          const hasReacted = comment.reactions.some(
                            r => r.userId === '1' && r.type === type
                          );
                          const count = comment.reactions.filter(r => r.type === type).length;
                          return (
                            <button
                              key={type}
                              onClick={() => handleReact(comment.id, type)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                hasReacted
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                  : 'hover:bg-white/5 text-gray-500'
                              }`}
                            >
                              <span>{reactionIcons[type]}</span>
                              {count > 0 && <span>{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities.map(activity => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5"
              >
                <Clock className="w-4 h-4 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{activity.userName}</span>{' '}
                    <span className="text-gray-400">{activity.action}</span>
                    {activity.details && (
                      <span className="text-gray-500"> {activity.details}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor((Date.now() - activity.timestamp.getTime()) / 60000)}m ago
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="glass border-green-500/30 p-4 bg-green-500/5">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Collaboration Tip</p>
            <p className="text-xs text-gray-400">
              Invite your co-founder or advisors to get feedback on your idea validation
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook to manage collaboration state
export function useCollaboration(ideaId: string) {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaborators, setCollaborators] = useState<TeamMember[]>([]);

  const inviteCollaborator = async (email: string, role: TeamMember['role'] = 'viewer') => {
    // In production, this would make an API call
    console.log('Inviting collaborator:', email, role);
  };

  const updatePresence = (userId: string, isOnline: boolean) => {
    setCollaborators(prev =>
      prev.map(c =>
        c.id === userId
          ? { ...c, isOnline, lastSeen: isOnline ? undefined : new Date() }
          : c
      )
    );
  };

  return {
    isCollaborating,
    collaborators,
    inviteCollaborator,
    updatePresence,
  };
}
