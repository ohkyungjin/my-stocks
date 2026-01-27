/**
 * Mock Service Worker (MSW) setup
 *
 * Provides mocked API responses for testing
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

/**
 * Define mock handlers for API endpoints
 */
export const handlers = [
  // Authentication endpoints
  http.post('/api/v1/auth/login', async ({ request }) => {
    return HttpResponse.json(
      {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          is_active: true,
          is_superuser: false,
        },
      },
      { status: 200 }
    );
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    return HttpResponse.json(
      {
        user: {
          id: 2,
          username: 'newuser',
          email: 'new@example.com',
          is_active: true,
          is_superuser: false,
        },
      },
      { status: 201 }
    );
  }),

  http.post('/api/v1/auth/refresh', async ({ request }) => {
    return HttpResponse.json(
      {
        access_token: 'mock-new-access-token',
      },
      { status: 200 }
    );
  }),

  http.get('/api/v1/auth/me', async ({ request }) => {
    return HttpResponse.json(
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-01T00:00:00Z',
      },
      { status: 200 }
    );
  }),

  // Orders endpoints
  http.get('/api/v1/orders', async ({ request }) => {
    return HttpResponse.json(
      {
        orders: [
          {
            id: 1,
            user_id: 1,
            symbol: '005930',
            symbol_name: 'Samsung Electronics',
            order_price: 50000,
            quantity: 10,
            status: 'pending',
            monitoring_enabled: true,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
      { status: 200 }
    );
  }),

  // Realtime monitoring endpoints
  http.get('/api/realtime/monitoring/status', async ({ request }) => {
    return HttpResponse.json(
      {
        is_monitoring_active: false,
        last_started_at: null,
        last_stopped_at: '2024-01-01T00:00:00Z',
        active_orders_count: 0,
        active_positions_count: 0,
      },
      { status: 200 }
    );
  }),

  http.post('/api/realtime/monitoring/start', async ({ request }) => {
    return HttpResponse.json(
      {
        status: 'started',
        message: 'Real-time monitoring started',
      },
      { status: 200 }
    );
  }),

  http.post('/api/realtime/monitoring/stop', async ({ request }) => {
    return HttpResponse.json(
      {
        status: 'stopped',
        message: 'Real-time monitoring stopped',
      },
      { status: 200 }
    );
  }),

  http.get('/api/realtime/account/summary', async ({ request }) => {
    return HttpResponse.json(
      {
        account_no: '12345678-01',
        total_cash: 1000000,
        available_cash: 500000,
        holdings_value: 500000,
        total_value: 1000000,
        day_change: 50000,
        day_change_percent: 5.0,
      },
      { status: 200 }
    );
  }),
];

/**
 * Setup mock server
 * Used in tests and dev environment
 */
export const server = setupServer(...handlers);

/**
 * Enable mock server in tests
 */
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
