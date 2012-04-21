class AddColumnsToPayments < ActiveRecord::Migration
  def self.up
    add_column :payments, :pay_mode, :string
    add_column :payments, :transfer_to_account_no, :integer
    add_column :payments, :bank_name, :string
    add_column :payments, :cheque_no, :integer
    add_column :payments, :post_cheque_date, :date
  end

  def self.down
    remove_column :payments, :pay_mode
    remove_column :payments, :transfer_to_account_no
    remove_column :payments, :bank_name
    remove_column :payments, :cheque_no
    remove_column :payments, :post_cheque_date
  end
end
