class ProductSerialNumber < ActiveRecord::Base

  belongs_to :product
  has_many :sale_products, :as => :product_reference

end
