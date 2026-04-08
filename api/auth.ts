import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl!, supabaseKey!);

/**
 * Signs up a user with email and password using Supabase authentication.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the authentication response data.
 * @throws Error if the sign-in process fails.
 */
export async function signUpWithEmailAndPassword(email: string, password: string) {
    try {
        return await supabase.auth.signUp({
            email,
            password,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
  
}

/**
 * Signs in a user with email and password using Supabase authentication.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the authentication response data.
 * @throws Error if the sign-in process fails.
 */
export async function signInWithEmailAndPassword(email: string, password: string) {
    try {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
  
}

/**
 * Signs out a user with email and password using Supabase authentication.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the authentication response data.
 * @throws Error if the sign-in process fails.
 */
export async function signOut() {
    try {
        return await supabase.auth.signOut();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Initiates a password reset process for the specified email address.
 * @param email - The user's email address to send the reset link to.
 * @returns A promise resolving to the Supabase authentication response.
 * @throws Error if the password reset request fails.
 */
export async function resetPasswordForEmail(email: string) {
    try {
        return await supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
        console.error(error);
        throw error;
    }
}