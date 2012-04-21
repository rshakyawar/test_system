class Service < ActiveRecord::Base

  belongs_to :technician
  belongs_to :complaint
  has_many :service_products
  has_many :payments, :as => :reference

  named_scope :with_date_and_complaint, lambda{ |from_date, to_date, complaint_id| {:conditions => ['service_date BETWEEN ? AND ? AND complaint_id = ?', Date.parse(from_date), Date.parse(to_date), complaint_id]} }

  named_scope :greater_service_date, lambda{ |days, complaint_id| {:conditions => ['service_date >= ? AND complaint_id = ?', Time.now - days.to_i.days,  complaint_id]} }

  named_scope :lesser_service_date, lambda{ |days, complaint_id| {:conditions => ['service_date < ? AND complaint_id = ?', Time.now - days.to_i.days,  complaint_id]} }

### Get Last Service information
  def self.get_serviced_persons( params )
    service_provided = []
    begin
      customers = Customer.find(:all, :conditions => ["name ilike ? AND colony ilike ? AND landmark ilike ? AND amc_type ilike ?","%#{params[:name]}%","%#{params[:colony]}%","%#{params[:landmark]}%","%#{params[:amc_type]}%"], :order => params[:order_by])
      unless customers.blank?
        customers.each do |customer|
          service_hash = {}
          complaints = customer.complaints.find(:all, :order => ["id DESC"])
          service_date = ""
          unless complaints.blank?
            service_date = true
            complaints.each do |complaint|
              service = ""
              if !params[:from_date].blank?
                services = Service.with_date_and_complaint(params[:from_date], params[:to_date], complaint.id)
                services.each do |service|
                  service_hash["last_service_date"] = service.service_date.strftime("%d/%m/%Y")
                  service_date = false
                end
              else
                service = complaint.service
              end
              unless service.blank?
                service_hash["last_service_date"] = service.service_date.strftime("%d/%m/%Y") unless service.service_date.nil?
                service_date = false
                break
              end
            end
          end
          if service_date
            service_hash["last_service_date"] = "-"
          end
          service_hash["customer_id"] = customer.id
          service_hash["customer_name"] = customer.name.capitalize
          service_hash["address"] = Customer.get_address( customer )
          service_hash["contact_numbers"] = Customer.get_contacts( customer )
          service_hash["model_name"] = customer.model_name
          service_hash["amc_type"] = customer.amc_type
          service_provided << service_hash
        end
      end
    rescue
    end
    return service_provided
  end

### Get Service information details
  def self.get_service_details(customer_id)
    service_details = []
    begin
      customer = Customer.find(customer_id)
      unless customer.blank?
        complaints = customer.complaints.find(:all, :order => ["id DESC"])
        unless complaints.blank?
          complaints.each do |complaint|
            service = complaint.service
            service_hash = {}
            unless service.blank?
              service_hash["complaint_date"] = complaint.date.strftime("%d/%m/%Y")
              service_hash["service_date"] = service.service_date.strftime("%d/%m/%Y")
              service_hash["remarks"] = service.remarks.blank? ? "-" : service.remarks
              service_hash["amount"] = service.amount
              service_hash["technician"] = service.technician.name.capitalize
              service_hash["service_id"] = service.id 
              service_details << service_hash
            end
          end
        end
      end
    rescue
    end
    return service_details
  end

### Get Amc person's not serviced since last one month or in given criteria
  def self.get_amc_not_serviced( params )
    service_provided = []
    begin
      order_by = 
      if params[:order_by] == "date asc" || params[:order_by] == "date desc"
        order_by = ""
      else
        order_by = params[:order_by]
      end
      customers = Customer.find(:all, :conditions => ["name ilike ? AND colony ilike ? AND landmark ilike ? AND amc_type ilike ?","%#{params[:name]}%","%#{params[:colony]}%","%#{params[:landmark]}%","%#{params[:amc_type]}%"], :order => order_by)
      unless customers.blank?
        customers.each do |customer|
          service_hash = {}
          complaints = customer.complaints.find(:all, :order => ["id DESC"])
          if !complaints.blank?
            complaints.each do |complaint|
              services = Service.greater_service_date(params[:days], complaint.id)
              if services.blank?
                services = Service.lesser_service_date(params[:days], complaint.id)
                unless services.blank?
                  service_hash["last_service_date"] = services[0].service_date.strftime("%d/%m/%Y")
                  service_hash["customer_id"] = customer.id
                  service_hash["customer_name"] = customer.name.capitalize
                  service_hash["address"] = Customer.get_address( customer )
                  service_hash["contact_numbers"] = Customer.get_contacts( customer )
                  service_hash["model_name"] = customer.model_name
                  service_hash["amc_type"] = customer.amc_type
                  service_provided << service_hash
                end
                break
              else
                break
              end
            end
          else
            service_hash["last_service_date"] = "-"
            service_hash["customer_id"] = customer.id
            service_hash["customer_name"] = customer.name.capitalize
            service_hash["address"] = Customer.get_address( customer )
            service_hash["contact_numbers"] = Customer.get_contacts( customer )
            service_hash["model_name"] = customer.model_name
            service_hash["amc_type"] = customer.amc_type
            service_provided << service_hash
          end
        end
      end
    rescue
    end

    if params[:order_by] == "date desc"
      service_provided.sort_by { |date| date["last_service_date"]}.reverse!
    elsif params[:order_by] == "date asc"
      service_provided.sort_by { |date| date["last_service_date"]}
    else
      service_provided
    end
  end

end
