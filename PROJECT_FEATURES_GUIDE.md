# Project Features Quick Reference

## Creating Projects

### Personal Project
1. Navigate to **Projects** → **New Project**
2. Leave "Group" dropdown as "No Group"
3. Enter project name and description
4. Click **Create Project**

### Group Project
1. Navigate to **Projects** → **New Project**
2. Select a group from the "Group" dropdown
3. Enter project name and description
4. Note: All group members will automatically have access
5. Click **Create Project**

## Viewing Projects

### Projects List
- **Search**: Use the search bar to find projects by name or description
- **Filter by Group**: Use the dropdown to show projects from specific groups
- **View Details**: Click on any project card to see details

### Project Details Page
Shows:
- Project stats (total tasks, in-progress, completed, at-risk)
- Task list with status and priority
- Team members (inherited from group if applicable)
- Project metadata (created date, last updated)
- AI Insights panel (when enabled)

## Permissions

### Project Creator
- ✅ View project
- ✅ Edit project details
- ✅ Delete project
- ✅ Manage tasks

### Group Owner (for group projects)
- ✅ View project
- ✅ Edit project details
- ✅ Delete project
- ✅ Manage tasks

### Group Members (for group projects)
- ✅ View project
- ✅ View tasks
- ❌ Cannot edit project details
- ❌ Cannot delete project

## API Functions

### Client-Side (via GroupContext)
```typescript
const { projects, createProject, updateProject, deleteProject } = useGroups();

// Create project
await createProject({
  name: 'My Project',
  description: 'Project description',
  groupId: 'optional-group-id' // omit for personal project
});

// Update project
await updateProject(projectId, {
  name: 'Updated Name',
  description: 'Updated description'
});

// Delete project
await deleteProject(projectId);
```

### Direct API Calls
```typescript
import { 
  createProject, 
  getProjectsByUser, 
  getProjectById,
  updateProject,
  deleteProject 
} from '@/api/projects';

// Get all user projects
const projects = await getProjectsByUser();

// Get projects from group membership
const groupProjects = await getProjectsByGroupMembership();

// Get single project
const project = await getProjectById(projectId);
```

## Common Scenarios

### Scenario 1: Create a Personal Project
```typescript
await createProject({
  name: 'My Personal Project',
  description: 'This is my personal workspace'
});
```

### Scenario 2: Create a Group Project
```typescript
await createProject({
  name: 'Team Website Redesign',
  description: 'Redesign company website',
  groupId: 'group-uuid-here'
});
```

### Scenario 3: Update Project Details
```typescript
await updateProject(projectId, {
  name: 'New Project Name',
  description: 'Updated description'
});
```

### Scenario 4: Move Project to Group
```typescript
await updateProject(projectId, {
  groupId: 'new-group-id' // or null to remove from group
});
```

## Troubleshooting

### "Unauthorized" Error
- Ensure you're the project creator or group owner
- Check if you're still a member of the group

### "Project Not Found" Error
- Project may have been deleted
- You may have lost access to the group
- Check the project ID is correct

### Projects Not Loading
- Check internet connection
- Verify Supabase credentials in environment variables
- Check browser console for errors
- Ensure you're logged in

### Can't See Group Projects
- Verify you're still a member of the group
- Check if the project was deleted
- Try refreshing the page

## Best Practices

1. **Use Descriptive Names**: Make projects easy to identify
2. **Add Clear Descriptions**: Help team members understand project goals
3. **Organize with Groups**: Use groups for related projects
4. **Regular Updates**: Keep project details current
5. **Clean Up**: Delete completed or abandoned projects

## Data Flow

```
User Action → Context Function → API Call → Supabase → Response → State Update → UI Refresh
```

Example:
```
Click "Create" → createProject() → POST /projects → Database → Project Data → Add to State → Show in List
```

## Performance Tips

1. **Filter Early**: Use search and filters to reduce displayed items
2. **Lazy Navigation**: Only load project details when needed
3. **Batch Operations**: Group multiple updates when possible
4. **Cache Awareness**: Context caches data, reducing API calls

## Security Notes

- All API calls require authentication
- Row Level Security (RLS) enforces permissions at database level
- Users can only access projects they created or have group access to
- Group membership determines project access for group projects

---

**Last Updated**: April 21, 2026  
**Version**: 1.0
