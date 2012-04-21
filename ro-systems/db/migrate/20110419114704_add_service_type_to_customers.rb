class AddServiceTypeToCustomers < ActiveRecord::Migration
  def self.up
    add_column :customers, :service_type, :string
  end

  def self.down
    remove_column :customers, :service_type
  end
end
