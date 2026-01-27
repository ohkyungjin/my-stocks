'use client';

import { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { StrategyParameters } from '@/lib/types/api';
import {
  parameterConfig,
  strategyParameters,
  formatTradingValue,
} from './strategyParameterConfig';

interface StrategyParameterEditorProps {
  strategyName: string;
  parameters: StrategyParameters;
  onParametersChange: (params: StrategyParameters) => void;
  onResetToDefault: () => void;
  onRun: () => void;
  runLoading: boolean;
  saveSuccess: boolean;
}

export function StrategyParameterEditor({
  strategyName,
  parameters,
  onParametersChange,
  onResetToDefault,
  onRun,
  runLoading,
  saveSuccess,
}: StrategyParameterEditorProps) {
  // Filter parameters based on strategy
  const relevantParams = useMemo(() => {
    return strategyParameters[strategyName] || [];
  }, [strategyName]);

  const updateParameter = (key: keyof StrategyParameters, value: number | boolean) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '4px',
        bgcolor: 'rgba(10,10,12,0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Stack spacing={2.5}>
        {/* Header with Run Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            전략 파라미터 & 실행
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
              onClick={onResetToDefault}
              disabled={runLoading}
              sx={{
                borderRadius: '2px',
                textTransform: 'none',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                fontSize: '0.7rem',
                py: 0.6,
                px: 1.5,
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                '&:hover': {
                  borderColor: '#FF006E',
                  bgcolor: 'rgba(255,0,110,0.05)',
                  color: '#FF006E',
                },
                '&:disabled': {
                  borderColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.2)',
                }
              }}
            >
              기본값
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={runLoading ? <CircularProgress size={16} sx={{ color: '#000000' }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
              onClick={onRun}
              disabled={runLoading}
              sx={{
                borderRadius: '2px',
                textTransform: 'none',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                fontSize: '0.7rem',
                py: 0.6,
                px: 1.5,
                bgcolor: '#00FF41',
                color: '#000000',
                '&:hover': {
                  bgcolor: '#00CC35',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              {runLoading ? '실행 중...' : '전략 실행'}
            </Button>
          </Box>
        </Box>

        {/* Parameters Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {relevantParams.map((paramKey) => {
            const config = parameterConfig[paramKey];
            if (!config) return null;

            const paramValue = (parameters as any)[paramKey];

            // Boolean parameter (Switch)
            if (config.type === 'boolean') {
              return (
                <Box
                  key={paramKey}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '280px',
                    p: 2,
                    borderRadius: '2px',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          mb: 0.5,
                        }}
                      >
                        {config.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.65rem',
                          color: 'rgba(255,255,255,0.4)',
                          lineHeight: 1.4,
                        }}
                      >
                        {config.description}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={paramValue ?? config.default}
                          onChange={(e) => updateParameter(paramKey as keyof StrategyParameters, e.target.checked)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00FF41',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              bgcolor: '#00FF41',
                            }
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.7rem',
                            color: paramValue ? '#00FF41' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {paramValue ? '활성' : '비활성'}
                        </Typography>
                      }
                      labelPlacement="start"
                    />
                  </Box>
                </Box>
              );
            }

            const currentValue = paramValue ?? config.default;

            // Input parameter (TextField)
            if (config.type === 'input') {
              return (
                <Box
                  key={paramKey}
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: '280px',
                    p: 2,
                    borderRadius: '2px',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                      }}
                    >
                      {config.label}
                    </Typography>
                    <Chip
                      label={
                        paramKey === 'min_trading_value'
                          ? formatTradingValue(currentValue)
                          : `${currentValue}${config.unit}`
                      }
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0,255,65,0.1)',
                        color: '#00FF41',
                        border: '1px solid rgba(0,255,65,0.3)',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        height: 22,
                        borderRadius: '2px',
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.65rem',
                      color: 'rgba(255,255,255,0.4)',
                      mb: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {config.description}
                  </Typography>
                  <TextField
                    type="number"
                    value={currentValue}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || (config.default as number);
                      updateParameter(paramKey as keyof StrategyParameters, value);
                    }}
                    size="small"
                    fullWidth
                    inputProps={{
                      min: config.min,
                      max: config.max,
                      step: config.step,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Typography
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {config.unit}
                        </Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRadius: '2px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.8rem',
                        color: '#FFFFFF',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0,255,65,0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FF41',
                        }
                      }
                    }}
                  />
                </Box>
              );
            }

            // Numeric parameter (Slider)
            return (
              <Box
                key={paramKey}
                sx={{
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: '280px',
                  p: 2,
                  borderRadius: '2px',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    {config.label}
                  </Typography>
                  <Chip
                    label={
                      paramKey === 'same_day_surge_threshold' && currentValue === 0
                        ? '비활성화'
                        : paramKey === 'min_trading_value'
                        ? formatTradingValue(currentValue)
                        : paramKey === 'max_upper_shadow_ratio' || paramKey === 'max_lower_shadow_ratio'
                        ? `${(currentValue * 100).toFixed(0)}%`
                        : `${currentValue}${config.unit}`
                    }
                    size="small"
                    sx={{
                      bgcolor: paramKey === 'same_day_surge_threshold' && currentValue === 0
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,255,65,0.1)',
                      color: paramKey === 'same_day_surge_threshold' && currentValue === 0
                        ? 'rgba(255,255,255,0.5)'
                        : '#00FF41',
                      border: '1px solid',
                      borderColor: paramKey === 'same_day_surge_threshold' && currentValue === 0
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,255,65,0.3)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      height: 22,
                      borderRadius: '2px',
                    }}
                  />
                </Box>
                <Box sx={{ px: 1.5, pt: 1 }}>
                  <Slider
                    value={currentValue}
                    onChange={(_, value) => updateParameter(paramKey as keyof StrategyParameters, value as number)}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    marks={paramKey === 'lookback_months' || paramKey === 'same_day_surge_threshold' || paramKey === 'min_trading_value'}
                    valueLabelDisplay="auto"
                    valueLabelFormat={
                      config.valueLabelFormat
                        ? config.valueLabelFormat
                        : paramKey === 'same_day_surge_threshold'
                        ? (value) => (value === 0 ? '비활성화' : `${value}%`)
                        : paramKey === 'min_trading_value'
                        ? (value) => formatTradingValue(value)
                        : undefined
                    }
                    size="small"
                    sx={{
                      color: '#00FF41',
                      '& .MuiSlider-thumb': {
                        bgcolor: '#00FF41',
                        border: '2px solid #000000',
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(0,255,65,0.16)',
                        }
                      },
                      '& .MuiSlider-track': {
                        bgcolor: '#00FF41',
                        border: 'none',
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                      '& .MuiSlider-mark': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                      '& .MuiSlider-valueLabel': {
                        bgcolor: '#00FF41',
                        color: '#000000',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Status Messages */}
        {saveSuccess && (
          <Alert
            severity="success"
            sx={{
              py: 0.5,
              bgcolor: 'rgba(0,255,65,0.05)',
              border: '1px solid rgba(0,255,65,0.2)',
              color: '#00FF41',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              borderRadius: '2px',
            }}
          >
            파라미터 저장됨
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
