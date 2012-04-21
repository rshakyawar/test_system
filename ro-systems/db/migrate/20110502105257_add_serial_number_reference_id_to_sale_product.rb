class AddSerialNumberReferenceIdToSaleProduct < ActiveRecord::Migration
  def self.up
    add_column :sale_products, :serial_number_reference_id, :string
  end

  def self.down
    remove_column :sale_products, :serial_number_reference_id
  end
end
