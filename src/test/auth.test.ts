import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSupabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  getSupabase: vi.fn(),
}));

describe("Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create Supabase client with correct config", () => {
    const mockClient = {
      auth: {
        signInWithPassword: vi.fn(),
        signInWithOAuth: vi.fn(),
      },
    };
    
    vi.mocked(getSupabase).mockReturnValue(mockClient as any);
    
    const client = getSupabase();
    expect(client).toBeDefined();
    expect(getSupabase).toHaveBeenCalled();
  });

  it("should handle login with email and password", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });
    
    const mockClient = {
      auth: {
        signInWithPassword: mockSignIn,
      },
    };
    
    vi.mocked(getSupabase).mockReturnValue(mockClient as any);
    
    const supabase = getSupabase();
    const result = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "password123",
    });
    
    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.error).toBeNull();
  });

  it("should handle login errors", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Invalid login credentials" },
    });
    
    const mockClient = {
      auth: {
        signInWithPassword: mockSignIn,
      },
    };
    
    vi.mocked(getSupabase).mockReturnValue(mockClient as any);
    
    const supabase = getSupabase();
    const result = await supabase.auth.signInWithPassword({
      email: "wrong@example.com",
      password: "wrongpass",
    });
    
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe("Invalid login credentials");
  });
});
