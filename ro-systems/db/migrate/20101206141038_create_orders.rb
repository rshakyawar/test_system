class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.date :order_date
      t.string :contact_person
      t.decimal :phone_number
      t.decimal :mobile_number
      t.float :total_amount
      t.references :company

      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
