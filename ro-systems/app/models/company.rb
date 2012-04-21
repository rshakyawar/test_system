class Company < ActiveRecord::Base

  has_many :orders

  validates :name, :presence => true
  validates :city, :presence => true
  validates :state, :presence => true

end
