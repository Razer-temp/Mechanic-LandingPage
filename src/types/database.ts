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
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    phone?: string | null;
                    avatar_url?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey";
                        columns: ["id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                    id?: string;
                    name: string;
                    description: string;
                    base_price: number;
                    category: string;
                    icon?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    base_price?: number;
                    category?: string;
                    icon?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
            bookings: {
                Row: {
                    id: string;
                    user_id: string;
                    service_id: string | null;
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
                    id?: string;
                    user_id: string;
                    service_id?: string | null;
                    bike_model: string;
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    scheduled_at: string;
                    time_slot?: string | null;
                    notes?: string | null;
                    estimated_cost?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    service_id?: string | null;
                    bike_model?: string;
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    scheduled_at?: string;
                    time_slot?: string | null;
                    notes?: string | null;
                    estimated_cost?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "bookings_service_id_fkey";
                        columns: ["service_id"];
                        referencedRelation: "services";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bookings_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
