export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          icon: string
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          created_at: string | null
          duration: number
          file_path: string | null
          id: string
          message_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration: number
          file_path?: string | null
          id: string
          message_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          file_path?: string | null
          id?: string
          message_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          caregiver_id: string
          created_at: string
          id: string
          senior_id: string
          status: string
          updated_at: string
        }
        Insert: {
          caregiver_id: string
          created_at?: string
          id?: string
          senior_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          caregiver_id?: string
          created_at?: string
          id?: string
          senior_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          notes: string | null
          status: string
          taken_at: string
          user_id: string
        }
        Insert: {
          id?: string
          medication_id: string
          notes?: string | null
          status: string
          taken_at?: string
          user_id: string
        }
        Update: {
          id?: string
          medication_id?: string
          notes?: string | null
          status?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          frequency: string
          id: string
          name: string
          notes: string | null
          time_of_day: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          frequency: string
          id?: string
          name: string
          notes?: string | null
          time_of_day: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          notes?: string | null
          time_of_day?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          category_id: string | null
          created_at: string | null
          dislikes: number | null
          duration: number
          expires_at: string | null
          file_path: string | null
          id: string
          is_public: boolean | null
          likes: number | null
          receiver_id: string | null
          sender_id: string | null
          tips_received: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          dislikes?: number | null
          duration: number
          expires_at?: string | null
          file_path?: string | null
          id: string
          is_public?: boolean | null
          likes?: number | null
          receiver_id?: string | null
          sender_id?: string | null
          tips_received?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          dislikes?: number | null
          duration?: number
          expires_at?: string | null
          file_path?: string | null
          id?: string
          is_public?: boolean | null
          likes?: number | null
          receiver_id?: string | null
          sender_id?: string | null
          tips_received?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          created_at: string | null
          id: string
          is_admin: boolean | null
          name: string
          paypal_email: string | null
          updated_at: string | null
          wallet_balance: number | null
          wallet_currency: string | null
        }
        Insert: {
          avatar: string
          created_at?: string | null
          id: string
          is_admin?: boolean | null
          name: string
          paypal_email?: string | null
          updated_at?: string | null
          wallet_balance?: number | null
          wallet_currency?: string | null
        }
        Update: {
          avatar?: string
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string
          paypal_email?: string | null
          updated_at?: string | null
          wallet_balance?: number | null
          wallet_currency?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          message_id: string | null
          payment_method: string | null
          status: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          message_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          message_id?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_type: string
          found_results: boolean | null
          id: string
          query: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          found_results?: boolean | null
          id?: string
          query?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          found_results?: boolean | null
          id?: string
          query?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
