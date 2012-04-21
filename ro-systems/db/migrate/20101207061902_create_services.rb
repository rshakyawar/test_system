class CreateServices < ActiveRecord::Migration
  def self.up
    create_table :services do |t|
      t.integer :complaint_id
      t.date :service_date
      t.integer :technician_id
      t.float :service_charge
      t.float :amount
      t.text :remarks

      t.timestamps
    end
  end

  def self.down
    drop_table :services
  end
end
