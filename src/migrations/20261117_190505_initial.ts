import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_users_account_type" AS ENUM('personal', 'business', 'corporate');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'suspended');
  CREATE TYPE "public"."enum__users_v_version_account_type" AS ENUM('personal', 'business', 'corporate');
  CREATE TYPE "public"."enum__users_v_version_status" AS ENUM('active', 'suspended');
  CREATE TYPE "public"."enum_suburbs_city" AS ENUM('cape-town', 'stellenbosch', 'johannesburg', 'pretoria', 'durban', 'gqeberha', 'bloemfontein', 'east-london');
  CREATE TYPE "public"."enum_suburbs_launch_status" AS ENUM('visible', 'hidden');
  CREATE TYPE "public"."enum__suburbs_v_version_city" AS ENUM('cape-town', 'stellenbosch', 'johannesburg', 'pretoria', 'durban', 'gqeberha', 'bloemfontein', 'east-london');
  CREATE TYPE "public"."enum__suburbs_v_version_launch_status" AS ENUM('visible', 'hidden');
  CREATE TYPE "public"."enum_homes_property_type" AS ENUM('house', 'flat', 'townhouse', 'loft');
  CREATE TYPE "public"."enum_homes_group_status" AS ENUM('open', 'almost-full', 'confirmed', 'expired');
  CREATE TYPE "public"."enum_homes_status" AS ENUM('pending', 'verified', 'hidden');
  CREATE TYPE "public"."enum__homes_v_version_property_type" AS ENUM('house', 'flat', 'townhouse', 'loft');
  CREATE TYPE "public"."enum__homes_v_version_group_status" AS ENUM('open', 'almost-full', 'confirmed', 'expired');
  CREATE TYPE "public"."enum__homes_v_version_status" AS ENUM('pending', 'verified', 'hidden');
  CREATE TYPE "public"."enum_demand_interests_tier" AS ENUM('student-plus', 'young-professional', 'visitor-short-stay', 'business-office');
  CREATE TYPE "public"."enum_demand_interests_status" AS ENUM('registered', 'reservation-invited', 'reserved', 'lease-signed', 'withdrawn');
  CREATE TYPE "public"."enum_demand_interests_reservation_deposit_status" AS ENUM('not-enabled', 'invited', 'paid', 'refunded');
  CREATE TYPE "public"."enum__demand_interests_v_version_tier" AS ENUM('student-plus', 'young-professional', 'visitor-short-stay', 'business-office');
  CREATE TYPE "public"."enum__demand_interests_v_version_status" AS ENUM('registered', 'reservation-invited', 'reserved', 'lease-signed', 'withdrawn');
  CREATE TYPE "public"."enum__demand_interests_v_version_reservation_deposit_status" AS ENUM('not-enabled', 'invited', 'paid', 'refunded');
  CREATE TYPE "public"."enum_tenant_applications_references_reference_type" AS ENUM('landlord', 'character', 'employer-institution', 'commercial-landlord', 'trade');
  CREATE TYPE "public"."enum_tenant_applications_references_status" AS ENUM('not-requested', 'requested', 'received', 'overdue');
  CREATE TYPE "public"."enum_tenant_applications_application_kind" AS ENUM('accommodation', 'office');
  CREATE TYPE "public"."enum_tenant_applications_id_type" AS ENUM('south-african-id', 'passport', 'asylum-permit', 'refugee-permit');
  CREATE TYPE "public"."enum_tenant_applications_applicant_type" AS ENUM('student', 'employed', 'intern-graduate', 'business', 'other');
  CREATE TYPE "public"."enum_tenant_applications_tier" AS ENUM('student-plus', 'young-professional', 'visitor-short-stay', 'business-office');
  CREATE TYPE "public"."enum_tenant_applications_agreement_length" AS ENUM('academic-year', '6-months', '12-months', '24-months', 'month-to-month', 'nightly-weekly');
  CREATE TYPE "public"."enum_tenant_applications_payer_type" AS ENUM('self', 'parent', 'guardian-family', 'employer-company', 'bursary-funder', 'university-institution', 'split-payment', 'business-company');
  CREATE TYPE "public"."enum_tenant_applications_payment_method" AS ENUM('debit-order', 'eft', 'direct-funder', 'invoice-eft');
  CREATE TYPE "public"."enum_app_office_type" AS ENUM('private-office', 'shared-office', 'entire-floor', 'flexible-workspace');
  CREATE TYPE "public"."enum_tenant_applications_status" AS ENUM('draft', 'submitted', 'documents-requested', 'verification-in-progress', 'affordability-review', 'approved', 'waitlisted', 'declined', 'lease-sent', 'lease-signed', 'deposit-paid');
  CREATE TYPE "public"."enum__tenant_applications_v_version_references_reference_type" AS ENUM('landlord', 'character', 'employer-institution', 'commercial-landlord', 'trade');
  CREATE TYPE "public"."enum__tenant_applications_v_version_references_status" AS ENUM('not-requested', 'requested', 'received', 'overdue');
  CREATE TYPE "public"."enum__tenant_applications_v_version_application_kind" AS ENUM('accommodation', 'office');
  CREATE TYPE "public"."enum__tenant_applications_v_version_id_type" AS ENUM('south-african-id', 'passport', 'asylum-permit', 'refugee-permit');
  CREATE TYPE "public"."enum__tenant_applications_v_version_applicant_type" AS ENUM('student', 'employed', 'intern-graduate', 'business', 'other');
  CREATE TYPE "public"."enum__tenant_applications_v_version_tier" AS ENUM('student-plus', 'young-professional', 'visitor-short-stay', 'business-office');
  CREATE TYPE "public"."enum__tenant_applications_v_version_agreement_length" AS ENUM('academic-year', '6-months', '12-months', '24-months', 'month-to-month', 'nightly-weekly');
  CREATE TYPE "public"."enum__tenant_applications_v_version_payer_type" AS ENUM('self', 'parent', 'guardian-family', 'employer-company', 'bursary-funder', 'university-institution', 'split-payment', 'business-company');
  CREATE TYPE "public"."enum__tenant_applications_v_version_payment_method" AS ENUM('debit-order', 'eft', 'direct-funder', 'invoice-eft');
  CREATE TYPE "public"."enum__tenant_applications_v_version_status" AS ENUM('draft', 'submitted', 'documents-requested', 'verification-in-progress', 'affordability-review', 'approved', 'waitlisted', 'declined', 'lease-sent', 'lease-signed', 'deposit-paid');
  CREATE TYPE "public"."enum_application_documents_document_type" AS ENUM('applicant-id', 'passport-visa', 'proof-registration', 'funding-letter', 'payslips', 'bank-statements', 'employment-letter', 'sponsor-id', 'sponsor-address', 'sponsor-employment', 'company-registration', 'business-bank-statements', 'proof-business-address', 'director-id', 'proof-income', 'applicant-residence', 'passport-photo', 'suretyship', 'other');
  CREATE TYPE "public"."enum_application_documents_status" AS ENUM('uploaded', 'under-review', 'accepted', 'needs-replacement');
  CREATE TYPE "public"."enum__application_documents_v_version_document_type" AS ENUM('applicant-id', 'passport-visa', 'proof-registration', 'funding-letter', 'payslips', 'bank-statements', 'employment-letter', 'sponsor-id', 'sponsor-address', 'sponsor-employment', 'company-registration', 'business-bank-statements', 'proof-business-address', 'director-id', 'proof-income', 'applicant-residence', 'passport-photo', 'suretyship', 'other');
  CREATE TYPE "public"."enum__application_documents_v_version_status" AS ENUM('uploaded', 'under-review', 'accepted', 'needs-replacement');
  CREATE TYPE "public"."enum_property_submissions_city" AS ENUM('Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Durban', 'Gqeberha', 'Bloemfontein', 'East London');
  CREATE TYPE "public"."enum_property_submissions_property_type" AS ENUM('house', 'flat', 'townhouse', 'loft');
  CREATE TYPE "public"."enum_property_submissions_status" AS ENUM('pending', 'reviewing', 'approved', 'declined');
  CREATE TYPE "public"."enum__property_submissions_v_version_city" AS ENUM('Cape Town', 'Stellenbosch', 'Johannesburg', 'Pretoria', 'Durban', 'Gqeberha', 'Bloemfontein', 'East London');
  CREATE TYPE "public"."enum__property_submissions_v_version_property_type" AS ENUM('house', 'flat', 'townhouse', 'loft');
  CREATE TYPE "public"."enum__property_submissions_v_version_status" AS ENUM('pending', 'reviewing', 'approved', 'declined');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"account_type" "enum_users_account_type" DEFAULT 'personal' NOT NULL,
  	"status" "enum_users_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_users_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_uuid" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_users_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_phone" varchar,
  	"version_account_type" "enum__users_v_version_account_type" DEFAULT 'personal' NOT NULL,
  	"version_status" "enum__users_v_version_status" DEFAULT 'active',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_email" varchar NOT NULL,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_reset_password_requested_at" timestamp(3) with time zone,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_users_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"_h_folders_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"_stored" boolean,
  	"_transforms" jsonb,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"original__stored" boolean,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" uuid,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_media_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_alt" varchar NOT NULL,
  	"version__h_folders_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version__stored" boolean,
  	"version__transforms" jsonb,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_original__stored" boolean,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" uuid,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "folders" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_h_folders_id" uuid,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_folders_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version__h_folders_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_h_tags_id" uuid,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_tags_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version__h_tags_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "suburbs_nearby_hubs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "suburbs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"city" "enum_suburbs_city" NOT NULL,
  	"summary" varchar NOT NULL,
  	"price_range" varchar NOT NULL,
  	"transport" varchar NOT NULL,
  	"safety_note" varchar NOT NULL,
  	"launch_status" "enum_suburbs_launch_status" DEFAULT 'hidden',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "suburbs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_suburbs_v_version_nearby_hubs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_suburbs_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_city" "enum__suburbs_v_version_city" NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_price_range" varchar NOT NULL,
  	"version_transport" varchar NOT NULL,
  	"version_safety_note" varchar NOT NULL,
  	"version_launch_status" "enum__suburbs_v_version_launch_status" DEFAULT 'hidden',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_suburbs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "homes_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homes_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homes" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"suburb_id" uuid NOT NULL,
  	"property_type" "enum_homes_property_type" NOT NULL,
  	"description" varchar NOT NULL,
  	"room_price" numeric NOT NULL,
  	"included_costs" numeric DEFAULT 0 NOT NULL,
  	"rooms" numeric NOT NULL,
  	"interested" numeric DEFAULT 0 NOT NULL,
  	"group_status" "enum_homes_group_status" DEFAULT 'open' NOT NULL,
  	"group_expiry" timestamp(3) with time zone NOT NULL,
  	"move_in" timestamp(3) with time zone NOT NULL,
  	"cover_image_id" uuid NOT NULL,
  	"verified_landlord" boolean DEFAULT false,
  	"verified_address" boolean DEFAULT false,
  	"photos_checked" boolean DEFAULT false,
  	"status" "enum_homes_status" DEFAULT 'pending' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" uuid,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_homes_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homes_v_version_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homes_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_suburb_id" uuid NOT NULL,
  	"version_property_type" "enum__homes_v_version_property_type" NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_room_price" numeric NOT NULL,
  	"version_included_costs" numeric DEFAULT 0 NOT NULL,
  	"version_rooms" numeric NOT NULL,
  	"version_interested" numeric DEFAULT 0 NOT NULL,
  	"version_group_status" "enum__homes_v_version_group_status" DEFAULT 'open' NOT NULL,
  	"version_group_expiry" timestamp(3) with time zone NOT NULL,
  	"version_move_in" timestamp(3) with time zone NOT NULL,
  	"version_cover_image_id" uuid NOT NULL,
  	"version_verified_landlord" boolean DEFAULT false,
  	"version_verified_address" boolean DEFAULT false,
  	"version_photos_checked" boolean DEFAULT false,
  	"version_status" "enum__homes_v_version_status" DEFAULT 'pending' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_homes_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" uuid,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "demand_interests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"suburb_id" uuid NOT NULL,
  	"home_id" uuid,
  	"institution_or_employer" varchar NOT NULL,
  	"move_in_month" timestamp(3) with time zone NOT NULL,
  	"monthly_budget" numeric NOT NULL,
  	"tier" "enum_demand_interests_tier" NOT NULL,
  	"sponsor_pays" boolean DEFAULT false,
  	"rooms_requested" numeric DEFAULT 1 NOT NULL,
  	"status" "enum_demand_interests_status" DEFAULT 'registered',
  	"reservation_deposit_status" "enum_demand_interests_reservation_deposit_status" DEFAULT 'not-enabled',
  	"consent_to_contact" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "demand_interests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_demand_interests_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_contact_name" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_phone" varchar NOT NULL,
  	"version_suburb_id" uuid NOT NULL,
  	"version_home_id" uuid,
  	"version_institution_or_employer" varchar NOT NULL,
  	"version_move_in_month" timestamp(3) with time zone NOT NULL,
  	"version_monthly_budget" numeric NOT NULL,
  	"version_tier" "enum__demand_interests_v_version_tier" NOT NULL,
  	"version_sponsor_pays" boolean DEFAULT false,
  	"version_rooms_requested" numeric DEFAULT 1 NOT NULL,
  	"version_status" "enum__demand_interests_v_version_status" DEFAULT 'registered',
  	"version_reservation_deposit_status" "enum__demand_interests_v_version_reservation_deposit_status" DEFAULT 'not-enabled',
  	"version_consent_to_contact" boolean DEFAULT false NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_demand_interests_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "tenant_applications_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"reference_type" "enum_tenant_applications_references_reference_type" NOT NULL,
  	"relationship" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"organisation" varchar,
  	"consent_confirmed" boolean DEFAULT false NOT NULL,
  	"status" "enum_tenant_applications_references_status" DEFAULT 'not-requested'
  );
  
  CREATE TABLE "tenant_applications" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"resume_token_hash" varchar NOT NULL,
  	"interest_id" uuid,
  	"owner_id" uuid,
  	"application_kind" "enum_tenant_applications_application_kind" DEFAULT 'accommodation',
  	"applicant_name" varchar NOT NULL,
  	"preferred_name" varchar,
  	"applicant_email" varchar NOT NULL,
  	"applicant_phone" varchar NOT NULL,
  	"id_type" "enum_tenant_applications_id_type",
  	"id_number" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"nationality" varchar,
  	"current_address" varchar,
  	"applicant_type" "enum_tenant_applications_applicant_type",
  	"institution_or_employer" varchar,
  	"tier" "enum_tenant_applications_tier",
  	"move_in_date" timestamp(3) with time zone,
  	"expected_move_out_date" timestamp(3) with time zone,
  	"agreement_length" "enum_tenant_applications_agreement_length",
  	"preferred_suburb_id" uuid,
  	"preferred_home_id" uuid,
  	"payer_type" "enum_tenant_applications_payer_type",
  	"payment_method" "enum_tenant_applications_payment_method",
  	"payer_net_monthly_income" numeric,
  	"sponsor_name" varchar,
  	"sponsor_email" varchar,
  	"sponsor_phone" varchar,
  	"sponsor_employment_status" varchar,
  	"business_details_company_name" varchar,
  	"business_details_registration_number" varchar,
  	"business_details_vat_number" varchar,
  	"business_details_industry" varchar,
  	"business_details_website" varchar,
  	"business_details_representative_role" varchar,
  	"business_details_team_size" numeric,
  	"business_details_monthly_revenue" numeric,
  	"business_details_office_type" "enum_app_office_type",
  	"business_details_required_seats" numeric,
  	"business_details_intended_use" varchar,
  	"application_data" jsonb NOT NULL,
  	"consents_personal_information" boolean,
  	"consents_contact_references" boolean,
  	"consents_house_rules" boolean,
  	"consents_truthfulness" boolean,
  	"consents_marketing" boolean DEFAULT false,
  	"consents_photos_testimonials" boolean DEFAULT false,
  	"typed_signature" varchar,
  	"signature_date" timestamp(3) with time zone,
  	"last_completed_step" numeric DEFAULT 0,
  	"status" "enum_tenant_applications_status" DEFAULT 'draft',
  	"submitted_at" timestamp(3) with time zone,
  	"assigned_reviewer_id" uuid,
  	"review_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenant_applications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_tenant_applications_v_version_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"reference_type" "enum__tenant_applications_v_version_references_reference_type" NOT NULL,
  	"relationship" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"organisation" varchar,
  	"consent_confirmed" boolean DEFAULT false NOT NULL,
  	"status" "enum__tenant_applications_v_version_references_status" DEFAULT 'not-requested',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tenant_applications_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_resume_token_hash" varchar NOT NULL,
  	"version_interest_id" uuid,
  	"version_owner_id" uuid,
  	"version_application_kind" "enum__tenant_applications_v_version_application_kind" DEFAULT 'accommodation',
  	"version_applicant_name" varchar NOT NULL,
  	"version_preferred_name" varchar,
  	"version_applicant_email" varchar NOT NULL,
  	"version_applicant_phone" varchar NOT NULL,
  	"version_id_type" "enum__tenant_applications_v_version_id_type",
  	"version_id_number" varchar,
  	"version_date_of_birth" timestamp(3) with time zone,
  	"version_nationality" varchar,
  	"version_current_address" varchar,
  	"version_applicant_type" "enum__tenant_applications_v_version_applicant_type",
  	"version_institution_or_employer" varchar,
  	"version_tier" "enum__tenant_applications_v_version_tier",
  	"version_move_in_date" timestamp(3) with time zone,
  	"version_expected_move_out_date" timestamp(3) with time zone,
  	"version_agreement_length" "enum__tenant_applications_v_version_agreement_length",
  	"version_preferred_suburb_id" uuid,
  	"version_preferred_home_id" uuid,
  	"version_payer_type" "enum__tenant_applications_v_version_payer_type",
  	"version_payment_method" "enum__tenant_applications_v_version_payment_method",
  	"version_payer_net_monthly_income" numeric,
  	"version_sponsor_name" varchar,
  	"version_sponsor_email" varchar,
  	"version_sponsor_phone" varchar,
  	"version_sponsor_employment_status" varchar,
  	"version_business_details_company_name" varchar,
  	"version_business_details_registration_number" varchar,
  	"version_business_details_vat_number" varchar,
  	"version_business_details_industry" varchar,
  	"version_business_details_website" varchar,
  	"version_business_details_representative_role" varchar,
  	"version_business_details_team_size" numeric,
  	"version_business_details_monthly_revenue" numeric,
  	"version_business_details_office_type" "enum_app_office_type",
  	"version_business_details_required_seats" numeric,
  	"version_business_details_intended_use" varchar,
  	"version_application_data" jsonb NOT NULL,
  	"version_consents_personal_information" boolean,
  	"version_consents_contact_references" boolean,
  	"version_consents_house_rules" boolean,
  	"version_consents_truthfulness" boolean,
  	"version_consents_marketing" boolean DEFAULT false,
  	"version_consents_photos_testimonials" boolean DEFAULT false,
  	"version_typed_signature" varchar,
  	"version_signature_date" timestamp(3) with time zone,
  	"version_last_completed_step" numeric DEFAULT 0,
  	"version_status" "enum__tenant_applications_v_version_status" DEFAULT 'draft',
  	"version_submitted_at" timestamp(3) with time zone,
  	"version_assigned_reviewer_id" uuid,
  	"version_review_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tenant_applications_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "application_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"application_id" uuid NOT NULL,
  	"application_token" varchar,
  	"document_type" "enum_application_documents_document_type" NOT NULL,
  	"status" "enum_application_documents_status" DEFAULT 'uploaded',
  	"applicant_note" varchar,
  	"review_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"_stored" boolean,
  	"_transforms" jsonb,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"original__stored" boolean,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "application_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_application_documents_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_application_id" uuid NOT NULL,
  	"version_application_token" varchar,
  	"version_document_type" "enum__application_documents_v_version_document_type" NOT NULL,
  	"version_status" "enum__application_documents_v_version_status" DEFAULT 'uploaded',
  	"version_applicant_note" varchar,
  	"version_review_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version__stored" boolean,
  	"version__transforms" jsonb,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_original__stored" boolean,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_application_documents_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "property_submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"company" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"property_address" varchar NOT NULL,
  	"city" "enum_property_submissions_city" NOT NULL,
  	"suburb" varchar NOT NULL,
  	"property_type" "enum_property_submissions_property_type" NOT NULL,
  	"rooms" numeric NOT NULL,
  	"expected_monthly_rent" numeric NOT NULL,
  	"description" varchar NOT NULL,
  	"status" "enum_property_submissions_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "property_submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_property_submissions_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_contact_name" varchar NOT NULL,
  	"version_company" varchar,
  	"version_email" varchar NOT NULL,
  	"version_phone" varchar NOT NULL,
  	"version_property_address" varchar NOT NULL,
  	"version_city" "enum__property_submissions_v_version_city" NOT NULL,
  	"version_suburb" varchar NOT NULL,
  	"version_property_type" "enum__property_submissions_v_version_property_type" NOT NULL,
  	"version_rooms" numeric NOT NULL,
  	"version_expected_monthly_rent" numeric NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_status" "enum__property_submissions_v_version_status" DEFAULT 'pending',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_property_submissions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid,
  	"media_id" uuid,
  	"folders_id" uuid,
  	"tags_id" uuid,
  	"suburbs_id" uuid,
  	"homes_id" uuid,
  	"demand_interests_id" uuid,
  	"tenant_applications_id" uuid,
  	"application_documents_id" uuid,
  	"property_submissions_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_version_sessions" ADD CONSTRAINT "_users_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v" ADD CONSTRAINT "_users_v_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_users_v_rels" ADD CONSTRAINT "_users_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_rels" ADD CONSTRAINT "_users_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_rels" ADD CONSTRAINT "_users_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "suburbs_nearby_hubs" ADD CONSTRAINT "suburbs_nearby_hubs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "suburbs_rels" ADD CONSTRAINT "suburbs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "suburbs_rels" ADD CONSTRAINT "suburbs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "suburbs_rels" ADD CONSTRAINT "suburbs_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_suburbs_v_version_nearby_hubs" ADD CONSTRAINT "_suburbs_v_version_nearby_hubs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_suburbs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_suburbs_v" ADD CONSTRAINT "_suburbs_v_parent_id_suburbs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_suburbs_v_rels" ADD CONSTRAINT "_suburbs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_suburbs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_suburbs_v_rels" ADD CONSTRAINT "_suburbs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_suburbs_v_rels" ADD CONSTRAINT "_suburbs_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes_features" ADD CONSTRAINT "homes_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes_included" ADD CONSTRAINT "homes_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes" ADD CONSTRAINT "homes_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homes" ADD CONSTRAINT "homes_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homes_rels" ADD CONSTRAINT "homes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes_rels" ADD CONSTRAINT "homes_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes_rels" ADD CONSTRAINT "homes_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homes_rels" ADD CONSTRAINT "homes_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v_version_features" ADD CONSTRAINT "_homes_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v_version_included" ADD CONSTRAINT "_homes_v_version_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v" ADD CONSTRAINT "_homes_v_parent_id_homes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homes_v" ADD CONSTRAINT "_homes_v_version_suburb_id_suburbs_id_fk" FOREIGN KEY ("version_suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homes_v" ADD CONSTRAINT "_homes_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homes_v_rels" ADD CONSTRAINT "_homes_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v_rels" ADD CONSTRAINT "_homes_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v_rels" ADD CONSTRAINT "_homes_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homes_v_rels" ADD CONSTRAINT "_homes_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "demand_interests" ADD CONSTRAINT "demand_interests_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "demand_interests" ADD CONSTRAINT "demand_interests_home_id_homes_id_fk" FOREIGN KEY ("home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "demand_interests_rels" ADD CONSTRAINT "demand_interests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."demand_interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "demand_interests_rels" ADD CONSTRAINT "demand_interests_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "demand_interests_rels" ADD CONSTRAINT "demand_interests_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_demand_interests_v" ADD CONSTRAINT "_demand_interests_v_parent_id_demand_interests_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."demand_interests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_demand_interests_v" ADD CONSTRAINT "_demand_interests_v_version_suburb_id_suburbs_id_fk" FOREIGN KEY ("version_suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_demand_interests_v" ADD CONSTRAINT "_demand_interests_v_version_home_id_homes_id_fk" FOREIGN KEY ("version_home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_demand_interests_v_rels" ADD CONSTRAINT "_demand_interests_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_demand_interests_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_demand_interests_v_rels" ADD CONSTRAINT "_demand_interests_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_demand_interests_v_rels" ADD CONSTRAINT "_demand_interests_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_applications_references" ADD CONSTRAINT "tenant_applications_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenant_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_applications" ADD CONSTRAINT "tenant_applications_interest_id_demand_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."demand_interests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_applications" ADD CONSTRAINT "tenant_applications_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_applications" ADD CONSTRAINT "tenant_applications_preferred_suburb_id_suburbs_id_fk" FOREIGN KEY ("preferred_suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_applications" ADD CONSTRAINT "tenant_applications_preferred_home_id_homes_id_fk" FOREIGN KEY ("preferred_home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_applications" ADD CONSTRAINT "tenant_applications_assigned_reviewer_id_admins_id_fk" FOREIGN KEY ("assigned_reviewer_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenant_applications_rels" ADD CONSTRAINT "tenant_applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenant_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_applications_rels" ADD CONSTRAINT "tenant_applications_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenant_applications_rels" ADD CONSTRAINT "tenant_applications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v_version_references" ADD CONSTRAINT "_tenant_applications_v_version_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenant_applications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_parent_id_tenant_applications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_version_interest_id_demand_interests_id_fk" FOREIGN KEY ("version_interest_id") REFERENCES "public"."demand_interests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_version_preferred_suburb_id_suburbs_id_fk" FOREIGN KEY ("version_preferred_suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_version_preferred_home_id_homes_id_fk" FOREIGN KEY ("version_preferred_home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v" ADD CONSTRAINT "_tenant_applications_v_version_assigned_reviewer_id_admins_id_fk" FOREIGN KEY ("version_assigned_reviewer_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v_rels" ADD CONSTRAINT "_tenant_applications_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tenant_applications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v_rels" ADD CONSTRAINT "_tenant_applications_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenant_applications_v_rels" ADD CONSTRAINT "_tenant_applications_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_tenant_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "application_documents_rels" ADD CONSTRAINT "application_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."application_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "application_documents_rels" ADD CONSTRAINT "application_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "application_documents_rels" ADD CONSTRAINT "application_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_application_documents_v" ADD CONSTRAINT "_application_documents_v_parent_id_application_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."application_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_application_documents_v" ADD CONSTRAINT "_application_documents_v_version_application_id_tenant_applications_id_fk" FOREIGN KEY ("version_application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_application_documents_v_rels" ADD CONSTRAINT "_application_documents_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_application_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_application_documents_v_rels" ADD CONSTRAINT "_application_documents_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_application_documents_v_rels" ADD CONSTRAINT "_application_documents_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_submissions_rels" ADD CONSTRAINT "property_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."property_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_submissions_rels" ADD CONSTRAINT "property_submissions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_submissions_rels" ADD CONSTRAINT "property_submissions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_property_submissions_v" ADD CONSTRAINT "_property_submissions_v_parent_id_property_submissions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."property_submissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_property_submissions_v_rels" ADD CONSTRAINT "_property_submissions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_property_submissions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_property_submissions_v_rels" ADD CONSTRAINT "_property_submissions_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_property_submissions_v_rels" ADD CONSTRAINT "_property_submissions_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suburbs_fk" FOREIGN KEY ("suburbs_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_homes_fk" FOREIGN KEY ("homes_id") REFERENCES "public"."homes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demand_interests_fk" FOREIGN KEY ("demand_interests_id") REFERENCES "public"."demand_interests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenant_applications_fk" FOREIGN KEY ("tenant_applications_id") REFERENCES "public"."tenant_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_application_documents_fk" FOREIGN KEY ("application_documents_id") REFERENCES "public"."application_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_property_submissions_fk" FOREIGN KEY ("property_submissions_id") REFERENCES "public"."property_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE INDEX "admins_rels_users_id_idx" ON "admins_rels" USING btree ("users_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_admins_id_idx" ON "users_rels" USING btree ("admins_id");
  CREATE INDEX "users_rels_users_id_idx" ON "users_rels" USING btree ("users_id");
  CREATE INDEX "_users_v_version_sessions_order_idx" ON "_users_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_users_v_version_sessions_parent_id_idx" ON "_users_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_users_v_parent_idx" ON "_users_v" USING btree ("parent_id");
  CREATE INDEX "_users_v_version_version_updated_at_idx" ON "_users_v" USING btree ("version_updated_at");
  CREATE INDEX "_users_v_version_version_created_at_idx" ON "_users_v" USING btree ("version_created_at");
  CREATE INDEX "_users_v_version_version_email_idx" ON "_users_v" USING btree ("version_email");
  CREATE INDEX "_users_v_created_at_idx" ON "_users_v" USING btree ("created_at");
  CREATE INDEX "_users_v_updated_at_idx" ON "_users_v" USING btree ("updated_at");
  CREATE INDEX "_users_v_rels_order_idx" ON "_users_v_rels" USING btree ("order");
  CREATE INDEX "_users_v_rels_parent_idx" ON "_users_v_rels" USING btree ("parent_id");
  CREATE INDEX "_users_v_rels_path_idx" ON "_users_v_rels" USING btree ("path");
  CREATE INDEX "_users_v_rels_admins_id_idx" ON "_users_v_rels" USING btree ("admins_id");
  CREATE INDEX "_users_v_rels_users_id_idx" ON "_users_v_rels" USING btree ("users_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "media_rels_users_id_idx" ON "media_rels" USING btree ("users_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_rels_users_id_idx" ON "_media_v_rels" USING btree ("users_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "folders_rels_users_id_idx" ON "folders_rels" USING btree ("users_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_rels_users_id_idx" ON "_folders_v_rels" USING btree ("users_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "tags_rels_users_id_idx" ON "tags_rels" USING btree ("users_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_rels_users_id_idx" ON "_tags_v_rels" USING btree ("users_id");
  CREATE INDEX "suburbs_nearby_hubs_order_idx" ON "suburbs_nearby_hubs" USING btree ("_order");
  CREATE INDEX "suburbs_nearby_hubs_parent_id_idx" ON "suburbs_nearby_hubs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "suburbs_slug_idx" ON "suburbs" USING btree ("slug");
  CREATE INDEX "suburbs_city_idx" ON "suburbs" USING btree ("city");
  CREATE INDEX "suburbs_updated_at_idx" ON "suburbs" USING btree ("updated_at");
  CREATE INDEX "suburbs_created_at_idx" ON "suburbs" USING btree ("created_at");
  CREATE INDEX "suburbs_rels_order_idx" ON "suburbs_rels" USING btree ("order");
  CREATE INDEX "suburbs_rels_parent_idx" ON "suburbs_rels" USING btree ("parent_id");
  CREATE INDEX "suburbs_rels_path_idx" ON "suburbs_rels" USING btree ("path");
  CREATE INDEX "suburbs_rels_admins_id_idx" ON "suburbs_rels" USING btree ("admins_id");
  CREATE INDEX "suburbs_rels_users_id_idx" ON "suburbs_rels" USING btree ("users_id");
  CREATE INDEX "_suburbs_v_version_nearby_hubs_order_idx" ON "_suburbs_v_version_nearby_hubs" USING btree ("_order");
  CREATE INDEX "_suburbs_v_version_nearby_hubs_parent_id_idx" ON "_suburbs_v_version_nearby_hubs" USING btree ("_parent_id");
  CREATE INDEX "_suburbs_v_parent_idx" ON "_suburbs_v" USING btree ("parent_id");
  CREATE INDEX "_suburbs_v_version_version_slug_idx" ON "_suburbs_v" USING btree ("version_slug");
  CREATE INDEX "_suburbs_v_version_version_city_idx" ON "_suburbs_v" USING btree ("version_city");
  CREATE INDEX "_suburbs_v_version_version_updated_at_idx" ON "_suburbs_v" USING btree ("version_updated_at");
  CREATE INDEX "_suburbs_v_version_version_created_at_idx" ON "_suburbs_v" USING btree ("version_created_at");
  CREATE INDEX "_suburbs_v_created_at_idx" ON "_suburbs_v" USING btree ("created_at");
  CREATE INDEX "_suburbs_v_updated_at_idx" ON "_suburbs_v" USING btree ("updated_at");
  CREATE INDEX "_suburbs_v_rels_order_idx" ON "_suburbs_v_rels" USING btree ("order");
  CREATE INDEX "_suburbs_v_rels_parent_idx" ON "_suburbs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_suburbs_v_rels_path_idx" ON "_suburbs_v_rels" USING btree ("path");
  CREATE INDEX "_suburbs_v_rels_admins_id_idx" ON "_suburbs_v_rels" USING btree ("admins_id");
  CREATE INDEX "_suburbs_v_rels_users_id_idx" ON "_suburbs_v_rels" USING btree ("users_id");
  CREATE INDEX "homes_features_order_idx" ON "homes_features" USING btree ("_order");
  CREATE INDEX "homes_features_parent_id_idx" ON "homes_features" USING btree ("_parent_id");
  CREATE INDEX "homes_included_order_idx" ON "homes_included" USING btree ("_order");
  CREATE INDEX "homes_included_parent_id_idx" ON "homes_included" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homes_slug_idx" ON "homes" USING btree ("slug");
  CREATE INDEX "homes_suburb_idx" ON "homes" USING btree ("suburb_id");
  CREATE INDEX "homes_room_price_idx" ON "homes" USING btree ("room_price");
  CREATE INDEX "homes_group_status_idx" ON "homes" USING btree ("group_status");
  CREATE INDEX "homes_cover_image_idx" ON "homes" USING btree ("cover_image_id");
  CREATE INDEX "homes_status_idx" ON "homes" USING btree ("status");
  CREATE INDEX "homes_updated_at_idx" ON "homes" USING btree ("updated_at");
  CREATE INDEX "homes_created_at_idx" ON "homes" USING btree ("created_at");
  CREATE INDEX "homes_rels_order_idx" ON "homes_rels" USING btree ("order");
  CREATE INDEX "homes_rels_parent_idx" ON "homes_rels" USING btree ("parent_id");
  CREATE INDEX "homes_rels_path_idx" ON "homes_rels" USING btree ("path");
  CREATE INDEX "homes_rels_media_id_idx" ON "homes_rels" USING btree ("media_id");
  CREATE INDEX "homes_rels_admins_id_idx" ON "homes_rels" USING btree ("admins_id");
  CREATE INDEX "homes_rels_users_id_idx" ON "homes_rels" USING btree ("users_id");
  CREATE INDEX "_homes_v_version_features_order_idx" ON "_homes_v_version_features" USING btree ("_order");
  CREATE INDEX "_homes_v_version_features_parent_id_idx" ON "_homes_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_homes_v_version_included_order_idx" ON "_homes_v_version_included" USING btree ("_order");
  CREATE INDEX "_homes_v_version_included_parent_id_idx" ON "_homes_v_version_included" USING btree ("_parent_id");
  CREATE INDEX "_homes_v_parent_idx" ON "_homes_v" USING btree ("parent_id");
  CREATE INDEX "_homes_v_version_version_slug_idx" ON "_homes_v" USING btree ("version_slug");
  CREATE INDEX "_homes_v_version_version_suburb_idx" ON "_homes_v" USING btree ("version_suburb_id");
  CREATE INDEX "_homes_v_version_version_room_price_idx" ON "_homes_v" USING btree ("version_room_price");
  CREATE INDEX "_homes_v_version_version_group_status_idx" ON "_homes_v" USING btree ("version_group_status");
  CREATE INDEX "_homes_v_version_version_cover_image_idx" ON "_homes_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_homes_v_version_version_status_idx" ON "_homes_v" USING btree ("version_status");
  CREATE INDEX "_homes_v_version_version_updated_at_idx" ON "_homes_v" USING btree ("version_updated_at");
  CREATE INDEX "_homes_v_version_version_created_at_idx" ON "_homes_v" USING btree ("version_created_at");
  CREATE INDEX "_homes_v_created_at_idx" ON "_homes_v" USING btree ("created_at");
  CREATE INDEX "_homes_v_updated_at_idx" ON "_homes_v" USING btree ("updated_at");
  CREATE INDEX "_homes_v_rels_order_idx" ON "_homes_v_rels" USING btree ("order");
  CREATE INDEX "_homes_v_rels_parent_idx" ON "_homes_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homes_v_rels_path_idx" ON "_homes_v_rels" USING btree ("path");
  CREATE INDEX "_homes_v_rels_media_id_idx" ON "_homes_v_rels" USING btree ("media_id");
  CREATE INDEX "_homes_v_rels_admins_id_idx" ON "_homes_v_rels" USING btree ("admins_id");
  CREATE INDEX "_homes_v_rels_users_id_idx" ON "_homes_v_rels" USING btree ("users_id");
  CREATE INDEX "demand_interests_email_idx" ON "demand_interests" USING btree ("email");
  CREATE INDEX "demand_interests_suburb_idx" ON "demand_interests" USING btree ("suburb_id");
  CREATE INDEX "demand_interests_home_idx" ON "demand_interests" USING btree ("home_id");
  CREATE INDEX "demand_interests_institution_or_employer_idx" ON "demand_interests" USING btree ("institution_or_employer");
  CREATE INDEX "demand_interests_move_in_month_idx" ON "demand_interests" USING btree ("move_in_month");
  CREATE INDEX "demand_interests_tier_idx" ON "demand_interests" USING btree ("tier");
  CREATE INDEX "demand_interests_sponsor_pays_idx" ON "demand_interests" USING btree ("sponsor_pays");
  CREATE INDEX "demand_interests_updated_at_idx" ON "demand_interests" USING btree ("updated_at");
  CREATE INDEX "demand_interests_created_at_idx" ON "demand_interests" USING btree ("created_at");
  CREATE INDEX "demand_interests_rels_order_idx" ON "demand_interests_rels" USING btree ("order");
  CREATE INDEX "demand_interests_rels_parent_idx" ON "demand_interests_rels" USING btree ("parent_id");
  CREATE INDEX "demand_interests_rels_path_idx" ON "demand_interests_rels" USING btree ("path");
  CREATE INDEX "demand_interests_rels_admins_id_idx" ON "demand_interests_rels" USING btree ("admins_id");
  CREATE INDEX "demand_interests_rels_users_id_idx" ON "demand_interests_rels" USING btree ("users_id");
  CREATE INDEX "_demand_interests_v_parent_idx" ON "_demand_interests_v" USING btree ("parent_id");
  CREATE INDEX "_demand_interests_v_version_version_email_idx" ON "_demand_interests_v" USING btree ("version_email");
  CREATE INDEX "_demand_interests_v_version_version_suburb_idx" ON "_demand_interests_v" USING btree ("version_suburb_id");
  CREATE INDEX "_demand_interests_v_version_version_home_idx" ON "_demand_interests_v" USING btree ("version_home_id");
  CREATE INDEX "_demand_interests_v_version_version_institution_or_emplo_idx" ON "_demand_interests_v" USING btree ("version_institution_or_employer");
  CREATE INDEX "_demand_interests_v_version_version_move_in_month_idx" ON "_demand_interests_v" USING btree ("version_move_in_month");
  CREATE INDEX "_demand_interests_v_version_version_tier_idx" ON "_demand_interests_v" USING btree ("version_tier");
  CREATE INDEX "_demand_interests_v_version_version_sponsor_pays_idx" ON "_demand_interests_v" USING btree ("version_sponsor_pays");
  CREATE INDEX "_demand_interests_v_version_version_updated_at_idx" ON "_demand_interests_v" USING btree ("version_updated_at");
  CREATE INDEX "_demand_interests_v_version_version_created_at_idx" ON "_demand_interests_v" USING btree ("version_created_at");
  CREATE INDEX "_demand_interests_v_created_at_idx" ON "_demand_interests_v" USING btree ("created_at");
  CREATE INDEX "_demand_interests_v_updated_at_idx" ON "_demand_interests_v" USING btree ("updated_at");
  CREATE INDEX "_demand_interests_v_rels_order_idx" ON "_demand_interests_v_rels" USING btree ("order");
  CREATE INDEX "_demand_interests_v_rels_parent_idx" ON "_demand_interests_v_rels" USING btree ("parent_id");
  CREATE INDEX "_demand_interests_v_rels_path_idx" ON "_demand_interests_v_rels" USING btree ("path");
  CREATE INDEX "_demand_interests_v_rels_admins_id_idx" ON "_demand_interests_v_rels" USING btree ("admins_id");
  CREATE INDEX "_demand_interests_v_rels_users_id_idx" ON "_demand_interests_v_rels" USING btree ("users_id");
  CREATE INDEX "tenant_applications_references_order_idx" ON "tenant_applications_references" USING btree ("_order");
  CREATE INDEX "tenant_applications_references_parent_id_idx" ON "tenant_applications_references" USING btree ("_parent_id");
  CREATE INDEX "tenant_applications_interest_idx" ON "tenant_applications" USING btree ("interest_id");
  CREATE INDEX "tenant_applications_owner_idx" ON "tenant_applications" USING btree ("owner_id");
  CREATE INDEX "tenant_applications_application_kind_idx" ON "tenant_applications" USING btree ("application_kind");
  CREATE INDEX "tenant_applications_applicant_email_idx" ON "tenant_applications" USING btree ("applicant_email");
  CREATE INDEX "tenant_applications_institution_or_employer_idx" ON "tenant_applications" USING btree ("institution_or_employer");
  CREATE INDEX "tenant_applications_tier_idx" ON "tenant_applications" USING btree ("tier");
  CREATE INDEX "tenant_applications_preferred_suburb_idx" ON "tenant_applications" USING btree ("preferred_suburb_id");
  CREATE INDEX "tenant_applications_preferred_home_idx" ON "tenant_applications" USING btree ("preferred_home_id");
  CREATE INDEX "tenant_applications_payer_type_idx" ON "tenant_applications" USING btree ("payer_type");
  CREATE INDEX "tenant_applications_status_idx" ON "tenant_applications" USING btree ("status");
  CREATE INDEX "tenant_applications_assigned_reviewer_idx" ON "tenant_applications" USING btree ("assigned_reviewer_id");
  CREATE INDEX "tenant_applications_updated_at_idx" ON "tenant_applications" USING btree ("updated_at");
  CREATE INDEX "tenant_applications_created_at_idx" ON "tenant_applications" USING btree ("created_at");
  CREATE INDEX "tenant_applications_rels_order_idx" ON "tenant_applications_rels" USING btree ("order");
  CREATE INDEX "tenant_applications_rels_parent_idx" ON "tenant_applications_rels" USING btree ("parent_id");
  CREATE INDEX "tenant_applications_rels_path_idx" ON "tenant_applications_rels" USING btree ("path");
  CREATE INDEX "tenant_applications_rels_admins_id_idx" ON "tenant_applications_rels" USING btree ("admins_id");
  CREATE INDEX "tenant_applications_rels_users_id_idx" ON "tenant_applications_rels" USING btree ("users_id");
  CREATE INDEX "_tenant_applications_v_version_references_order_idx" ON "_tenant_applications_v_version_references" USING btree ("_order");
  CREATE INDEX "_tenant_applications_v_version_references_parent_id_idx" ON "_tenant_applications_v_version_references" USING btree ("_parent_id");
  CREATE INDEX "_tenant_applications_v_parent_idx" ON "_tenant_applications_v" USING btree ("parent_id");
  CREATE INDEX "_tenant_applications_v_version_version_interest_idx" ON "_tenant_applications_v" USING btree ("version_interest_id");
  CREATE INDEX "_tenant_applications_v_version_version_owner_idx" ON "_tenant_applications_v" USING btree ("version_owner_id");
  CREATE INDEX "_tenant_applications_v_version_version_application_kind_idx" ON "_tenant_applications_v" USING btree ("version_application_kind");
  CREATE INDEX "_tenant_applications_v_version_version_applicant_email_idx" ON "_tenant_applications_v" USING btree ("version_applicant_email");
  CREATE INDEX "_tenant_applications_v_version_version_institution_or_em_idx" ON "_tenant_applications_v" USING btree ("version_institution_or_employer");
  CREATE INDEX "_tenant_applications_v_version_version_tier_idx" ON "_tenant_applications_v" USING btree ("version_tier");
  CREATE INDEX "_tenant_applications_v_version_version_preferred_suburb_idx" ON "_tenant_applications_v" USING btree ("version_preferred_suburb_id");
  CREATE INDEX "_tenant_applications_v_version_version_preferred_home_idx" ON "_tenant_applications_v" USING btree ("version_preferred_home_id");
  CREATE INDEX "_tenant_applications_v_version_version_payer_type_idx" ON "_tenant_applications_v" USING btree ("version_payer_type");
  CREATE INDEX "_tenant_applications_v_version_version_status_idx" ON "_tenant_applications_v" USING btree ("version_status");
  CREATE INDEX "_tenant_applications_v_version_version_assigned_reviewer_idx" ON "_tenant_applications_v" USING btree ("version_assigned_reviewer_id");
  CREATE INDEX "_tenant_applications_v_version_version_updated_at_idx" ON "_tenant_applications_v" USING btree ("version_updated_at");
  CREATE INDEX "_tenant_applications_v_version_version_created_at_idx" ON "_tenant_applications_v" USING btree ("version_created_at");
  CREATE INDEX "_tenant_applications_v_created_at_idx" ON "_tenant_applications_v" USING btree ("created_at");
  CREATE INDEX "_tenant_applications_v_updated_at_idx" ON "_tenant_applications_v" USING btree ("updated_at");
  CREATE INDEX "_tenant_applications_v_rels_order_idx" ON "_tenant_applications_v_rels" USING btree ("order");
  CREATE INDEX "_tenant_applications_v_rels_parent_idx" ON "_tenant_applications_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tenant_applications_v_rels_path_idx" ON "_tenant_applications_v_rels" USING btree ("path");
  CREATE INDEX "_tenant_applications_v_rels_admins_id_idx" ON "_tenant_applications_v_rels" USING btree ("admins_id");
  CREATE INDEX "_tenant_applications_v_rels_users_id_idx" ON "_tenant_applications_v_rels" USING btree ("users_id");
  CREATE INDEX "application_documents_application_idx" ON "application_documents" USING btree ("application_id");
  CREATE INDEX "application_documents_updated_at_idx" ON "application_documents" USING btree ("updated_at");
  CREATE INDEX "application_documents_created_at_idx" ON "application_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "application_documents_filename_idx" ON "application_documents" USING btree ("filename");
  CREATE INDEX "application_documents_original_original_filename_idx" ON "application_documents" USING btree ("original_filename");
  CREATE INDEX "application_documents_rels_order_idx" ON "application_documents_rels" USING btree ("order");
  CREATE INDEX "application_documents_rels_parent_idx" ON "application_documents_rels" USING btree ("parent_id");
  CREATE INDEX "application_documents_rels_path_idx" ON "application_documents_rels" USING btree ("path");
  CREATE INDEX "application_documents_rels_admins_id_idx" ON "application_documents_rels" USING btree ("admins_id");
  CREATE INDEX "application_documents_rels_users_id_idx" ON "application_documents_rels" USING btree ("users_id");
  CREATE INDEX "_application_documents_v_parent_idx" ON "_application_documents_v" USING btree ("parent_id");
  CREATE INDEX "_application_documents_v_version_version_application_idx" ON "_application_documents_v" USING btree ("version_application_id");
  CREATE INDEX "_application_documents_v_version_version_updated_at_idx" ON "_application_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_application_documents_v_version_version_created_at_idx" ON "_application_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_application_documents_v_version_version_filename_idx" ON "_application_documents_v" USING btree ("version_filename");
  CREATE INDEX "_application_documents_v_version_original_version_origin_idx" ON "_application_documents_v" USING btree ("version_original_filename");
  CREATE INDEX "_application_documents_v_created_at_idx" ON "_application_documents_v" USING btree ("created_at");
  CREATE INDEX "_application_documents_v_updated_at_idx" ON "_application_documents_v" USING btree ("updated_at");
  CREATE INDEX "_application_documents_v_rels_order_idx" ON "_application_documents_v_rels" USING btree ("order");
  CREATE INDEX "_application_documents_v_rels_parent_idx" ON "_application_documents_v_rels" USING btree ("parent_id");
  CREATE INDEX "_application_documents_v_rels_path_idx" ON "_application_documents_v_rels" USING btree ("path");
  CREATE INDEX "_application_documents_v_rels_admins_id_idx" ON "_application_documents_v_rels" USING btree ("admins_id");
  CREATE INDEX "_application_documents_v_rels_users_id_idx" ON "_application_documents_v_rels" USING btree ("users_id");
  CREATE INDEX "property_submissions_updated_at_idx" ON "property_submissions" USING btree ("updated_at");
  CREATE INDEX "property_submissions_created_at_idx" ON "property_submissions" USING btree ("created_at");
  CREATE INDEX "property_submissions_rels_order_idx" ON "property_submissions_rels" USING btree ("order");
  CREATE INDEX "property_submissions_rels_parent_idx" ON "property_submissions_rels" USING btree ("parent_id");
  CREATE INDEX "property_submissions_rels_path_idx" ON "property_submissions_rels" USING btree ("path");
  CREATE INDEX "property_submissions_rels_admins_id_idx" ON "property_submissions_rels" USING btree ("admins_id");
  CREATE INDEX "property_submissions_rels_users_id_idx" ON "property_submissions_rels" USING btree ("users_id");
  CREATE INDEX "_property_submissions_v_parent_idx" ON "_property_submissions_v" USING btree ("parent_id");
  CREATE INDEX "_property_submissions_v_version_version_updated_at_idx" ON "_property_submissions_v" USING btree ("version_updated_at");
  CREATE INDEX "_property_submissions_v_version_version_created_at_idx" ON "_property_submissions_v" USING btree ("version_created_at");
  CREATE INDEX "_property_submissions_v_created_at_idx" ON "_property_submissions_v" USING btree ("created_at");
  CREATE INDEX "_property_submissions_v_updated_at_idx" ON "_property_submissions_v" USING btree ("updated_at");
  CREATE INDEX "_property_submissions_v_rels_order_idx" ON "_property_submissions_v_rels" USING btree ("order");
  CREATE INDEX "_property_submissions_v_rels_parent_idx" ON "_property_submissions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_property_submissions_v_rels_path_idx" ON "_property_submissions_v_rels" USING btree ("path");
  CREATE INDEX "_property_submissions_v_rels_admins_id_idx" ON "_property_submissions_v_rels" USING btree ("admins_id");
  CREATE INDEX "_property_submissions_v_rels_users_id_idx" ON "_property_submissions_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_suburbs_id_idx" ON "payload_locked_documents_rels" USING btree ("suburbs_id");
  CREATE INDEX "payload_locked_documents_rels_homes_id_idx" ON "payload_locked_documents_rels" USING btree ("homes_id");
  CREATE INDEX "payload_locked_documents_rels_demand_interests_id_idx" ON "payload_locked_documents_rels" USING btree ("demand_interests_id");
  CREATE INDEX "payload_locked_documents_rels_tenant_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("tenant_applications_id");
  CREATE INDEX "payload_locked_documents_rels_application_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("application_documents_id");
  CREATE INDEX "payload_locked_documents_rels_property_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("property_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "payload_llm_instructions_rels_users_id_idx" ON "payload_llm_instructions_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "_users_v_version_sessions" CASCADE;
  DROP TABLE "_users_v" CASCADE;
  DROP TABLE "_users_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "suburbs_nearby_hubs" CASCADE;
  DROP TABLE "suburbs" CASCADE;
  DROP TABLE "suburbs_rels" CASCADE;
  DROP TABLE "_suburbs_v_version_nearby_hubs" CASCADE;
  DROP TABLE "_suburbs_v" CASCADE;
  DROP TABLE "_suburbs_v_rels" CASCADE;
  DROP TABLE "homes_features" CASCADE;
  DROP TABLE "homes_included" CASCADE;
  DROP TABLE "homes" CASCADE;
  DROP TABLE "homes_rels" CASCADE;
  DROP TABLE "_homes_v_version_features" CASCADE;
  DROP TABLE "_homes_v_version_included" CASCADE;
  DROP TABLE "_homes_v" CASCADE;
  DROP TABLE "_homes_v_rels" CASCADE;
  DROP TABLE "demand_interests" CASCADE;
  DROP TABLE "demand_interests_rels" CASCADE;
  DROP TABLE "_demand_interests_v" CASCADE;
  DROP TABLE "_demand_interests_v_rels" CASCADE;
  DROP TABLE "tenant_applications_references" CASCADE;
  DROP TABLE "tenant_applications" CASCADE;
  DROP TABLE "tenant_applications_rels" CASCADE;
  DROP TABLE "_tenant_applications_v_version_references" CASCADE;
  DROP TABLE "_tenant_applications_v" CASCADE;
  DROP TABLE "_tenant_applications_v_rels" CASCADE;
  DROP TABLE "application_documents" CASCADE;
  DROP TABLE "application_documents_rels" CASCADE;
  DROP TABLE "_application_documents_v" CASCADE;
  DROP TABLE "_application_documents_v_rels" CASCADE;
  DROP TABLE "property_submissions" CASCADE;
  DROP TABLE "property_submissions_rels" CASCADE;
  DROP TABLE "_property_submissions_v" CASCADE;
  DROP TABLE "_property_submissions_v_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_account_type";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum__users_v_version_account_type";
  DROP TYPE "public"."enum__users_v_version_status";
  DROP TYPE "public"."enum_suburbs_city";
  DROP TYPE "public"."enum_suburbs_launch_status";
  DROP TYPE "public"."enum__suburbs_v_version_city";
  DROP TYPE "public"."enum__suburbs_v_version_launch_status";
  DROP TYPE "public"."enum_homes_property_type";
  DROP TYPE "public"."enum_homes_group_status";
  DROP TYPE "public"."enum_homes_status";
  DROP TYPE "public"."enum__homes_v_version_property_type";
  DROP TYPE "public"."enum__homes_v_version_group_status";
  DROP TYPE "public"."enum__homes_v_version_status";
  DROP TYPE "public"."enum_demand_interests_tier";
  DROP TYPE "public"."enum_demand_interests_status";
  DROP TYPE "public"."enum_demand_interests_reservation_deposit_status";
  DROP TYPE "public"."enum__demand_interests_v_version_tier";
  DROP TYPE "public"."enum__demand_interests_v_version_status";
  DROP TYPE "public"."enum__demand_interests_v_version_reservation_deposit_status";
  DROP TYPE "public"."enum_tenant_applications_references_reference_type";
  DROP TYPE "public"."enum_tenant_applications_references_status";
  DROP TYPE "public"."enum_tenant_applications_application_kind";
  DROP TYPE "public"."enum_tenant_applications_id_type";
  DROP TYPE "public"."enum_tenant_applications_applicant_type";
  DROP TYPE "public"."enum_tenant_applications_tier";
  DROP TYPE "public"."enum_tenant_applications_agreement_length";
  DROP TYPE "public"."enum_tenant_applications_payer_type";
  DROP TYPE "public"."enum_tenant_applications_payment_method";
  DROP TYPE "public"."enum_app_office_type";
  DROP TYPE "public"."enum_tenant_applications_status";
  DROP TYPE "public"."enum__tenant_applications_v_version_references_reference_type";
  DROP TYPE "public"."enum__tenant_applications_v_version_references_status";
  DROP TYPE "public"."enum__tenant_applications_v_version_application_kind";
  DROP TYPE "public"."enum__tenant_applications_v_version_id_type";
  DROP TYPE "public"."enum__tenant_applications_v_version_applicant_type";
  DROP TYPE "public"."enum__tenant_applications_v_version_tier";
  DROP TYPE "public"."enum__tenant_applications_v_version_agreement_length";
  DROP TYPE "public"."enum__tenant_applications_v_version_payer_type";
  DROP TYPE "public"."enum__tenant_applications_v_version_payment_method";
  DROP TYPE "public"."enum__tenant_applications_v_version_status";
  DROP TYPE "public"."enum_application_documents_document_type";
  DROP TYPE "public"."enum_application_documents_status";
  DROP TYPE "public"."enum__application_documents_v_version_document_type";
  DROP TYPE "public"."enum__application_documents_v_version_status";
  DROP TYPE "public"."enum_property_submissions_city";
  DROP TYPE "public"."enum_property_submissions_property_type";
  DROP TYPE "public"."enum_property_submissions_status";
  DROP TYPE "public"."enum__property_submissions_v_version_city";
  DROP TYPE "public"."enum__property_submissions_v_version_property_type";
  DROP TYPE "public"."enum__property_submissions_v_version_status";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";`)
}
