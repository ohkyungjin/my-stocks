'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Slider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { StrategyParameters } from '@/lib/types/api';

interface ParameterControlProps {
  strategyName: string;
  parameters: StrategyParameters;
  onSave?: (params: StrategyParameters) => Promise<void>;
  loading?: boolean;
}

// Parameter configurations with validation
const parameterConfig = {
  lookback_months: {
    label: 'Lookback Period (개월)',
    description: '과거 데이터 분석 기간',
    min: 1,
    max: 24,
    step: 1,
    default: 6,
    unit: '개월',
  },
  resistance_range: {
    label: 'Resistance Range (%)',
    description: '저항선 범위 허용 오차',
    min: 0.5,
    max: 10.0,
    step: 0.5,
    default: 3.0,
    unit: '%',
  },
  min_trading_value: {
    label: 'Minimum Trading Value',
    description: '최소 거래대금 필터',
    min: 10000000,
    max: 10000000000000,
    step: 100000000,
    default: 100000000,
    unit: '원',
  },
  same_day_surge_threshold: {
    label: 'Same Day Surge Filter (%)',
    description: '전일 대비 또는 저항선 대비 급등 종목 제외 (0 = 비활성화)',
    min: 0,
    max: 20,
    step: 1,
    default: 5,
    unit: '%',
  },
};

export function ParameterControl({
  strategyName,
  parameters,
  onSave,
  loading = false,
}: ParameterControlProps) {
  const [localParams, setLocalParams] = useState<StrategyParameters>(
    parameters || {
      lookback_months: parameterConfig.lookback_months.default,
      resistance_range: parameterConfig.resistance_range.default,
      min_trading_value: parameterConfig.min_trading_value.default,
      same_day_surge_threshold: parameterConfig.same_day_surge_threshold.default,
    }
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local params when parameters prop changes
  useEffect(() => {
    if (parameters) {
      setLocalParams(parameters);
    }
  }, [parameters]);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(localParams) !== JSON.stringify(parameters);
    setHasChanges(changed);
  }, [localParams, parameters]);

  const handleReset = () => {
    setLocalParams(parameters);
    setHasChanges(false);
    setError(null);
  };

  const handleResetToDefault = () => {
    const defaultParams: StrategyParameters = {
      lookback_months: parameterConfig.lookback_months.default,
      resistance_range: parameterConfig.resistance_range.default,
      min_trading_value: parameterConfig.min_trading_value.default,
      same_day_surge_threshold: parameterConfig.same_day_surge_threshold.default,
    };
    setLocalParams(defaultParams);
    setError(null);
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setError(null);
      await onSave(localParams);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파라미터 저장 실패');
    }
  };

  const updateParameter = (key: keyof StrategyParameters, value: number) => {
    setLocalParams((prev) => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SettingsIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>
                전략 파라미터 조정
              </Typography>
            </Stack>
            {hasChanges && (
              <Chip
                label="변경됨"
                size="small"
                color="warning"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          {/* Success Message */}
          {saveSuccess && (
            <Alert severity="success" onClose={() => setSaveSuccess(false)}>
              파라미터가 성공적으로 저장되었습니다.
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Lookback Months */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {parameterConfig.lookback_months.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {parameterConfig.lookback_months.description}
            </Typography>
            <Box sx={{ px: 1, mt: 2 }}>
              <Slider
                value={localParams.lookback_months}
                onChange={(_, value) => updateParameter('lookback_months', value as number)}
                min={parameterConfig.lookback_months.min}
                max={parameterConfig.lookback_months.max}
                step={parameterConfig.lookback_months.step}
                marks
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}개월`}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.disabled">
                최소: {parameterConfig.lookback_months.min}{parameterConfig.lookback_months.unit}
              </Typography>
              <Typography variant="caption" className="font-mono" fontWeight={600}>
                현재: {localParams.lookback_months}{parameterConfig.lookback_months.unit}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                최대: {parameterConfig.lookback_months.max}{parameterConfig.lookback_months.unit}
              </Typography>
            </Box>
          </Box>

          {/* Resistance Range */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {parameterConfig.resistance_range.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {parameterConfig.resistance_range.description}
            </Typography>
            <Box sx={{ px: 1, mt: 2 }}>
              <Slider
                value={localParams.resistance_range}
                onChange={(_, value) => updateParameter('resistance_range', value as number)}
                min={parameterConfig.resistance_range.min}
                max={parameterConfig.resistance_range.max}
                step={parameterConfig.resistance_range.step}
                marks={[
                  { value: 0.5, label: '0.5%' },
                  { value: 3, label: '3%' },
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' },
                ]}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.disabled">
                엄격: {parameterConfig.resistance_range.min}{parameterConfig.resistance_range.unit}
              </Typography>
              <Typography variant="caption" className="font-mono" fontWeight={600}>
                현재: {localParams.resistance_range}{parameterConfig.resistance_range.unit}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                관대: {parameterConfig.resistance_range.max}{parameterConfig.resistance_range.unit}
              </Typography>
            </Box>
          </Box>

          {/* Minimum Trading Value */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {parameterConfig.min_trading_value.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {parameterConfig.min_trading_value.description}
            </Typography>
            <TextField
              type="number"
              value={localParams.min_trading_value}
              onChange={(e) => updateParameter('min_trading_value', parseInt(e.target.value) || 0)}
              fullWidth
              inputProps={{
                min: parameterConfig.min_trading_value.min,
                max: parameterConfig.min_trading_value.max,
                step: parameterConfig.min_trading_value.step,
              }}
              InputProps={{
                endAdornment: <Typography color="text.secondary">원</Typography>,
              }}
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              권장 범위: {(() => {
                const formatValue = (value: number) => {
                  if (value >= 1000000000000) {
                    const jo = value / 1000000000000;
                    return jo % 1 === 0 ? `${jo.toFixed(0)}조원` : `${jo.toFixed(1)}조원`;
                  }
                  if (value >= 100000000000) return `${(value / 100000000000).toFixed(0)}천억원`;
                  if (value >= 10000000000) return `${(value / 10000000000).toFixed(0)}백억원`;
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}십억원`;
                  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억원`;
                  return `${value.toLocaleString()}원`;
                };
                const min = parameterConfig.min_trading_value.min;
                const max = parameterConfig.min_trading_value.max;
                return `${formatValue(min)} ~ ${formatValue(max)}`;
              })()}
            </Typography>
          </Box>

          {/* Same Day Surge Filter */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {parameterConfig.same_day_surge_threshold.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {parameterConfig.same_day_surge_threshold.description}
            </Typography>
            <Box sx={{ px: 1, mt: 2 }}>
              <Slider
                value={localParams.same_day_surge_threshold}
                onChange={(_, value) => updateParameter('same_day_surge_threshold', value as number)}
                min={parameterConfig.same_day_surge_threshold.min}
                max={parameterConfig.same_day_surge_threshold.max}
                step={parameterConfig.same_day_surge_threshold.step}
                marks
                valueLabelDisplay="on"
                valueLabelFormat={(value) => value === 0 ? '비활성화' : `${value}%`}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.disabled">
                비활성화 (0%)
              </Typography>
              <Typography variant="caption" className="font-mono" fontWeight={600}>
                현재: {localParams.same_day_surge_threshold === 0 ? '비활성화' : `${localParams.same_day_surge_threshold}%`}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                엄격: {parameterConfig.same_day_surge_threshold.max}{parameterConfig.same_day_surge_threshold.unit}
              </Typography>
            </Box>
          </Box>

          {/* Impact Info */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              backgroundColor: 'action.hover',
              borderLeft: '3px solid',
              borderColor: 'warning.main',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="warning.main" gutterBottom display="block">
              ⚠️ 파라미터 변경 영향
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              • <strong>Lookback Period 증가</strong>: 더 긴 과거 데이터 분석, 시그널 감소 가능<br />
              • <strong>Resistance Range 증가</strong>: 더 많은 시그널 생성, 정확도 감소 가능<br />
              • <strong>Min Volume 증가</strong>: 유동성 높은 종목만 필터링, 시그널 감소<br />
              • <strong>Same Day Surge 증가</strong>: 당일 급등 종목 더 많이 제외, 시그널 감소
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleResetToDefault}
              disabled={loading}
              fullWidth
            >
              기본값 복원
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasChanges || loading}
              fullWidth
            >
              취소
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!hasChanges || loading}
              fullWidth
            >
              {loading ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
