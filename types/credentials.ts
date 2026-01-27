/**
 * User Credentials Types
 *
 * 사용자별 API 키 및 자격증명 관리 타입 정의
 */

/**
 * 자격증명 기본 인터페이스
 */
export interface CredentialsBase {
  // KIS API
  kis_app_key?: string | null;
  kis_app_secret?: string | null;
  kis_account_no?: string | null;
  kis_account_product_code?: string;
  kis_is_real?: boolean;

  // Telegram
  telegram_bot_token?: string | null;
  telegram_chat_id?: string | null;
  telegram_enabled?: boolean;

  // OpenAI
  openai_api_key?: string | null;
  openai_enabled?: boolean;
}

/**
 * 자격증명 생성 요청
 */
export interface CredentialsCreate extends CredentialsBase {}

/**
 * 자격증명 수정 요청
 */
export interface CredentialsUpdate extends CredentialsBase {}

/**
 * 자격증명 응답 (복호화된 값)
 */
export interface CredentialsResponse extends CredentialsBase {
  id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 자격증명 응답 (마스킹된 값)
 */
export interface CredentialsMaskedResponse {
  id: number;
  user_id: number;

  // KIS API - 마스킹
  kis_app_key_set: boolean;
  kis_app_secret_set: boolean;
  kis_account_no?: string | null;
  kis_account_product_code?: string;
  kis_is_real?: boolean;

  // Telegram - 마스킹
  telegram_bot_token_set: boolean;
  telegram_chat_id?: string | null;
  telegram_enabled?: boolean;

  // OpenAI - 마스킹
  openai_api_key_set: boolean;
  openai_enabled?: boolean;

  created_at?: string;
  updated_at?: string;
}

/**
 * 자격증명 폼 데이터
 */
export interface CredentialsFormData {
  // KIS API
  kis_app_key: string;
  kis_app_secret: string;
  kis_account_no: string;
  kis_account_product_code: string;
  kis_is_real: boolean;

  // Telegram
  telegram_bot_token: string;
  telegram_chat_id: string;
  telegram_enabled: boolean;

  // OpenAI
  openai_api_key: string;
  openai_enabled: boolean;
}

/**
 * 자격증명 검증 오류
 */
export interface CredentialsValidationError {
  field: keyof CredentialsFormData;
  message: string;
}
