Deployment steps for Vercel

1. Connect repository to Vercel
   - Push your project to GitHub/GitLab/Bitbucket.
   - On Vercel, "Add New Project" and import the repository.

2. Add Environment Variables (Project Settings → Environment Variables):
   - NEXT_PUBLIC_SUPABASE_URL = <your_supabase_url>
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = <your_anon_key>
   - SUPABASE_SERVICE_ROLE_KEY = <your_service_role_key>

   Note: Do NOT expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Vercel will keep it server-side.

3. Build & Output settings (usually automatic for Next.js):
   - Build Command: `npm run build`
   - Output Directory: (leave empty / default for Next.js)

4. Deploy
   - Trigger a deploy from Vercel UI or push to the connected repo branch.

5. Post-deploy checks
   - Visit the site URL and verify public pages and admin login.
   - Test `/api/packages` POST and GET from admin UI.

If your Supabase host is not reachable from Vercel, the API will fall back to local file storage in the project (`/data/packages.json`). For production persistence, ensure the Supabase project URL and keys are correct and reachable.
