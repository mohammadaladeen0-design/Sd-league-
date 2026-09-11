// Phase 1 hand-authored types matching supabase/schema.sql.
// Once the Supabase CLI is available, regenerate with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.types.ts

export type UserRole = "user" | "moderator" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          role: UserRole;
          is_email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          role?: UserRole;
          is_email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          // Client-side updates are restricted to these two fields, matching
          // the database GRANT (see supabase/schema.sql, section 6b) and the
          // enforce_profile_update_restrictions trigger, which is the real
          // security boundary — this type just keeps the app code honest
          // about what will actually succeed against the database.
          // role, is_email_verified, email, id, and created_at are
          // deliberately NOT writable here; a future admin-only code path
          // (Phase 2+, running under service_role) will need its own
          // separate type rather than widening this one.
          username?: string;
          avatar_url?: string | null;
        };
      };
    };
  };
}
