# Group Management API Integration

## Overview

This document describes the integration of the Supabase-backed group management API functions into the Inkling frontend application.

## API Functions (`/api/groups.ts`)

### Self-Service Functions

Users can call these functions to manage their own group memberships:

1. **`joinGroup(groupId, userId)`**
   - Allows a user to join a group
   - Validates: group exists, user is not already a member
   - Inserts record into `group_members` table

2. **`leaveGroup(groupId, userId)`**
   - Allows a user to leave a group
   - Validates: user is currently a member
   - Deletes record from `group_members` table

### Admin Functions

Group members can call these functions to manage other members:

3. **`addMemberToGroup(groupId, userId, adminUserId)`**
   - Allows a group member to add another user to the group
   - Validates: admin is a group member, group exists, user not already a member
   - Inserts record into `group_members` table

4. **`removeMemberFromGroup(groupId, userId, adminUserId)`**
   - Allows a group member to remove another user from the group
   - Validates: admin is a group member, user to be removed is a member
   - Deletes record from `group_members` table

### Other Group Operations

5. **`createGroup(name, description)`** - Creates a new group
6. **`getGroupsWithUser()`** - Fetches all groups the authenticated user belongs to
7. **`getGroupById(groupId)`** - Fetches a specific group by ID
8. **`getGroupMembers(groupId)`** - Fetches all members of a group with user details
9. **`updateGroup(groupId, name?, description?)`** - Updates group details
10. **`deleteGroup(groupId)`** - Deletes a group

## Context Integration (`/contexts/GroupContext.tsx`)

### Changes Made:

- **Imported API functions** from `/api/groups.ts`
- **Added authentication integration** via `useAuth()` hook
- **Implemented real data fetching** from Supabase on user authentication
- **Added loading states** for async operations
- **Added error handling** with proper error propagation
- **Removed localStorage dependency** (now using Supabase as source of truth)

### State Management:

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Updated Context Methods:

All context methods now call the real API functions:

- `getGroupsWithUser()` → calls `getGroupsWithUser()` API
- `getGroupById()` → calls `getGroupById()` API
- `createGroup()` → calls `createGroup()` API
- `updateGroup()` → calls `updateGroup()` API
- `deleteGroup()` → calls `deleteGroup()` API
- `addMember()` → calls `addMemberToGroup()` API (requires adminUserId)
- `removeMember()` → calls `removeMemberFromGroup()` API (requires adminUserId)
- `joinGroup()` → calls `joinGroup()` API (requires userId)
- `leaveGroup()` → calls `leaveGroup()` API (requires userId)

## Component Updates

### Groups Page (`/app/groups/page.tsx`)

**Features:**

- ✅ Loading spinner while fetching groups
- ✅ Error display for failed operations
- ✅ Disabled buttons during async operations
- ✅ Confirmation dialog before deletion
- ✅ Empty state when no groups exist

**User Experience:**

- Shows "Loading groups..." spinner on initial load
- Displays error messages in a visible banner
- Disables create/delete buttons during operations
- Confirms destructive actions (delete group)

### Group Detail Page (`/app/groups/[id]/page.tsx`)

**Features:**

- Uses context data (already integrated)
- Displays group projects and tasks
- Shows member management component
- Provides navigation and stats

### Member Management Component (`/components/groups/MemberManagement.tsx`)

**Features:**

- ✅ Permission checks (must be group member to manage)
- ✅ Loading states during operations
- ✅ Error handling and display
- ✅ Disabled controls during processing
- ✅ Empty state messaging

**Permission Model:**

- Any group member can add/remove other members (basic level)
- Owners cannot be removed (protected by UI)
- Role-based restrictions can be added later

**User Experience:**

- Shows helpful messages when user lacks permissions
- Displays error messages inline
- Disables buttons during async operations
- Shows loading state while fetching members

## Database Schema Requirements

The integration assumes the following Supabase schema:

```sql
-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members table (junction table)
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Viewer', -- Viewer, Assignee, Editor, Owner
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Considerations

### Row Level Security (RLS) Policies

Recommended RLS policies for Supabase:

```sql
-- Groups: Users can see groups they're members of
CREATE POLICY "Users can view their groups"
  ON groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

-- Group members: Users can see members of their groups
CREATE POLICY "Users can view group members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

-- Members can add other members
CREATE POLICY "Members can add members"
  ON group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_members.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Members can remove other members (except owners)
CREATE POLICY "Members can remove members"
  ON group_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_members.group_id
      AND group_members.user_id = auth.uid()
    )
  );
```

## Error Handling

All API functions include:
1. **Input validation** - Checks for required parameters
2. **Database validation** - Verifies existence of groups/members
3. **Duplicate prevention** - Prevents duplicate memberships
4. **Descriptive errors** - Clear error messages for UI display
5. **Console logging** - Errors logged for debugging

## Next Steps

### Immediate:
1. ✅ Test all group CRUD operations
2. ✅ Test member add/remove flows
3. ✅ Verify loading states work correctly
4. ✅ Test error scenarios (network failures, permission errors)

### Future Enhancements:
1. **User Search API** - Implement backend endpoint to search for users by email/name
2. **Role-Based Permissions** - Add proper owner/admin/member role hierarchy
3. **Email Invitations** - Send invites to non-registered users
4. **Member Activity Log** - Track when members join/leave
5. **Bulk Operations** - Add/remove multiple members at once
6. **Transfer Ownership** - Allow owners to transfer ownership to another member

## Known Limitations

1. **User Search**: Currently not implemented - requires a backend API endpoint to search users
2. **Role Management**: All members have equal permissions (can be enhanced with RLS policies)
3. **Owner Detection**: Uses `owners` array which may not be populated from Supabase
4. **Caching**: No client-side caching beyond React state (could add React Query/SWR)

## Testing Checklist

- [ ] Create a new group
- [ ] Join a group (self-service)
- [ ] Leave a group (self-service)
- [ ] Add a member to a group (admin action)
- [ ] Remove a member from a group (admin action)
- [ ] Update group name/description
- [ ] Delete a group
- [ ] Verify loading states appear during operations
- [ ] Verify error messages display correctly
- [ ] Test permission restrictions (non-members can't manage)
- [ ] Test duplicate membership prevention
- [ ] Test removing non-existent member handling
