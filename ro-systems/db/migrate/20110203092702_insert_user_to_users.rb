class InsertUserToUsers < ActiveRecord::Migration
  def self.up
	 
    change_table :users do |t|
  User.create :user_name => "admin",:password => "admin" ,:is_admin=> true
 end
end
   
  def self.down
    
  end
end
