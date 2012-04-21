class CreateBillBookSeries < ActiveRecord::Migration
  def self.up
    create_table :bill_book_series do |t|
      t.string :name
      t.timestamps
    end
  end

  def self.down
    drop_table :bill_book_series
  end
end
