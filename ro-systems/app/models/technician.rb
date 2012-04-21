class Technician < ActiveRecord::Base

  has_many :technicians

  has_many :delivery_person, :class_name => "Technician", :foreign_key => "delivery_person_name"
  has_many :installation_person, :class_name => "Technician", :foreign_key => "installation_person_name"

  validates :name, :presence => true

end
