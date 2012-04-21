class CreateCompanies < ActiveRecord::Migration
  def self.up
    create_table :companies do |t|
      t.string :name
      t.string :house_number
      t.string :street
      t.string :colony
      t.string :landmark
      t.string :city
      t.decimal :zipcode
      t.string :state

      t.timestamps
    end
  end

  def self.down
    drop_table :companies
  end
end
