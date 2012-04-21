class CreatePayments < ActiveRecord::Migration
  def self.up
    create_table :payments do |t|
      t.string :reference_type
      t.integer :reference_id
      t.date :pay_date
      t.date :next_pay_date
      t.float :paid_amount

      t.timestamps
    end
  end

  def self.down
    drop_table :payments
  end
end
