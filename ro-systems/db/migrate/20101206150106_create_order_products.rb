class CreateOrderProducts < ActiveRecord::Migration
  def self.up
    create_table :order_products do |t|
      t.integer :order_id
      t.integer :product_id
      t.integer :ordered_quantity
      t.integer :received_quantity
      t.float :rate

      t.timestamps
    end
  end

  def self.down
    drop_table :order_products
  end
end
