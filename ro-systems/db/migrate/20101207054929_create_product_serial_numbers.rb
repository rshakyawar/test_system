class CreateProductSerialNumbers < ActiveRecord::Migration
  def self.up
    create_table :product_serial_numbers do |t|
      t.string :serial_number
      t.boolean :is_sold
      t.references :product

      t.timestamps
    end
  end

  def self.down
    drop_table :product_serial_numbers
  end
end
