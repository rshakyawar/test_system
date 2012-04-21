// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var cheques = new Array();
function display_name()
{
document.getElementById('technician_name_auto_complete').style.display='block';
}
function select_other()
{
var mdiv=document.getElementById('other1');
var cdiv=document.getElementById('sale_installation_person_id');
if(cdiv.options[cdiv.selectedIndex].value=="")
{
mdiv.style.visibility='visible';
}
else
{
mdiv.style.visibility='hidden';
}

}

function ful_amount_paid()    // function for checkbox in customer bill
{
if(document.getElementById("fulpaid_1").checked)
{
document.getElementById("payments_paid_amount").value=document.getElementById("sale_total_amount").value;
document.getElementById("payments_next_pay_date").value = "";
document.getElementById("payments_paid_amount").disabled=true;
document.getElementById("payments_next_pay_date").disabled=true;
document.getElementById("next_pay_date").disabled=true;
}
else
{
document.getElementById("payments_paid_amount").value = "";
document.getElementById("payments_next_pay_date").disabled=false;
document.getElementById("next_pay_date").disabled=false;
document.getElementById("payments_paid_amount").disabled=false;
}

}

// Functions For Create Order
function get_total(id)
{
  obj_rate= $("product_rate_"+id);
  obj_quantity=$("product_quantity_"+id);
  obj_product= $("product_name_"+id);
  obj_description=$("description_"+id);
  obj_rate.setAttribute("class", "dynamic-box-length");
  obj_quantity.setAttribute("class", "dynamic-box-length");
  obj_product.setAttribute("class", "dynamic-name-box-length");
  obj_description.setAttribute("class", "dynamic-description-box-length");
  quantity=obj_quantity.value;
  rate=obj_rate.value;
  if(obj_product.selectedIndex != 0 || obj_description.selectedIndex != 0 || rate != "" || quantity != "")
  {
    if( obj_product.selectedIndex != 0 && obj_description.selectedIndex != 0 )
    {

      change_color = true;
      if(rate != "" && quantity != "")
      {
        var pattern=/^\d+$/;
        if(pattern.test(parseInt(rate)) && pattern.test(quantity))
        {
          change_color = false;
          obj_total=$("order_total_amount");
          obj_row_total=$("product_total_"+id);
          row_total = obj_row_total.value;
          obj_row_total.value = rate*quantity;
          obj_total.value = parseInt(obj_total.value) - parseInt(row_total) + parseInt(obj_row_total.value);
          rate_quantity.is_filled_row = true;
}
      }
      if(change_color)
      {
        obj_rate.setAttribute("class", "error-dynamic-box");
        obj_quantity.setAttribute("class", "error-dynamic-box");
        return false;
      }
    }
    else
    {
      obj_product.setAttribute("class", "error-dynamic-name-box");
      obj_description.setAttribute("class", "error-dynamic-description-box");
      return false;
    }
  }
  else if(!rate_quantity.is_filled_row)
  {
    obj_rate.setAttribute("class", "error-dynamic-box");
    obj_quantity.setAttribute("class", "error-dynamic-box");
    obj_product.setAttribute("class", "error-dynamic-name-box");
    obj_description.setAttribute("class", "error-dynamic-description-box");
    return false;
  }
  return true;
}

function check_fields()
{
  var checking_status = true;
  reset_fields();
  !check_company() ? checking_status = false : "";
  (!check_date("order_order_date") || !check_date("order_payments_date")) ? checking_status = false : "";
  (!contact_numbers("order_mobile_number") || !contact_numbers("order_phone_number")) ? checking_status = false : "";
  !rate_quantity() ? checking_status = false : "";
  !check_paid_amount("order_payments_paid_amount") ? checking_status = false : "";
  if(!checking_status)
  {
    error_message();
  }
  else
  {
    disabled_element = $("order_total_amount");
    disabled_element.disabled = false;
  }
  return checking_status;
}

function check_edit_order_fields()
{
      var checking_status = true;
      reset_fields();
      !check_company() ? checking_status = false : "";
    (!check_date("order_order_date") || !check_date("order_payments_date")) ? checking_status = false : "";
      (!contact_numbers("order_mobile_number") || !contact_numbers("order_phone_number")) ? checking_status = false : "";
      !rate_quantity() ? checking_status = false : "";
      !check_paid_amount("order_payments_paid_amount") ? checking_status = false : "";
      if(!checking_status)
      {
        error_message();
      }
      else
      {
        disabled_element = $("order_total_amount");
        disabled_element.disabled = false;
  }
  return checking_status;
}

function error_message()
{
  var divObject;
  try{
    divObject = $("without-error");
    divObject.id = "error";
  }
  catch(err)
  {
    divObject = $("error");
  }
  divObject.innerHTML = "Please fill required fields correctly";
}

function check_company()
{
  elementObject = $("company_id");
  if(elementObject.selectedIndex == 0)
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}

function check_date(date_id)
{
  elementObject = $(date_id);
  elementValue = elementObject.value;
  if( date_id == "order_order_date")
  {
    if(!date_check(elementObject))
    {
      elementObject.setAttribute("class", "error_fields");
      return false;
    }
  }
  else
  {
    if(elementValue != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        payment_date = Date.parse(elementValue);
        order_date = Date.parse($F("order_order_date"));
      }
    }
  }
  return true;
}

function date_check(elementObject)
{
  elementValue = elementObject.value;
  var pattern=/^\d{2}\/\d{2}\/\d{4}$/;
  if(elementValue == null || elementValue.trim() == "" || !pattern.test(elementValue))
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}

function contact_numbers(number_id)
{
  elementObject = $(number_id);
  elementValue = elementObject.value;
  if( elementValue != "")
  {
    var pattern=/\d{10}/;
    if(!pattern.test(elementValue))
    {
      elementObject.setAttribute("class", "error_fields");
      return false;
    }
  }
  return true;
}

function check_paid_amount(field_id)
{
  elementObject = $(field_id);
  elementValue = elementObject.value;
  if(elementValue!= "" && elementValue.trim() != "")
  {
    var pattern=/\d+(\.\d{1,2})?/;
    if(!pattern.test(elementValue))
    {
      elementObject.setAttribute("class", "error_fields");
      return false;
    }
  }
  else
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}

function rate_quantity()
{
  var isError = true;
  rate_quantity.is_filled_row = false;
  for(i=1; i<= add_row.counter; i++)
  {
    var result = get_total(i);
    (!result) ? isError = false : "";
  }
  (!rate_quantity.is_filled_row) ? isError = false : "";
  return isError;
}

function edit_rate_quantity()
{
  var isError = true;
  return isError;
}
// End of functions for create order

// Start of AMC NOT SERVICED
function create_complaint(customer_id)
{
  window.location = '/create_complaint/'+customer_id;
}
// End Of AMC NOT SERVICED

//Start functions for Status details
function get_status_detail(order_id)
{
  window.location = '/order/status_details/'+order_id;
}

function edit_order(order_id)
{
  window.location = '/order/edit/'+order_id;
}

function show_order_status(order_id)
{
  window.location = '/order/show_order_status/'+order_id;
}

function add_same_remaining_quantity(order_product_id)
{
  window.location = "/update_same_quantity/"+order_product_id;
}

function set_serial(is_serial)
{
  set_serial.is_serial_number = is_serial;
}

function check_quantity_serial()
{
  reset_fields();
  ordered_quantity_object= $("order_product_ordered_quantity");
  received_quantity_object= $("order_product_received_quantity");
  previous_quantity_object= $("order_product_previous_quantity");
  divObject = $("add_serial");
  ordered_quantity = ordered_quantity_object.value;
  received_quantity = received_quantity_object.value;
  previous_quantity = parseInt(previous_quantity_object.value);
  var pattern=/^\d+$/;
  if(pattern.test(ordered_quantity))
  {
    if(pattern.test(received_quantity))
    {
      ordered_quantity = parseInt(ordered_quantity);
      received_quantity = parseInt(received_quantity);
      if((received_quantity + previous_quantity) > ordered_quantity)
      {
        divObject.innerHTML = "<div id=serial-heading> Please Enter Correct values</div><div class=bottom_padding></div>";
      }
      else if(received_quantity > 0 && set_serial.is_serial_number)
      {
        divObject.innerHTML = "<div id=serial-heading>Add Serial Numbers</div><div class=bottom_padding></div>";
        for( var i = 0; i < received_quantity; i++ )
        {
          div_fields_element = document.createElement("div");
          div_fields_element.setAttribute("class","serial-fields");
          div_lable_element = document.createElement("div");
          div_lable_element.setAttribute("class","serial-lables");
          div_lable_element.innerHTML = "Serial Number";
          div_box_element = document.createElement("div");
          div_box_element.setAttribute("class","serial-boxes");
          element = document.createElement("input");
          element.setAttribute("type", "text");
          element.setAttribute("name", "serial_number[]");
          element.setAttribute("class", "selectboxLength");
          div_lable_element.value = "S. No.";
          div_fields_element.appendChild(div_lable_element);
          div_box_element.appendChild(element);
          div_fields_element.appendChild(div_box_element);
          divObject.appendChild(div_fields_element);
        }
      }
    }
  }
}
// check quantity

function check_quantity()
{
  is_success = true;
  ordered_quantity_object= $("order_product_ordered_quantity");
  received_quantity_object= $("order_product_received_quantity");
  previous_quantity_object= $("order_product_previous_quantity");
  ordered_quantity = ordered_quantity_object.value;
  received_quantity = received_quantity_object.value;
  previous_quantity = parseInt(previous_quantity_object.value);
  var pattern=/^\d+$/;
  if(pattern.test(ordered_quantity))
  {
    if(pattern.test(received_quantity))
    {
      ordered_quantity = parseInt(ordered_quantity);
      received_quantity = parseInt(received_quantity);
      if((received_quantity + previous_quantity) > ordered_quantity)
      {
        ordered_quantity_object.setAttribute("class", "error_fields");
        received_quantity_object.setAttribute("class", "error_fields");
        is_success = false;
      }
    }
    else
    {
      received_quantity_object.setAttribute("class", "error_fields");
      is_success = false;
    }
  }
  else
  {
    ordered_quantity_object.setAttribute("class", "error_fields");
    is_success = false;
  }

  if(is_success)
  {
    textbox_object = document.getElementsByName("serial_number[]");
    for(var i = 0; i < textbox_object.length; i++)
    {
      if(textbox_object[i].value == "")
      {
        textbox_object[i].setAttribute("class", "error_fields");
        is_success = false;
      }
    }
  }
  return is_success;
}
// End of functions for Status Details

// Start Functions for Balance Details
function pay_balance(order_product_id)
{
  window.location = "/update_quantity/"+order_product_id;
}
// End of functions for Balance Details

// Complaint form
function complaint_submit_check1()
{alert("hi");
  reset_fields();
  var checking_status = true;
  date_check($("customer_complaint_date")) ? "" : checking_status = false;
  try
  {
    elementObject = $("customer_id");
    if(elementObject.selectedIndex == 0)
    {
      elementObject.setAttribute("class", "error_fields");
      checking_status = false;
    }
  }
  catch(err)
  {
    check_name("customer_name") ? "" : checking_status = false;
    check_address() ? "" : checking_status = false;
    (!contact_numbers("customer_mobile_number") || !contact_numbers("customer_phone_number")) ? checking_status = false : "";
    check_name("customer_model_name") ? "" : checking_status = false;
  }
  checking_status ? "" : error_message();
  return checking_status;
}
//Edit Complaint
function complaint_submit_check()
{
  reset_fields();
  var checking_status = true;
  date_check($("customer_complaint_date")) ? "" : checking_status = false;
  try
  {
    elementObject = $("customer_id");
    if(elementObject.selectedIndex == 0)
    {
      elementObject.setAttribute("class", "error_fields");
      checking_status = false;
    }
  }
  catch(err)
  {
    check_name("customer_name") ? "" : checking_status = false;
    check_address() ? "" : checking_status = false;
    (!contact_numbers("customer_mobile_number") || !contact_numbers("customer_phone_number")) ? checking_status = false : "";
    check_name("customer_model_name") ? "" : checking_status = false;
  }
  checking_status ? "" : error_message();
  return checking_status;
}

function check_name(element_id)
{
  elementObject = $(element_id);
  if(elementObject.value=="" || elementObject.value.trim() == "")
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}

function reset_fields()
{
  try{
    divObject = $("error");
    divObject.id = "without-error";
    divObject.innerHTML = "";
  }
  catch(err)
  {}
  try{
    error_elements = document.getElementsByClassName("error_fields");
    while(error_elements.length > 0)
    {
      error_elements[0].setAttribute("class", "selectboxLength");
    }
  }
  catch(err)
  {}
}

function check_address()
{
  city_object = $("customer_city");
  state_object = $("customer_state");
  address_status = true;
  if(city_object.value=="" || city_object.value.trim() == "")
  {
    city_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  if(state_object.value.trim() == "")
  {
    state_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  house_no_object = $("customer_house_number");
  street_object = $("customer_street");
  colony_object = $("customer_colony");
  landmark_object = $("customer_landmark");
  if(street_object.value.trim() == "" && colony_object.value.trim() == "" && landmark_object.value.trim() == "")
  {
//     house_no_object.setAttribute("class", "error_fields");
    //address_status = false;
  }
  return address_status;
}
// End of complaint check

// AMC From Check
function amc_submit_check()
{
  reset_fields();
  var checking_status = true;
  date_check($("customer_contract_date")) ? "" : checking_status = false;
  elementObject = $("customer_amc_type");
  if(elementObject.selectedIndex == 0)
  {
    elementObject.setAttribute("class", "error_fields");
    checking_status = false;
  }
  check_name("customer_name") ? "" : checking_status = false;
  check_address() ? "" : checking_status = false;
  (!contact_numbers("customer_mobile_number") || !contact_numbers("customer_phone_number")) ? checking_status = false : "";
  check_paid_amount("customer_contract_amount") ? "" : checking_status = false;
  check_name("customer_model_name") ? "" : checking_status = false;
  checking_status ? "" : error_message();
  return checking_status;
}
// End of AMC From checking

// Sale Form check
function check_sales_fields()
{
  var checking_status = true;
  reset_fields();
   check_bill_book_number("bill_book_series_id","bill_book_series_current_invoice_number") ? "" : checking_status = false;
   check_name("sale_customer_name") ? "" : checking_status = false;
check_sales_address() ? "" : checking_status = false;
  (!check_sales_dates($("sale_purchase_date")) || !check_sales_dates($("payments_next_pay_date")) || !check_sales_dates($("sale_installation_date"))) ? checking_status = false : "";
  (!contact_numbers("sale_mobile_number") || !contact_numbers("sale_phone_number")) ? checking_status = false : "" ;
  sales_rate_quantity() ? "" : checking_status = false;
  (!select_person("technician_delivery_person_name") || !select_person("technician_installation_person_name")) ? checking_status = false : "" ;
  check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
    if($("payment_is_cash").checked ==true){
              if($("payments_cash_amount").value ==""){$("payments_cash_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
    else if($("payment_is_cheque").checked == true){
              for(var i=0; i<cheques.length; i++)  {
                      if($("payment_cheque_no_"+cheques[i]).value == "") {
                         $("payment_cheque_no_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_cheque_amount_"+cheques[i]).value == "") {
                         $("payment_cheque_amount_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_post_date_"+cheques[i]).value == "") {
                         $("payment_post_date_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_bank_name_"+cheques[i]).value == "") {
                         $("payment_bank_name_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
               }
    }
    else if($("payment_is_by_transfer").checked ==true){
                if($("payments_transfer_amount").value ==""){$("payments_transfer_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
    else if($("payment_is_by_card").checked ==true){
                if($("payments_card_paid_amount").value ==""){$("payments_card_paid_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
    else{checking_status = false; alert("please Spacify atleast one payment mode (tick atleast one check box)"); return checking_status;}

  if(!checking_status)
  {
    error_message();
  }
  else
  {
    disabled_elements = $("sale_total_amount");
    disabled_elements.disabled = false;
    for(i=1; i<= sales_add_row.counter; i++)
    {
      obj_quantity=$("product_quantity_"+i);
      obj_quantity.disabled = false;
      obj_description=$("description_"+i);
      obj_description.disabled = false;
      obj_serial = $("serial_number_"+i);
      obj_serial.disabled = false;
    }
  }

return checking_status;
}
// to check sales edit order fields
function check_edit_sales_fields()
{
  var checking_status = true;
  reset_fields();
   check_name("sale_customer_name") ? "" : checking_status = false;
   check_sales_address() ? "" : checking_status = false;
   sales_rate_quantity1() ? "" : checking_status = false;
   check_paid_amount("payments_paid_amount") ? "" : checking_status = false;   
if(!checking_status)
  {
    error_message();
  }
  else{
    disabled_elements = $("sale_total_amount");
    disabled_elements.disabled = false;
    for(i=1; i<= sales_add_row.counter; i++)
    {
      obj_quantity=$("product_quantity_"+i);
      obj_quantity.disabled = false;
      obj_description=$("description_"+i);
      obj_description.disabled = false;
      obj_serial = $("serial_number_"+i);
      obj_serial.disabled = false;
    }
  }
return checking_status;
}

function sales_rate_quantity1()
{
  var isError = true;
  sales_rate_quantity.is_filled_row = false;
  for(i=1; i<= sales_add_row.counter; i++)
  {
    var result = sales_get_total1(i);
    result ? "" : isError = false;
  }
  sales_rate_quantity.is_filled_row ? "" : isError = false;
  return isError;
}

function sales_get_total1(id)
{
  obj_rate= $("product_rate_"+id);
  obj_quantity=$("product_quantity_"+id);
  obj_product= $("product_name_"+id);
  obj_description=$("description_"+id);
  obj_serial = $("serial_number_"+id);
  obj_rate.setAttribute("class", "dynamic-sales-rate-box-length");
  obj_quantity.setAttribute("class", "dynamic-sales-quantity-box-length");
  obj_product.setAttribute("class", "dynamic-sales-name-box-length");
  obj_description.setAttribute("class", "dynamic-sales-description-box-length");
  obj_serial.setAttribute("class", "dynamic-sales-box-length");
  quantity=obj_quantity.value;
  rate=obj_rate.value;
  serial_number_selected =  true;
  if(obj_product.selectedIndex != 0 || obj_description.selectedIndex != 0 || rate != "" || quantity != "")
  {
    if( obj_product.selectedIndex != 0 && obj_description.selectedIndex != 0 )
    {
      if(serial_number_selected)
      {
        change_color = true;
        if(rate != "" && quantity != "")
        {
          var pattern=/^\d+$/;
          if(pattern.test(rate) && pattern.test(quantity))
          {
            change_color = false;
            obj_total=$("sale_total_amount");
            obj_row_total=$("product_total_"+id);
            row_total = obj_row_total.value;
            obj_row_total.value = rate*quantity;
            obj_total.value = parseInt(obj_total.value) - parseInt(row_total) + parseInt(obj_row_total.value);
            sales_rate_quantity.is_filled_row = true;
          }
        }
        if(change_color)
        {
          obj_rate.setAttribute("class", "error-dynamic-sales-rate-box");
          obj_quantity.setAttribute("class", "error-dynamic-sales-quantity-box");
          return false;
        }
      }
      else
      {
          obj_serial.setAttribute("class", "error-dynamic-sales-box");
          return serial_number_selected;
      }
    }
    else
    {
      obj_product.setAttribute("class", "error-dynamic-name-sales-box");
      obj_description.setAttribute("class", "error-dynamic-description-sales-box");
      return false;
    }
  }
  else if(!sales_rate_quantity.is_filled_row)
  {
    obj_rate.setAttribute("class", "error-dynamic-sales-rate-box");
    obj_quantity.setAttribute("class", "error-dynamic-sales-quantity-box");
    obj_product.setAttribute("class", "error-dynamic-name-sales-box");
    obj_description.setAttribute("class", "error-dynamic-description-sales-box");
    return false;
  }
  return true;
}

function check_bill_book_number(bill_book_no_id, invoice_no)
  {
checking_status = true;
    if($(bill_book_no_id).value ==""){$(bill_book_no_id).setAttribute("class", "error_fields");checking_status = false;}
    if($(invoice_no).value =="" || $(invoice_no).value.trim() ==""){$(invoice_no).setAttribute("class", "error_fields");checking_status = false;}
return checking_status;
  }


function check_sales_dates(date_id)
{
  elementObject = $(date_id);
  elementValue = elementObject.value;
  if( date_id == "sale_purchase_date")
  {
    if(!date_check(elementObject))
      return false;
  }
  else
  {
    if(elementValue != "" && elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        installation_date = Date.parse(elementValue);
        purchase_date = Date.parse($F("sale_purchase_date"));
        if(date_id == "payments_next_pay_date")
        {
          if(installation_date <= purchase_date)
          {
            elementObject.setAttribute("class", "error_fields");
            return false;
          }
        }
        else if(date_id == "sale_installation_date")
        {
          if(installation_date < purchase_date)
          {
            elementObject.setAttribute("class", "error_fields");
            return false;
          }
        }
      }
    }
  }
  return true;
}

function select_person(element_id)
{
  element_object = $(element_id);
  if(element_object.selectedIndex == 0)
  {
    element_object.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}

function sales_get_total(id)
{
  obj_rate= $("product_rate_"+id);
  obj_quantity=$("product_quantity_"+id);
  obj_product= $("product_name_"+id);
  obj_description=$("description_"+id);
  obj_serial = $("serial_number_"+id);
  obj_rate.setAttribute("class", "dynamic-sales-rate-box-length");
  obj_quantity.setAttribute("class", "dynamic-sales-quantity-box-length");
  obj_product.setAttribute("class", "dynamic-sales-name-box-length");
  obj_description.setAttribute("class", "dynamic-sales-description-box-length");
  obj_serial.setAttribute("class", "dynamic-sales-box-length");
  quantity=obj_quantity.value;
  rate=obj_rate.value;
  serial_number_selected = (obj_serial.disabled && obj_serial.selectedIndex != 0) ? false : true;
  if(obj_product.selectedIndex != 0 || obj_description.selectedIndex != 0 || rate != "" || quantity != "")
  {
    if( obj_product.selectedIndex != 0 && obj_description.selectedIndex != 0 )
    {
      if(serial_number_selected)
      {
        change_color = true;
        if(rate != "" && quantity != "")
        {
          var pattern=/^\d+$/;
          if(pattern.test(rate) && pattern.test(quantity))
          {
            change_color = false;
            obj_total=$("sale_total_amount");
            obj_row_total=$("product_total_"+id);
            row_total = obj_row_total.value;
            obj_row_total.value = rate*quantity;
            obj_total.value = parseInt(obj_total.value) - parseInt(row_total) + parseInt(obj_row_total.value);
            sales_rate_quantity.is_filled_row = true;
          }
        }
        if(change_color)
        {
          obj_rate.setAttribute("class", "error-dynamic-sales-rate-box");
          obj_quantity.setAttribute("class", "error-dynamic-sales-quantity-box");
          return false;
        }
      }
      else
      {
          obj_serial.setAttribute("class", "error-dynamic-sales-box");
          return serial_number_selected;
      }
    }
    else
    {
      obj_product.setAttribute("class", "error-dynamic-name-sales-box");
      obj_description.setAttribute("class", "error-dynamic-description-sales-box");
      return false;
    }
  }
  else if(!sales_rate_quantity.is_filled_row)
  {
    obj_rate.setAttribute("class", "error-dynamic-sales-rate-box");
    obj_quantity.setAttribute("class", "error-dynamic-sales-quantity-box");
    obj_product.setAttribute("class", "error-dynamic-name-sales-box");
    obj_description.setAttribute("class", "error-dynamic-description-sales-box");
    return false;
  }
  return true;
}

function check_sales_address()
{
  city_object = $("sale_city");
  state_object = $("sale_state");
  address_status = true;
  if(city_object.value=="" || city_object.value.trim() == "")
  {
    city_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  if(state_object.value=="" || state_object.value.trim() == "")
  {
    state_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  house_no_object = $("sale_house_number");
  street_object = $("sale_street");
  colony_object = $("sale_colony");
  landmark_object = $("sale_landmark");
  return address_status;
}

function sales_rate_quantity()
{
  var isError = true;
  sales_rate_quantity.is_filled_row = false;
  for(i=1; i<= sales_add_row.counter; i++)
  {
    var result = sales_get_total(i);
    result ? "" : isError = false;
  }
  sales_rate_quantity.is_filled_row ? "" : isError = false;
  return isError;
}
// End of sale form check

// Service Form
function service_entry(complaint_id)
{
  window.location = "/customer/service_form/"+complaint_id;
}

function service_get_total(id)
{
  obj_rate= $("product_rate_"+id);
  obj_quantity=$("product_quantity_"+id);
  obj_product= $("product_name_"+id);
  obj_description=$("description_"+id);
  obj_rate.setAttribute("class", "dynamic-box-length");
  obj_quantity.setAttribute("class", "dynamic-box-length");
  obj_product.setAttribute("class", "dynamic-name-box-length");
  obj_description.setAttribute("class", "dynamic-description-box-length");
  quantity=obj_quantity.value;
  rate=obj_rate.value;
  if(obj_product.selectedIndex != 0 || obj_description.selectedIndex != 0 || rate != "" || quantity != "")
  {
    if( obj_product.selectedIndex != 0 && obj_description.selectedIndex != 0 )
    {
      change_color = true;
      if(rate != "" && quantity != "")
      {
        var pattern=/^\d+$/;
        if(pattern.test(rate) && pattern.test(quantity))
        {
          change_color = false;
          obj_total=$("service_amount");
          obj_row_total=$("product_total_"+id);
          row_total = obj_row_total.value;
          obj_row_total.value = rate*quantity;
          obj_total.value = parseInt(obj_total.value) - parseInt(row_total) + parseInt(obj_row_total.value);
     
        }
      }
      if(change_color)
      {
        obj_rate.setAttribute("class", "error-dynamic-box");
        obj_quantity.setAttribute("class", "error-dynamic-box");
        return false;
      }
    }
    else
    {
      obj_product.setAttribute("class", "error-dynamic-name-box");
      obj_description.setAttribute("class", "error-dynamic-description-box");
      return false;
    }
  }
  return true;
}

function check_service_fields()
{
  var checking_status = true;
  reset_fields();
  (!check_service_dates("service_service_date") || !check_service_dates("payments_next_pay_date")) ? checking_status = false : "";
  select_person("service_technician_id") ? "" : checking_status = false;
 // add_service_charge() ? "" : checking_status = false;
  check_paid_amount("service_service_charge") ? "" : checking_status = false;
  check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
  if(!checking_status)
  {
    error_message();
  }
  else
  {
    disabled_element = $("service_amount");
    disabled_element.disabled = false;
  }
  return checking_status;
}

function check_service_dates(date_id)
{
  elementObject = $(date_id);
  elementValue = elementObject.value;
  if( date_id == "service_service_date")
  {
    if(!date_check(elementObject))
      return false;
  }
  else
  {
    if(elementValue != "" && elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        next_pay_date = Date.parse(elementValue);
        service_date = Date.parse($F("service_service_date"));
        if(next_pay_date <= service_date)
        {
          elementObject.setAttribute("class", "error_fields");
          return false;
        }
      }
    }
  }
  return true;
}

function service_rate_quantity()
{
  var isError = true;
  for(i=1; i<= service_add_row.counter; i++)
  {
    var result = service_get_total(i);
    result ? "" : isError = false;
  }
  return isError;
}
var blur_count = 0;
var pr_amt = 0;
function add_service_charge(cnt)
{  blur_count = cnt;
  elementObject = $("service_service_charge");
  elementValue = elementObject.value;
  var pattern=/^\d+$/;
  if(elementValue == "" || elementValue.trim() == "" || !pattern.test(elementValue))
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  else
  {
    elementObject.setAttribute("class", "selectboxLength");
    amount_element = $("service_amount");
    var row_total
    if(blur_count ==1 )   { row_total = obj_total.value;}
    amount_element.value = 0;
    service_rate_quantity();
    amount_element.value = parseInt(row_total) - pr_amt + parseInt(elementValue);
    blur_count ++;
    pr_amt = parseInt(elementValue);
    return true;
  }
}
// End of service form

// Customer balance report
function pay_installment(payment_id,from_action)
{
  pass_info = payment_id;
  pass_info += "&"+from_action;
  window.location = "/customer/pay_installment/"+pass_info;
}
/// function for order pay installment
function order_pay_installment(payment_id,from_action)
{
  pass_info = payment_id;
  pass_info += "&"+from_action;
  window.location = "/order/pay_installment/"+pass_info;
}
function check_order_installment()
  {
    	checking_status = true;
  	elementObject = $("payments_pay_date");
	elementValue = elementObject.value;
  	if(elementValue == "" && elementValue.trim() == "")
   	 {
    	  if(!date_check(elementObject))
    	  {
    	    elementObject.setAttribute("class", "error_fields");
     	   checking_status = false;
     	   return checking_status;
     	  }
     	 }
  	check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
	return checking_status;
  }
function check_installment()
{
  var checking_status = true;
  reset_fields();
  (!check_installment_dates("payments_pay_date") || !check_installment_dates("payments_next_pay_date")) ? checking_status = false : "";
    check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
       if($("payments_is_cash").checked ==true){
              if($("payments_cash_amount").value ==""){$("payments_cash_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
    else if($("payments_is_cheque").checked ==true){
             for(var i=0; i<cheques.length; i++)  {
                      if($("payment_cheque_no_"+cheques[i]).value == "") {
                         $("payment_cheque_no_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_cheque_amount_"+cheques[i]).value == "") {
                         $("payment_cheque_amount_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_post_date_"+cheques[i]).value == "") {
                         $("payment_post_date_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
              if($("payment_bank_name_"+cheques[i]).value == "") {
                         $("payment_bank_name_"+cheques[i]).setAttribute("class", "error_fields"); checking_status = false;
                      }
               }
          }
    else if($("payments_is_by_transfer").checked ==true){
                if($("payments_transfer_amount").value ==""){$("payments_transfer_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
    else if($("payments_is_by_card").checked ==true){
                if($("payments_card_paid_amount").value ==""){$("payments_card_paid_amount").setAttribute("class", "error_fields");checking_status = false;}
          }
  else {checking_status = false; alert("please choose atleast one payment mode[tick atleast one check box]"); return checking_status;}
  checking_status ? "" : error_message();
  return checking_status;
}

function check_installment_dates(date_id)
{
  elementObject = $(date_id);
  elementValue = elementObject.value;
  if( date_id == "payments_pay_date")
  {
    if(!date_check(elementObject))
      return false;
  }
  else
  {
    if(elementValue != "" && elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        next_pay_date = Date.parse(elementValue);
        pay_date = Date.parse($F("payments_pay_date"));
        if(next_pay_date <= pay_date)
        {
          elementObject.setAttribute("class", "error_fields");
          return false;
        }
      }
    }
  }
  return true;
}
// End of customer balance report

// Renew AMC From Check
function renew_amc_submit_check()
{
  reset_fields();
  var checking_status = true;
  renew_date_check($("customer_contract_date")) ? "" : checking_status = false;
  check_name("customer_name") ? "" : checking_status = false;
  check_address() ? "" : checking_status = false;
  (!contact_numbers("customer_mobile_number") || !contact_numbers("customer_phone_number")) ? checking_status = false : "";
  check_paid_amount("customer_contract_amount") ? "" : checking_status = false;
  check_name("customer_model_name") ? "" : checking_status = false;
  checking_status ? "" : error_message();
  return checking_status;
}

function renew_date_check(elementObject)
{
  elementValue = elementObject.value;
  var pattern=/^\d{4}-\d{2}-\d{2}$/;
  if(elementValue == null || elementValue.trim() == "" || !pattern.test(elementValue))
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  return true;
}
// End of AMC From checking

  function cash_payment(){
      if($("payment_is_cash").checked ==true)  {
          $("cash_div").show();
        }
      else{
          $("cash_div").hide();
        }
  }

function cheque_payment(){
      if($("payment_is_cheque").checked ==true){
          $("cheque_div").show();
      sales_add_payment_cheque();
        }
      else{
          $("cheque_div").hide();
          sales_add_payment_cheque.counter = 0;
          cheques.length = 0;
            $("c1").innerHTML = "";
        }
  }

function transfer_payment(){
      if($("payment_is_by_transfer").checked ==true){
          $("transfer_div").show();
        }
      else{
          $("transfer_div").hide();
        }
  }

function card_payment(){
      if($("payment_is_by_card").checked ==true){
          $("card_div").show();
        }
      else{
          $("card_div").hide();
        }
  }

 function installment_cash_payment(){
      if($("payments_is_cash").checked ==true){
          $("cash_div").show();
        }
      else{
          $("cash_div").hide();
        }
  }

function installment_cheque_payment(){
      if($("payments_is_cheque").checked ==true){
                    $("cheque_div").show();
            sales_add_payment_cheque();
          }
      else{
                $("cheque_div").hide();
                sales_add_payment_cheque.counter = 0;
                cheques.length = 0;
                $("c1").innerHTML = "";
        }
  }

function installment_transfer_payment(){
      if($("payments_is_by_transfer").checked ==true){
          $("transfer_div1").show();
          $("transfer_div2").show();
        }
      else{
          $("transfer_div1").hide();
          $("transfer_div2").hide();
        }
  }

function installment_card_payment(){
      if($("payments_is_by_card").checked ==true){
          $("card_div").show();
        }
      else{
          $("card_div").hide();
        }
  }

function edit_sales_order(sale_id)
{
  window.location = '/sales/edit/'+sale_id;
}

function view_sales_order(sale_id)
{
  window.location = '/sales/view/'+sale_id;
}

function view_complaint(complaint_id)
{
  window.location = '/customer/view/'+complaint_id;
}

function edit_complaint(complaint_id)
{
  window.location = '/customer/edit_complaint/'+complaint_id;
}

function check_bill_book_series_field()
{
    checking_status = true
    elementObject = $("bill_book_series_name")
    if((elementObject).value == "" || elementObject.value.trim() == ""  )
    {
      elementObject.setAttribute("class", "error_fields");
      checking_status = false
     }
    if(!checking_status)
    {
      error_message();
    }
 return checking_status
}

function check_company_fields()
{
  checking_status = true
  company_name_object = $("company_name");
  company_city_object = $("company_city");
  company_state_object = $("company_state");
  if(company_name_object.value.trim() == "" || company_name_object.value == "")
  {
    company_name_object.setAttribute("class", "error_fields");
    checking_status = false;
  }
  if(company_city_object.value.trim() == "" || company_city_object.value == "")
  {
    company_city_object.setAttribute("class", "error_fields");
    checking_status = false;
  }
  if(company_state_object.value.trim() == "" || company_state_object.value == "")
  {
    company_state_object.setAttribute("class", "error_fields");
    checking_status = false;
  }
  if(!checking_status)
    {
      error_message();
    }
return checking_status;
}
