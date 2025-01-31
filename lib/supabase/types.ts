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
      companies: {
        Row: {
          id: string
          name: string
          phone_number: string | null
          timezone: string
          business_hours: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone_number?: string | null
          timezone?: string
          business_hours?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone_number?: string | null
          timezone?: string
          business_hours?: Json
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          company_id: string
          greeting: string | null
          voice_type: string
          confidence_threshold: number
          record_calls: boolean
          auto_transcribe: boolean
          notification_email: string | null
          missed_call_alerts: boolean
          voicemail_alerts: boolean
          weekly_reports: boolean
        }
        Insert: {
          id?: string
          company_id: string
          greeting?: string | null
          voice_type?: string
          confidence_threshold?: number
          record_calls?: boolean
          auto_transcribe?: boolean
          notification_email?: string | null
          missed_call_alerts?: boolean
          voicemail_alerts?: boolean
          weekly_reports?: boolean
        }
        Update: {
          id?: string
          company_id?: string
          greeting?: string | null
          voice_type?: string
          confidence_threshold?: number
          record_calls?: boolean
          auto_transcribe?: boolean
          notification_email?: string | null
          missed_call_alerts?: boolean
          voicemail_alerts?: boolean
          weekly_reports?: boolean
        }
      }
      knowledge_items: {
        Row: {
          id: string
          company_id: string
          type: string
          question: string | null
          answer: string
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          type: string
          question?: string | null
          answer: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          type?: string
          question?: string | null
          answer?: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          company_id: string
          call_sid: string
          from_number: string
          to_number: string
          status: string
          duration: number | null
          recording_url: string | null
          transcript: string | null
          ai_handled: boolean
          handoff_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          call_sid: string
          from_number: string
          to_number: string
          status: string
          duration?: number | null
          recording_url?: string | null
          transcript?: string | null
          ai_handled?: boolean
          handoff_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          call_sid?: string
          from_number?: string
          to_number?: string
          status?: string
          duration?: number | null
          recording_url?: string | null
          transcript?: string | null
          ai_handled?: boolean
          handoff_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}