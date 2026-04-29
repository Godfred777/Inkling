import { supabase } from "@/lib/supabase/client";

/**
 * Helper function to get authenticated user ID
 * @returns The ID of the authenticated user.
 * @throws Error if the user is not authenticated or their ID is not found.
 */
async function getAuthenticatedUserId(): Promise<string> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !user.id) {
        throw new Error('User not authenticated or User ID not found');
    }
    return user.id;
}

/**
 * Creates a new task for a given project.
 * @param projectId - The ID of the project to which the task belongs.
 * @param title - The title of the task.
 * @param description - A detailed description of the task.
 * @param dueDate - The due date for the task in ISO format.
 * @param priority - The priority level of the task ('low', 'medium', 'high').
 */
export async function createTask(projectId: string, title: string, description: string, dueDate: string, priority: 'low' | 'medium' | 'high') {
  try {

    // Checks if the user is authenticated before attempting to create a task
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userId = (await user).data.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }


    //Checks if the project exists before creating a task and the user has access to it
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, group_id')
      .eq('id', projectId)
      .eq('creator_id', userId)
      .single();

    // If the project is belongs to a group, checks if the user is the owner of the group
    //Note: Only group owners can create tasks for projects within their groups, while individual project creators can create tasks for their own projects regardless of group ownership. This is to ensure that group members cannot create tasks for projects they do not own, while still allowing individual project creators the flexibility to manage their own projects.
    //Editors of the group can also create tasks for projects within their groups but for now only owners can do this.
    if (project?.group_id) {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('id')
        .eq('id', project.group_id)
        .eq('owner_id', userId)
        .single();

      if (groupError || !groupData) {
        throw new Error('Unauthorized or Group not found');
      }
    }
    
    if (projectError) {
      throw projectError;
    }
    if (!project) {
      throw new Error('Project not found');
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ project_id: projectId, title, description, due_date: dueDate, priority, status: 'todo', assigne_id: userId })
      .select()
      .single();
  
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    
  }
}

/**
  * Updates an existing task with new details.
  * @param taskId - The ID of the task to update.
  * @param updates - An object containing the fields to update (title, description, status, priority, dueDate).
  * @returns The updated task data.
  * @throws Error if the update fails or the user is not authorized.
 */
export async function updateTask(taskId: string, updates: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string }) {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const userId = (await user).data.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    // Fetch the task to verify ownership or group permissions
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, assigne_id, projects(id, group_id, creator_id)')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }
    if (task.assigne_id !== userId) {
      // If the task is assigned to the user, they can update it
      // If not, check if the user has permissions through the project or group
      const project = task.projects?.[0];
      if (project?.creator_id !== userId) {
        if (project?.group_id) {
          const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .select('id')
            .eq('id', project.group_id)
            .eq('owner_id', userId)
            .single();
          if (groupError || !groupData) {
            throw new Error('Unauthorized to update this task');
          }
        } else {
          throw new Error('Unauthorized to update this task');
        }
      }
    }
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

/**
 * Deletes a task by its ID.
 * @param taskId - The ID of the task to delete.
 * @returns A success message upon successful deletion.
 * @throws Error if the deletion fails or the user is not authorized.
 */
export async function deleteTask(taskId: string) {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const userId = (await user).data.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    // Fetch the task to verify ownership or group permissions
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, assigne_id, projects(id, group_id, creator_id)')
      .eq('id', taskId)
      .single();
    if (taskError || !task) {
      throw new Error('Task not found');
    }
    if (task.assigne_id !== userId) {
      // If the task is assigned to the user, they can delete it
      // If not, check if the user has permissions through the project or group
      const project = task.projects?.[0];
      if (project?.creator_id !== userId) {
        if (project?.group_id) {
          const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .select('id')
            .eq('id', project.group_id)
            .eq('owner_id', userId)
            .single();
          if (groupError || !groupData) {
            throw new Error('Unauthorized to delete this task');
          }
        } else {
          throw new Error('Unauthorized to delete this task');
        }
      }
    }
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    if (error) {
      throw error;
    }
    return 'Task deleted successfully';
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Retrieves all tasks for a given project.
 * @param projectId - The ID of the project to fetch tasks for.
 * @returns An array of task objects.
 * @throws Error if the retrieval fails.
 * Note: This function currently does not perform explicit authorization checks to ensure the caller has access to the project.
 * It is assumed that Row Level Security (RLS) on the 'tasks' table or a higher-level application logic handles this.
 */
export async function getTasksByProject(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}


/**
 * Retrieves all tasks assigned to the authenticated user.
 * @returns An array of task objects assigned to the user.
 * @throws Error if the retrieval fails or the user is not authenticated.
 */
export async function getTasksByUser() {
  try {
    const user = supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const userId = (await user).data.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigne_id', userId);
    if (error) {
      throw error;
    }
    return data
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }
}

/**
 * Retrieves a task by its ID.
 * @param taskId - The ID of the task to fetch.
 * @return The task object if found, otherwise null.
 * @throws Error if the retrieval fails.
 * Note: This function currently does not perform explicit authorization checks to ensure the caller has access to the task.
 * It is assumed that Row Level Security (RLS) on the 'tasks' table or a higher-level application logic handles this.
 */
export async function getTaskById(taskId: string) {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();
            
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        throw error;
    }
}

/**
 * Updates the status of a task.
 * @param taskId - The ID of the task to update.
 * @param status - The new status of the task.
 * @returns The updated task object.
 * @throws Error if the update fails.
 */
export async function updateTaskStatus(taskId: string, status: string) {
    try {
        const currentUserId = await getAuthenticatedUserId();

        // Fetch the task and its associated project details for authorization
        const { data: task, error: taskFetchError } = await supabase
            .from('tasks')
            .select('assigne_id, projects(id, group_id, creator_id)')
            .eq('id', taskId)
            .single();

        if (taskFetchError || !task) {
            throw new Error('Task not found');
        }

        const project = task.projects?.[0];
        if (!project) {
            throw new Error('Project not found for this task');
        }

        // Authorization: currentUserId must be assignee, project creator, or group owner
        const isTaskAssignee = task.assigne_id === currentUserId;
        const isProjectCreator = project.creator_id === currentUserId;
        let isGroupOwner = false;

        if (project.group_id) {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('owner_id')
                .eq('id', project.group_id)
                .single();

            if (groupError || !groupData) {
                console.warn(`Group ${project.group_id} not found or user not owner for project ${project.id}.`);
            } else {
                isGroupOwner = groupData.owner_id === currentUserId;
            }
        }

        if (!isTaskAssignee && !isProjectCreator && !isGroupOwner) {
            throw new Error('Unauthorized to update this task status');
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
    }
}

/**
 * Assigns a task to a user.
 * @param taskId - The ID of the task to assign.
 * @param newAssigneeId - The ID of the user to assign the task to.
 * @returns The assigned task object.
 * @throws Error if the assignment fails.
 */
export async function assignTaskToUser(taskId: string, newAssigneeId: string) {
    try {
        const currentUserId = await getAuthenticatedUserId();

        // 1. Verify the newAssigneeId exists
        const { data: assigneeProfile, error: assigneeError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', newAssigneeId)
        .single();
      
        if (assigneeError || !assigneeProfile) {
            throw new Error('Assignee user not found');
        }

        // 2. Fetch the task and its associated project details for authorization
        const { data: task, error: taskFetchError } = await supabase
        .from('tasks')
        .select('assigne_id, projects(id, group_id, creator_id)') // Corrected select for projects
        .eq('id', taskId)
        .single();

        if (taskFetchError || !task) {
            throw new Error('Task not found');
        }

        const project = task.projects?.[0]; // Corrected access
        if (!project) {
            throw new Error('Project not found for this task');
        }

        // Authorization for the currentUserId (caller) to assign the task
        const isTaskAssignee = task.assigne_id === currentUserId;
        const isProjectCreator = project.creator_id === currentUserId;
        let isGroupOwner = false;

        if (project.group_id) {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('owner_id')
                .eq('id', project.group_id)
                .single();

            if (groupError || !groupData) {
                console.warn(`Group ${project.group_id} not found or user not owner for project ${project.id}.`);
            } else {
                isGroupOwner = groupData.owner_id === currentUserId;
            }
        }

        if (!isTaskAssignee && !isProjectCreator && !isGroupOwner) {
            throw new Error('Unauthorized to assign this task');
        }

        // 3. If it's a group project, verify newAssigneeId is a member of the group
        if (project.group_id) {
            const { data: groupMember, error: memberError } = await supabase
                .from('group_members')
                .select('user_id')
                .eq('group_id', project.group_id)
                .eq('user_id', newAssigneeId)
                .single();

            if (memberError || !groupMember) {
                throw new Error('New assignee is not a member of the project\'s group');
            }
        }

        // 4. Perform the assignment
        const { data, error } = await supabase
        .from('groups')
        .update({ assigne_id: newAssigneeId })
        .eq('id', taskId)
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      return data;

    } catch (error) {
        console.error('Error assigning task to user:', error);
        throw error;
    }
}