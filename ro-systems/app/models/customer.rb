class Customer < ActiveRecord::Base

  has_many :complaints
has_many :cheque_details, :as => :object
 
### Get Customer balance Report
  def self.balance_report( params )
    @remaining_balance = []
    if params[:payment_for].blank?
      sales_balance_report( params )
      service_balance_report( params )
    elsif params[:payment_for] == "sale"
      sales_balance_report( params )
    elsif params[:payment_for] == "service"
      service_balance_report( params )
    end
    order_by = params[:order_by]
    if order_by == "last_pay desc"
      @remaining_balance.sort_by { |last_pay| last_pay["last_pay_date"]}.reverse!
    elsif order_by == "last_pay asc"
      @remaining_balance.sort_by { |last_pay| last_pay["last_pay_date"]}
    elsif order_by == "name desc"
      @remaining_balance.sort_by { |name| name["customer_name"]}.reverse!
    elsif order_by == "name asc"
      @remaining_balance.sort_by { |name| name["customer_name"]}
    elsif order_by == "remaining desc"
      @remaining_balance.sort_by { |balance| balance["remaining_balance"]}.reverse!
    elsif order_by == "remaining asc"
      @remaining_balance.sort_by { |balance| balance["remaining_balance"]}
    elsif order_by == "next_pay desc"
      @remaining_balance.sort_by { |next_pay| next_pay["next_pay_date"]}.reverse!
    elsif order_by == "next_pay asc"
      @remaining_balance.sort_by { |next_pay| next_pay["next_pay_date"]}
    elsif order_by == "payment_for desc"
      @remaining_balance.sort_by { |payment_for| payment_for["payment_for"]}.reverse!
    elsif order_by == "payment_for asc"
      @remaining_balance.sort_by { |payment_for| payment_for["payment_for"]}
    else
      @remaining_balance
    end
  end

### Get Customer balance Report for sales
  def self.sales_balance_report( params )
    begin
      sales = Sale.find(:all, :conditions => ["customer_name ilike ?", "%#{params[:name]}%"])
      unless sales.blank?
        sales.each do |sale|
          total_payments = sale.payments.sum("paid_amount")
          remain = sale.total_amount.to_f - total_payments
          if remain > 0
            next_pay_info = sale.payments.find(:last)
              is_between_dates = false
              if !params[:late_from_date].blank? && !params[:next_from_date].blank?
                date_check = sale.payments.find(:last, :conditions => ["pay_date between ? AND ? AND next_pay_date BETWEEN ? AND ?", Date.parse(params[:late_from_date]), Date.parse(params[:late_to_date]), Date.parse(params[:next_from_date]), Date.parse(params[:next_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              elsif !params[:late_from_date].blank?
                date_check = sale.payments.find(:last, :conditions => ["pay_date between ? AND ?", Date.parse(params[:late_from_date]), Date.parse(params[:late_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              elsif !params[:next_from_date].blank?
                date_check = sale.payments.find(:last, :conditions => ["next_pay_date BETWEEN ? AND ?", Date.parse(params[:next_from_date]), Date.parse(params[:next_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              else
                is_between_dates = true
              end
              if is_between_dates
                balance_hash = {}
                balance_hash["last_pay_date"] = next_pay_info.pay_date.blank? ? "-": next_pay_info.pay_date.strftime("%d/%m/%y")
                balance_hash["customer_name"] = sale.customer_name.capitalize
                balance_hash["payment_id"] = next_pay_info.id
                contacts = ""
                sale.mobile_number.blank? ? contacts : contacts << "#{Integer(sale.mobile_number)}"
                sale.phone_number.blank? ? contacts : contacts << ", #{Integer(sale.phone_number)}"
                balance_hash["contact_numbers"] = contacts.blank? ? "-" : contacts
                balance_hash["remaining_balance"] = remain
                balance_hash["next_pay_date"] =  next_pay_info.next_pay_date.blank? ? "-": next_pay_info.next_pay_date.strftime("%d/%m/%Y")  
                balance_hash["payment_for"] = "Sale"
                @remaining_balance << balance_hash
              end
            end
         end
      end
   rescue
    end
  end

### Get Customer balance Report for sevice
  def self.service_balance_report( params )
    begin
      services = Service.all
      unless services.blank?
        services.each do |service|
          total_payments = service.payments.sum("paid_amount")
          remain = service.amount.to_f - total_payments
          if remain > 0
            next_pay_info = service.payments.find(:last)
           unless next_pay_info.next_pay_date.blank?
              is_between_dates = false
              if !params[:late_from_date].blank? && !params[:next_from_date].blank?
                date_check = service.payments.find(:last, :conditions => ["pay_date between ? AND ? AND next_pay_date BETWEEN ? AND ?", Date.parse(params[:late_from_date]), Date.parse(params[:late_to_date]), Date.parse(params[:next_from_date]), Date.parse(params[:next_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              elsif !params[:late_from_date].blank?
                date_check = service.payments.find(:last, :conditions => ["pay_date between ? AND ?", Date.parse(params[:late_from_date]), Date.parse(params[:late_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              elsif !params[:next_from_date].blank?
                date_check = service.payments.find(:last, :conditions => ["next_pay_date BETWEEN ? AND ?", Date.parse(params[:next_from_date]), Date.parse(params[:next_to_date])])
                is_between_dates = date_check.id == next_pay_info.id ? true : false
              else
                is_between_dates = true
              end

              if is_between_dates
                customer = Customer.find(:first, :conditions => ["name ilike ? AND id = ?", "%#{params[:name]}%", service.complaint.customer_id] )
                unless customer.blank?
                  balance_hash = {}
                  balance_hash["last_pay_date"] = next_pay_info.pay_date.strftime("%d/%m/%Y")
                  balance_hash["customer_name"] = customer.name.capitalize
                  balance_hash["payment_id"] = next_pay_info.id
                  contacts = ""
                  customer.mobile_number.blank? ? contacts : contacts << "#{Integer(customer.mobile_number)}"
                  customer.phone_number.blank? ? contacts : contacts << ", #{Integer(customer.phone_number)}"
                  balance_hash["contact_numbers"] = contacts.blank? ? "-" : contacts
                  balance_hash["remaining_balance"] = remain
                  balance_hash["next_pay_date"] = next_pay_info.next_pay_date.strftime("%d/%m/%Y")
                  balance_hash["payment_for"] = "Service"
                  @remaining_balance << balance_hash
                end
              end
            end
          end
        end
      end
    rescue
    end
  end

### Get Customer balance details
  def self.detailed_balance_report(payment_id)
    remaining_balance = []
    begin
      payment = Payment.find(payment_id)
      remain_for = ""
      total_amount = 0
      if payment.reference_type == "Sale"
        remain_for = Sale.find(payment.reference_id)
        total_amount = remain_for.total_amount.to_f
      else
        remain_for = Service.find(payment.reference_id)
        total_amount = remain_for.amount.to_f
      end

      unless payment.blank?
        installments = remain_for.payments.all
        total_paid = 0
        unless installments.blank?
          installments.each do |installment|
            balance_hash = {}
            balance_hash["pay_date"] = installment.pay_date.strftime("%d/%m/%Y")
            balance_hash["total_amount"] = total_amount
            paid = installment.paid_amount.to_f
            balance_hash["paid"] = paid
            total_paid = total_paid + paid
            balance_hash["remaining_balance"] = total_amount - total_paid
            remaining_balance << balance_hash
          end
        end
      end
    rescue
    end
    remaining_balance 
  end

### Get Customer's AMC Expiry Report
  def self.get_amc_expiry( params )
    expiries = []
    begin
      customers = ""
      if params[:from_date].blank?
        customers = Customer.find(:all, :conditions => ["contract_date BETWEEN ? AND ? AND name ilike ? AND colony ilike ? AND landmark ilike ?", Time.now - 13.month, Time.now - 11.month, "%#{params[:name]}%", "%#{params[:colony]}%","%#{params[:landmark]}%"], :order => params[:order_by])
      else
        customers = Customer.find(:all, :conditions => ["contract_date BETWEEN ? AND ? AND name ilike ? AND colony ilike ? AND landmark ilike ? AND contract_date BETWEEN ? AND ?", Time.now - 1.year, Time.now - 11.month, "%#{params[:name]}%", "%#{params[:colony]}%","%#{params[:landmark]}%",Date.parse(params[:from_date]) - 1.year, Date.parse(params[:to_date]) - 1.year], :order => params[:order_by])
      end
      unless customers.blank?
        customers.each do |customer|
          each_expiry = {}
          each_expiry["customer_name"] = customer.name.capitalize
          each_expiry["customer_id"] = customer.id
          each_expiry["address"] = get_address( customer )
          each_expiry["contact_numbers"] = get_contacts( customer )
          each_expiry["expiry_date"] = (customer.contract_date + 1.year).strftime("%d/%m/%Y")
          each_expiry["remarks"] = customer.remarks.blank? ? "-" : customer.remarks
          expiries << each_expiry
        end
      end
    rescue
    end
    expiries
  end

### Get Customer Or Company Address as a string
  def self.get_address( customer )
    address = ""
    customer.house_number.blank? ? address : address << "#{customer.house_number}"
    customer.street.blank? ? address : address << ", #{customer.street}"
    customer.colony.blank? ? address : address << ", #{customer.colony}"
    customer.landmark.blank? ? address : address << ", #{customer.landmark}"
    customer.city.blank? ? address : address << ", #{customer.city}"
    customer.state.blank? ? address : address << ", #{customer.state}"
    customer.zipcode.blank? ? address : address << "- #{customer.zipcode}"
    address.blank? ? "-" : address
  end

### Get Contact Numbers as a string
  def self.get_contacts( customer )
    contacts = ""
    customer.mobile_number.blank? ? contacts : contacts << "#{Integer(customer.mobile_number)}"
    customer.phone_number.blank? ? contacts : contacts << ", #{Integer(customer.phone_number)}"
    contacts.blank? ? "-" : contacts
  end
### Get compalint no. in format DDMMYYYYXXX
 def self.get_complaint_no()
    day = Date.today.day < 10 ? "0"+Date.today.day.to_s : Date.today.day.to_s
    month = Date.today.month < 10 ? "0" + Date.today.month.to_s : Date.today.month.to_s
    random = rand(999)
    random1 = random<100 ? "0"+ random.to_s : random.to_s
   complaint_no = day+month+Date.today.year.to_s+random1 
end

end
