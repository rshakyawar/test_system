class CreateTechnicians < ActiveRecord::Migration
  def self.up
    create_table :technicians do |t|
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :technicians
  end
end
