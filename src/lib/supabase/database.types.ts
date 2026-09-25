export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action: string;
          admin_id: string | null;
          business_id: string | null;
          created_at: string;
          id: number;
          note: string | null;
          report_id: string | null;
          review_id: string | null;
          sponsorship_id: string | null;
        };
        Insert: {
          action: string;
          admin_id?: string | null;
          business_id?: string | null;
          created_at?: string;
          id?: never;
          note?: string | null;
          report_id?: string | null;
          review_id?: string | null;
          sponsorship_id?: string | null;
        };
        Update: {
          action?: string;
          admin_id?: string | null;
          business_id?: string | null;
          created_at?: string;
          id?: never;
          note?: string | null;
          report_id?: string | null;
          review_id?: string | null;
          sponsorship_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_actions_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "admin_actions_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_actions_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_actions_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "public_reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_actions_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_actions_sponsorship_id_fkey";
            columns: ["sponsorship_id"];
            isOneToOne: false;
            referencedRelation: "sponsorships";
            referencedColumns: ["id"];
          },
        ];
      };
      banners: {
        Row: {
          advertiser: string;
          body: string | null;
          city_id: number | null;
          clicks: number;
          color: string;
          created_at: string;
          cta: string | null;
          ends_at: string;
          id: string;
          link_url: string;
          logo_path: string | null;
          payment_ref: string | null;
          scope: string;
          service_id: number | null;
          starts_at: string;
          status: Database["public"]["Enums"]["sponsorship_status"];
          title: string;
        };
        Insert: {
          advertiser: string;
          body?: string | null;
          city_id?: number | null;
          clicks?: number;
          color?: string;
          created_at?: string;
          cta?: string | null;
          ends_at: string;
          id?: string;
          link_url: string;
          logo_path?: string | null;
          payment_ref?: string | null;
          scope?: string;
          service_id?: number | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["sponsorship_status"];
          title: string;
        };
        Update: {
          advertiser?: string;
          body?: string | null;
          city_id?: number | null;
          clicks?: number;
          color?: string;
          created_at?: string;
          cta?: string | null;
          ends_at?: string;
          id?: string;
          link_url?: string;
          logo_path?: string | null;
          payment_ref?: string | null;
          scope?: string;
          service_id?: number | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["sponsorship_status"];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "banners_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "banners_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      business_cities: {
        Row: {
          business_id: string;
          city_id: number;
        };
        Insert: {
          business_id: string;
          city_id: number;
        };
        Update: {
          business_id?: string;
          city_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "business_cities_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "business_cities_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_cities_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
      business_daily_stats: {
        Row: {
          business_id: string;
          contact_email: number;
          contact_instagram: number;
          contact_phone: number;
          contact_viber: number;
          contact_website: number;
          contact_whatsapp: number;
          day: string;
          views: number;
        };
        Insert: {
          business_id: string;
          contact_email?: number;
          contact_instagram?: number;
          contact_phone?: number;
          contact_viber?: number;
          contact_website?: number;
          contact_whatsapp?: number;
          day: string;
          views?: number;
        };
        Update: {
          business_id?: string;
          contact_email?: number;
          contact_instagram?: number;
          contact_phone?: number;
          contact_viber?: number;
          contact_website?: number;
          contact_whatsapp?: number;
          day?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: "business_daily_stats_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "business_daily_stats_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      business_hours: {
        Row: {
          business_id: string;
          closes_at: string;
          opens_at: string;
          weekday: number;
        };
        Insert: {
          business_id: string;
          closes_at: string;
          opens_at: string;
          weekday: number;
        };
        Update: {
          business_id?: string;
          closes_at?: string;
          opens_at?: string;
          weekday?: number;
        };
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "business_hours_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      business_photos: {
        Row: {
          business_id: string;
          created_at: string;
          height: number | null;
          id: string;
          is_cover: boolean;
          sort_order: number;
          storage_path: string;
          width: number | null;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_cover?: boolean;
          sort_order?: number;
          storage_path: string;
          width?: number | null;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          height?: number | null;
          id?: string;
          is_cover?: boolean;
          sort_order?: number;
          storage_path?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "business_photos_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "business_photos_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      business_services: {
        Row: {
          business_id: string;
          is_primary: boolean;
          service_id: number;
        };
        Insert: {
          business_id: string;
          is_primary?: boolean;
          service_id: number;
        };
        Update: {
          business_id?: string;
          is_primary?: boolean;
          service_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "business_services_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "business_services_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "business_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      businesses: {
        Row: {
          address: string | null;
          city_id: number;
          created_at: string;
          description: string | null;
          email: string | null;
          emergency_24h: boolean;
          id: string;
          instagram: string | null;
          languages: string[];
          lat: number | null;
          lng: number | null;
          moderated_at: string | null;
          moderation_note: string | null;
          name: string;
          offers_online: boolean;
          owner_id: string | null;
          phone: string | null;
          rating_avg: number;
          rating_count: number;
          response_time_bucket:
            Database["public"]["Enums"]["response_time_bucket"] | null;
          search_text: string | null;
          slug: string;
          source_urls: string[] | null;
          status: Database["public"]["Enums"]["business_status"];
          updated_at: string;
          verified_at: string | null;
          viber: string | null;
          views_count: number;
          website: string | null;
          whatsapp: string | null;
        };
        Insert: {
          address?: string | null;
          city_id: number;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          emergency_24h?: boolean;
          id?: string;
          instagram?: string | null;
          languages?: string[];
          lat?: number | null;
          lng?: number | null;
          moderated_at?: string | null;
          moderation_note?: string | null;
          name: string;
          offers_online?: boolean;
          owner_id?: string | null;
          phone?: string | null;
          rating_avg?: number;
          rating_count?: number;
          response_time_bucket?:
            Database["public"]["Enums"]["response_time_bucket"] | null;
          search_text?: string | null;
          slug: string;
          source_urls?: string[] | null;
          status?: Database["public"]["Enums"]["business_status"];
          updated_at?: string;
          verified_at?: string | null;
          viber?: string | null;
          views_count?: number;
          website?: string | null;
          whatsapp?: string | null;
        };
        Update: {
          address?: string | null;
          city_id?: number;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          emergency_24h?: boolean;
          id?: string;
          instagram?: string | null;
          languages?: string[];
          lat?: number | null;
          lng?: number | null;
          moderated_at?: string | null;
          moderation_note?: string | null;
          name?: string;
          offers_online?: boolean;
          owner_id?: string | null;
          phone?: string | null;
          rating_avg?: number;
          rating_count?: number;
          response_time_bucket?:
            Database["public"]["Enums"]["response_time_bucket"] | null;
          search_text?: string | null;
          slug?: string;
          source_urls?: string[] | null;
          status?: Database["public"]["Enums"]["business_status"];
          updated_at?: string;
          verified_at?: string | null;
          viber?: string | null;
          views_count?: number;
          website?: string | null;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "businesses_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cities: {
        Row: {
          created_at: string;
          id: number;
          lat: number | null;
          lng: number | null;
          name_en: string;
          name_locative_me: string;
          name_me: string;
          name_ru: string;
          parent_city_id: number | null;
          population: number | null;
          region_id: number;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          lat?: number | null;
          lng?: number | null;
          name_en: string;
          name_locative_me: string;
          name_me: string;
          name_ru: string;
          parent_city_id?: number | null;
          population?: number | null;
          region_id: number;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          lat?: number | null;
          lng?: number | null;
          name_en?: string;
          name_locative_me?: string;
          name_me?: string;
          name_ru?: string;
          parent_city_id?: number | null;
          population?: number | null;
          region_id?: number;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cities_parent_city_id_fkey";
            columns: ["parent_city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cities_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiries: {
        Row: {
          answers: Json;
          body: string;
          business_id: string | null;
          city_id: number;
          closed_at: string | null;
          created_at: string;
          id: string;
          phone: string | null;
          preferred_time: string | null;
          service_id: number;
          status: Database["public"]["Enums"]["inquiry_status"];
          urgent: boolean;
          user_id: string;
        };
        Insert: {
          answers?: Json;
          body: string;
          business_id?: string | null;
          city_id: number;
          closed_at?: string | null;
          created_at?: string;
          id?: string;
          phone?: string | null;
          preferred_time?: string | null;
          service_id: number;
          status?: Database["public"]["Enums"]["inquiry_status"];
          urgent?: boolean;
          user_id: string;
        };
        Update: {
          answers?: Json;
          body?: string;
          business_id?: string | null;
          city_id?: number;
          closed_at?: string | null;
          created_at?: string;
          id?: string;
          phone?: string | null;
          preferred_time?: string | null;
          service_id?: number;
          status?: Database["public"]["Enums"]["inquiry_status"];
          urgent?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "inquiries_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiry_reveals: {
        Row: {
          business_id: string;
          inquiry_id: string;
          revealed_at: string;
        };
        Insert: {
          business_id: string;
          inquiry_id: string;
          revealed_at?: string;
        };
        Update: {
          business_id?: string;
          inquiry_id?: string;
          revealed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiry_reveals_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "inquiry_reveals_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiry_reveals_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
        ];
      };
      price_list_items: {
        Row: {
          business_id: string;
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["price_kind"];
          name: string;
          preset_id: number | null;
          price_from: number | null;
          price_to: number | null;
          service_id: number | null;
          sort_order: number;
          unit: Database["public"]["Enums"]["price_unit"];
        };
        Insert: {
          business_id: string;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["price_kind"];
          name: string;
          preset_id?: number | null;
          price_from?: number | null;
          price_to?: number | null;
          service_id?: number | null;
          sort_order?: number;
          unit?: Database["public"]["Enums"]["price_unit"];
        };
        Update: {
          business_id?: string;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["price_kind"];
          name?: string;
          preset_id?: number | null;
          price_from?: number | null;
          price_to?: number | null;
          service_id?: number | null;
          sort_order?: number;
          unit?: Database["public"]["Enums"]["price_unit"];
        };
        Relationships: [
          {
            foreignKeyName: "price_list_items_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "price_list_items_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_preset_id_fkey";
            columns: ["preset_id"];
            isOneToOne: false;
            referencedRelation: "service_price_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      regions: {
        Row: {
          id: number;
          name_en: string;
          name_me: string;
          name_ru: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          id?: never;
          name_en: string;
          name_me: string;
          name_ru: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          id?: never;
          name_en?: string;
          name_me?: string;
          name_ru?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          business_id: string | null;
          created_at: string;
          details: string | null;
          id: string;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id: string | null;
          resolution_note: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          review_id: string | null;
          status: Database["public"]["Enums"]["report_status"];
          target: Database["public"]["Enums"]["report_target"];
        };
        Insert: {
          business_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          review_id?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          target: Database["public"]["Enums"]["report_target"];
        };
        Update: {
          business_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: Database["public"]["Enums"]["report_reason"];
          reporter_id?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          review_id?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          target?: Database["public"]["Enums"]["report_target"];
        };
        Relationships: [
          {
            foreignKeyName: "reports_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "reports_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_resolved_by_fkey";
            columns: ["resolved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "public_reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      review_photos: {
        Row: {
          created_at: string;
          height: number | null;
          id: string;
          review_id: string;
          sort_order: number;
          storage_path: string;
          width: number | null;
        };
        Insert: {
          created_at?: string;
          height?: number | null;
          id?: string;
          review_id: string;
          sort_order?: number;
          storage_path: string;
          width?: number | null;
        };
        Update: {
          created_at?: string;
          height?: number | null;
          id?: string;
          review_id?: string;
          sort_order?: number;
          storage_path?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "public_reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_photos_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          body: string | null;
          business_id: string;
          created_at: string;
          edited_at: string | null;
          id: string;
          rating: number;
          replied_at: string | null;
          reply_body: string | null;
          status: Database["public"]["Enums"]["review_status"];
          user_id: string;
        };
        Insert: {
          body?: string | null;
          business_id: string;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          rating: number;
          replied_at?: string | null;
          reply_body?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          user_id: string;
        };
        Update: {
          body?: string | null;
          business_id?: string;
          created_at?: string;
          edited_at?: string | null;
          id?: string;
          rating?: number;
          replied_at?: string | null;
          reply_body?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      service_groups: {
        Row: {
          icon: string | null;
          id: number;
          name_en: string;
          name_me: string;
          name_ru: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          icon?: string | null;
          id?: never;
          name_en: string;
          name_me: string;
          name_ru: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          icon?: string | null;
          id?: never;
          name_en?: string;
          name_me?: string;
          name_ru?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      service_price_items: {
        Row: {
          id: number;
          name_en: string;
          name_me: string;
          name_ru: string;
          service_id: number;
          sort_order: number;
          unit: Database["public"]["Enums"]["price_unit"];
        };
        Insert: {
          id?: never;
          name_en: string;
          name_me: string;
          name_ru: string;
          service_id: number;
          sort_order?: number;
          unit: Database["public"]["Enums"]["price_unit"];
        };
        Update: {
          id?: never;
          name_en?: string;
          name_me?: string;
          name_ru?: string;
          service_id?: number;
          sort_order?: number;
          unit?: Database["public"]["Enums"]["price_unit"];
        };
        Relationships: [
          {
            foreignKeyName: "service_price_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          description_en: string | null;
          description_me: string | null;
          description_ru: string | null;
          faq_en: Json;
          faq_me: Json;
          faq_ru: Json;
          group_id: number;
          id: number;
          name_en: string;
          name_me: string;
          name_ru: string;
          offers_online: boolean;
          plural_gen_me: string | null;
          price_unit_default: Database["public"]["Enums"]["price_unit"] | null;
          schema_type: string | null;
          search_text: string | null;
          slug_en: string;
          slug_me: string;
          slug_ru: string;
          sort_order: number;
          tips_en: Json;
          tips_me: Json;
          tips_ru: Json;
        };
        Insert: {
          created_at?: string;
          description_en?: string | null;
          description_me?: string | null;
          description_ru?: string | null;
          faq_en?: Json;
          faq_me?: Json;
          faq_ru?: Json;
          group_id: number;
          id?: never;
          name_en: string;
          name_me: string;
          name_ru: string;
          offers_online?: boolean;
          plural_gen_me?: string | null;
          price_unit_default?: Database["public"]["Enums"]["price_unit"] | null;
          schema_type?: string | null;
          search_text?: string | null;
          slug_en: string;
          slug_me: string;
          slug_ru: string;
          sort_order?: number;
          tips_en?: Json;
          tips_me?: Json;
          tips_ru?: Json;
        };
        Update: {
          created_at?: string;
          description_en?: string | null;
          description_me?: string | null;
          description_ru?: string | null;
          faq_en?: Json;
          faq_me?: Json;
          faq_ru?: Json;
          group_id?: number;
          id?: never;
          name_en?: string;
          name_me?: string;
          name_ru?: string;
          offers_online?: boolean;
          plural_gen_me?: string | null;
          price_unit_default?: Database["public"]["Enums"]["price_unit"] | null;
          schema_type?: string | null;
          search_text?: string | null;
          slug_en?: string;
          slug_me?: string;
          slug_ru?: string;
          sort_order?: number;
          tips_en?: Json;
          tips_me?: Json;
          tips_ru?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "services_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "service_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      sponsorships: {
        Row: {
          business_id: string;
          city_id: number | null;
          created_at: string;
          ends_at: string;
          id: string;
          payment_ref: string | null;
          scope: Database["public"]["Enums"]["sponsorship_scope"];
          service_id: number | null;
          starts_at: string;
          status: Database["public"]["Enums"]["sponsorship_status"];
        };
        Insert: {
          business_id: string;
          city_id?: number | null;
          created_at?: string;
          ends_at: string;
          id?: string;
          payment_ref?: string | null;
          scope: Database["public"]["Enums"]["sponsorship_scope"];
          service_id?: number | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["sponsorship_status"];
        };
        Update: {
          business_id?: string;
          city_id?: number | null;
          created_at?: string;
          ends_at?: string;
          id?: string;
          payment_ref?: string | null;
          scope?: Database["public"]["Enums"]["sponsorship_scope"];
          service_id?: number | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["sponsorship_status"];
        };
        Relationships: [
          {
            foreignKeyName: "sponsorships_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "sponsorships_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sponsorships_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sponsorships_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      business_contact_channels: {
        Row: {
          business_id: string | null;
          has_email: boolean | null;
          has_phone: boolean | null;
          has_viber: boolean | null;
          has_whatsapp: boolean | null;
        };
        Insert: {
          business_id?: string | null;
          has_email?: never;
          has_phone?: never;
          has_viber?: never;
          has_whatsapp?: never;
        };
        Update: {
          business_id?: string | null;
          has_email?: never;
          has_phone?: never;
          has_viber?: never;
          has_whatsapp?: never;
        };
        Relationships: [];
      };
      price_item_stats: {
        Row: {
          city_id: number | null;
          city_key: number | null;
          items_count: number | null;
          preset_id: number | null;
          price_avg: number | null;
          price_max: number | null;
          price_min: number | null;
          service_id: number | null;
          unit: Database["public"]["Enums"]["price_unit"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "price_list_items_preset_id_fkey";
            columns: ["preset_id"];
            isOneToOne: false;
            referencedRelation: "service_price_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      price_points: {
        Row: {
          business_id: string | null;
          city_id: number | null;
          id: string | null;
          preset_id: number | null;
          price: number | null;
          price_high: number | null;
          price_low: number | null;
          service_id: number | null;
          unit: Database["public"]["Enums"]["price_unit"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "price_list_items_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_preset_id_fkey";
            columns: ["preset_id"];
            isOneToOne: false;
            referencedRelation: "service_price_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "price_list_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      price_stats: {
        Row: {
          businesses_count: number | null;
          city_id: number | null;
          city_key: number | null;
          computed_at: string | null;
          items_count: number | null;
          price_avg: number | null;
          price_max: number | null;
          price_median: number | null;
          price_min: number | null;
          price_p25: number | null;
          price_p75: number | null;
          service_id: number | null;
          unit: Database["public"]["Enums"]["price_unit"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "price_list_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      public_reviews: {
        Row: {
          author_name: string | null;
          body: string | null;
          business_city_id: number | null;
          business_id: string | null;
          business_name: string | null;
          business_slug: string | null;
          created_at: string | null;
          edited_at: string | null;
          id: string | null;
          rating: number | null;
          replied_at: string | null;
          reply_body: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_city_id_fkey";
            columns: ["business_city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "business_contact_channels";
            referencedColumns: ["business_id"];
          },
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      can_see_inquiry: { Args: { p_inquiry_id: string }; Returns: boolean };
      immutable_unaccent: { Args: { "": string }; Returns: string };
      inquiry_matches_business: {
        Args: { p_business_id: string; p_inquiry_id: string };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
      is_business_public: { Args: { p_business_id: string }; Returns: boolean };
      is_review_author: { Args: { p_review_id: string }; Returns: boolean };
      is_review_visible: { Args: { p_review_id: string }; Returns: boolean };
      owns_business: { Args: { p_business_id: string }; Returns: boolean };
      refresh_price_stats: { Args: never; Returns: undefined };
      rate_limit_hit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number };
        Returns: boolean;
      };
      reveal_business_contact: {
        Args: {
          p_business_id: string;
          p_kind: Database["public"]["Enums"]["contact_kind"];
        };
        Returns: string;
      };
      reveal_inquiry_contact: {
        Args: { p_business_id: string; p_inquiry_id: string };
        Returns: {
          name: string;
          phone: string;
        }[];
      };
      search_business_ids: {
        Args: { max_results?: number; q: string };
        Returns: {
          id: string;
        }[];
      };
      search_cities: {
        Args: { max_results?: number; q: string };
        Returns: {
          created_at: string;
          id: number;
          lat: number | null;
          lng: number | null;
          name_en: string;
          name_locative_me: string;
          name_me: string;
          name_ru: string;
          parent_city_id: number | null;
          population: number | null;
          region_id: number;
          slug: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "cities";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      search_normalize: { Args: { "": string }; Returns: string };
      search_services: {
        Args: { max_results?: number; q: string };
        Returns: {
          created_at: string;
          description_en: string | null;
          description_me: string | null;
          description_ru: string | null;
          faq_en: Json;
          faq_me: Json;
          faq_ru: Json;
          group_id: number;
          id: number;
          name_en: string;
          name_me: string;
          name_ru: string;
          offers_online: boolean;
          plural_gen_me: string | null;
          price_unit_default: Database["public"]["Enums"]["price_unit"] | null;
          schema_type: string | null;
          search_text: string | null;
          slug_en: string;
          slug_me: string;
          slug_ru: string;
          sort_order: number;
          tips_en: Json;
          tips_me: Json;
          tips_ru: Json;
        }[];
        SetofOptions: {
          from: "*";
          to: "services";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      storage_business_id: { Args: { object_name: string }; Returns: string };
      track_banner_click: { Args: { p_banner_id: string }; Returns: string };
      track_business_contact: {
        Args: {
          p_business_id: string;
          p_kind: Database["public"]["Enums"]["contact_kind"];
        };
        Returns: undefined;
      };
      set_business_cover: {
        Args: { p_business_id: string; p_photo_id: string };
        Returns: undefined;
      };
      set_business_hours: {
        Args: { p_business_id: string; p_hours: Json };
        Returns: undefined;
      };
      set_business_price_list: {
        Args: { p_business_id: string; p_items: Json };
        Returns: undefined;
      };
      set_business_services_and_cities: {
        Args: {
          p_business_id: string;
          p_city_id: number;
          p_city_ids: number[];
          p_services: Json;
        };
        Returns: undefined;
      };
      track_business_view: {
        Args: { p_business_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      business_status: "pending" | "active" | "rejected" | "suspended";
      contact_kind:
        "phone" | "viber" | "whatsapp" | "email" | "website" | "instagram";
      inquiry_status:
        "pending" | "approved" | "rejected" | "closed" | "expired";
      price_kind: "fixed" | "from" | "range" | "on_request" | "free";
      price_unit: "hour" | "m2" | "piece" | "job" | "session" | "day" | "month";
      report_reason:
        "inappropriate" | "abusive" | "false_info" | "spam" | "other";
      report_status: "open" | "resolved" | "dismissed";
      report_target: "business" | "review";
      response_time_bucket: "minutes" | "hour" | "hours" | "day";
      review_status: "published" | "hidden" | "removed";
      sponsorship_scope: "home" | "service" | "city" | "service_city";
      sponsorship_status: "active" | "paused" | "expired" | "cancelled";
      user_role: "user" | "business" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      business_status: ["pending", "active", "rejected", "suspended"],
      contact_kind: [
        "phone",
        "viber",
        "whatsapp",
        "email",
        "website",
        "instagram",
      ],
      inquiry_status: ["pending", "approved", "rejected", "closed", "expired"],
      price_kind: ["fixed", "from", "range", "on_request", "free"],
      price_unit: ["hour", "m2", "piece", "job", "session", "day", "month"],
      report_reason: [
        "inappropriate",
        "abusive",
        "false_info",
        "spam",
        "other",
      ],
      report_status: ["open", "resolved", "dismissed"],
      report_target: ["business", "review"],
      response_time_bucket: ["minutes", "hour", "hours", "day"],
      review_status: ["published", "hidden", "removed"],
      sponsorship_scope: ["home", "service", "city", "service_city"],
      sponsorship_status: ["active", "paused", "expired", "cancelled"],
      user_role: ["user", "business", "admin"],
    },
  },
} as const;
