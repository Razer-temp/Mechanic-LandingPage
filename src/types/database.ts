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
                Relationships: [];
            };
            bookings: {
                Row: {
                    id: string;
                    name: string;
                    phone: string;
                    bike_model: string;
                    service_type: string;
                    service_location: string;
                    address: string | null;
                    preferred_date: string;
                    preferred_time: string;
                    notes: string | null;
                    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    phone: string;
                    bike_model: string;
                    service_type: string;
                    service_location: string;
                    metadata?: Json;
                    address?: string | null;
                    preferred_date: string;
                    preferred_time: string;
                    notes?: string | null;
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    phone?: string;
                    bike_model?: string;
                    service_type?: string;
                    service_location?: string;
                    address?: string | null;
                    preferred_date?: string;
                    preferred_time?: string;
                    notes?: string | null;
                    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    created_at?: string;
                };
                Relationships: [];
            };
            chat_sessions: {
                Row: {
                    id: string;
                    customer_name: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    customer_name?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    customer_name?: string | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            chat_messages: {
                Row: {
                    id: string;
                    session_id: string;
                    role: 'bot' | 'user';
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    role: 'bot' | 'user';
                    content: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    session_id?: string;
                    role?: 'bot' | 'user';
                    content?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "chat_messages_session_id_fkey";
                        columns: ["session_id"];
                        referencedRelation: "chat_sessions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            admin_settings: {
                Row: {
                    key: string;
                    value: Json;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: Json;
                    updated_at?: string;
                };
                Update: {
                    key?: string;
                    value?: Json;
                    updated_at?: string;
                };
                Relationships: [];
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
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type AdminSetting = Database['public']['Tables']['admin_settings']['Row'];
