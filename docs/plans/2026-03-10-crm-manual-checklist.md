# CRM Setup Manual Checklist

## Things Josh Needs to Do (Non-Code)

### Before Any Code

- [ ] **Ask Nick**: Does he have Google Workspace with his new domain, or just basic email hosting?
  - If Google Workspace: his business email IS his OAuth identity (e.g., `nick@trinityremodelingdfw.com`)
  - If no Google Workspace: use his personal Gmail for CRM login
  - **Do NOT create a Google account on his behalf**
- [ ] **Send Nick the Supabase setup instructions** (see below)
- [ ] **Wait for Nick's Supabase invite** before proceeding with any backend work
- [ ] **Ask Nick for his preferred notification email** (where lead alerts should go)

### After Nick Completes His Steps

- [ ] **Accept the Supabase org invite** from Nick's email
- [ ] **Create the Supabase project** inside Nick's organization
  - Project name: `trinity-remodeling-crm` (or similar)
  - Region: East US 1 (closest to DFW)
  - Generate and save the database password securely
- [ ] **Run the database migration** (schema, RLS, functions)
- [ ] **Configure Google OAuth in Supabase dashboard**
  - Authentication > Providers > Google
  - Create OAuth credentials in Google Cloud Console
  - Paste Client ID + Secret into Supabase
  - Add callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
- [ ] **Set up Resend for email notifications**
  - Verify Nick's domain in your Resend account
  - Send Nick the DNS records he needs to add (SPF, DKIM, DMARC)
  - Test email delivery after DNS propagation
- [ ] **Have Nick create a Vercel account** (send him those instructions too)
  - Or: create a Vercel team, invite Nick as owner, deploy there

### DNS Records Nick Needs to Add (You Provide These)

- [ ] **Resend domain verification** (SPF, DKIM, DMARC records)
  - You get these from Resend dashboard after adding his domain
  - Send Nick exact records with instructions for his registrar

### Post-Deployment

- [ ] **Test the full flow end-to-end**:
  - [ ] Submit a test lead via contact form
  - [ ] Verify lead appears in Supabase
  - [ ] Verify Nick receives email notification
  - [ ] Log into CRM via Google OAuth
  - [ ] Verify lead shows in dashboard and pipeline
  - [ ] Test lead actions (update status, add activity, etc.)
- [ ] **Set up a backup admin email** (e.g., `backup@trinityremodelingdfw.com`)
- [ ] **Create the "break glass" document** for Nick:
  - List every service, account, and how to access it
  - Store in a shared Google Doc or PDF
- [ ] **Review session expiry** in Supabase (set to 8 hours max)
- [ ] **Add Cloudflare Turnstile** to contact form (free CAPTCHA)
- [ ] **Confirm Supabase plan** — free tier works to start, Pro ($25/mo) for backups

---

## Transfer Checklist (For Someday)

When the relationship ends:

| Service | Owner | Transfer Action |
|---------|-------|-----------------|
| Supabase | Nick | Remove Josh from org |
| Vercel | Nick | Remove Josh from team |
| Resend | Josh | Create Nick's account, re-verify domain, swap API key |
| GitHub Repo | Josh | Fork/duplicate to Nick's GitHub |
| Domain/DNS | Nick | Already his |
| Google OAuth | Nick | Already his |
