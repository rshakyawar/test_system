class User < ActiveRecord::Base

  validates :user_name, :presence => true
  validates :password, :presence => true,
                       :length => { :minimum => 4, :maximum => 10 },
                       :confirmation => true      
  validates :user_type_id, :presence => true
end
