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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          country: string
          created_at: string
          district: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          label: string | null
          landmark: string | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          recipient_name: string | null
          recipient_phone: string | null
          region: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"]
          city: string
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          label?: string | null
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          region?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"]
          city?: string
          country?: string
          created_at?: string
          district?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          label?: string | null
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          region?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          business_name: string | null
          business_registration_number: string | null
          buyer_type: Database["public"]["Enums"]["buyer_type"]
          created_at: string
          credit_limit: number | null
          default_currency: string | null
          id: string
          notes: string | null
          payment_terms_days: number | null
          tax_id: string | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          business_name?: string | null
          business_registration_number?: string | null
          buyer_type?: Database["public"]["Enums"]["buyer_type"]
          created_at?: string
          credit_limit?: number | null
          default_currency?: string | null
          id?: string
          notes?: string | null
          payment_terms_days?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          business_name?: string | null
          business_registration_number?: string | null
          buyer_type?: Database["public"]["Enums"]["buyer_type"]
          created_at?: string
          credit_limit?: number | null
          default_currency?: string | null
          id?: string
          notes?: string | null
          payment_terms_days?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          notes: string | null
          product_variant_id: string
          quantity: number
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          notes?: string | null
          product_variant_id: string
          quantity?: number
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_variant_id?: string
          quantity?: number
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_delivery_date: string | null
          actual_pickup_date: string | null
          created_at: string
          delivery_address_id: string | null
          delivery_fee: number | null
          delivery_model: Database["public"]["Enums"]["delivery_model"]
          delivery_notes: string | null
          dimensions_cm: string | null
          estimated_delivery_date: string | null
          estimated_pickup_date: string | null
          id: string
          logistics_partner_id: string | null
          order_id: string
          pickup_address_id: string | null
          proof_of_delivery_url: string | null
          recipient_name: string | null
          recipient_phone: string | null
          risk_score: number | null
          signature_url: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["delivery_status"]
          tracking_number: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          actual_pickup_date?: string | null
          created_at?: string
          delivery_address_id?: string | null
          delivery_fee?: number | null
          delivery_model?: Database["public"]["Enums"]["delivery_model"]
          delivery_notes?: string | null
          dimensions_cm?: string | null
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          logistics_partner_id?: string | null
          order_id: string
          pickup_address_id?: string | null
          proof_of_delivery_url?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          risk_score?: number | null
          signature_url?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          tracking_number?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          actual_pickup_date?: string | null
          created_at?: string
          delivery_address_id?: string | null
          delivery_fee?: number | null
          delivery_model?: Database["public"]["Enums"]["delivery_model"]
          delivery_notes?: string | null
          dimensions_cm?: string | null
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          id?: string
          logistics_partner_id?: string | null
          order_id?: string
          pickup_address_id?: string | null
          proof_of_delivery_url?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          risk_score?: number | null
          signature_url?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          tracking_number?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_logistics_partner_id_fkey"
            columns: ["logistics_partner_id"]
            isOneToOne: false
            referencedRelation: "logistics_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_pickup_address_id_fkey"
            columns: ["pickup_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          against_supplier_id: string | null
          created_at: string
          description: string | null
          dispute_number: string
          evidence_urls: string[] | null
          id: string
          order_id: string
          raised_by: string
          reason: string
          refund_amount: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
        }
        Insert: {
          against_supplier_id?: string | null
          created_at?: string
          description?: string | null
          dispute_number: string
          evidence_urls?: string[] | null
          id?: string
          order_id: string
          raised_by: string
          reason: string
          refund_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Update: {
          against_supplier_id?: string | null
          created_at?: string
          description?: string | null
          dispute_number?: string
          evidence_urls?: string[] | null
          id?: string
          order_id?: string
          raised_by?: string
          reason?: string
          refund_amount?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_against_supplier_id_fkey"
            columns: ["against_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_partners: {
        Row: {
          base_rate: number | null
          code: string | null
          coverage_cities: string[] | null
          coverage_regions: string[] | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          on_time_rate: number | null
          per_km_rate: number | null
          performance_score: number | null
          phone: string | null
          service_types: string[] | null
          total_deliveries: number | null
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          base_rate?: number | null
          code?: string | null
          coverage_cities?: string[] | null
          coverage_regions?: string[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          on_time_rate?: number | null
          per_km_rate?: number | null
          performance_score?: number | null
          phone?: string | null
          service_types?: string[] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          base_rate?: number | null
          code?: string | null
          coverage_cities?: string[] | null
          coverage_regions?: string[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          on_time_rate?: number | null
          per_km_rate?: number | null
          performance_score?: number | null
          phone?: string | null
          service_types?: string[] | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          discount_amount: number | null
          id: string
          notes: string | null
          order_id: string
          product_name: string
          product_variant_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          supplier_id: string
          tax_amount: number | null
          total: number
          unit_price: number
          updated_at: string
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_id: string
          product_name: string
          product_variant_id: string
          quantity: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          supplier_id: string
          tax_amount?: number | null
          total: number
          unit_price: number
          updated_at?: string
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_id?: string
          product_name?: string
          product_variant_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          supplier_id?: string
          tax_amount?: number | null
          total?: number
          unit_price?: number
          updated_at?: string
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          currency: string
          delivered_at: string | null
          delivery_fee: number | null
          discount_amount: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipped_at: string | null
          shipping_address_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_fee?: number | null
          discount_amount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipped_at?: string | null
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          delivered_at?: string | null
          delivery_fee?: number | null
          discount_amount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipped_at?: string | null
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failed_at: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          order_id: string
          paid_at: string | null
          payment_method: string
          payment_provider: string | null
          payment_url: string | null
          provider_reference: string | null
          refund_amount: number | null
          refunded_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          paid_at?: string | null
          payment_method: string
          payment_provider?: string | null
          payment_url?: string | null
          provider_reference?: string | null
          refund_amount?: number | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          paid_at?: string | null
          payment_method?: string
          payment_provider?: string | null
          payment_url?: string | null
          provider_reference?: string | null
          refund_amount?: number | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string
          currency: string
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          max_quantity: number | null
          min_quantity: number
          price_per_unit: number
          product_variant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          max_quantity?: number | null
          min_quantity?: number
          price_per_unit: number
          product_variant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          max_quantity?: number | null
          min_quantity?: number
          price_per_unit?: number
          product_variant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_tiers_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          low_stock_threshold: number | null
          name: string
          packaging: string | null
          product_id: string
          quality: string | null
          reserved_quantity: number | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          low_stock_threshold?: number | null
          name: string
          packaging?: string | null
          product_id: string
          quality?: string | null
          reserved_quantity?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          low_stock_threshold?: number | null
          name?: string
          packaging?: string | null
          product_id?: string
          quality?: string | null
          reserved_quantity?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          created_at: string
          description: string | null
          expiry_date: string | null
          harvest_date: string | null
          id: string
          is_featured: boolean | null
          is_organic: boolean | null
          lead_time_days: number | null
          max_order_quantity: number | null
          min_order_quantity: number | null
          name: string
          order_count: number | null
          origin_country: string | null
          origin_region: string | null
          short_description: string | null
          sku: string | null
          slug: string | null
          status: Database["public"]["Enums"]["product_status"]
          supplier_id: string
          unit_of_measure: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          is_featured?: boolean | null
          is_organic?: boolean | null
          lead_time_days?: number | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          name: string
          order_count?: number | null
          origin_country?: string | null
          origin_region?: string | null
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          supplier_id: string
          unit_of_measure?: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          is_featured?: boolean | null
          is_organic?: boolean | null
          lead_time_days?: number | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          name?: string
          order_count?: number | null
          origin_country?: string | null
          origin_region?: string | null
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          supplier_id?: string
          unit_of_measure?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean | null
          preferred_currency: string | null
          preferred_language: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      recommendation_events: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          metadata: Json | null
          product_id: string | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json | null
          product_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json | null
          product_id?: string | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          cons: string[] | null
          created_at: string
          helpful_count: number | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_verified_purchase: boolean | null
          order_item_id: string | null
          product_id: string
          pros: string[] | null
          rating: number
          response_at: string | null
          response_from_supplier: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          cons?: string[] | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified_purchase?: boolean | null
          order_item_id?: string | null
          product_id: string
          pros?: string[] | null
          rating: number
          response_at?: string | null
          response_from_supplier?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          cons?: string[] | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified_purchase?: boolean | null
          order_item_id?: string | null
          product_id?: string
          pros?: string[] | null
          rating?: number
          response_at?: string | null
          response_from_supplier?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_quotes: {
        Row: {
          attachments: string[] | null
          created_at: string
          currency: string
          id: string
          is_accepted: boolean | null
          lead_time_days: number | null
          notes: string | null
          quantity_available: number | null
          quoted_price: number
          responded_at: string | null
          rfq_id: string
          supplier_id: string
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          currency?: string
          id?: string
          is_accepted?: boolean | null
          lead_time_days?: number | null
          notes?: string | null
          quantity_available?: number | null
          quoted_price: number
          responded_at?: string | null
          rfq_id: string
          supplier_id: string
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          currency?: string
          id?: string
          is_accepted?: boolean | null
          lead_time_days?: number | null
          notes?: string | null
          quantity_available?: number | null
          quoted_price?: number
          responded_at?: string | null
          rfq_id?: string
          supplier_id?: string
          updated_at?: string
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rfq_quotes_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfq_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_quotes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_requests: {
        Row: {
          attachments: string[] | null
          category_id: string | null
          certification_requirements: string[] | null
          created_at: string
          currency: string | null
          delivery_deadline: string | null
          delivery_location: string | null
          description: string | null
          expires_at: string | null
          id: string
          product_name: string
          quality_requirements: string | null
          quantity: number
          rfq_number: string
          status: Database["public"]["Enums"]["rfq_status"]
          target_price: number | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          category_id?: string | null
          certification_requirements?: string[] | null
          created_at?: string
          currency?: string | null
          delivery_deadline?: string | null
          delivery_location?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_name: string
          quality_requirements?: string | null
          quantity: number
          rfq_number: string
          status?: Database["public"]["Enums"]["rfq_status"]
          target_price?: number | null
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          category_id?: string | null
          certification_requirements?: string[] | null
          created_at?: string
          currency?: string | null
          delivery_deadline?: string | null
          delivery_location?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_name?: string
          quality_requirements?: string | null
          quantity?: number
          rfq_number?: string
          status?: Database["public"]["Enums"]["rfq_status"]
          target_price?: number | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_suppliers: {
        Row: {
          created_at: string
          id: string
          supplier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          supplier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          supplier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_events: {
        Row: {
          created_at: string
          delivery_id: string
          description: string | null
          event_time: string
          event_type: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          delivery_id: string
          description?: string | null
          event_time?: string
          event_type: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          delivery_id?: string
          description?: string | null
          event_time?: string
          event_type?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          banner_url: string | null
          city: string | null
          company_name: string
          company_registration_number: string | null
          country: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          phone: string | null
          rating: number | null
          region: string | null
          response_rate: number | null
          response_time_hours: number | null
          tax_id: string | null
          total_orders: number | null
          total_products: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          company_name: string
          company_registration_number?: string | null
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          region?: string | null
          response_rate?: number | null
          response_time_hours?: number | null
          tax_id?: string | null
          total_orders?: number | null
          total_products?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          company_name?: string
          company_registration_number?: string | null
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          region?: string | null
          response_rate?: number | null
          response_time_hours?: number | null
          tax_id?: string | null
          total_orders?: number | null
          total_products?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
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
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      address_type: "billing" | "shipping" | "warehouse" | "office"
      app_role:
        | "buyer_individual"
        | "buyer_business"
        | "supplier"
        | "admin"
        | "logistics_partner"
      buyer_type: "individual" | "business" | "cooperative" | "government"
      delivery_model: "harvesta" | "supplier" | "partner" | "pickup"
      delivery_status:
        | "pending"
        | "assigned"
        | "picked_up"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "failed"
        | "returned"
      dispute_status:
        | "open"
        | "under_review"
        | "resolved"
        | "escalated"
        | "closed"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "in_transit"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      product_status:
        | "draft"
        | "active"
        | "inactive"
        | "out_of_stock"
        | "discontinued"
      rfq_status:
        | "open"
        | "quoted"
        | "negotiating"
        | "accepted"
        | "rejected"
        | "expired"
        | "cancelled"
      user_status: "active" | "suspended" | "pending_verification" | "inactive"
      verification_status: "pending" | "verified" | "rejected" | "expired"
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
      address_type: ["billing", "shipping", "warehouse", "office"],
      app_role: [
        "buyer_individual",
        "buyer_business",
        "supplier",
        "admin",
        "logistics_partner",
      ],
      buyer_type: ["individual", "business", "cooperative", "government"],
      delivery_model: ["harvesta", "supplier", "partner", "pickup"],
      delivery_status: [
        "pending",
        "assigned",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed",
        "returned",
      ],
      dispute_status: [
        "open",
        "under_review",
        "resolved",
        "escalated",
        "closed",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "in_transit",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      product_status: [
        "draft",
        "active",
        "inactive",
        "out_of_stock",
        "discontinued",
      ],
      rfq_status: [
        "open",
        "quoted",
        "negotiating",
        "accepted",
        "rejected",
        "expired",
        "cancelled",
      ],
      user_status: ["active", "suspended", "pending_verification", "inactive"],
      verification_status: ["pending", "verified", "rejected", "expired"],
    },
  },
} as const
