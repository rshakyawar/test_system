class SalesController < ApplicationController
### Check Authendication before calling any function
  before_filter :authenticate
  before_filter :is_admin
# protect_from_forgery :except => [:sales_destroy]
auto_complete_for :technician, :name
auto_complete_for :sale, :name

     def auto_complete_for_technician_delivery_person_name
                re = Regexp.new("^#{params[:technician][:name]}", "i")
                find_options = { :order => "name ASC" }
                @technicians = Technician.find(:all, find_options).collect(&:name).select { |org| org.match re }
            render :template => 'sales/auto_complete_for_technician_name',:layout=>false
      end
      def auto_complete_for_technician_installation_person_name
                  re = Regexp.new("^#{params[:technician][:name]}", "i")
                  find_options = { :order => "name ASC" }
                  @technicians = Technician.find(:all, find_options).collect(&:name).select { |org| org.match re }
            render :template => 'sales/auto_complete_for_technician_name',:layout=>false
      end
# ## auto_complete for enquiry from
      def auto_complete_for_technician_enquiry_from
                    re = Regexp.new("^#{params[:technician][:name]}", "i")
                    find_options = { :order => "name ASC" }
                    @technicians = Technician.find(:all, find_options).collect(&:name).select { |org| org.match re }
            render :template => 'sales/auto_complete_for_technician_name',:layout=>false
      end

    def auto_complete_for_sale_customer_name
                  re = Regexp.new("^#{params[:sale][:customer_name]}", "i")
                  @customers = Sale.find(:all, :order => "customer_name ASC").collect(&:customer_name).select { |org| org.match re }
          render :template => 'sales/auto_complete_for_sale_customer_name',:layout=>false
    end
### Get Product Serial Numbers of a particular product
  def selected_description
    response = []
    begin
      @products = Product.find(params[:id], :conditions => "is_enable = TRUE")
      if @products.is_serial_number
        @serials = @products.product_serial_numbers.find(:all, :conditions => ["is_sold = FALSE"])
        @serials.each do |serial|
          serial.serial_number.blank? ? '' : response << {'id' => serial.id, 'serial_number' => serial.serial_number}
        end
      end
    rescue
    end
    render :json => response.to_json
  end

### Create Bill for Sale
  def create_bill
    @customer_info = Sale.new(params[:sale])
      @customer_info.enquiry_from=params[:technician][:enquiry_from]
      @customer_info.delivery_person_name=params[:technician][:delivery_person_name]
      @customer_info.installation_person_name=params[:technician][:installation_person_name]
       bill_book_number =  BillBookSeries.find(params[:bill_book_series][:id])
       available_invoice = Sale.find(:all, :conditions => ["bill_book_number = ? AND invoice_number = ?", bill_book_number.name,  params[:bill_book_series][:current_invoice_number]])
        if(available_invoice == [])
          @customer_info.invoice_number=params[:bill_book_series][:current_invoice_number]
          @customer_info.bill_book_number = bill_book_number.name
              if (@customer_info.invoice_number.to_i == bill_book_number.current_invoice_number)
                bill_book_number.current_invoice_number = (bill_book_number.current_invoice_number).to_i + 1
                bill_book_number.update_attributes(bill_book_number.current_invoice_number)
              end
        else
          flash[:notice] = "This invoice number is already used"
        return redirect_to sales_sale_path
        end
        if @customer_info.save
              if params[:payment][:is_cash] == "1"
                  @cash_payment = Payment.cash_payment(@customer_info,params[:payments][:cash_amount], params[:payments][:next_pay_date])
                end
              if params[:payment][:is_cheque] == "1"
                  @cheque_payment = Payment.cheque_payment(@customer_info,params[:payment],params[:payments][:next_pay_date])
                 end
              if params[:payment][:is_by_transfer] == "1"
                  @online_payment = Payment.payment_transfer(@customer_info,params[:payments][:transfer_amount], params[:payments][:next_pay_date],params[:payments][:transfer_to_account_no])
                end
              if params[:payment][:is_by_card] == "1"
                  @card_payment = Payment.card_payment(@customer_info,params[:payments][:card_paid_amount], params[:payments][:next_pay_date])
               end
        names = params[:product][:name]
        product_ids = params[:product][:description]
        serial_numbers = params[:product][:serial_number]
        service_types = params[:product][:service_type]
        quantities = params[:product][:quantity]
        rates = params[:product][:rate]
        product_ids.each_index do |index|
          if Order.accept_product(names[index],product_ids[index])
            reference_object = ""
            if !serial_numbers[index].blank?
              reference_object = ProductSerialNumber.find(serial_numbers[index])
              reference_object.update_attribute(:is_sold, true)
            else
              reference_object = Product.find(product_ids[index])
            end

            product_save = reference_object.sale_products.create(:sale_id => @customer_info.id, :quantity => quantities[index], :rate => rates[index], :service_type_id => service_types[index],:serial_number_reference_id => serial_numbers[index],:product_reference_id => product_ids[index])

          end
      end
      session[:sale_id] = @customer_info.id
      redirect_to sales_sale_path
    else
      render sales_sale_path
    end
  end
### function to edit sales order
  def edit_sales_order
    begin
        @sale = Sale.find(params[:id])
      rescue
      end
  end

###View Sales Order
 def view_sales_order
    begin
        @sale = Sale.find(params[:id])
      rescue
      end
  end
#### for update sales bill 
  def update_sales_order
        begin
        @customer_info = Sale.find(params[:id])
        @customer_info.update_attributes(params[:sale])
        @customer_info.payments.each do|sale_payment|
               sale_payment.update_attributes(:paid_amount=>params[:payments][:cash_amount], :next_pay_date=>params[:payments][:next_pay_date],  :pay_date=> @customer_info.date) if sale_payment.pay_mode == "cash"
                    cheque_payment = Payment.cheque_update(@customer_info,params[:payments]) if sale_payment.pay_mode == "cheque"
                     sale_payment.update_attributes(:paid_amount=>params[:payments][:transfer_amount], :next_pay_date=>params[:payments][:next_pay_date],  :pay_date=> @customer_info.date, :transfer_to_account_no=> params[:payments][:transfer_to_acount_no]) if sale_payment.pay_mode == "transfer"
                    sale_payment.update_attributes(:paid_amount=>params[:payments][:card_paid_amount],:next_pay_date=>params[:payments][:next_pay_date],  :pay_date=> @customer_info.date) if sale_payment.pay_mode == "card"
             end
          names = params[:product][:name]
          product_descs = params[:product][:description]
          serial_numbers = params[:product][:serial_number]
          service_types = params[:product][:service_type]
          quantities = params[:product][:quantity]
          rates = params[:product][:rate]
          index =0
        
        @customer_info.sale_products.each do |sale_product|
          product =  Product.find(names[index])
          if (sale_product.product_reference_type == "ProductSerialNumber" && !serial_numbers[index].blank?)
                serial_number = ProductSerialNumber.find(sale_product.serial_number_reference_id)
                serial_number.update_attributes(:is_sold => false)
          end

          if !serial_numbers[index].blank?
                  serial_no2 = ProductSerialNumber.find(serial_numbers[index])
                   if( !serial_no2.nil?)
                          serial_no2.update_attributes( :is_sold => true)
                          sale_product.update_attributes(:product_reference_type =>"ProductSerialNumber")
                   end
          else
          sale_product.update_attributes( :product_reference_type =>"Product")
          end
          sale_product.update_attributes(:product_reference_id => product_descs[index], :quantity => quantities[index], :rate => rates[index],:service_type_id => service_types[index],:serial_number_reference_id => serial_numbers[index] )
          index=index+1
        end
      redirect_to sales_sales_register_path
    rescue
      redirect_to home_path
  end
end

### Get Sales Register In Particular order
  def ordered_sales_register
    sales_info = Sale.get_sale_information( params )
    render_partial_pagination("sales_register", sales_info, params[:page], :sales_info)
  end

### Print Sales Register
  def print_sales_register
    @customer_name, @payment_dates, @address, @serial, @contact_numbers, @customer_type, @balance = params[:customer], params[:dates], params[:address], params[:serials], params[:contact_numbers], params[:customer_type], params[:balance]
  end

### Generate Bill
  def print_sales
     sales = Sale.find(params[:sale_id])
    unless sales.blank?
      @bill_book_number = sales.bill_book_number.blank? ? "-" : sales.bill_book_number
      @invoice_number = sales.invoice_number.blank? ? "-" : sales.invoice_number
      @purchase_date = sales.date.blank? ? "-" : sales.date.strftime("%d/%m/%Y")
      @customer_name = sales.customer_name.blank? ? "-" : sales.customer_name
      @address = Customer.get_address( sales )
      @contact_numbers = Customer.get_contacts( sales )
      products = sales.sale_products
      @product_names, @descriptions, @quantities, @serial_number, @service_type, @rates, @total = [], [], [], [], [], [], []
      unless products.blank?
        index = 0
        products.each do |product|
          if product.product_reference_type == "ProductSerialNumber"
            serial_product = ProductSerialNumber.find(product.product_reference_id)
            @serial_number[index] = serial_product.serial_number
            @product_names[index] = serial_product.product.name
            @descriptions[index] = serial_product.product.description
          else
            @serial_number[index] = "-"
            row_product = Product.find(product.product_reference_id)
            @product_names[index] = row_product.name
            @descriptions[index] = row_product.description
          end
          @service_type[index] =  product.service_type_id.blank? ? "-" : product.service_type.time_limit
          @quantities[index] = product.quantity
          @rates[index] = product.rate
          @total[index] = @quantities[index] * @rates[index]
          index = index + 1
        end
      end
      @total_amount = sales.total_amount
      @paid_amount = sales.payments.sum('paid_amount')
      @cheque_amount = 0
        sales.payments.each do |payment|
            payment.update_attributes(:is_print=>true)
          @cash_amount = payment.paid_amount if(payment.pay_mode == "cash")
          if(payment.pay_mode == "cheque") 
          	cheque_amount = payment.paid_amount 
          	@cheque_amount = @cheque_amount+cheque_amount 
          end
          @transfer_amount = payment.paid_amount if(payment.pay_mode == "transfer")
          @card_paid_amount = payment.paid_amount if(payment.pay_mode == "card")
      end
      payment = sales.payments.first
      @next_pay_date = payment.next_pay_date.blank? ? "-" : payment.next_pay_date.strftime("%d/%m/%Y")
      @enquiry_from = sales.enquiry_from.blank? ? "-" : sales.enquiry_from
      @delivery_person = sales.delivery_person_name
      @installation_person = sales.installation_person_name
      @installation_date = sales.installation_date.blank? ? "-" : sales.installation_date.strftime("%d/%m/%Y")
      @po_number = sales.po_number
      @po_date = sales.po_date.blank? ? "-" : sales.po_date.strftime("%d/%m/%Y")
      @remarks = sales.remarks.blank? ? "-" : sales.remarks
    end
  end

  def sales_destroy
    sale = Sale.find(params[:id])
    sale.destroy
    redirect_to sales_sales_register_path
  end

def get_customer_details
        customer = params[:customer_name]
        customer_details = Sale.find(:first, :conditions => ["customer_name = ?", customer]) 
        customer_details.blank? ? '' : response = {'house_number' =>customer_details.house_number, 'street' => customer_details.street  , 'colony' => customer_details.colony, 'landmark' => customer_details.landmark, 'city' => customer_details.city, 'zipcode' => customer_details.zipcode, 'state' => customer_details.state, 'phone_number' => customer_details.phone_number, 'mobile_number' => customer_details.mobile_number}
  render :json => response
end

    def new_bill_book_series
    @bill_book_series = BillBookSeries.new
    end

   def create_bill_book_series
       @bill_book_series = BillBookSeries.new(params[:bill_book_series])
       if @bill_book_series.save
       redirect_to sales_bill_book_series_show_path
       else
       flash[:notice] = "Please enter Bill Book Series Name"
       render sales_bill_book_series_new_path
       end
   end

   def selected_bill_book_series
      begin
      bill_book_series = BillBookSeries.find(params[:id])
      rescue
      end
      render :text => bill_book_series.current_invoice_number.to_s
   end
### Show Bill Book Series List
  def show_bill_book_series
    @bill_book_series = BillBookSeries.all
  end
### Edit Bill Book Series form
  def edit_bill_book_series
    begin
      @bill_book_series = BillBookSeries.find(params[:id])
    rescue
    end
  end
### Upadate Bill Book Series
  def update_bill_book_series
    begin
      @bill_book_series = BillBookSeries.find(params[:id])
      if @bill_book_series.update_attributes(params[:bill_book_series])
        redirect_to sales_bill_book_series_show_path
      else
        flash[:notice] = "Please enter Bill Book Series Name"
        render bill_book_series_edit_path(@bill_book_series)
      end
    rescue
      render bill_book_series_edit_path(@bill_book_series)
    end
  end
### Delete bill book series
  def destroy_bill_book_series
    begin
      @bill_book_series = BillBookSeries.find(params[:id])
      @bill_book_series.destroy
    rescue
    end
    redirect_to sales_bill_book_series_show_path
  end
end
