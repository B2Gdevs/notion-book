export enum IntegrationSystem {
  OTTER = "OTTER",
  CLERK = "CLERK",
  STRIPE = "STRIPE",
}

export interface OAuthTokenInfo {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string; // Assuming you'll handle the date as a string in TypeScript
  scope: string;
  created_by_user_id: string;
}

export interface Integration {
  id?: string | null;
  name: string;
  access_token?: string | null;
  access_token_expiration_date?: string | null;
  client_cred_scope?: string | null;
  oauth_token_info?: OAuthTokenInfo | null; // Made optional and nullable to align with Python's use of Optional
  org_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}