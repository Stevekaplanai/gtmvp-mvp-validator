'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

interface ShareCardProps {
  idea: string;
  score: number;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  topDimension?: {
    name: string;
    score: number;
  };
  comparedTo?: string;
}

export function ShareCard({
  idea,
  score,
  verdict,
  topDimension,
  comparedTo,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const verdictConfig = {
    BUILD: {
      color: 'from-green-500 to-emerald-600',
      emoji: '✅',
      message: 'Ready to build!',
    },
    PIVOT: {
      color: 'from-yellow-500 to-orange-600',
      emoji: '⚠️',
      message: 'Needs refinement',
    },
    SKIP: {
      color: 'from-red-500 to-rose-600',
      emoji: '❌',
      message: 'High risk',
    },
  };

  const config = verdictConfig[verdict];

  const shareText = `I just validated my startup idea with GTMVP! 🚀\n\nScore: ${score}/100\nVerdict: ${verdict}\n${comparedTo ? `Similar to early ${comparedTo}!\n` : ''}\nTry it yourself: ${window.location.origin}`;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Convert to image using html2canvas (would need to install)
      // For now, just copy the share text
      await handleCopyLink();
    } catch (error) {
      console.error('Failed to download card:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <div ref={cardRef} className="relative overflow-hidden">
        <Card className="glass border-white/10 overflow-hidden">
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${config.color} p-6 text-white relative`}>
            <div className="absolute top-0 right-0 text-9xl opacity-10">
              {config.emoji}
            </div>
            <div className="relative z-10">
              <p className="text-sm opacity-90 mb-1">GTMVP MVP Validator</p>
              <h2 className="text-3xl font-bold mb-2">Validation Complete!</h2>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {config.message}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">YOUR IDEA</p>
              <p className="text-white font-medium line-clamp-2">{idea}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">OVERALL SCORE</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {score}
                  </span>
                  <span className="text-2xl text-gray-600">/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">VERDICT</p>
                <div className="text-2xl font-bold">{config.emoji} {verdict}</div>
              </div>
            </div>

            {topDimension && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">TOP STRENGTH</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{topDimension.name}</span>
                  <Badge variant="secondary">{topDimension.score}/100</Badge>
                </div>
              </div>
            )}

            {comparedTo && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">SIMILAR TO</p>
                <p className="text-white font-medium">Early {comparedTo}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Validated with AI-powered analysis
              </div>
              <div className="text-xs text-blue-400 font-semibold">
                GTMVP.com
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Share Actions */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-4 h-4" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="w-4 h-4" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </Button>
        </div>

        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Download as Image
        </Button>
      </div>

      {/* Share Stats */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Share your results to inspire others!</span>
          <Badge variant="outline" className="gap-1">
            <Share2 className="w-3 h-3" />
            +10 XP
          </Badge>
        </div>
      </Card>
    </div>
  );
}

// Compact share button for inline use
export function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={onClick}
    >
      <Share2 className="w-4 h-4" />
      Share Results
    </Button>
  );
}
