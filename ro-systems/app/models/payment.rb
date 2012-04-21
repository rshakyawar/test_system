class Payment < ActiveRecord::Base

  belongs_to :reference, :polymorphic=> true
# # #   validates_length_of :cheque_no, :minimum => 6, :maximum => 6, :message => "Invalid cheque no"
  scope :payment_to_print, where(:is_print => false)

    def self.cash_payment(customer_info,cash_amount, next_pay_date )
                  order_payment = customer_info.payments.create(:paid_amount=>cash_amount, :next_pay_date=>next_pay_date,  :pay_mode=>'cash', :pay_date=> customer_info.date)
     end

    def self.cheque_payment(customer_info,params,next_pay_date)
        for i in 0..params[:cheque_no].length-1
          order_payment = customer_info.payments.create(:paid_amount => params[:cheque_amount][i],:cheque_no => params[:cheque_no][i],:post_cheque_date => params[:post_date][i],:bank_name => params[:bank_name][i], :next_pay_date=>next_pay_date, :pay_mode=> 'cheque',:pay_date=> customer_info.date)
        end
      order_payment
    end

    def self.payment_transfer(customer_info,transfer_amount, next_pay_date, transfer_to_account_no )
                    order_payment = customer_info.payments.create(:paid_amount=>transfer_amount, :next_pay_date=>next_pay_date,  :transfer_to_account_no => transfer_to_account_no, :pay_mode=>'transfer',:pay_date=> customer_info.date)
    end

    def self.card_payment(customer_info,card_paid_amount, next_pay_date )
                    order_payment = customer_info.payments.create(:paid_amount=>card_paid_amount, :next_pay_date=>next_pay_date,  :pay_mode=>'card', :pay_date=> customer_info.date)
    end

  def self.cheque_update(customer_info,params_payments)
      begin
          cheque_amount = params_payments[:cheque_amount]
          cheque_no = params_payments[:cheque_number]
          post_date = params_payments[:cheque_post_date]
          bank_name = params_payments[:cheque_bank_name]
          next_pay_date=params_payments[:next_pay_date]
          index =1
          cheque_payments = customer_info.payments.find(:all, :conditions => ["pay_mode = 'cheque'"])
          cheque_payments.each do |payment|
            payment.update_attributes(:paid_amount => cheque_amount[index.to_s], :cheque_no => cheque_no[index.to_s], :post_cheque_date => post_date[index.to_s], :bank_name => bank_name[index.to_s], :pay_date=> customer_info.date, :next_pay_date =>next_pay_date) 
          index = index+1
         end
    rescue
    end
  end
end
