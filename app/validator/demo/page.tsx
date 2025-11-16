'use client';

import { useState } from 'react';
import { ValidationResults, generateMockValidationData } from '@/components/validation/ValidationResults';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ValidationDemoPage() {
  const [verdict, setVerdict] = useState<'BUILD' | 'PIVOT' | 'SKIP'>('BUILD');
  const [validationData, setValidationData] = useState(generateMockValidationData('BUILD'));

  const handleVerdictChange = (newVerdict: 'BUILD' | 'PIVOT' | 'SKIP') => {
    setVerdict(newVerdict);
    setValidationData(generateMockValidationData(newVerdict));
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/validator">
            <Button variant="outline" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Validator
            </Button>
          </Link>

          <Card className="glass border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  🎨 Visual Validation Demo
                </h1>
                <p className="text-gray-400">
                  Explore the enhanced validation experience with interactive charts, roadmaps, and insights
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleVerdictChange(verdict)}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            </div>

            {/* Verdict Selector */}
            <div className="mt-6 flex gap-3">
              <Button
                variant={verdict === 'BUILD' ? 'default' : 'outline'}
                onClick={() => handleVerdictChange('BUILD')}
                className="flex-1"
              >
                BUILD ✅
              </Button>
              <Button
                variant={verdict === 'PIVOT' ? 'default' : 'outline'}
                onClick={() => handleVerdictChange('PIVOT')}
                className="flex-1"
              >
                PIVOT ⚠️
              </Button>
              <Button
                variant={verdict === 'SKIP' ? 'default' : 'outline'}
                onClick={() => handleVerdictChange('SKIP')}
                className="flex-1"
              >
                SKIP ❌
              </Button>
            </div>
          </Card>
        </div>

        {/* Validation Results */}
        <ValidationResults {...validationData} />

        {/* Footer Info */}
        <Card className="glass border-white/10 p-6 mt-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            💡 About This Demo
          </h3>
          <p className="text-sm text-gray-400 max-w-3xl mx-auto">
            This demo showcases the visual enhancements added to the GTMVP MVP Validator.
            The actual validator uses Claude AI to analyze your idea and generate these visualizations
            based on real research and analysis. Try different verdicts to see how the presentation
            adapts to BUILD, PIVOT, or SKIP recommendations.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link href="/validator">
              <Button className="gap-2">
                Try Real Validator
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Learn More About GTMVP
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
