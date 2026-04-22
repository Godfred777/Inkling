import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

/**
 * Creates a new group or personal project
 * @param name of the group created
 * @param description about the group created
 * @param groupId (Optional) the group owning this project
 * @returns status code 200 along with group data
 */

export async function createProject(name: string, description?: string, groupId?: string | null) {
    try {
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const userID = user.data?.user?.id;
        if (!userID) {
            throw new Error('User ID not found');
        }

        // If a groupId is provided, verify the user has permission to add projects to that group
        if (groupId) {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('id')
                .eq('id', groupId)
                .eq('owner_id', userID)
                .single();

            if (groupError || !groupData) {
                throw new Error('Unauthorized or Group not found');
            }
        }

        const { data, error } = await supabase
            .from('projects')
            .upsert({ name, description, creator_id: userID, group_id: groupId})
            .select()
            .single()
        
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    } 
}


/**
 * Views all projects created by the user
 * @returns a list of projects created and managed by the user
 */
export async function getProjectsByUser() {
    try {
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const userID = user.data?.user?.id;
        if (!userID) {
            throw new Error('User ID not found');
        }

        const { data, error } = await supabase
            .from('projects')
            .select(`*, groups(owner_id)`)
            .eq('creator_id', userID);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    
    }

}

/**
 * Retrieves all projects asociated to groups the user is a member of
 * @returns all projects associated to all groups the user is a member of
 */

export async function getProjectsByGroupMembership() {
    try {
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const userID = user.data?.user?.id;
        if (!userID) {
            throw new Error('User ID not found');
        }

        // Projects and group_members are not directly related.
        // We must join through the 'groups' table to verify membership.
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                groups!inner(
                    group_members!inner(user_id)
                )
            `)
            .eq('groups.group_members.user_id', userID);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching group projects:', error);
        throw error;
    }
}

export async function getProjectById(projectId: string) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
            
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        throw error;
    }
}

/**
 * Updates a projects name and/or description
 * @param projectId of the project to update
 * @param name of the project to change
 * @param description of the project to change
 * @param groupId (Optional)
 * @returns data about a projects
 * Note: The idea is that group owners and editors can perform this operation but for now only owners can do this.
 * If the project is an orphan project, anyone can perform this operation as long as they created it
 */
export async function updateProject(projectId: string, name?: string, description?: string, groupId?: string | null) {
    try {
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const userID = user.data?.user?.id;
        if (!userID) {
            throw new Error('User ID not found');
        }

        // First, verify permission: User must be creator OR owner of the group the project belongs to
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('creator_id, group_id, groups(owner_id)')
            .eq('id', projectId)
            .single();

        if (fetchError || !project) throw new Error('Project not found');

        const isCreator = project.creator_id === userID;
        const isGroupOwner = project.groups && (project.groups as any).owner_id === userID;

        if (!isCreator && !isGroupOwner) {
            throw new Error('Unauthorized to update this project');
        }

        const updates: { name?: string; description?: string; group_id?: string | null } = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (groupId !== undefined) updates.group_id = groupId;

        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    
    }
}

/**
 * Deletes a projects
 * @param projectId of the project to delete
 * @param groupID (Optional) if the project was created for a group
 * @returns an object of type void and status code of 204
 * Note that this operation is only available for group owners and editors ideally but for the implementation is only available for owners.
 * For orphaned projects, the creator has permission to use this operation
 */
export async function deleteProject(projectId: string) {
    try {
        const user = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const userID = user.data?.user?.id;
        if (!userID) throw new Error('User ID not found');

        // Security check: only creator or group owner can delete
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('creator_id, groups(owner_id)')
            .eq('id', projectId)
            .single();

        if (fetchError || !project) throw new Error('Project not found');

        const isCreator = project.creator_id === userID;
        const isGroupOwner = project.groups && (project.groups as any).owner_id === userID;

        if (!isCreator && !isGroupOwner) {
            throw new Error('Unauthorized to delete this project');
        }

        const { data, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    
    }
}