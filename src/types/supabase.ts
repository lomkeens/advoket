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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          company: string | null
          notes: string | null
          status: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      cases: {
        Row: {
          id: string
          title: string
          description: string | null
          client_id: string
          status: string
          priority: string
          case_type: string | null
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          due_date: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          client_id: string
          status?: string
          priority?: string
          case_type?: string | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          client_id?: string
          status?: string
          priority?: string
          case_type?: string | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          due_date?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          description: string | null
          file_url: string
          file_type: string | null
          size: number | null
          case_id: string | null
          client_id: string | null
          uploaded_by: string | null
          uploaded_at: string
          tags: string[] | null
          version: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          file_url: string
          file_type?: string | null
          size?: number | null
          case_id?: string | null
          client_id?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
          tags?: string[] | null
          version?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          file_url?: string
          file_type?: string | null
          size?: number | null
          case_id?: string | null
          client_id?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
          tags?: string[] | null
          version?: number | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          all_day: boolean | null
          location: string | null
          event_type: string
          case_id: string | null
          client_id: string | null
          attendees: string[] | null
          created_by: string | null
          created_at: string
          reminder: boolean | null
          reminder_time: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          all_day?: boolean | null
          location?: string | null
          event_type?: string
          case_id?: string | null
          client_id?: string | null
          attendees?: string[] | null
          created_by?: string | null
          created_at?: string
          reminder?: boolean | null
          reminder_time?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          all_day?: boolean | null
          location?: string | null
          event_type?: string
          case_id?: string | null
          client_id?: string | null
          attendees?: string[] | null
          created_by?: string | null
          created_at?: string
          reminder?: boolean | null
          reminder_time?: number | null
        }
      }
      time_entries: {
        Row: {
          id: string
          description: string
          case_id: string
          client_id: string
          date: string
          duration: number
          billable: boolean
          rate: number | null
          attorney_id: string | null
          status: string
          invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          case_id: string
          client_id: string
          date?: string
          duration: number
          billable?: boolean
          rate?: number | null
          attorney_id?: string | null
          status?: string
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          case_id?: string
          client_id?: string
          date?: string
          duration?: number
          billable?: boolean
          rate?: number | null
          attorney_id?: string | null
          status?: string
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string
          case_id: string | null
          issue_date: string
          due_date: string
          amount: number
          status: string
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_id: string
          case_id?: string | null
          issue_date?: string
          due_date: string
          amount: number
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string
          case_id?: string | null
          issue_date?: string
          due_date?: string
          amount?: number
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          rate: number
          amount: number
          time_entry_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          rate: number
          amount: number
          time_entry_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          rate?: number
          amount?: number
          time_entry_id?: string | null
          created_at?: string
        }
      }
    }
  }
}