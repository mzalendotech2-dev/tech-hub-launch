export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          admin_notes: string
          consent_given: boolean
          contact_number: string
          course_id: string
          created_at: string
          current_location: string
          email: string
          full_name: string
          id: string
          reference_number: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string
          consent_given: boolean
          contact_number: string
          course_id: string
          created_at?: string
          current_location: string
          email: string
          full_name: string
          id?: string
          reference_number?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string
          consent_given?: boolean
          contact_number?: string
          course_id?: string
          created_at?: string
          current_location?: string
          email?: string
          full_name?: string
          id?: string
          reference_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          is_active: boolean
          learning_mode: string
          schedule: string
          slug: string
          start_date: string | null
          title: string
          tuition_kes: number
          tuition_usd: number
          updated_at: string
          weekly_hours: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          id?: string
          is_active?: boolean
          learning_mode?: string
          schedule?: string
          slug: string
          start_date?: string | null
          title: string
          tuition_kes: number
          tuition_usd: number
          updated_at?: string
          weekly_hours?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          is_active?: boolean
          learning_mode?: string
          schedule?: string
          slug?: string
          start_date?: string | null
          title?: string
          tuition_kes?: number
          tuition_usd?: number
          updated_at?: string
          weekly_hours?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          message: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          message: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          message?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string
          event_day: string
          event_type: string
          id: string
          target: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          event_day?: string
          event_type: string
          id?: string
          target: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          event_day?: string
          event_type?: string
          id?: string
          target?: string
          visitor_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_site_event: {
        Args: { _event_type: string; _target: string; _visitor_id: string }
        Returns: undefined
      }
      submit_application: {
        Args: {
          _contact_number: string
          _course_id: string
          _current_location: string
          _email: string
          _full_name: string
        }
        Returns: string
      }
      submit_contact: {
        Args: {
          _email: string
          _full_name: string
          _message: string
          _subject: string
        }
        Returns: undefined
      }
      submit_feedback: {
        Args: {
          _category: string
          _email: string
          _full_name: string
          _message: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
