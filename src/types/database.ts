export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    phone: string | null;
                    avatar_url: string | null;
                    role: 'user' | 'admin';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    phone?: string | null;
                    avatar_url?: string | null;
                    role?: 'user' | 'admin';
                };
                Update: {
                    full_name?: string | null;
                    phone?: string | null;
                    avatar_url?: string | null;
                    role?: 'user' | 'admin';
                };
            };
            services: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    base_price: number;
                    category: string;
                    icon: string;
                    created_at: string;
                };
                Insert: {
                    name: string;
                    description: string;
                    base_price: number;
                    category: string;
                    icon?: string;
                };
                Update: {
                    name?: string;
                    description?: string;
                    base_price?: number;
                    category?: string;
                    icon?: string;
                };
            };
            bookings: {
                Row: {
                    id: string;
                    user_id: string;
                    service_id: string;
                    bike_model: string;
                    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    scheduled_at: string;
                    time_slot: string | null;
                    notes: string | null;
                    estimated_cost: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    service_id: string;
                    bike_model: string;
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    scheduled_at: string;
                    time_slot?: string | null;
                    notes?: string | null;
                    estimated_cost?: number | null;
                };
                Update: {
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    scheduled_at?: string;
                    time_slot?: string | null;
                    notes?: string | null;
                    estimated_cost?: number | null;
                };
            };
        };
    };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
