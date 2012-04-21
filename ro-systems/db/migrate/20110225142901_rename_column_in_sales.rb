class RenameColumnInSales < ActiveRecord::Migration
  def self.up
      rename_column :sales, :delivery_person_id, :delivery_person_name
      rename_column :sales, :installation_person_id, :installation_person_name
      change_column :sales, :delivery_person_name, :string
      change_column :sales, :installation_person_name, :string
end

  def self.down
      rename_column :sales, :delivery_person_name,:delivery_person_id
      rename_column :sales, :installation_person_name, :installation_person_id
      change_column :sales, :delivery_person_id, :integer
      change_column :sales, :installation_person_id, :integer
  end
end
