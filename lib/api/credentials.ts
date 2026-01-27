/**
 * Credentials API Client
 *
 * 사용자별 API 키 및 자격증명 관리 API
 */

import { apiClient } from './client';
import {
  CredentialsCreate,
  CredentialsUpdate,
  CredentialsResponse,
  CredentialsMaskedResponse,
} from '@/types/credentials';

/**
 * 자격증명 API 엔드포인트
 */
const CREDENTIALS_ENDPOINT = '/api/v1/auth/credentials';

/**
 * 자격증명 생성
 *
 * @param data 자격증명 데이터
 * @returns 생성된 자격증명 (마스킹)
 */
export async function createCredentials(
  data: CredentialsCreate
): Promise<CredentialsMaskedResponse> {
  return apiClient.post<CredentialsMaskedResponse>(CREDENTIALS_ENDPOINT, data);
}

/**
 * 자격증명 조회 (마스킹)
 *
 * @returns 사용자 자격증명 (민감한 정보는 마스킹됨)
 */
export async function getCredentials(): Promise<CredentialsMaskedResponse> {
  return apiClient.get<CredentialsMaskedResponse>(CREDENTIALS_ENDPOINT);
}

/**
 * 자격증명 조회 (복호화)
 *
 * ⚠️ 보안 주의: 이 함수는 민감한 정보를 반환합니다.
 * - HTTPS를 사용하세요
 * - 응답을 로그에 남기지 마세요
 * - 메모리에서 즉시 제거하세요
 *
 * @returns 사용자 자격증명 (복호화된 값)
 */
export async function getCredentialsDecrypted(): Promise<CredentialsResponse> {
  return apiClient.get<CredentialsResponse>(`${CREDENTIALS_ENDPOINT}/decrypted`);
}

/**
 * 자격증명 수정
 *
 * @param data 수정할 자격증명 데이터 (부분 업데이트 가능)
 * @returns 수정된 자격증명 (마스킹)
 */
export async function updateCredentials(
  data: CredentialsUpdate
): Promise<CredentialsMaskedResponse> {
  return apiClient.put<CredentialsMaskedResponse>(CREDENTIALS_ENDPOINT, data);
}

/**
 * 자격증명 삭제
 *
 * @returns void (204 No Content)
 */
export async function deleteCredentials(): Promise<void> {
  return apiClient.delete<void>(CREDENTIALS_ENDPOINT);
}

/**
 * 자격증명 존재 여부 확인
 *
 * @returns 자격증명 존재 여부
 */
export async function checkCredentialsExist(): Promise<boolean> {
  try {
    await getCredentials();
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}
