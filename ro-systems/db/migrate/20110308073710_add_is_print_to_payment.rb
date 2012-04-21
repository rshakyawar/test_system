class AddIsPrintToPayment < ActiveRecord::Migration
  def self.up
    add_column :payments, :is_print, :boolean, :default => false
  end

  def self.down
    remove_column :payments, :is_print
  end
end
