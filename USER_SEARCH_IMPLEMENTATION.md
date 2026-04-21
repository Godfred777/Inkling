# User Search Implementation Guide

## Overview
The user search functionality in the MemberManagement component now queries the Supabase `profiles` table to find users by name or email.

## Database Setup

### 1. Create Profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles USING btree (name);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles USING btree (email);
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (needed for member search)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (trigger on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 3. Create Trigger to Auto-Create Profile on Signup

```sql
-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## How It Works

### Search Query
The component uses this Supabase query:

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('id, email, name')
  .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
  .limit(10);
```

- **Case-insensitive search**: Uses `ilike` for case-insensitive matching
- **Partial matching**: `%` wildcards match any substring
- **Searches both fields**: Looks in both `name` and `email` columns
- **Limited results**: Returns max 10 users to keep UI clean
- **Debounced**: Waits 300ms after typing stops before searching

### Filtering
After fetching, the code filters out users who are already in the group:

```typescript
const groupMemberIds = new Set(group?.members.map(m => m.user.id) || []);
const filteredUsers = (data || []).filter(u => !groupMemberIds.has(u.id));
```

## User Experience

1. **User clicks "Add Member"** → Search panel opens
2. **User starts typing** → After 300ms, search query fires
3. **Loading state** → Shows spinner while searching
4. **Results display** → Shows matching users not already in group
5. **User clicks "Add"** → Adds selected user to group
6. **Error handling** → Shows error message if search fails

## Testing the Search

### Test Cases:
- ✅ Search by partial name (e.g., "john" finds "John Doe")
- ✅ Search by partial email (e.g., "gmail" finds "user@gmail.com")
- ✅ Case-insensitive (e.g., "JOHN" finds "john")
- ✅ No duplicates (filters out existing members)
- ✅ Empty state (shows "Type to search..." when no query)
- ✅ No results (shows "No users found" when query has no matches)
- ✅ Loading state (shows spinner during search)
- ✅ Error state (shows error message on failure)

## Troubleshooting

### "No users found" but users exist:
1. Check if `profiles` table has data:
   ```sql
   SELECT * FROM profiles;
   ```
2. Verify RLS policies allow reading profiles
3. Check browser console for errors

### Search returns error:
1. Verify Supabase URL and key are correct in `.env.local`
2. Check if `profiles` table exists
3. Verify RLS policies are set up correctly

### Users can't be added:
1. Check if user is already in the group (they're filtered out)
2. Verify `group_members` table has correct RLS policies
3. Check browser console for permission errors

## Performance Optimization

For large user bases (1000+ users):

1. **Add full-text search**:
   ```sql
   ALTER TABLE profiles ADD COLUMN search_vector tsvector;
   
   CREATE INDEX idx_profiles_search_vector ON profiles USING GIN (search_vector);
   
   CREATE OR REPLACE FUNCTION profiles_search_vector_update() RETURNS trigger AS $$
   BEGIN
     NEW.search_vector := to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.email, ''));
     RETURN NEW;
   END
   $$ LANGUAGE plpgsql;
   
   CREATE TRIGGER profiles_search_vector_update_trigger
     BEFORE INSERT OR UPDATE ON profiles
     FOR EACH ROW
     EXECUTE FUNCTION profiles_search_vector_update();
   ```

2. **Update search query**:
   ```typescript
   .textSearch('search_vector', searchQuery, {
     type: 'websearch',
     config: 'english'
   })
   ```

## Security Considerations

- **RLS enabled**: Only authenticated users can query profiles
- **Limited results**: Max 10 users returned per search
- **No sensitive data**: Only returns `id`, `email`, and `name`
- **Rate limiting**: Consider adding Supabase rate limits if needed

## Next Steps

1. ✅ Set up `profiles` table in Supabase
2. ✅ Configure RLS policies
3. ✅ Create signup trigger
4. ✅ Test search functionality
5. (Optional) Add avatar support
6. (Optional) Implement full-text search for large user bases
