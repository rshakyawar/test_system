class CreateOrderPayments < ActiveRecord::Migration
  def self.up
    create_table :order_payments do |t|
      t.date :date
      t.float :paid_amount
      t.text :remarks
      t.references :order

      t.timestamps
    end
  end

  def self.down
    drop_table :order_payments
  end
end
