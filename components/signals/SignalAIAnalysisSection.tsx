/**
 * Signal AI Analysis Section Component
 * Displays AI agent analysis with financial, supply/demand, and news insights
 */

import {
  Box,
  Stack,
  Typography,
  Chip,
  Alert,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Psychology as AIIcon } from '@mui/icons-material';
import { AnalysisResponse } from '@/lib/types/api';

interface SignalAIAnalysisSectionProps {
  aiAnalysis: AnalysisResponse | null;
  aiLoading: boolean;
  aiError: string | null;
  onAnalyze: () => void;
}

export function SignalAIAnalysisSection({
  aiAnalysis,
  aiLoading,
  aiError,
  onAnalyze,
}: SignalAIAnalysisSectionProps) {
  if (aiLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="caption" color="text.secondary">
            AI 에이전트가 종목을 분석 중입니다... (약 5-10초 소요)
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (aiError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {aiError}
        <Button size="small" onClick={onAnalyze} sx={{ ml: 2 }}>
          재시도
        </Button>
      </Alert>
    );
  }

  if (!aiAnalysis) {
    return (
      <Alert severity="info" icon={<AIIcon />}>
        AI 에이전트 분석을 통해 재무, 수급, 뉴스 관점에서 종합적인 투자 의사결정을 받아보세요.
        <br />
        <Typography variant="caption" color="text.secondary">
          분석에는 약 5-10초가 소요됩니다.
        </Typography>
      </Alert>
    );
  }

  const decisionLabel = {
    strong_buy: '강력 매수',
    buy: '매수',
    strong_sell: '강력 매도',
    sell: '매도',
    hold: '보유/관망',
  }[aiAnalysis.decision] || '보유/관망';

  const decisionColor =
    aiAnalysis.decision === 'strong_buy' || aiAnalysis.decision === 'buy' ? 'success' :
    aiAnalysis.decision === 'strong_sell' || aiAnalysis.decision === 'sell' ? 'error' : 'default';

  const backgroundGradient =
    aiAnalysis.decision === 'strong_buy' || aiAnalysis.decision === 'buy'
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
      : aiAnalysis.decision === 'strong_sell' || aiAnalysis.decision === 'sell'
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(156, 163, 175, 0.05) 100%)';

  const borderColor =
    aiAnalysis.decision === 'strong_buy' || aiAnalysis.decision === 'buy' ? 'success.main' :
    aiAnalysis.decision === 'strong_sell' || aiAnalysis.decision === 'sell' ? 'error.main' : 'grey.500';

  return (
    <Stack spacing={2}>
      {/* Overall Analysis Result */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          background: backgroundGradient,
          border: '1px solid',
          borderColor: borderColor,
        }}
      >
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              종합 의사결정
            </Typography>
            <Chip
              label={decisionLabel}
              color={decisionColor}
              sx={{ fontWeight: 700, fontSize: '0.875rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                종합 점수
              </Typography>
              <Typography variant="h5" className="font-mono" fontWeight={700}>
                {aiAnalysis.total_score.toFixed(1)}점
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                신뢰도
              </Typography>
              <Typography variant="h5" className="font-mono" fontWeight={700}>
                {(aiAnalysis.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {aiAnalysis.rationale}
          </Typography>

          {aiAnalysis.key_points && aiAnalysis.key_points.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" fontWeight={600} gutterBottom display="block">
                핵심 포인트
              </Typography>
              <Stack spacing={0.5}>
                {aiAnalysis.key_points.map((point, index) => (
                  <Typography key={index} variant="caption" color="text.secondary">
                    • {point}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Individual Agent Analysis Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <AgentAnalysisCard
          title="재무 분석"
          score={aiAnalysis.financial_analysis?.score}
          rationale={aiAnalysis.financial_analysis?.rationale}
        />
        <AgentAnalysisCard
          title="수급 분석"
          score={aiAnalysis.supply_demand_analysis?.score}
          rationale={aiAnalysis.supply_demand_analysis?.rationale}
        />
        <AgentAnalysisCard
          title="뉴스 분석"
          score={aiAnalysis.news_analysis?.score}
          rationale={aiAnalysis.news_analysis?.rationale}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" variant="text" onClick={onAnalyze}>
          분석 새로고침
        </Button>
      </Box>
    </Stack>
  );
}

// Helper component for individual agent analysis
function AgentAnalysisCard({
  title,
  score,
  rationale,
}: {
  title: string;
  score?: number | null;
  rationale?: string | null;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        {score !== null && score !== undefined && (
          <Chip
            label={`${score}점`}
            color={getScoreColor(score)}
            size="small"
          />
        )}
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          {rationale || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
}
