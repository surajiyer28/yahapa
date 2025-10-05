export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          notes: string | null
          completed: boolean
          effort_score: number
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          notes?: string | null
          completed?: boolean
          effort_score?: number
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          notes?: string | null
          completed?: boolean
          effort_score?: number
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_data: {
        Row: {
          id: string
          user_id: string
          date: string
          steps: number
          calories: number
          distance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          steps?: number
          calories?: number
          distance?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          steps?: number
          calories?: number
          distance?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
