import React from 'react';
import { CulturalScore } from '../types';
import { CheckCircle2, Lightbulb } from 'lucide-react';

interface CulturalScoreCardProps {
  score: CulturalScore;
  onOpenExplorer: () => void;
}

export const CulturalScoreCard: React.FC<CulturalScoreCardProps> = ({
  score,
  onOpenExplorer
}) => {
  const isSacred = score.level === 'sacred';
  const isCreative = score.level === 'creative';

  const badgeColor = isSacred
    ? 'text-[#52b788] bg-[#2d6a4f]/20 border-[#2d6a4f]/50'
    : isCreative
      ? 'text-[#ffd166] bg-[#d49b27]/20 border-[#d49b27]/50'
      : 'text-[#f28482] bg-[#c94b4b]/20 border-[#c94b4b]/50';

  return (
    <div className="bg-gradient-to-br from-[#191b26] to-[#12131b] border border-[#2e3247] rounded-3xl p-5 shadow-xl space-y-4">
      
      {/* Top Header with Score Gauge */}
      <div className="flex items-center justify-between pb-3 border-b border-[#282b3d]">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#252838]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isSacred ? 'text-[#52b788]' : isCreative ? 'text-[#e09f3e]' : 'text-[#c94b4b]'}
                strokeDasharray={`${score.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-white font-sans">
              {score.score}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Cultural Guardian</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {score.badge}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{score.title}</p>
          </div>
        </div>

        <button
          onClick={onOpenExplorer}
          className="text-xs text-[#e09f3e] hover:underline font-semibold flex items-center gap-1"
        >
          Tra cứu quy chuẩn →
        </button>
      </div>

      {/* Summary Note */}
      <p className="text-xs text-gray-300 leading-relaxed bg-[#14151f] p-3 rounded-2xl border border-[#262838]">
        {score.summary}
      </p>

      {/* Strengths & Highlights */}
      {score.strengths.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-[#52b788] flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Điểm Sáng Di Sản & Thẩm Mỹ</span>
          </div>
          <ul className="space-y-1 text-xs text-gray-300">
            {score.strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#52b788] font-bold text-xs mt-0.5">●</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips & Cultural Guidance */}
      {score.tips.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#252838]">
          <div className="text-[11px] font-bold text-[#ffd166] flex items-center gap-1.5 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Lời Khuyên Bảo Tồn Văn Hóa Cho Gen Z</span>
          </div>
          <ul className="space-y-1 text-xs text-gray-400">
            {score.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#ffd166] font-bold text-xs mt-0.5">✦</span>
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
