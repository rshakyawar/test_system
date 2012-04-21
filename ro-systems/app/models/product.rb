class Product < ActiveRecord::Base

  has_many :order_products
  has_many :product_serial_numbers
  has_many :service_products
  has_many :sale_products, :as => :product_reference

  validates :name, :presence => true
  validates :description, :presence => true
  validates :current_stock, :presence => true, :numericality => true

### Get Stock Details in a particular order
  def self.get_stock_detail( params )
    stock_detail = []
    begin
      products = ""
      unless params[:order_by] == "quantity desc" || params[:order_by] == "quantity asc"
        products = Product.all(:conditions => ["name ilike ? AND description ilike ? AND is_enable = TRUE", "%#{params[:name]}%", "%#{params[:description]}%"], :order => "#{params[:order_by]}")
      else
        products = Product.all(:conditions => ["name ilike ? AND description ilike ? AND is_enable = TRUE", "%#{params[:name]}%", "%#{params[:description]}%"])
      end
      unless products.blank?
        products.each do |product|
          detail = {}
          detail["product_name"] = product.name
          detail["description"] = product.description
          detail["product_id"] = product.id
          ordered_products = product.order_products
          total_quantity = 0
          total_amount = 0.0
          ordered_products.each do |p| 
             if p.received_quantity != nil
              total_quantity = (total_quantity + p.received_quantity) 
              total_amount = total_amount + p.rate * p.received_quantity
             end
          end
          detail["average_rate"] = total_quantity == 0 ? 0.0 : (total_amount / total_quantity).round(2) 
          with_serial = product.is_serial_number
          if with_serial
            received_quantity = product.product_serial_numbers.count("product_id", :conditions => ["is_sold = FALSE"])
            detail["quantity"] = received_quantity
          else
            received_quantity = product.order_products.sum("received_quantity")
            sold_quantity = product.sale_products.sum("quantity")
            detail["quantity"] = received_quantity - sold_quantity + Integer(product.current_stock)
          end
          stock_detail << detail
        end
      end
    rescue
        return 0
    end
    if params[:order_by] == "quantity desc"
      stock_detail.sort_by{ |quantity| quantity["quantity"] }.reverse!
    elsif params[:order_by] == "quantity asc"
      stock_detail.sort_by{ |quantity| quantity["quantity"] }
    else
      stock_detail
    end
  end

end
