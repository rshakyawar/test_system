class AddCurrentInvoiceToBillBookSeries < ActiveRecord::Migration
  def self.up
    add_column :bill_book_series, :current_invoice_number, :integer, :default => 101
  end

  def self.down
      remove_column :bill_book_series, :current_invoice_number
  end
end
