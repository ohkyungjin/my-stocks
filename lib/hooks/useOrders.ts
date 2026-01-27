'use client';

import { useState, useEffect } from 'react';
import type { Order, UpdateOrderRequest, BulkUpdateOrdersRequest } from '@/lib/types/api';
import { apiClient } from '@/lib/api/client';

// Re-export types for convenience
export type { UpdateOrderRequest, BulkUpdateOrdersRequest };

/**
 * 예약 주문 목록 조회
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<Order[]>('/api/v1/orders/scheduled');
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주문을 가져오는데 실패했습니다');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * 개별 주문 수정
   */
  const updateOrder = async (orderId: number, request: UpdateOrderRequest) => {
    setIsUpdating(true);
    try {
      const updatedOrder = await apiClient.put<Order>(`/api/v1/orders/${orderId}`, request);

      // 로컬 상태 업데이트 (전체 리프레시 없이)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 일괄 주문 수정
   */
  const bulkUpdateOrders = async (request: BulkUpdateOrdersRequest) => {
    setIsUpdating(true);
    try {
      const result = await apiClient.post('/api/v1/orders/bulk-update', request);

      // 전체 리프레시 (일괄 수정은 복잡해서 전체 새로고침)
      await fetchOrders();

      return result;
    } catch (error) {
      console.error('Failed to bulk update orders:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 주문 취소
   */
  const cancelOrder = async (orderId: number) => {
    setIsUpdating(true);
    try {
      const result = await apiClient.post(`/api/v1/orders/${orderId}/cancel`);

      await fetchOrders(); // 목록 갱신
      return result;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    orders,
    isLoading,
    isUpdating,
    error,
    updateOrder,
    bulkUpdateOrders,
    cancelOrder,
    mutate: fetchOrders,
  };
}
