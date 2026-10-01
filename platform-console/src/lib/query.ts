import { QueryCache, QueryClient } from "@tanstack/solid-query";
import { Code, ConnectError } from "@connectrpc/connect";

/**
 * 平台查詢的 QueryClient：**不重試**。
 *
 * 平台工具是 operator 的即時操作面：401/403 重試只會延後登入頁的出現，
 * 而平台寫入（收款、改方案）重試本身就有語意風險。要重試的是「使用者」，不是客戶端。
 *
 * 全域攔截 AUTH-4001（Unauthenticated）：路由守衛只在「進入頁面」時探針，若使用者在
 * 頁面停留期間 session 過期，後續查詢失敗應直接導回登入頁，而不是只顯示錯誤文案。
 */
const queryCache = new QueryCache({
  onError: (error) => {
    if (error instanceof ConnectError && error.code === Code.Unauthenticated) {
      window.location.assign("/login");
    }
  },
});

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: { queries: { retry: false } },
});
