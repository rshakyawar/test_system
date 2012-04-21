class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.string :name
      t.text :description
      t.integer :current_stock
      t.boolean :is_serial_number

      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end
