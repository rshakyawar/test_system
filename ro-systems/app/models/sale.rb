class Sale < ActiveRecord::Base

  has_many :sale_products, :dependent => :destroy
  has_many :payments, :as => :reference, :dependent => :destroy
  belongs_to :technician
  validates_uniqueness_of :invoice_number, :scope => :bill_book_number, :message => "^This invoice no. has already used"
### Get Sales detailed Information
  def self.get_sale_information( params )
    data = []
    begin
      sale_info = ""
      if params[:from_date].blank?
        sale_info = Sale.find(:all, :conditions => ["customer_name ilike ? AND colony ilike ? AND landmark ilike ? AND customer_type ilike ?", "%#{params[:name]}%", "%#{params[:colony]}%", "%#{params[:landmark]}%", "%#{params[:customer_type]}"], :order => params[:order_by])
      else
        sale_info = Sale.find(:all, :conditions => ["customer_name ilike ? AND colony ilike ? AND landmark ilike ? AND customer_type ilike ? AND date BETWEEN ? AND ?", "%#{params[:name]}%", "%#{params[:colony]}%", "%#{params[:landmark]}%", "%#{params[:customer_type]}", Date.parse(params[:from_date]), Date.parse(params[:to_date])], :order => params[:order_by])
      end
      unless sale_info.blank?
        sale_info.each do |sale|
          data_hash = {}
          data_hash["date"] = sale.date.blank? ? "-": sale.date.strftime('%d/%m/%Y')
          data_hash["sale_id"] = sale.id.blank? ? "-": sale.id
          data_hash["customer_name"] = sale.customer_name.blank? ? "-": sale.customer_name.capitalize
          data_hash["customer_type"] = sale.customer_type.capitalize
          data_hash["address"] = Customer.get_address( sale )
          data_hash["contact_numbers"] = Customer.get_contacts( sale )
          data_hash["amount"] = sale.total_amount.blank? ? "-" : sale.total_amount
          data << data_hash
        end
      end
    rescue
    end
    data
  end

end
