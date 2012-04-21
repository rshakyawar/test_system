module OrdersHelper
def get_total_paidamount(order_obj)
order_obj.order_payments.sum('paid_amount')
end

end
