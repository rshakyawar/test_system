class CreateCitiInfos < ActiveRecord::Migration
  def self.up
    create_table :citi_infos do |t|
      t.string :city_name
      t.string :zip
      t.string :std_code

      t.timestamps
    end
  end

  def self.down
    drop_table :citi_infos
  end
end
