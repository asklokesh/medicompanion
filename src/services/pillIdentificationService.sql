
-- Create a stored procedure for inserting user activity
-- This allows us to insert records without needing to add the table to the TypeScript types
CREATE OR REPLACE FUNCTION public.insert_user_activity(
  activity_type TEXT,
  user_id UUID DEFAULT NULL,
  query TEXT DEFAULT NULL,
  found_results BOOLEAN DEFAULT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_activity (
    activity_type, 
    user_id, 
    query, 
    found_results, 
    timestamp
  ) VALUES (
    activity_type, 
    user_id, 
    query, 
    found_results, 
    timestamp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the anonymous role to call this function
GRANT EXECUTE ON FUNCTION public.insert_user_activity TO anon;
GRANT EXECUTE ON FUNCTION public.insert_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_user_activity TO service_role;
