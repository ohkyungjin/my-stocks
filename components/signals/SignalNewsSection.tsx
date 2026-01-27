/**
 * Signal News Section Component
 * Displays related news articles for a signal
 */

import {
  Box,
  Stack,
  Typography,
  Chip,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Article as NewsIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { NewsArticle } from '@/lib/types/api';
import { formatDateTime } from '@/lib/utils/formatters';

interface SignalNewsSectionProps {
  news: NewsArticle[];
  newsLoading: boolean;
  newsExpanded: boolean;
  onToggleExpand: () => void;
}

export function SignalNewsSection({
  news,
  newsLoading,
  newsExpanded,
  onToggleExpand,
}: SignalNewsSectionProps) {
  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <NewsIcon sx={{ color: 'info.main' }} />
          <Typography variant="body2" fontWeight={600}>
            관련 뉴스
          </Typography>
          {!newsLoading && news.length > 0 && (
            <Chip
              label={`${news.length}건`}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Stack>

        {news.length > 3 && (
          <Button
            size="small"
            onClick={onToggleExpand}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: newsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            }
          >
            {newsExpanded ? '접기' : '전체보기'}
          </Button>
        )}
      </Box>

      {/* News Content */}
      {newsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : news.length === 0 ? (
        <Alert severity="info">최근 7일간 뉴스가 없습니다.</Alert>
      ) : (
        <Stack spacing={1.5}>
          {(newsExpanded ? news : news.slice(0, 3)).map((article) => (
            <NewsArticleCard key={article.id} article={article} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

// Helper component for individual news article
function NewsArticleCard({ article }: { article: NewsArticle }) {
  const handleClick = () => {
    if (article.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  };

  const sentimentLabel = {
    positive: '긍정',
    negative: '부정',
    neutral: '중립',
  }[article.sentiment || 'neutral'] || '중립';

  const sentimentColor =
    article.sentiment === 'positive' ? 'success' :
    article.sentiment === 'negative' ? 'error' : 'default';

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        backgroundColor: 'action.hover',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.selected',
        },
        cursor: article.link ? 'pointer' : 'default',
      }}
      onClick={handleClick}
    >
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
            {article.title}
          </Typography>
          {article.link && (
            <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
        </Box>

        {article.snippet && (
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            {article.snippet}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {article.source && (
            <Chip
              label={article.source}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
          {article.sentiment && (
            <Chip
              label={sentimentLabel}
              size="small"
              color={sentimentColor}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
          {article.published_date && (
            <Typography variant="caption" color="text.disabled" className="font-mono">
              {formatDateTime(new Date(article.published_date))}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
