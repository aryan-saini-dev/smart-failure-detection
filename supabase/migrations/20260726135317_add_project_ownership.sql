ALTER TABLE public.projects
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

CREATE INDEX projects_user_id_created_at_idx ON public.projects (user_id, created_at DESC);

REVOKE ALL ON public.projects FROM anon;
REVOKE UPDATE, DELETE ON public.projects FROM authenticated;
GRANT SELECT, INSERT ON public.projects TO authenticated;

DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);
