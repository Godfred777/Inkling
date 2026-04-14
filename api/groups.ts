import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl!, supabaseKey!);

/**
 * Create a group with the specified name and description.
 * @param name - The name of the group.
 * @param description - An optional description for the group.
 * @return A promise that resolves to the created group object.
 * @throws An error if the group creation fails.
 */
export async function createGroup(name: string, description?: string) {
    try {
        const { data, error } = await supabase
            .from('groups')
            .insert({ name, description })
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

/** Retrieve all groups an authenticated user is a part of.
 * @return A promise that resolves to an array of group objects.
 * @throws An error if the retrieval fails.
 */

export async function getGroupsWithUser() {
    try {
        const user = supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('groups')
            .select(`
                *,
                group_members!inner(user_id)
            `);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {        
        console.error('Error fetching groups:', error);
        throw error;
    }
}

/**
 * Retrieve a specific group by its ID.
 * @param groupId: The ID of the group to retrieve.
 * @returns all the details of the group with the specified ID.
 * @throws An error if the retrieval fails.
 */

export async function getGroupById(groupId: string) {
    try {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw error;
    }
}

/**
 * Join a group (self-service).
 * Inserts a record into the group_members table for the current user.
 * @param groupId - The ID of the group to join.
 * @param userId - The ID of the user joining the group (must be the current user).
 * @return A promise that resolves to the created group member object.
 * @throws An error if the operation fails, user is already a member, or group doesn't exist.
 */
export async function joinGroup(groupId: string, userId: string) {
    try {
        // Validate inputs
        if (!groupId || !userId) {
            throw new Error('Group ID and User ID are required');
        }

        // Check if group exists
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('id')
            .eq('id', groupId)
            .single();

        if (groupError || !group) {
            throw new Error('Group not found');
        }

        // Check if user is already a member
        const { data: existingMembership } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (existingMembership) {
            throw new Error('User is already a member of this group');
        }

        // Insert membership
        const { data, error } = await supabase
            .from('group_members')
            .insert({ group_id: groupId, user_id: userId })
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error joining group:', error);
        throw error;
    }
}

/**
 * Leave a group (self-service).
 * Deletes the membership record from the group_members table for the current user.
 * @param groupId - The ID of the group to leave.
 * @param userId - The ID of the user leaving the group (must be the current user).
 * @return A promise that resolves to the deleted group member object.
 * @throws An error if the operation fails or user is not a member.
 */
export async function leaveGroup(groupId: string, userId: string) {
    try {
        // Validate inputs
        if (!groupId || !userId) {
            throw new Error('Group ID and User ID are required');
        }

        // Check if user is a member
        const { data: existingMembership, error: fetchError } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !existingMembership) {
            throw new Error('User is not a member of this group');
        }

        // Delete membership
        const { data, error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error leaving group:', error);
        throw error;
    }
}

/**
 * Add a member to a group (admin action).
 * Inserts a record into the group_members table for another user.
 * @param groupId - The ID of the group.
 * @param userId - The ID of the user to add to the group.
 * @param adminUserId - The ID of the admin performing the action.
 * @return A promise that resolves to the created group member object.
 * @throws An error if the operation fails, user is already a member, or admin lacks permissions.
 */
export async function addMemberToGroup(groupId: string, userId: string, ownerId: string) {
    try {
        // Validate inputs
        if (!groupId || !userId || !ownerId) {
            throw new Error('Group ID, User ID, and Admin User ID are required');
        }

        // Verify owner is a member of the group (basic permission check)
        const { data: ownership } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', ownerId)
            .eq('role', 'owner')
            .single();

        if (!ownership) {
            throw new Error('Only group members can add new members');
        }

        // Check if group exists
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .select('id')
            .eq('id', groupId)
            .single();

        if (groupError || !group) {
            throw new Error('Group not found');
        }

        // Check if user is already a member
        const { data: existingMembership } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (existingMembership) {
            throw new Error('User is already a member of this group');
        }

        // Insert membership
        const { data, error } = await supabase
            .from('group_members')
            .insert({ group_id: groupId, user_id: userId })
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error adding member to group:', error);
        throw error;
    }
}

/**
 * Remove a member from a group (admin action).
 * Deletes the membership record from the group_members table for another user.
 * @param groupId - The ID of the group.
 * @param userId - The ID of the user to remove from the group.
 * @param adminUserId - The ID of the admin performing the action.
 * @return A promise that resolves to the deleted group member object.
 * @throws An error if the operation fails, user is not a member, or admin lacks permissions.
 */
export async function removeMemberFromGroup(groupId: string, userId: string, ownerId: string) {
    try {
        // Validate inputs
        if (!groupId || !userId || !ownerId) {
            throw new Error('Group ID, User ID, and Admin User ID are required');
        }

        // Verify admin is a member of the group (basic permission check)
        const { data: ownership } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', ownerId)
            .eq('role', 'owner') 
            .single();

        if (!ownership) {
            throw new Error('Only group members can remove other members');
        }

        // Check if the user to be removed is a member
        const { data: existingMembership, error: fetchError } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !existingMembership) {
            throw new Error('User is not a member of this group');
        }

        // Delete membership
        const { data, error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error removing member from group:', error);
        throw error;
    }
}

/** Retrieves all group members of a particular group by querying the group_members table and joining it with the users table to get user details.
 * @param groupId - The ID of the group whose members are to be retrieved.
 * @return A promise that resolves to an array of group member objects, each containing user details.
 * @throws An error if the retrieval fails.
 */
export async function getGroupMembers(groupId: string) {
    try {
        const { data, error } = await supabase
            .from('group_members')
            .select(`
                user_id,
                users (
                    id,
                    email
                )
            `)
            .eq('group_id', groupId);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching group members:', error);
        throw error;
    }
}

/** Update the details of a group, such as its name or description, by updating the corresponding record in the groups table.
 * @param groupId - The ID of the group to update.
 * @param name - The new name for the group (optional).
 * @param description - The new description for the group (optional).
 * @return A promise that resolves to the updated group object.
 * @throws An error if the update fails.
 */
export async function updateGroup(groupId: string, name?: string, description?: string) {
    try {
        const updates: { name?: string; description?: string } = {};
        if (name) updates.name = name;
        if (description) updates.description = description;

        const { data, error } = await supabase
            .from('groups')
            .update(updates)
            .eq('id', groupId)
            .select()
            .single();

            if (error) {
                throw error;
            }
            return data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
}

/** Delete a group by removing the corresponding record from the groups table.
 * @param groupId - The ID of the group to delete.
 * @return A promise that resolves to the deleted group object.
 * @throws An error if the deletion fails.
 */
export async function deleteGroup(groupId: string) {
    try {
        const { data, error } = await supabase
            .from('groups')
            .delete()
            .eq('id', groupId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}