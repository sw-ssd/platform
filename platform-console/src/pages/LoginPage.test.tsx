import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { loginUrl } from "../lib/api";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("渲染 OIDC 登入連結，指向後端 loginUrl", () => {
    render(() => <LoginPage />);
    const link = screen.getByRole("link", { name: "以 Google 登入" });
    expect(link.getAttribute("href")).toBe(loginUrl);
  });
});
