import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('tenant', 'partner');
  CREATE TYPE "public"."enum__users_v_version_role" AS ENUM('tenant', 'partner');
  CREATE TYPE "public"."enum_tenancies_kind" AS ENUM('room', 'office');
  CREATE TYPE "public"."enum_tenancies_status" AS ENUM('pending-payment', 'active', 'notice', 'ended', 'cancelled');
  CREATE TYPE "public"."enum__tenancies_v_version_kind" AS ENUM('room', 'office');
  CREATE TYPE "public"."enum__tenancies_v_version_status" AS ENUM('pending-payment', 'active', 'notice', 'ended', 'cancelled');
  CREATE TYPE "public"."enum_invoices_kind" AS ENUM('reservation-deposit', 'deposit', 'first-month', 'monthly-rent', 'office-rent', 'other');
  CREATE TYPE "public"."enum_invoices_status" AS ENUM('issued', 'paid', 'overdue', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_invoices_payment_method" AS ENUM('payfast', 'eft', 'cash', 'other');
  CREATE TYPE "public"."enum__invoices_v_version_kind" AS ENUM('reservation-deposit', 'deposit', 'first-month', 'monthly-rent', 'office-rent', 'other');
  CREATE TYPE "public"."enum__invoices_v_version_status" AS ENUM('issued', 'paid', 'overdue', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum__invoices_v_version_payment_method" AS ENUM('payfast', 'eft', 'cash', 'other');
  CREATE TYPE "public"."enum_payments_provider" AS ENUM('payfast', 'manual');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('complete', 'failed', 'pending', 'cancelled');
  CREATE TYPE "public"."enum__payments_v_version_provider" AS ENUM('payfast', 'manual');
  CREATE TYPE "public"."enum__payments_v_version_status" AS ENUM('complete', 'failed', 'pending', 'cancelled');
  CREATE TYPE "public"."enum_maintenance_requests_category" AS ENUM('plumbing', 'electrical', 'appliances', 'internet', 'security', 'cleaning', 'furniture', 'other');
  CREATE TYPE "public"."enum_maintenance_requests_priority" AS ENUM('low', 'normal', 'urgent');
  CREATE TYPE "public"."enum_maintenance_requests_status" AS ENUM('open', 'in-progress', 'scheduled', 'resolved', 'closed');
  CREATE TYPE "public"."enum__maintenance_requests_v_version_category" AS ENUM('plumbing', 'electrical', 'appliances', 'internet', 'security', 'cleaning', 'furniture', 'other');
  CREATE TYPE "public"."enum__maintenance_requests_v_version_priority" AS ENUM('low', 'normal', 'urgent');
  CREATE TYPE "public"."enum__maintenance_requests_v_version_status" AS ENUM('open', 'in-progress', 'scheduled', 'resolved', 'closed');
  CREATE TYPE "public"."enum_payouts_status" AS ENUM('scheduled', 'paid', 'on-hold');
  CREATE TYPE "public"."enum__payouts_v_version_status" AS ENUM('scheduled', 'paid', 'on-hold');
  CREATE TABLE "tenancies" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"tenant_id" uuid,
  	"tenant_name" varchar NOT NULL,
  	"tenant_email" varchar NOT NULL,
  	"application_id" uuid,
  	"kind" "enum_tenancies_kind" DEFAULT 'room' NOT NULL,
  	"home_id" uuid,
  	"room_label" varchar,
  	"office_description" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"billing_day" numeric DEFAULT 1,
  	"monthly_rent" numeric DEFAULT 0,
  	"deposit_amount" numeric,
  	"status" "enum_tenancies_status" DEFAULT 'pending-payment' NOT NULL,
  	"initial_invoices_issued" boolean DEFAULT false,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenancies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_tenancies_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_label" varchar,
  	"version_tenant_id" uuid,
  	"version_tenant_name" varchar NOT NULL,
  	"version_tenant_email" varchar NOT NULL,
  	"version_application_id" uuid,
  	"version_kind" "enum__tenancies_v_version_kind" DEFAULT 'room' NOT NULL,
  	"version_home_id" uuid,
  	"version_room_label" varchar,
  	"version_office_description" varchar,
  	"version_start_date" timestamp(3) with time zone NOT NULL,
  	"version_end_date" timestamp(3) with time zone,
  	"version_billing_day" numeric DEFAULT 1,
  	"version_monthly_rent" numeric DEFAULT 0,
  	"version_deposit_amount" numeric,
  	"version_status" "enum__tenancies_v_version_status" DEFAULT 'pending-payment' NOT NULL,
  	"version_initial_invoices_issued" boolean DEFAULT false,
  	"version_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tenancies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "invoices" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"number" varchar,
  	"kind" "enum_invoices_kind" NOT NULL,
  	"amount" numeric NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"description" varchar NOT NULL,
  	"period" varchar,
  	"payer_name" varchar NOT NULL,
  	"payer_email" varchar NOT NULL,
  	"tenant_id" uuid,
  	"tenancy_id" uuid,
  	"application_id" uuid,
  	"interest_id" uuid,
  	"unique_key" varchar,
  	"pay_token_hash" varchar,
  	"status" "enum_invoices_status" DEFAULT 'issued' NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"payment_method" "enum_invoices_payment_method",
  	"payment_reference" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "invoices_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_invoices_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_number" varchar,
  	"version_kind" "enum__invoices_v_version_kind" NOT NULL,
  	"version_amount" numeric NOT NULL,
  	"version_due_date" timestamp(3) with time zone NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_period" varchar,
  	"version_payer_name" varchar NOT NULL,
  	"version_payer_email" varchar NOT NULL,
  	"version_tenant_id" uuid,
  	"version_tenancy_id" uuid,
  	"version_application_id" uuid,
  	"version_interest_id" uuid,
  	"version_unique_key" varchar,
  	"version_pay_token_hash" varchar,
  	"version_status" "enum__invoices_v_version_status" DEFAULT 'issued' NOT NULL,
  	"version_paid_at" timestamp(3) with time zone,
  	"version_payment_method" "enum__invoices_v_version_payment_method",
  	"version_payment_reference" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_invoices_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "payments" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"invoice_id" uuid NOT NULL,
  	"provider" "enum_payments_provider" DEFAULT 'payfast' NOT NULL,
  	"provider_payment_id" varchar,
  	"amount_gross" numeric,
  	"amount_fee" numeric,
  	"amount_net" numeric,
  	"status" "enum_payments_status" NOT NULL,
  	"payer_email" varchar,
  	"sandbox" boolean DEFAULT false,
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"raw" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_payments_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_invoice_id" uuid NOT NULL,
  	"version_provider" "enum__payments_v_version_provider" DEFAULT 'payfast' NOT NULL,
  	"version_provider_payment_id" varchar,
  	"version_amount_gross" numeric,
  	"version_amount_fee" numeric,
  	"version_amount_net" numeric,
  	"version_status" "enum__payments_v_version_status" NOT NULL,
  	"version_payer_email" varchar,
  	"version_sandbox" boolean DEFAULT false,
  	"version_received_at" timestamp(3) with time zone NOT NULL,
  	"version_raw" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_payments_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "maintenance_requests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"tenancy_id" uuid NOT NULL,
  	"home_id" uuid,
  	"reporter_id" uuid,
  	"category" "enum_maintenance_requests_category" NOT NULL,
  	"priority" "enum_maintenance_requests_priority" DEFAULT 'normal' NOT NULL,
  	"description" varchar NOT NULL,
  	"status" "enum_maintenance_requests_status" DEFAULT 'open' NOT NULL,
  	"status_changed_at" timestamp(3) with time zone,
  	"resolution_note" varchar,
  	"staff_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maintenance_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_maintenance_requests_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar NOT NULL,
  	"version_tenancy_id" uuid NOT NULL,
  	"version_home_id" uuid,
  	"version_reporter_id" uuid,
  	"version_category" "enum__maintenance_requests_v_version_category" NOT NULL,
  	"version_priority" "enum__maintenance_requests_v_version_priority" DEFAULT 'normal' NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_status" "enum__maintenance_requests_v_version_status" DEFAULT 'open' NOT NULL,
  	"version_status_changed_at" timestamp(3) with time zone,
  	"version_resolution_note" varchar,
  	"version_staff_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_maintenance_requests_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "payouts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"reference" varchar NOT NULL,
  	"partner_id" uuid NOT NULL,
  	"period" varchar NOT NULL,
  	"gross_collected" numeric NOT NULL,
  	"management_fee" numeric NOT NULL,
  	"amount" numeric NOT NULL,
  	"status" "enum_payouts_status" DEFAULT 'scheduled' NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payouts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_payouts_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_reference" varchar NOT NULL,
  	"version_partner_id" uuid NOT NULL,
  	"version_period" varchar NOT NULL,
  	"version_gross_collected" numeric NOT NULL,
  	"version_management_fee" numeric NOT NULL,
  	"version_amount" numeric NOT NULL,
  	"version_status" "enum__payouts_v_version_status" DEFAULT 'scheduled' NOT NULL,
  	"version_paid_at" timestamp(3) with time zone,
  	"version_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_payouts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "payment_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"reservation_deposits_enabled" boolean DEFAULT false,
  	"reservation_deposit_amount" numeric DEFAULT 500,
  	"reservation_terms" varchar DEFAULT 'Your reservation deposit holds your place in the group. It is credited against your first month, and refunded in full if the group does not confirm.',
  	"invoice_due_days" numeric DEFAULT 7,
  	"management_fee_percent" numeric DEFAULT 12,
  	"eft_details" varchar DEFAULT 'Affordable Life (Pty) Ltd
  Bank: — add your bank —
  Account number: —
  Branch code: —
  Reference: your invoice number',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payment_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  CREATE TABLE "_payment_settings_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_reservation_deposits_enabled" boolean DEFAULT false,
  	"version_reservation_deposit_amount" numeric DEFAULT 500,
  	"version_reservation_terms" varchar DEFAULT 'Your reservation deposit holds your place in the group. It is credited against your first month, and refunded in full if the group does not confirm.',
  	"version_invoice_due_days" numeric DEFAULT 7,
  	"version_management_fee_percent" numeric DEFAULT 12,
  	"version_eft_details" varchar DEFAULT 'Affordable Life (Pty) Ltd
  Bank: — add your bank —
  Account number: —
  Branch code: —
  Reference: your invoice number',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_payment_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"users_id" uuid
  );
  
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'tenant' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "company_name" varchar;
  ALTER TABLE "_users_v" ADD COLUMN "version_role" "enum__users_v_version_role" DEFAULT 'tenant' NOT NULL;
  ALTER TABLE "_users_v" ADD COLUMN "version_company_name" varchar;
  ALTER TABLE "homes" ADD COLUMN "partner_id" uuid;
  ALTER TABLE "_homes_v" ADD COLUMN "version_partner_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tenancies_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invoices_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payments_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "maintenance_requests_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payouts_id" uuid;
  ALTER TABLE "tenancies" ADD CONSTRAINT "tenancies_tenant_id_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenancies" ADD CONSTRAINT "tenancies_application_id_tenant_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenancies" ADD CONSTRAINT "tenancies_home_id_homes_id_fk" FOREIGN KEY ("home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenancies_rels" ADD CONSTRAINT "tenancies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenancies_rels" ADD CONSTRAINT "tenancies_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenancies_rels" ADD CONSTRAINT "tenancies_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenancies_v" ADD CONSTRAINT "_tenancies_v_parent_id_tenancies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenancies_v" ADD CONSTRAINT "_tenancies_v_version_tenant_id_users_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenancies_v" ADD CONSTRAINT "_tenancies_v_version_application_id_tenant_applications_id_fk" FOREIGN KEY ("version_application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenancies_v" ADD CONSTRAINT "_tenancies_v_version_home_id_homes_id_fk" FOREIGN KEY ("version_home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenancies_v_rels" ADD CONSTRAINT "_tenancies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tenancies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenancies_v_rels" ADD CONSTRAINT "_tenancies_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenancies_v_rels" ADD CONSTRAINT "_tenancies_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenant_id_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenancy_id_tenancies_id_fk" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_application_id_tenant_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_interest_id_demand_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."demand_interests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices_rels" ADD CONSTRAINT "invoices_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices_rels" ADD CONSTRAINT "invoices_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices_rels" ADD CONSTRAINT "invoices_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invoices_v" ADD CONSTRAINT "_invoices_v_parent_id_invoices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invoices_v" ADD CONSTRAINT "_invoices_v_version_tenant_id_users_id_fk" FOREIGN KEY ("version_tenant_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invoices_v" ADD CONSTRAINT "_invoices_v_version_tenancy_id_tenancies_id_fk" FOREIGN KEY ("version_tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invoices_v" ADD CONSTRAINT "_invoices_v_version_application_id_tenant_applications_id_fk" FOREIGN KEY ("version_application_id") REFERENCES "public"."tenant_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invoices_v" ADD CONSTRAINT "_invoices_v_version_interest_id_demand_interests_id_fk" FOREIGN KEY ("version_interest_id") REFERENCES "public"."demand_interests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_invoices_v_rels" ADD CONSTRAINT "_invoices_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_invoices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invoices_v_rels" ADD CONSTRAINT "_invoices_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_invoices_v_rels" ADD CONSTRAINT "_invoices_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments_rels" ADD CONSTRAINT "payments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments_rels" ADD CONSTRAINT "payments_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payments_rels" ADD CONSTRAINT "payments_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payments_v" ADD CONSTRAINT "_payments_v_parent_id_payments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_payments_v" ADD CONSTRAINT "_payments_v_version_invoice_id_invoices_id_fk" FOREIGN KEY ("version_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_payments_v_rels" ADD CONSTRAINT "_payments_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_payments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payments_v_rels" ADD CONSTRAINT "_payments_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payments_v_rels" ADD CONSTRAINT "_payments_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_tenancy_id_tenancies_id_fk" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_home_id_homes_id_fk" FOREIGN KEY ("home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_requests_rels" ADD CONSTRAINT "maintenance_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."maintenance_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_requests_rels" ADD CONSTRAINT "maintenance_requests_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_requests_rels" ADD CONSTRAINT "maintenance_requests_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v" ADD CONSTRAINT "_maintenance_requests_v_parent_id_maintenance_requests_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."maintenance_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v" ADD CONSTRAINT "_maintenance_requests_v_version_tenancy_id_tenancies_id_fk" FOREIGN KEY ("version_tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v" ADD CONSTRAINT "_maintenance_requests_v_version_home_id_homes_id_fk" FOREIGN KEY ("version_home_id") REFERENCES "public"."homes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v" ADD CONSTRAINT "_maintenance_requests_v_version_reporter_id_users_id_fk" FOREIGN KEY ("version_reporter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v_rels" ADD CONSTRAINT "_maintenance_requests_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_maintenance_requests_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v_rels" ADD CONSTRAINT "_maintenance_requests_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_maintenance_requests_v_rels" ADD CONSTRAINT "_maintenance_requests_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_partner_id_users_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payouts_rels" ADD CONSTRAINT "payouts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payouts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payouts_rels" ADD CONSTRAINT "payouts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payouts_rels" ADD CONSTRAINT "payouts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payouts_v" ADD CONSTRAINT "_payouts_v_parent_id_payouts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payouts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_payouts_v" ADD CONSTRAINT "_payouts_v_version_partner_id_users_id_fk" FOREIGN KEY ("version_partner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_payouts_v_rels" ADD CONSTRAINT "_payouts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_payouts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payouts_v_rels" ADD CONSTRAINT "_payouts_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payouts_v_rels" ADD CONSTRAINT "_payouts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payment_settings_rels" ADD CONSTRAINT "payment_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payment_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payment_settings_rels" ADD CONSTRAINT "payment_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payment_settings_rels" ADD CONSTRAINT "payment_settings_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payment_settings_v_rels" ADD CONSTRAINT "_payment_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_payment_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payment_settings_v_rels" ADD CONSTRAINT "_payment_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_payment_settings_v_rels" ADD CONSTRAINT "_payment_settings_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tenancies_tenant_idx" ON "tenancies" USING btree ("tenant_id");
  CREATE INDEX "tenancies_tenant_email_idx" ON "tenancies" USING btree ("tenant_email");
  CREATE INDEX "tenancies_application_idx" ON "tenancies" USING btree ("application_id");
  CREATE INDEX "tenancies_home_idx" ON "tenancies" USING btree ("home_id");
  CREATE INDEX "tenancies_status_idx" ON "tenancies" USING btree ("status");
  CREATE INDEX "tenancies_updated_at_idx" ON "tenancies" USING btree ("updated_at");
  CREATE INDEX "tenancies_created_at_idx" ON "tenancies" USING btree ("created_at");
  CREATE INDEX "tenancies_rels_order_idx" ON "tenancies_rels" USING btree ("order");
  CREATE INDEX "tenancies_rels_parent_idx" ON "tenancies_rels" USING btree ("parent_id");
  CREATE INDEX "tenancies_rels_path_idx" ON "tenancies_rels" USING btree ("path");
  CREATE INDEX "tenancies_rels_admins_id_idx" ON "tenancies_rels" USING btree ("admins_id");
  CREATE INDEX "tenancies_rels_users_id_idx" ON "tenancies_rels" USING btree ("users_id");
  CREATE INDEX "_tenancies_v_parent_idx" ON "_tenancies_v" USING btree ("parent_id");
  CREATE INDEX "_tenancies_v_version_version_tenant_idx" ON "_tenancies_v" USING btree ("version_tenant_id");
  CREATE INDEX "_tenancies_v_version_version_tenant_email_idx" ON "_tenancies_v" USING btree ("version_tenant_email");
  CREATE INDEX "_tenancies_v_version_version_application_idx" ON "_tenancies_v" USING btree ("version_application_id");
  CREATE INDEX "_tenancies_v_version_version_home_idx" ON "_tenancies_v" USING btree ("version_home_id");
  CREATE INDEX "_tenancies_v_version_version_status_idx" ON "_tenancies_v" USING btree ("version_status");
  CREATE INDEX "_tenancies_v_version_version_updated_at_idx" ON "_tenancies_v" USING btree ("version_updated_at");
  CREATE INDEX "_tenancies_v_version_version_created_at_idx" ON "_tenancies_v" USING btree ("version_created_at");
  CREATE INDEX "_tenancies_v_created_at_idx" ON "_tenancies_v" USING btree ("created_at");
  CREATE INDEX "_tenancies_v_updated_at_idx" ON "_tenancies_v" USING btree ("updated_at");
  CREATE INDEX "_tenancies_v_rels_order_idx" ON "_tenancies_v_rels" USING btree ("order");
  CREATE INDEX "_tenancies_v_rels_parent_idx" ON "_tenancies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tenancies_v_rels_path_idx" ON "_tenancies_v_rels" USING btree ("path");
  CREATE INDEX "_tenancies_v_rels_admins_id_idx" ON "_tenancies_v_rels" USING btree ("admins_id");
  CREATE INDEX "_tenancies_v_rels_users_id_idx" ON "_tenancies_v_rels" USING btree ("users_id");
  CREATE UNIQUE INDEX "invoices_number_idx" ON "invoices" USING btree ("number");
  CREATE INDEX "invoices_period_idx" ON "invoices" USING btree ("period");
  CREATE INDEX "invoices_payer_email_idx" ON "invoices" USING btree ("payer_email");
  CREATE INDEX "invoices_tenant_idx" ON "invoices" USING btree ("tenant_id");
  CREATE INDEX "invoices_tenancy_idx" ON "invoices" USING btree ("tenancy_id");
  CREATE INDEX "invoices_application_idx" ON "invoices" USING btree ("application_id");
  CREATE INDEX "invoices_interest_idx" ON "invoices" USING btree ("interest_id");
  CREATE UNIQUE INDEX "invoices_unique_key_idx" ON "invoices" USING btree ("unique_key");
  CREATE INDEX "invoices_pay_token_hash_idx" ON "invoices" USING btree ("pay_token_hash");
  CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE INDEX "invoices_rels_order_idx" ON "invoices_rels" USING btree ("order");
  CREATE INDEX "invoices_rels_parent_idx" ON "invoices_rels" USING btree ("parent_id");
  CREATE INDEX "invoices_rels_path_idx" ON "invoices_rels" USING btree ("path");
  CREATE INDEX "invoices_rels_admins_id_idx" ON "invoices_rels" USING btree ("admins_id");
  CREATE INDEX "invoices_rels_users_id_idx" ON "invoices_rels" USING btree ("users_id");
  CREATE INDEX "_invoices_v_parent_idx" ON "_invoices_v" USING btree ("parent_id");
  CREATE INDEX "_invoices_v_version_version_number_idx" ON "_invoices_v" USING btree ("version_number");
  CREATE INDEX "_invoices_v_version_version_period_idx" ON "_invoices_v" USING btree ("version_period");
  CREATE INDEX "_invoices_v_version_version_payer_email_idx" ON "_invoices_v" USING btree ("version_payer_email");
  CREATE INDEX "_invoices_v_version_version_tenant_idx" ON "_invoices_v" USING btree ("version_tenant_id");
  CREATE INDEX "_invoices_v_version_version_tenancy_idx" ON "_invoices_v" USING btree ("version_tenancy_id");
  CREATE INDEX "_invoices_v_version_version_application_idx" ON "_invoices_v" USING btree ("version_application_id");
  CREATE INDEX "_invoices_v_version_version_interest_idx" ON "_invoices_v" USING btree ("version_interest_id");
  CREATE INDEX "_invoices_v_version_version_unique_key_idx" ON "_invoices_v" USING btree ("version_unique_key");
  CREATE INDEX "_invoices_v_version_version_pay_token_hash_idx" ON "_invoices_v" USING btree ("version_pay_token_hash");
  CREATE INDEX "_invoices_v_version_version_status_idx" ON "_invoices_v" USING btree ("version_status");
  CREATE INDEX "_invoices_v_version_version_updated_at_idx" ON "_invoices_v" USING btree ("version_updated_at");
  CREATE INDEX "_invoices_v_version_version_created_at_idx" ON "_invoices_v" USING btree ("version_created_at");
  CREATE INDEX "_invoices_v_created_at_idx" ON "_invoices_v" USING btree ("created_at");
  CREATE INDEX "_invoices_v_updated_at_idx" ON "_invoices_v" USING btree ("updated_at");
  CREATE INDEX "_invoices_v_rels_order_idx" ON "_invoices_v_rels" USING btree ("order");
  CREATE INDEX "_invoices_v_rels_parent_idx" ON "_invoices_v_rels" USING btree ("parent_id");
  CREATE INDEX "_invoices_v_rels_path_idx" ON "_invoices_v_rels" USING btree ("path");
  CREATE INDEX "_invoices_v_rels_admins_id_idx" ON "_invoices_v_rels" USING btree ("admins_id");
  CREATE INDEX "_invoices_v_rels_users_id_idx" ON "_invoices_v_rels" USING btree ("users_id");
  CREATE INDEX "payments_invoice_idx" ON "payments" USING btree ("invoice_id");
  CREATE UNIQUE INDEX "payments_provider_payment_id_idx" ON "payments" USING btree ("provider_payment_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "payments_rels_order_idx" ON "payments_rels" USING btree ("order");
  CREATE INDEX "payments_rels_parent_idx" ON "payments_rels" USING btree ("parent_id");
  CREATE INDEX "payments_rels_path_idx" ON "payments_rels" USING btree ("path");
  CREATE INDEX "payments_rels_admins_id_idx" ON "payments_rels" USING btree ("admins_id");
  CREATE INDEX "payments_rels_users_id_idx" ON "payments_rels" USING btree ("users_id");
  CREATE INDEX "_payments_v_parent_idx" ON "_payments_v" USING btree ("parent_id");
  CREATE INDEX "_payments_v_version_version_invoice_idx" ON "_payments_v" USING btree ("version_invoice_id");
  CREATE INDEX "_payments_v_version_version_provider_payment_id_idx" ON "_payments_v" USING btree ("version_provider_payment_id");
  CREATE INDEX "_payments_v_version_version_updated_at_idx" ON "_payments_v" USING btree ("version_updated_at");
  CREATE INDEX "_payments_v_version_version_created_at_idx" ON "_payments_v" USING btree ("version_created_at");
  CREATE INDEX "_payments_v_created_at_idx" ON "_payments_v" USING btree ("created_at");
  CREATE INDEX "_payments_v_updated_at_idx" ON "_payments_v" USING btree ("updated_at");
  CREATE INDEX "_payments_v_rels_order_idx" ON "_payments_v_rels" USING btree ("order");
  CREATE INDEX "_payments_v_rels_parent_idx" ON "_payments_v_rels" USING btree ("parent_id");
  CREATE INDEX "_payments_v_rels_path_idx" ON "_payments_v_rels" USING btree ("path");
  CREATE INDEX "_payments_v_rels_admins_id_idx" ON "_payments_v_rels" USING btree ("admins_id");
  CREATE INDEX "_payments_v_rels_users_id_idx" ON "_payments_v_rels" USING btree ("users_id");
  CREATE INDEX "maintenance_requests_tenancy_idx" ON "maintenance_requests" USING btree ("tenancy_id");
  CREATE INDEX "maintenance_requests_home_idx" ON "maintenance_requests" USING btree ("home_id");
  CREATE INDEX "maintenance_requests_reporter_idx" ON "maintenance_requests" USING btree ("reporter_id");
  CREATE INDEX "maintenance_requests_status_idx" ON "maintenance_requests" USING btree ("status");
  CREATE INDEX "maintenance_requests_updated_at_idx" ON "maintenance_requests" USING btree ("updated_at");
  CREATE INDEX "maintenance_requests_created_at_idx" ON "maintenance_requests" USING btree ("created_at");
  CREATE INDEX "maintenance_requests_rels_order_idx" ON "maintenance_requests_rels" USING btree ("order");
  CREATE INDEX "maintenance_requests_rels_parent_idx" ON "maintenance_requests_rels" USING btree ("parent_id");
  CREATE INDEX "maintenance_requests_rels_path_idx" ON "maintenance_requests_rels" USING btree ("path");
  CREATE INDEX "maintenance_requests_rels_admins_id_idx" ON "maintenance_requests_rels" USING btree ("admins_id");
  CREATE INDEX "maintenance_requests_rels_users_id_idx" ON "maintenance_requests_rels" USING btree ("users_id");
  CREATE INDEX "_maintenance_requests_v_parent_idx" ON "_maintenance_requests_v" USING btree ("parent_id");
  CREATE INDEX "_maintenance_requests_v_version_version_tenancy_idx" ON "_maintenance_requests_v" USING btree ("version_tenancy_id");
  CREATE INDEX "_maintenance_requests_v_version_version_home_idx" ON "_maintenance_requests_v" USING btree ("version_home_id");
  CREATE INDEX "_maintenance_requests_v_version_version_reporter_idx" ON "_maintenance_requests_v" USING btree ("version_reporter_id");
  CREATE INDEX "_maintenance_requests_v_version_version_status_idx" ON "_maintenance_requests_v" USING btree ("version_status");
  CREATE INDEX "_maintenance_requests_v_version_version_updated_at_idx" ON "_maintenance_requests_v" USING btree ("version_updated_at");
  CREATE INDEX "_maintenance_requests_v_version_version_created_at_idx" ON "_maintenance_requests_v" USING btree ("version_created_at");
  CREATE INDEX "_maintenance_requests_v_created_at_idx" ON "_maintenance_requests_v" USING btree ("created_at");
  CREATE INDEX "_maintenance_requests_v_updated_at_idx" ON "_maintenance_requests_v" USING btree ("updated_at");
  CREATE INDEX "_maintenance_requests_v_rels_order_idx" ON "_maintenance_requests_v_rels" USING btree ("order");
  CREATE INDEX "_maintenance_requests_v_rels_parent_idx" ON "_maintenance_requests_v_rels" USING btree ("parent_id");
  CREATE INDEX "_maintenance_requests_v_rels_path_idx" ON "_maintenance_requests_v_rels" USING btree ("path");
  CREATE INDEX "_maintenance_requests_v_rels_admins_id_idx" ON "_maintenance_requests_v_rels" USING btree ("admins_id");
  CREATE INDEX "_maintenance_requests_v_rels_users_id_idx" ON "_maintenance_requests_v_rels" USING btree ("users_id");
  CREATE INDEX "payouts_partner_idx" ON "payouts" USING btree ("partner_id");
  CREATE INDEX "payouts_updated_at_idx" ON "payouts" USING btree ("updated_at");
  CREATE INDEX "payouts_created_at_idx" ON "payouts" USING btree ("created_at");
  CREATE INDEX "payouts_rels_order_idx" ON "payouts_rels" USING btree ("order");
  CREATE INDEX "payouts_rels_parent_idx" ON "payouts_rels" USING btree ("parent_id");
  CREATE INDEX "payouts_rels_path_idx" ON "payouts_rels" USING btree ("path");
  CREATE INDEX "payouts_rels_admins_id_idx" ON "payouts_rels" USING btree ("admins_id");
  CREATE INDEX "payouts_rels_users_id_idx" ON "payouts_rels" USING btree ("users_id");
  CREATE INDEX "_payouts_v_parent_idx" ON "_payouts_v" USING btree ("parent_id");
  CREATE INDEX "_payouts_v_version_version_partner_idx" ON "_payouts_v" USING btree ("version_partner_id");
  CREATE INDEX "_payouts_v_version_version_updated_at_idx" ON "_payouts_v" USING btree ("version_updated_at");
  CREATE INDEX "_payouts_v_version_version_created_at_idx" ON "_payouts_v" USING btree ("version_created_at");
  CREATE INDEX "_payouts_v_created_at_idx" ON "_payouts_v" USING btree ("created_at");
  CREATE INDEX "_payouts_v_updated_at_idx" ON "_payouts_v" USING btree ("updated_at");
  CREATE INDEX "_payouts_v_rels_order_idx" ON "_payouts_v_rels" USING btree ("order");
  CREATE INDEX "_payouts_v_rels_parent_idx" ON "_payouts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_payouts_v_rels_path_idx" ON "_payouts_v_rels" USING btree ("path");
  CREATE INDEX "_payouts_v_rels_admins_id_idx" ON "_payouts_v_rels" USING btree ("admins_id");
  CREATE INDEX "_payouts_v_rels_users_id_idx" ON "_payouts_v_rels" USING btree ("users_id");
  CREATE INDEX "payment_settings_rels_order_idx" ON "payment_settings_rels" USING btree ("order");
  CREATE INDEX "payment_settings_rels_parent_idx" ON "payment_settings_rels" USING btree ("parent_id");
  CREATE INDEX "payment_settings_rels_path_idx" ON "payment_settings_rels" USING btree ("path");
  CREATE INDEX "payment_settings_rels_admins_id_idx" ON "payment_settings_rels" USING btree ("admins_id");
  CREATE INDEX "payment_settings_rels_users_id_idx" ON "payment_settings_rels" USING btree ("users_id");
  CREATE INDEX "_payment_settings_v_created_at_idx" ON "_payment_settings_v" USING btree ("created_at");
  CREATE INDEX "_payment_settings_v_updated_at_idx" ON "_payment_settings_v" USING btree ("updated_at");
  CREATE INDEX "_payment_settings_v_rels_order_idx" ON "_payment_settings_v_rels" USING btree ("order");
  CREATE INDEX "_payment_settings_v_rels_parent_idx" ON "_payment_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_payment_settings_v_rels_path_idx" ON "_payment_settings_v_rels" USING btree ("path");
  CREATE INDEX "_payment_settings_v_rels_admins_id_idx" ON "_payment_settings_v_rels" USING btree ("admins_id");
  CREATE INDEX "_payment_settings_v_rels_users_id_idx" ON "_payment_settings_v_rels" USING btree ("users_id");
  ALTER TABLE "homes" ADD CONSTRAINT "homes_partner_id_users_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homes_v" ADD CONSTRAINT "_homes_v_version_partner_id_users_id_fk" FOREIGN KEY ("version_partner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenancies_fk" FOREIGN KEY ("tenancies_id") REFERENCES "public"."tenancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maintenance_requests_fk" FOREIGN KEY ("maintenance_requests_id") REFERENCES "public"."maintenance_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payouts_fk" FOREIGN KEY ("payouts_id") REFERENCES "public"."payouts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_idx" ON "users" USING btree ("role");
  CREATE INDEX "_users_v_version_version_role_idx" ON "_users_v" USING btree ("version_role");
  CREATE INDEX "homes_partner_idx" ON "homes" USING btree ("partner_id");
  CREATE INDEX "_homes_v_version_version_partner_idx" ON "_homes_v" USING btree ("version_partner_id");
  CREATE INDEX "payload_locked_documents_rels_tenancies_id_idx" ON "payload_locked_documents_rels" USING btree ("tenancies_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_maintenance_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("maintenance_requests_id");
  CREATE INDEX "payload_locked_documents_rels_payouts_id_idx" ON "payload_locked_documents_rels" USING btree ("payouts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenancies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tenancies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tenancies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tenancies_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invoices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invoices_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_invoices_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_invoices_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payments_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payments_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maintenance_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maintenance_requests_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_maintenance_requests_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_maintenance_requests_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payouts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payouts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payouts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payouts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_settings_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payment_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_payment_settings_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tenancies" CASCADE;
  DROP TABLE "tenancies_rels" CASCADE;
  DROP TABLE "_tenancies_v" CASCADE;
  DROP TABLE "_tenancies_v_rels" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "invoices_rels" CASCADE;
  DROP TABLE "_invoices_v" CASCADE;
  DROP TABLE "_invoices_v_rels" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "payments_rels" CASCADE;
  DROP TABLE "_payments_v" CASCADE;
  DROP TABLE "_payments_v_rels" CASCADE;
  DROP TABLE "maintenance_requests" CASCADE;
  DROP TABLE "maintenance_requests_rels" CASCADE;
  DROP TABLE "_maintenance_requests_v" CASCADE;
  DROP TABLE "_maintenance_requests_v_rels" CASCADE;
  DROP TABLE "payouts" CASCADE;
  DROP TABLE "payouts_rels" CASCADE;
  DROP TABLE "_payouts_v" CASCADE;
  DROP TABLE "_payouts_v_rels" CASCADE;
  DROP TABLE "payment_settings" CASCADE;
  DROP TABLE "payment_settings_rels" CASCADE;
  DROP TABLE "_payment_settings_v" CASCADE;
  DROP TABLE "_payment_settings_v_rels" CASCADE;
  ALTER TABLE "homes" DROP CONSTRAINT "homes_partner_id_users_id_fk";
  
  ALTER TABLE "_homes_v" DROP CONSTRAINT "_homes_v_version_partner_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tenancies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invoices_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_maintenance_requests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payouts_fk";
  
  DROP INDEX "users_role_idx";
  DROP INDEX "_users_v_version_version_role_idx";
  DROP INDEX "homes_partner_idx";
  DROP INDEX "_homes_v_version_version_partner_idx";
  DROP INDEX "payload_locked_documents_rels_tenancies_id_idx";
  DROP INDEX "payload_locked_documents_rels_invoices_id_idx";
  DROP INDEX "payload_locked_documents_rels_payments_id_idx";
  DROP INDEX "payload_locked_documents_rels_maintenance_requests_id_idx";
  DROP INDEX "payload_locked_documents_rels_payouts_id_idx";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "company_name";
  ALTER TABLE "_users_v" DROP COLUMN "version_role";
  ALTER TABLE "_users_v" DROP COLUMN "version_company_name";
  ALTER TABLE "homes" DROP COLUMN "partner_id";
  ALTER TABLE "_homes_v" DROP COLUMN "version_partner_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tenancies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invoices_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "maintenance_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payouts_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum__users_v_version_role";
  DROP TYPE "public"."enum_tenancies_kind";
  DROP TYPE "public"."enum_tenancies_status";
  DROP TYPE "public"."enum__tenancies_v_version_kind";
  DROP TYPE "public"."enum__tenancies_v_version_status";
  DROP TYPE "public"."enum_invoices_kind";
  DROP TYPE "public"."enum_invoices_status";
  DROP TYPE "public"."enum_invoices_payment_method";
  DROP TYPE "public"."enum__invoices_v_version_kind";
  DROP TYPE "public"."enum__invoices_v_version_status";
  DROP TYPE "public"."enum__invoices_v_version_payment_method";
  DROP TYPE "public"."enum_payments_provider";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum__payments_v_version_provider";
  DROP TYPE "public"."enum__payments_v_version_status";
  DROP TYPE "public"."enum_maintenance_requests_category";
  DROP TYPE "public"."enum_maintenance_requests_priority";
  DROP TYPE "public"."enum_maintenance_requests_status";
  DROP TYPE "public"."enum__maintenance_requests_v_version_category";
  DROP TYPE "public"."enum__maintenance_requests_v_version_priority";
  DROP TYPE "public"."enum__maintenance_requests_v_version_status";
  DROP TYPE "public"."enum_payouts_status";
  DROP TYPE "public"."enum__payouts_v_version_status";`)
}
