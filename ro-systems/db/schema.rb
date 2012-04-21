# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110502105257) do

  create_table "bill_book_series", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "current_invoice_number", :default => 101
  end

  create_table "citi_infos", :force => true do |t|
    t.string   "city_name"
    t.string   "zip"
    t.string   "std_code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "companies", :force => true do |t|
    t.string   "name"
    t.string   "house_number"
    t.string   "street"
    t.string   "colony"
    t.string   "landmark"
    t.string   "city"
    t.decimal  "zipcode"
    t.string   "state"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "complaints", :force => true do |t|
    t.date     "date"
    t.text     "description"
    t.integer  "customer_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "complaint_no"
  end

  create_table "customers", :force => true do |t|
    t.string   "identity"
    t.date     "contract_date"
    t.string   "amc_type"
    t.string   "name"
    t.string   "house_number"
    t.string   "street"
    t.string   "colony"
    t.string   "landmark"
    t.string   "city"
    t.string   "zipcode"
    t.string   "state"
    t.decimal  "phone_number"
    t.decimal  "mobile_number"
    t.string   "contract_person"
    t.string   "model_name"
    t.string   "prefilter"
    t.float    "contract_amount"
    t.text     "remarks"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "service_type"
  end

  create_table "order_payments", :force => true do |t|
    t.date     "date"
    t.float    "paid_amount"
    t.text     "remarks"
    t.integer  "order_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "order_products", :force => true do |t|
    t.integer  "order_id"
    t.integer  "product_id"
    t.integer  "ordered_quantity"
    t.integer  "received_quantity"
    t.float    "rate"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status"
  end

  create_table "orders", :force => true do |t|
    t.date     "order_date"
    t.string   "contact_person"
    t.decimal  "phone_number"
    t.decimal  "mobile_number"
    t.float    "total_amount"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status"
  end

  create_table "payments", :force => true do |t|
    t.string   "reference_type"
    t.integer  "reference_id"
    t.date     "pay_date"
    t.date     "next_pay_date"
    t.float    "paid_amount"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "pay_mode"
    t.integer  "transfer_to_account_no"
    t.string   "bank_name"
    t.integer  "cheque_no"
    t.date     "post_cheque_date"
    t.boolean  "is_print",               :default => false
  end

  create_table "product_serial_numbers", :force => true do |t|
    t.string   "serial_number"
    t.boolean  "is_sold"
    t.integer  "product_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "products", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "current_stock"
    t.boolean  "is_serial_number"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_enable",        :default => true
  end

  create_table "sale_products", :force => true do |t|
    t.integer  "sale_id"
    t.string   "product_reference_type"
    t.integer  "product_reference_id"
    t.integer  "quantity"
    t.float    "rate"
    t.integer  "service_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "serial_number_reference_id"
  end

  create_table "sales", :force => true do |t|
    t.string   "customer_type"
    t.date     "date"
    t.string   "bill_book_number"
    t.string   "customer_name"
    t.string   "invoice_number"
    t.string   "house_number"
    t.string   "street"
    t.string   "colony"
    t.string   "landmark"
    t.string   "city"
    t.string   "zipcode"
    t.string   "state"
    t.decimal  "phone_number"
    t.decimal  "mobile_number"
    t.date     "installation_date"
    t.string   "delivery_person_name"
    t.string   "installation_person_name"
    t.string   "po_number"
    t.date     "po_date"
    t.float    "total_amount"
    t.string   "enquiry_from"
    t.text     "remarks"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "service_products", :force => true do |t|
    t.integer  "service_id"
    t.integer  "product_id"
    t.integer  "quantity"
    t.float    "rate"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "service_types", :force => true do |t|
    t.string   "time_limit"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "services", :force => true do |t|
    t.integer  "complaint_id"
    t.date     "service_date"
    t.integer  "technician_id"
    t.float    "service_charge"
    t.float    "amount"
    t.text     "remarks"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "technicians", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "user_name"
    t.string   "password"
    t.boolean  "is_admin"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_type_id"
  end

end
