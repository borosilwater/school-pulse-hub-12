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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          priority: number | null
          published: boolean | null
          title: string
          type: Database["public"]["Enums"]["announcement_type"]
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: number | null
          published?: boolean | null
          title: string
          type?: Database["public"]["Enums"]["announcement_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: number | null
          published?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["announcement_type"]
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          address: string
          application_number: string
          application_status: string | null
          class_applying_for: string
          created_at: string
          date_of_birth: string
          documents_uploaded: Json | null
          email: string
          full_name: string
          gender: string
          id: string
          parent_income: number | null
          parent_name: string
          parent_occupation: string | null
          phone: string
          previous_school: string | null
          remarks: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          address: string
          application_number: string
          application_status?: string | null
          class_applying_for: string
          created_at?: string
          date_of_birth: string
          documents_uploaded?: Json | null
          email: string
          full_name: string
          gender: string
          id?: string
          parent_income?: number | null
          parent_name: string
          parent_occupation?: string | null
          phone: string
          previous_school?: string | null
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          application_number?: string
          application_status?: string | null
          class_applying_for?: string
          created_at?: string
          date_of_birth?: string
          documents_uploaded?: Json | null
          email?: string
          full_name?: string
          gender?: string
          id?: string
          parent_income?: number | null
          parent_name?: string
          parent_occupation?: string | null
          phone?: string
          previous_school?: string | null
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_content: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean | null
          meta_data: Json | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_data?: Json | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_data?: Json | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          achievements: string[] | null
          created_at: string
          description: string | null
          facilities: string[] | null
          head_of_department: string | null
          id: string
          name: string
          subjects: string[] | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          head_of_department?: string | null
          id?: string
          name: string
          subjects?: string[] | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          head_of_department?: string | null
          id?: string
          name?: string
          subjects?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_of_department_fkey"
            columns: ["head_of_department"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          download_count: number | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          max_participants: number | null
          organizer_id: string
          registration_required: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          registration_required?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          registration_required?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exam_results: {
        Row: {
          created_at: string
          exam_date: string
          exam_name: string
          grade: string | null
          id: string
          marks_obtained: number
          published_at: string | null
          score: number | null
          status: Database["public"]["Enums"]["exam_status"]
          student_id: string
          subject: string
          teacher_id: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_date: string
          exam_name: string
          grade?: string | null
          id?: string
          marks_obtained: number
          published_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["exam_status"]
          student_id: string
          subject: string
          teacher_id: string
          total_marks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_date?: string
          exam_name?: string
          grade?: string | null
          id?: string
          marks_obtained?: number
          published_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["exam_status"]
          student_id?: string
          subject?: string
          teacher_id?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string
          department: string
          designation: string
          emergency_contact: string | null
          employee_id: string
          experience_years: number | null
          id: string
          is_active: boolean | null
          joining_date: string | null
          phone: string | null
          profile_image_url: string | null
          qualification: string | null
          subjects_taught: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string
          department: string
          designation: string
          emergency_contact?: string | null
          employee_id: string
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          joining_date?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qualification?: string | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string
          department?: string
          designation?: string
          emergency_contact?: string | null
          employee_id?: string
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          joining_date?: string | null
          phone?: string | null
          profile_image_url?: string | null
          qualification?: string | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount_paid: number
          created_at: string
          fee_structure_id: string | null
          id: string
          payment_date: string | null
          payment_method: string
          payment_status: string | null
          student_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          fee_structure_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          payment_status?: string | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          fee_structure_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          payment_status?: string | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year: string
          amount: number
          class_name: string
          created_at: string
          due_date: string | null
          fee_type: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          amount: number
          class_name: string
          created_at?: string
          due_date?: string | null
          fee_type: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          amount?: number
          class_name?: string
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      placements: {
        Row: {
          academic_year: string | null
          college_university: string | null
          company_name: string
          course: string | null
          created_at: string
          id: string
          package_amount: number | null
          placement_date: string | null
          placement_type: string | null
          position: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          college_university?: string | null
          company_name: string
          course?: string | null
          created_at?: string
          id?: string
          package_amount?: number | null
          placement_date?: string | null
          placement_type?: string | null
          position: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          college_university?: string | null
          company_name?: string
          course?: string | null
          created_at?: string
          id?: string
          package_amount?: number | null
          placement_date?: string | null
          placement_type?: string | null
          position?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          class_name: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message: string
          phone_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          phone_number: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          phone_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          academic_year: string | null
          address: string | null
          admission_date: string | null
          admission_number: string
          blood_group: string | null
          class_name: string
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          father_name: string | null
          gender: string | null
          guardian_phone: string | null
          hostel_resident: boolean | null
          id: string
          is_active: boolean | null
          medical_conditions: string | null
          mother_name: string | null
          roll_number: string | null
          section: string | null
          transport_required: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          academic_year?: string | null
          address?: string | null
          admission_date?: string | null
          admission_number: string
          blood_group?: string | null
          class_name: string
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          father_name?: string | null
          gender?: string | null
          guardian_phone?: string | null
          hostel_resident?: boolean | null
          id?: string
          is_active?: boolean | null
          medical_conditions?: string | null
          mother_name?: string | null
          roll_number?: string | null
          section?: string | null
          transport_required?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          academic_year?: string | null
          address?: string | null
          admission_date?: string | null
          admission_number?: string
          blood_group?: string | null
          class_name?: string
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          father_name?: string | null
          gender?: string | null
          guardian_phone?: string | null
          hostel_resident?: boolean | null
          id?: string
          is_active?: boolean | null
          medical_conditions?: string | null
          mother_name?: string | null
          roll_number?: string | null
          section?: string | null
          transport_required?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      announcement_type: "general" | "urgent" | "event" | "exam"
      exam_status: "pending" | "published" | "draft"
      user_role: "student" | "teacher" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      announcement_type: ["general", "urgent", "event", "exam"],
      exam_status: ["pending", "published", "draft"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
