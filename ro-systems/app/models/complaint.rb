class Complaint < ActiveRecord::Base

  belongs_to :customer
  has_one :service
  validates_uniqueness_of :complaint_no

### Get Complaint details in particular order
  def self.get_complaints( params )
    @status_data = []
    begin
      if !params[:name].blank? || !params[:colony].blank? || !params[:landmark].blank?
        if params[:order_by] == "date asc" || params[:order_by] == "date desc"
          incomplete = ""
          if !params[:from_date].blank?
            incomplete = Complaint.find(:all, :conditions => ["id NOT IN (select complaint_id from services) AND date BETWEEN ? AND ?", Date.parse(params[:from_date]), Date.parse(params[:to_date])], :order => params[:order_by])
          else
            incomplete = Complaint.find(:all, :conditions => ["id NOT IN (select complaint_id from services)"], :order => params[:order_by])
          end
          unless incomplete.blank?
            incomplete.each do |complaint|
              customer = Customer.all( :conditions => ["name ilike ? AND colony ilike ? AND landmark ilike ? AND id = ?", "%#{params[:name]}%", "%#{params[:colony]}%", "%#{params[:landmark]}%", complaint.customer_id])
              unless customer.blank?
                complaint_data(complaint)
              end
            end
          end
        else
          customers = Customer.find(:all, :conditions => ["name ilike ? AND colony ilike ? AND landmark ilike ?", "%#{params[:name]}%", "%#{params[:colony]}%", "%#{params[:landmark]}%"], :order => params[:order_by])
          if !customers.blank?
            incomplete = ""
            if !params[:from_date].blank?
              customers.each do |customer|
                incomplete = customer.complaints.find(:all, :conditions => ["id NOT IN (select complaint_id from services) AND date BETWEEN ? AND ?", Date.parse(params[:from_date]), Date.parse(params[:to_date])])
                unless incomplete.blank?
                  incomplete.each do |complaint|
                    complaint_data(complaint)
                  end
                end
              end
            else
              customers.each do |customer|
                incomplete = customer.complaints.find(:all, :conditions => ["id NOT IN (select complaint_id from services)"])
                unless incomplete.blank?
                  incomplete.each do |complaint|
                    complaint_data(complaint)
                  end
                end
              end
            end
          end
        end
      elsif !params[:from_date].blank?
        if params[:order_by] == "date asc" || params[:order_by] == "date desc"
          incomplete = Complaint.find(:all, :conditions => ["id NOT IN (select complaint_id from services) AND date BETWEEN ? AND ?", Date.parse(params[:from_date]), Date.parse(params[:to_date])], :order => params[:order_by])
          unless incomplete.blank?
            incomplete.each do |complaint|
              complaint_data(complaint)
            end
          end
        elsif !params[:order_by].blank?
          customers = Customer.find(:all, :order => params[:order_by])
          unless customers.blank?
            customers.each do |customer|
              incomplete = customer.complaints.find(:all, :conditions => ["id NOT IN (select complaint_id from services) AND date BETWEEN ? AND ?", Date.parse(params[:from_date]), Date.parse(params[:to_date])])
              unless incomplete.blank?
                incomplete.each do |complaint|
                  complaint_data(complaint)
                end
              end
            end
          end
        else
          incomplete = Complaint.find(:all, :conditions => ["id NOT IN (select complaint_id from services) AND date BETWEEN ? AND ?", Date.parse(params[:from_date]), Date.parse(params[:to_date])])
          unless incomplete.blank?
            incomplete.each do |complaint|
              complaint_data(complaint)
            end
          end
        end
      elsif params[:order_by] == "date asc" || params[:order_by] == "date desc" 
        incomplete = Complaint.find(:all, :conditions => ["id NOT IN (select complaint_id from services)"], :order => params[:order_by])
        unless incomplete.blank?
          incomplete.each do |complaint|
            complaint_data(complaint)
          end
        end
      else
        customers = Customer.find(:all, :order => params[:order_by])
        unless customers.blank?
          customers.each do |customer|
            incomplete = customer.complaints.find(:all, :conditions => ["id NOT IN (select complaint_id from services)"])
            unless incomplete.blank?
              incomplete.each do |complaint|
                complaint_data(complaint)
              end
            end
          end
        end
      end
    rescue
    end
    @status_data
  end

### Get Complaint details
  def self.complaint_data(complaint)
    status = {}
    status["complaint_date"] = complaint.date.strftime('%d/%m/%Y')
    status["complaint_id"] = complaint.id
    customer = complaint.customer
    status["coustomer_name"] = customer.name.capitalize
    status["address"] = Customer.get_address( customer )
    status["contact_numbers"] = Customer.get_contacts( customer )
    status["model_name"] = customer.model_name
    status["description"] = complaint.description.blank? ? "-" : complaint.description
    @status_data << status
  end

end
