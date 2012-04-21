class CreateSales < ActiveRecord::Migration
  def self.up
    create_table :sales do |t|
      t.string :customer_type
      t.date :date
      t.string :bill_book_number
      t.string :customer_name
      t.string :invoice_number
      t.string :house_number
      t.string :street
      t.string :colony
      t.string :landmark
      t.string :city
      t.string :zipcode
      t.string :state
      t.decimal :phone_number
      t.decimal :mobile_number
      t.date :installation_date
      t.integer :delivery_person_id
      t.integer :installation_person_id
      t.string :po_number
      t.date :po_date
      t.float :total_amount
      t.string :enquiry_from
      t.text :remarks

      t.timestamps
    end
  end

  def self.down
    drop_table :sales
  end
end
