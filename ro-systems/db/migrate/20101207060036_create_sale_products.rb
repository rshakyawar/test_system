class CreateSaleProducts < ActiveRecord::Migration
  def self.up
    create_table :sale_products do |t|
      t.integer :sale_id
      t.string :product_reference_type
      t.integer :product_reference_id
      t.integer :quantity
      t.float :rate
      t.integer :service_type_id

      t.timestamps
    end
  end

  def self.down
    drop_table :sale_products
  end
end
