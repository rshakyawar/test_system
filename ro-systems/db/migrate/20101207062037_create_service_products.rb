class CreateServiceProducts < ActiveRecord::Migration
  def self.up
    create_table :service_products do |t|
      t.integer :service_id
      t.integer :product_id
      t.integer :quantity
      t.float :rate

      t.timestamps
    end
  end

  def self.down
    drop_table :service_products
  end
end
