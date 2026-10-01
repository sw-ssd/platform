import { Code, ConnectError } from "@connectrpc/connect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { queryClient } from "./query";

const originalLocation = window.location;
const mockAssign = vi.fn();

beforeEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...originalLocation, assign: mockAssign },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: originalLocation,
  });
  mockAssign.mockClear();
});

describe("query cache", () => {
  it("AUTH-4001 (Unauthenticated) 觸發導回 /login", () => {
    queryClient.getQueryCache().config.onError?.(
      new ConnectError("未登入", Code.Unauthenticated),
      { queryKey: ["test"] } as never,
    );
    expect(mockAssign).toHaveBeenCalledWith("/login");
  });

  it("非 Unauthenticated 錯誤不導向登入頁", () => {
    queryClient.getQueryCache().config.onError?.(
      new ConnectError("內部錯誤", Code.Internal),
      { queryKey: ["test"] } as never,
    );
    expect(mockAssign).not.toHaveBeenCalled();
  });
});
