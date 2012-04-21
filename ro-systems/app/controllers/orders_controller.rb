class OrdersController < ApplicationController

### Check Authendication before calling any function
  before_filter :authenticate
before_filter :is_admin
protect_from_forgery :except => [:destroy_order]

### Save Order Information to Database
  def create_order
    @order = Order.new(params[:order])
    if @order.save
      params[:order_payments][:order_id] = @order.id
      if params[:order_payments][:date] == ""
        params[:order_payments][:date] = @order.order_date
      end
      @order_payment = OrderPayment.create(params[:order_payments])
      names = params[:product][:name]
      product_ids = params[:product][:description]
      quantities = params[:product][:quantity]
      rates = params[:product][:rate]
      product_ids.each_index do |index|
        if Order.accept_product(names[index],product_ids[index])
          product_save = OrderProduct.create(:order_id => @order.id, :product_id => product_ids[index], :ordered_quantity => quantities[index], :rate => rates[index])
        end
      end
      session[:order_id] = @order.id
      redirect_to order_path
    else
      render order_path
    end
  end


### Edit Order information to database
def edit_order
  begin
      @order = Order.find(params[:id])
      if @order.order_date==nil
             @order.order_date = Date.today.strftime('%m/%d/%Y')
      end
    rescue
    end
end
### update order information
  def update_order
       @order = Order.find(params[:id])
       @order.total_amount = params[:order_total_amount]
       @order.update_attributes(params[:order])
       @order_payment = @order.order_payments.find(:first)
       @order_payment.update_attributes(params[:order_payments])
        names = params[:product][:name]
        product_ids = params[:product][:description]
        quantities = params[:product][:quantity]
        rates = params[:product][:rate]
        index =0
    @order.order_products.each do |order_product|
        order_product.update_attributes(:product_id => product_ids[index], :ordered_quantity => quantities[index], :rate => rates[index])
        index=index+1
    end
      session[:order_id] = @order.id
      redirect_to order_path
  end

### Get Company Information with selected ID
  def selected_company
    begin
      companies = Company.find(params[:id])
    rescue
    end
    render :json => [{'company_house_number' => companies.house_number, 'company_street' => companies.street, 'company_colony' => companies.colony, 'company_landmark' => companies.landmark, 'company_city' => companies.city, 'company_zipcode' => companies.zipcode, 'company_state' => companies.state}].to_json
  end

### Get Product Description with selected Product Name
  def selected_product
    response = []
    begin
        @products = Product.find(:all, :conditions => ["name = ? AND is_enable = TRUE", params[:id]])
         
        if @products.blank?
           product = Product.find(:first, :conditions => ["id = ? AND is_enable = TRUE", params[:id]])
           @products = Product.where(:name => "#{product.name}") 
        end
      
       @products.each do |product|
        response << {'descriptions' => product.description, 'id' => product.id}
      end
    rescue
    end
    render :json => response.to_json
  end

### Get Order Status in a Particular Order
  def ordered_order_status
    orders = Order.get_order_status(params)
    render_partial_pagination("order_status", orders, params[:page], :orders)
  end

### Get Order Status Details
  def order_status_details
    @orders = Order.get_order_status_details(params[:id])
  end

### Show Order Status Details
  def show_order_status
    @orders = Order.get_order_status_details(params[:id])
  end


### Add Received Quantity Of An Order
  def add_received_quantity
    @orders = Order.get_product_quantity(params[:id])
  end

### Update Quantity with same as received quantity
  def update_same_received_quantity
    begin
      order_product = OrderProduct.find(params[:id])
      order_product.update_attribute(:received_quantity, order_product.ordered_quantity)
      products = OrderProduct.find(:all, :conditions => ["order_id = ?", order_product.order_id])
      unless products.blank?
        total_amount = 0
        products.each do |product|
          total_amount = total_amount + product.received_quantity * product.rate
        end
        order = order_product.order
        order.update_attribute(:total_amount, total_amount)
      end
    rescue
    end
    redirect_to "/order/status_details/#{order_product.order.id}"
  end

### Update Quantity(product with serial number)
  def receive_quantity
    begin
      order_product = OrderProduct.find(params[:order_product][:id])
      previous_received = order_product.received_quantity
      params[:order_product][:received_quantity] = previous_received.to_i + params[:order_product][:received_quantity].to_i
      if order_product.update_attributes(params[:order_product])
        product_id = order_product.product.id
        serial_numbers = params[:serial_number]
        unless serial_numbers.blank?
          serial_numbers.each do |serial_number|
            add_serial_number = ProductSerialNumber.create(:product_id => product_id, :is_sold => false, :serial_number => serial_number)
          end
        end
        products = OrderProduct.find(:all, :conditions => ["order_id = ?", order_product.order_id])
        unless products.blank?
          total_amount = 0
          products.each do |product|
            total_amount = total_amount + product.received_quantity * product.rate
          end
          order = order_product.order
          order.update_attribute(:total_amount, total_amount)
        end
      end
    rescue
    end
    redirect_to "/order/status_details/#{order_product.order.id}"
  end

### Get Order Balance in particular order
  def ordered_order_balance
    orders = Order.get_order_balance( params )
    render_partial_pagination("order_balance", orders, params[:page], :orders)
  end

### Get Order Balance details
  def order_balance_details
    orders = Order.get_order_balance_details(params[:id])
    start_index = params[:page]=="0" ? 0 : (Integer(params[:page])-1)*5
    total_pages = (Float(orders.size)/5).ceil
    render :partial => "order_balance_details", :locals => { :orders => orders[start_index,5], :total_pages => total_pages, :counter => start_index, :company_id => params[:id], :action => params[:action] }
  end

### Get Companies in some order
  def ordered_show_companies
    companies = Company.find(:all, :conditions => ["name like ? AND colony like ? AND landmark like ?", "%#{params[:name]}%", "%#{params[:colony]}%", "%#{params[:landmark]}%"], :order => params[:order_by])
    company_arr = []
    unless companies.blank?
      companies.each do |company|
        company_hash = {}
        company_hash["name"] = company.name
        company_hash["id"] = company.id
        company_hash["address"] = Customer.get_address( company )
        company_arr << company_hash
      end
    end
    render_partial_pagination("show_companies", company_arr, params[:page], :companies)
  end

### Generate Create Company form
  def new_company
    @company = Company.new
  end

### Save Company Information
  def create_company
    @company = Company.new(params[:company])
    (@company.save) ? redirect_to(company_show_path) : render(company_new_path)
  end

### Print company Listing
  def print_companies
    @company_name, @address, @serial = params[:company], params[:address], params[:serials]
  end

### Print Order Status
  def print_order_status
    @company_name, @order_date, @order_status, @serial = params[:company], params[:order_dates], params[:order_status], params[:serials]
  end

### Print Order Balance
  def print_order_balance
    @company_name, @order_balance, @address, @serial = params[:company], params[:order_balance], params[:address], params[:serials]
  end

### Print Order Form
  def print_order
    order = Order.find(params[:order_id])
    unless order.blank?
      company = order.company
      unless company.blank?
        @company_name = company.name.capitalize
        @address = Customer.get_address( company )
        @order_date = order.order_date.blank? ? "-" : order.order_date.strftime("%d/%m/%Y")
        @contact_person = order.contact_person.blank? ? "-" : order.contact_person.capitalize
        @contact_numbers = Customer.get_contacts( order )
        products = order.order_products
        @product_names, @descriptions, @quantities, @rates, @total = [], [], [], [], []
        unless products.blank?
          index = 0
          products.each do |product|
            @product_names[index] = product.product.name
            @descriptions[index] = product.product.description
            @quantities[index] = product.ordered_quantity
            @rates[index] = product.rate
            @total[index] = @quantities[index] * @rates[index]
            index = index + 1
          end
        end
        @total_amount = order.total_amount
        payment = order.order_payments.first
        @payment_date = payment.date.blank? ? "-" : payment.date.strftime("%d/%m/%Y")
        @paid_amount = payment.paid_amount
        @remarks = payment.remarks
      end
    end
  end

### Print Payment Of company
  def print_company_pay
    payment = OrderPayment.find(params[:payment_id])
    unless payment.blank?
      company = payment.order.company
      unless company.blank?
        @pay_date = payment.date.blank? ? "-" : payment.date.strftime("%d/%m/%Y")
        @amount = payment.paid_amount
        @company_name = company.name
        @address = Customer.get_address( company )
      end
    end
  end

### Open Edit Company Form
  def edit_company
    begin
      @company = Company.find(params[:id])
    rescue
    end
  end

### Update Company Information to Database
  def update_company
    begin
      @company = Company.find(params[:id])
      if @company.update_attributes(params[:company])
        redirect_to company_show_path
      else
        flash[:notice] = "Please enter correct Informations"
        render company_edit_path
      end
    rescue
    end
  end

  def destroy_order
    order = Order.find(params[:id])
    order.destroy
    redirect_to order_status_path
  end

 def destroy_company
    begin
      @company = Company.find(params[:id])
      @company.destroy
    rescue
    end
    redirect_to company_show_path
  end
end
