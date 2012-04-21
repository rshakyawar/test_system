class AddColumnToComplaints < ActiveRecord::Migration
  def self.up
  add_column :complaints, :complaint_no, :string
  end

  def self.down
remove_column :complaints, :complaint_no
  end
end
