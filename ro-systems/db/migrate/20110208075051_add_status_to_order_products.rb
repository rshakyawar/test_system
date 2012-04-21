class AddStatusToOrderProducts < ActiveRecord::Migration
  def self.up
    add_column :order_products, :status, :string
  end

  def self.down
    remove_column :order_products, :status
  end
end
