class AddIsEnableInPruducts < ActiveRecord::Migration
  def self.up
    add_column :products, :is_enable , :boolean, :default => true
  end

  def self.down
    remove_column :products, :is_enable , :boolean
  end
end
