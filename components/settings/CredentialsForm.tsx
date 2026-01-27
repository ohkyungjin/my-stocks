'use client';

/**
 * Credentials Form Component
 *
 * 사용자별 API 키 및 자격증명 입력/수정 폼
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  CredentialsFormData,
  CredentialsMaskedResponse,
} from '@/types/credentials';
import {
  getCredentials,
  createCredentials,
  updateCredentials,
} from '@/lib/api/credentials';

interface CredentialsFormProps {
  onSaveSuccess?: () => void;
}

export default function CredentialsForm({ onSaveSuccess }: CredentialsFormProps) {
  const [formData, setFormData] = useState<CredentialsFormData>({
    kis_app_key: '',
    kis_app_secret: '',
    kis_account_no: '',
    kis_account_product_code: '01',
    kis_is_real: false,
    telegram_bot_token: '',
    telegram_chat_id: '',
    telegram_enabled: false,
    openai_api_key: '',
    openai_enabled: false,
  });

  const [existingCredentials, setExistingCredentials] =
    useState<CredentialsMaskedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 비밀번호 표시 상태
  const [showKisAppKey, setShowKisAppKey] = useState(false);
  const [showKisAppSecret, setShowKisAppSecret] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  // 초기 로드
  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCredentials();
      setExistingCredentials(data);

      // 마스킹되지 않은 값들만 폼에 설정
      setFormData({
        kis_app_key: '', // 마스킹됨
        kis_app_secret: '', // 마스킹됨
        kis_account_no: data.kis_account_no || '',
        kis_account_product_code: data.kis_account_product_code || '01',
        kis_is_real: data.kis_is_real || false,
        telegram_bot_token: '', // 마스킹됨
        telegram_chat_id: data.telegram_chat_id || '',
        telegram_enabled: data.telegram_enabled || false,
        openai_api_key: '', // 마스킹됨
        openai_enabled: data.openai_enabled || false,
      });
    } catch (err: any) {
      if (err.status === 404) {
        // 자격증명이 없음 - 신규 생성
        setExistingCredentials(null);
      } else {
        setError(err.message || '자격증명을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CredentialsFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // 빈 문자열을 null로 변환 (선택적 필드)
      const payload = {
        kis_app_key: formData.kis_app_key || null,
        kis_app_secret: formData.kis_app_secret || null,
        kis_account_no: formData.kis_account_no || null,
        kis_account_product_code: formData.kis_account_product_code,
        kis_is_real: formData.kis_is_real,
        telegram_bot_token: formData.telegram_bot_token || null,
        telegram_chat_id: formData.telegram_chat_id || null,
        telegram_enabled: formData.telegram_enabled,
        openai_api_key: formData.openai_api_key || null,
        openai_enabled: formData.openai_enabled,
      };

      if (existingCredentials) {
        // 수정
        await updateCredentials(payload);
        setSuccess('자격증명이 성공적으로 수정되었습니다.');
      } else {
        // 생성
        await createCredentials(payload);
        setSuccess('자격증명이 성공적으로 저장되었습니다.');
      }

      // 다시 로드하여 마스킹된 상태 확인
      await loadCredentials();

      // 부모 컴포넌트에 알림
      onSaveSuccess?.();

      // 민감한 정보 초기화 (보안)
      setFormData((prev) => ({
        ...prev,
        kis_app_key: '',
        kis_app_secret: '',
        telegram_bot_token: '',
        openai_api_key: '',
      }));
    } catch (err: any) {
      setError(err.message || '자격증명 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* 한국투자증권 API */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">한국투자증권 (KIS) API</Typography>
            {existingCredentials?.kis_app_key_set && (
              <Chip label="설정됨" color="success" size="small" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label="APP KEY"
              value={formData.kis_app_key}
              onChange={handleChange('kis_app_key')}
              type={showKisAppKey ? 'text' : 'password'}
              fullWidth
              placeholder={
                existingCredentials?.kis_app_key_set
                  ? '설정됨 (변경하려면 입력)'
                  : 'APP KEY 입력'
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowKisAppKey(!showKisAppKey)}
                      edge="end"
                    >
                      {showKisAppKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: existingCredentials?.kis_app_key_set ? (
                  <InputAdornment position="start">
                    <CheckCircleIcon color="success" fontSize="small" />
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="APP SECRET"
              value={formData.kis_app_secret}
              onChange={handleChange('kis_app_secret')}
              type={showKisAppSecret ? 'text' : 'password'}
              fullWidth
              placeholder={
                existingCredentials?.kis_app_secret_set
                  ? '설정됨 (변경하려면 입력)'
                  : 'APP SECRET 입력'
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowKisAppSecret(!showKisAppSecret)}
                      edge="end"
                    >
                      {showKisAppSecret ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: existingCredentials?.kis_app_secret_set ? (
                  <InputAdornment position="start">
                    <CheckCircleIcon color="success" fontSize="small" />
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="계좌번호"
              value={formData.kis_account_no}
              onChange={handleChange('kis_account_no')}
              fullWidth
              placeholder="12345678"
              helperText="8자리 계좌번호"
            />

            <TextField
              label="계좌상품코드"
              value={formData.kis_account_product_code}
              onChange={handleChange('kis_account_product_code')}
              fullWidth
              placeholder="01"
              helperText="기본값: 01"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.kis_is_real}
                  onChange={handleChange('kis_is_real')}
                  color="warning"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">실전투자 모드</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.kis_is_real
                      ? '⚠️ 실제 돈으로 거래합니다'
                      : '모의투자 (안전)'}
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* 텔레그램 봇 */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">텔레그램 알림</Typography>
            {existingCredentials?.telegram_bot_token_set && (
              <Chip label="설정됨" color="success" size="small" />
            )}
            {existingCredentials?.telegram_enabled && (
              <Chip label="활성화됨" color="primary" size="small" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.telegram_enabled}
                  onChange={handleChange('telegram_enabled')}
                  color="primary"
                />
              }
              label="텔레그램 알림 활성화"
            />

            <TextField
              label="봇 토큰"
              value={formData.telegram_bot_token}
              onChange={handleChange('telegram_bot_token')}
              type={showTelegramToken ? 'text' : 'password'}
              fullWidth
              placeholder={
                existingCredentials?.telegram_bot_token_set
                  ? '설정됨 (변경하려면 입력)'
                  : '123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
              }
              helperText="BotFather에서 받은 토큰"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowTelegramToken(!showTelegramToken)}
                      edge="end"
                    >
                      {showTelegramToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: existingCredentials?.telegram_bot_token_set ? (
                  <InputAdornment position="start">
                    <CheckCircleIcon color="success" fontSize="small" />
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="채팅 ID"
              value={formData.telegram_chat_id}
              onChange={handleChange('telegram_chat_id')}
              fullWidth
              placeholder="987654321"
              helperText="@userinfobot에서 확인 가능"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* OpenAI API */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">OpenAI API</Typography>
            {existingCredentials?.openai_api_key_set && (
              <Chip label="설정됨" color="success" size="small" />
            )}
            {existingCredentials?.openai_enabled && (
              <Chip label="활성화됨" color="primary" size="small" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.openai_enabled}
                  onChange={handleChange('openai_enabled')}
                  color="primary"
                />
              }
              label="OpenAI 기능 활성화"
            />

            <TextField
              label="API 키"
              value={formData.openai_api_key}
              onChange={handleChange('openai_api_key')}
              type={showOpenAIKey ? 'text' : 'password'}
              fullWidth
              placeholder={
                existingCredentials?.openai_api_key_set
                  ? '설정됨 (변경하려면 입력)'
                  : 'sk-...'
              }
              helperText="OpenAI Platform에서 발급"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      edge="end"
                    >
                      {showOpenAIKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: existingCredentials?.openai_api_key_set ? (
                  <InputAdornment position="start">
                    <CheckCircleIcon color="success" fontSize="small" />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* 저장 버튼 */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={isSaving}
          sx={{ minWidth: 200 }}
        >
          {isSaving
            ? '저장 중...'
            : existingCredentials
            ? '자격증명 수정'
            : '자격증명 저장'}
        </Button>
      </Box>

      {/* 보안 안내 */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>🔒 보안 안내</strong>
        </Typography>
        <Typography variant="caption" component="div">
          • 모든 민감한 정보는 암호화되어 저장됩니다.
          <br />
          • 설정된 값은 마스킹되어 표시되며, 변경 시에만 입력하면 됩니다.
          <br />
          • 브라우저를 닫으면 입력한 값은 메모리에서 제거됩니다.
          <br />• 이 정보는 본인만 조회할 수 있습니다.
        </Typography>
      </Alert>
    </Box>
  );
}
