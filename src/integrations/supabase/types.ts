export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          applies_to: string | null
          coupon_code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_amount: number | null
          discount_percent: number
          discount_type: string | null
          discount_value: number | null
          id: number
          is_active: boolean | null
          is_reusable: boolean | null
          max_uses: number | null
          minimum_purchase_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applies_to?: string | null
          coupon_code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percent: number
          discount_type?: string | null
          discount_value?: number | null
          id?: never
          is_active?: boolean | null
          is_reusable?: boolean | null
          max_uses?: number | null
          minimum_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applies_to?: string | null
          coupon_code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number
          discount_type?: string | null
          discount_value?: number | null
          id?: never
          is_active?: boolean | null
          is_reusable?: boolean | null
          max_uses?: number | null
          minimum_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          price: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          price: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          course_interest: string | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          course_interest?: string | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          course_interest?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          description: string
          id: number
          invoice_id: number | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: never
          invoice_id?: number | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: never
          invoice_id?: number | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          coupon_id: number | null
          created_at: string | null
          customer_id: number | null
          due_date: string | null
          email_sent_at: string | null
          id: number
          invoice_number: string
          status: string | null
          total_amount: number
        }
        Insert: {
          coupon_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          due_date?: string | null
          email_sent_at?: string | null
          id?: never
          invoice_number: string
          status?: string | null
          total_amount: number
        }
        Update: {
          coupon_id?: number | null
          created_at?: string | null
          customer_id?: number | null
          due_date?: string | null
          email_sent_at?: string | null
          id?: never
          invoice_number?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          amount: number
          city: string | null
          completed_at: string | null
          coupon_applied: string | null
          course_id: string
          created_at: string | null
          discount_amount: number | null
          id: string
          invoice_generated_at: string | null
          invoice_number: string | null
          order_id: string
          pincode: string | null
          state: string | null
          status: string | null
          student_email: string
          student_name: string
          student_phone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          amount: number
          city?: string | null
          completed_at?: string | null
          coupon_applied?: string | null
          course_id: string
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          invoice_generated_at?: string | null
          invoice_number?: string | null
          order_id: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          student_email: string
          student_name: string
          student_phone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          amount?: number
          city?: string | null
          completed_at?: string | null
          coupon_applied?: string | null
          course_id?: string
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          invoice_generated_at?: string | null
          invoice_number?: string | null
          order_id?: string
          pincode?: string | null
          state?: string | null
          status?: string | null
          student_email?: string
          student_name?: string
          student_phone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Referral: {
        Row: {
          created_at: string
          discount_amount: number
          id: number
          Referral_code: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          discount_amount: number
          id?: number
          Referral_code?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          discount_amount?: number
          id?: number
          Referral_code?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      validate_coupon: {
        Args: { input_code: string }
        Returns: {
          is_valid: boolean
          discount_percent: number
          error_message: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
