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
      blocked_users: {
        Row: {
          blocked_by: string
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          blocked_by: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          blocked_by?: string
          created_at?: string
          id?: string
          reason?: string | null
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
      course_case_studies: {
        Row: {
          challenge: string
          course_id: string
          created_at: string
          difficulty: string
          hint: string | null
          id: string
          order_index: number
          scenario: string
          tasks: string[]
          title: string
        }
        Insert: {
          challenge: string
          course_id: string
          created_at?: string
          difficulty?: string
          hint?: string | null
          id?: string
          order_index?: number
          scenario: string
          tasks?: string[]
          title: string
        }
        Update: {
          challenge?: string
          course_id?: string
          created_at?: string
          difficulty?: string
          hint?: string | null
          id?: string
          order_index?: number
          scenario?: string
          tasks?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_case_studies_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_interview_questions: {
        Row: {
          answer_outline: string
          category: string
          course_id: string
          created_at: string
          difficulty: string
          id: string
          order_index: number
          question: string
        }
        Insert: {
          answer_outline: string
          category?: string
          course_id: string
          created_at?: string
          difficulty?: string
          id?: string
          order_index?: number
          question: string
        }
        Update: {
          answer_outline?: string
          category?: string
          course_id?: string
          created_at?: string
          difficulty?: string
          id?: string
          order_index?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_interview_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
          job_placement: number | null
          price: number
          rating: number | null
          student_count: number | null
          success_rate: number | null
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
          job_placement?: number | null
          price: number
          rating?: number | null
          student_count?: number | null
          success_rate?: number | null
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
          job_placement?: number | null
          price?: number
          rating?: number | null
          student_count?: number | null
          success_rate?: number | null
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
      group_enrollment_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          is_lead: boolean
          member_email: string
          member_name: string
          member_phone: string
          share_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          is_lead?: boolean
          member_email: string
          member_name: string
          member_phone: string
          share_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          is_lead?: boolean
          member_email?: string
          member_name?: string
          member_phone?: string
          share_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_enrollment_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      group_enrollments: {
        Row: {
          coupon_applied: string | null
          course_id: string
          created_at: string
          created_by: string
          discount_amount: number
          group_code: string
          group_name: string
          id: string
          member_count: number
          per_member_amount: number
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          coupon_applied?: string | null
          course_id: string
          created_at?: string
          created_by: string
          discount_amount?: number
          group_code: string
          group_name: string
          id?: string
          member_count?: number
          per_member_amount: number
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          coupon_applied?: string | null
          course_id?: string
          created_at?: string
          created_by?: string
          discount_amount?: number
          group_code?: string
          group_name?: string
          id?: string
          member_count?: number
          per_member_amount?: number
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          resume_url: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_broadcast_state: {
        Row: {
          cycle_count: number
          id: number
          last_user_created_at: string | null
          last_user_id: string | null
          updated_at: string
        }
        Insert: {
          cycle_count?: number
          id?: number
          last_user_created_at?: string | null
          last_user_id?: string | null
          updated_at?: string
        }
        Update: {
          cycle_count?: number
          id?: number
          last_user_created_at?: string | null
          last_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          applications_count: number | null
          apply_url: string | null
          attachment_url: string | null
          benefits: string[] | null
          company_name: string | null
          company_website: string | null
          contact_email: string | null
          created_at: string
          currency: string | null
          description: string
          experience_level: string | null
          id: string
          is_active: boolean | null
          job_type: string
          location: string
          recruiter_id: string | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          salary_period:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null
          skills: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          application_deadline?: string | null
          applications_count?: number | null
          apply_url?: string | null
          attachment_url?: string | null
          benefits?: string[] | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          created_at?: string
          currency?: string | null
          description: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          job_type: string
          location: string
          recruiter_id?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null
          skills?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          application_deadline?: string | null
          applications_count?: number | null
          apply_url?: string | null
          attachment_url?: string | null
          benefits?: string[] | null
          company_name?: string | null
          company_website?: string | null
          contact_email?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string
          location?: string
          recruiter_id?: string | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null
          skills?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
        ]
      }
      job_subscription_coupon_usage: {
        Row: {
          coupon_code: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_code: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_code?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_subscriptions: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          order_id: string | null
          payment_status: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          order_id?: string | null
          payment_status?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          order_id?: string | null
          payment_status?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      live_project_code_unlocks: {
        Row: {
          code: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      live_project_codes: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          note: string | null
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          note?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          note?: string | null
        }
        Relationships: []
      }
      live_project_teammate_profiles: {
        Row: {
          about: string | null
          availability: string | null
          city: string | null
          contact_email: string
          contact_phone: string | null
          course_id: string | null
          created_at: string
          display_name: string
          experience_level: string
          headline: string
          id: string
          join_requests_count: number
          linkedin_url: string | null
          preferred_domain: string | null
          skills: string[]
          status: string
          updated_at: string
          user_id: string
          views_count: number
        }
        Insert: {
          about?: string | null
          availability?: string | null
          city?: string | null
          contact_email: string
          contact_phone?: string | null
          course_id?: string | null
          created_at?: string
          display_name: string
          experience_level?: string
          headline: string
          id?: string
          join_requests_count?: number
          linkedin_url?: string | null
          preferred_domain?: string | null
          skills?: string[]
          status?: string
          updated_at?: string
          user_id: string
          views_count?: number
        }
        Update: {
          about?: string | null
          availability?: string | null
          city?: string | null
          contact_email?: string
          contact_phone?: string | null
          course_id?: string | null
          created_at?: string
          display_name?: string
          experience_level?: string
          headline?: string
          id?: string
          join_requests_count?: number
          linkedin_url?: string | null
          preferred_domain?: string | null
          skills?: string[]
          status?: string
          updated_at?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_project_teammate_profiles_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      live_projects: {
        Row: {
          apply_url: string | null
          company_name: string
          company_website: string | null
          contact_email: string
          contact_person: string
          created_at: string
          domain: string
          duration: string | null
          engagement_type: string
          id: string
          location: string | null
          openings: number
          skills: string[]
          status: string
          stipend: string | null
          submitted_by: string
          summary: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          apply_url?: string | null
          company_name: string
          company_website?: string | null
          contact_email: string
          contact_person: string
          created_at?: string
          domain: string
          duration?: string | null
          engagement_type?: string
          id?: string
          location?: string | null
          openings?: number
          skills?: string[]
          status?: string
          stipend?: string | null
          submitted_by: string
          summary: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          apply_url?: string | null
          company_name?: string
          company_website?: string | null
          contact_email?: string
          contact_person?: string
          created_at?: string
          domain?: string
          duration?: string | null
          engagement_type?: string
          id?: string
          location?: string | null
          openings?: number
          skills?: string[]
          status?: string
          stipend?: string | null
          submitted_by?: string
          summary?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
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
          group_enrollment_id: string | null
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
          group_enrollment_id?: string | null
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
          group_enrollment_id?: string | null
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
          {
            foreignKeyName: "orders_group_enrollment_id_fkey"
            columns: ["group_enrollment_id"]
            isOneToOne: false
            referencedRelation: "group_enrollments"
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
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          passed: boolean | null
          quiz_id: string
          score: number | null
          started_at: string | null
          total_points: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id: string
          score?: number | null
          started_at?: string | null
          total_points?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string
          score?: number | null
          started_at?: string | null
          total_points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_option_id: string
          created_at: string | null
          id: string
          options: Json
          order_index: number | null
          points: number | null
          question_text: string
          quiz_id: string
        }
        Insert: {
          correct_option_id: string
          created_at?: string | null
          id?: string
          options: Json
          order_index?: number | null
          points?: number | null
          question_text: string
          quiz_id: string
        }
        Update: {
          correct_option_id?: string
          created_at?: string | null
          id?: string
          options?: Json
          order_index?: number | null
          points?: number | null
          question_text?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          passing_score: number
          time_limit_minutes: number
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          passing_score?: number
          time_limit_minutes?: number
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          passing_score?: number
          time_limit_minutes?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiters: {
        Row: {
          company_description: string | null
          company_name: string
          company_size: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          industry: string | null
          is_verified: boolean | null
          location: string | null
          logo_url: string | null
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          company_size?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          company_size?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
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
      teammate_join_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          profile_id: string
          requester_email: string
          requester_name: string
          requester_phone: string | null
          requester_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          profile_id: string
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          requester_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          profile_id?: string
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          requester_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teammate_join_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "live_project_teammate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      toolkit_usage: {
        Row: {
          created_at: string
          id: string
          prompt: string | null
          tool_id: string
          tool_name: string
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          prompt?: string | null
          tool_id: string
          tool_name: string
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string | null
          tool_id?: string
          tool_name?: string
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      has_live_project_access: { Args: { _user_id: string }; Returns: boolean }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
      list_live_projects: {
        Args: never
        Returns: {
          apply_url: string
          company_name: string
          company_website: string
          contact_email: string
          contact_person: string
          created_at: string
          domain: string
          duration: string
          engagement_type: string
          id: string
          location: string
          openings: number
          skills: string[]
          stipend: string
          summary: string
          title: string
          unlocked: boolean
        }[]
      }
      live_project_domain_counts: {
        Args: never
        Returns: {
          domain: string
          total: number
        }[]
      }
      redeem_live_project_code: {
        Args: { input_code: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      validate_coupon: {
        Args: { input_code: string }
        Returns: {
          discount_amount: number
          discount_percent: number
          discount_type: string
          error_message: string
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      salary_period_enum:
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "contract"
        | "per_month"
        | "per_annum"
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
      salary_period_enum: [
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "contract",
        "per_month",
        "per_annum",
      ],
    },
  },
} as const
