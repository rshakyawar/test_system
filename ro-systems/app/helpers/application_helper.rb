module ApplicationHelper

  def is_calender_neccessary( called_action )
    actions = ['amc_expiry', 'balance_report', 'complaint_form', 'complaint_register', 'new_customer', 'order', 'order_status', 'pay_installment', 'renew_customer', 'sales', 'sales_register', 'service_form', 'service_register','edit_order','sale_add_payment_cheque','sale_product_row','edit_sales_order','edit_amc','order_pay_installment','edit_complaint']
    actions.include?(called_action)
  end

  def ServiceType.find_service_types
     ServiceType.find(:all).map(&:time_limit)
  end

end
