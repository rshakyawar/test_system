class SaleProduct < ActiveRecord::Base

  belongs_to :sale
  belongs_to :product_reference, :polymorphic=> true
  belongs_to :service_type


end
