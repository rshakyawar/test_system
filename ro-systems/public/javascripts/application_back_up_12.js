// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Functions For Create Order
function add_row()
{
  typeof add_row.counter == 'undefined' ? add_row.counter = 0 : "" ;
  var count= ++add_row.counter;
  new Ajax.Request('/product_row/'+count,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$(count+"");
      var response = transport.responseText || "no response text";
      divObject.innerHTML += "<div class=clear></div><div class=dynamic-product-rows><div class=serial-numbers>"+(count)+"</div>"+response+"</div><div id="+(count+1)+"></div>";
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}

function company_select(id)
{
  var company_tags=['company_house_number','company_street','company_colony','company_landmark','company_city','company_zipcode','company_state'];
  if(id!=0)
  {
    new Ajax.Request('/selected_company/'+id,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        company_array=response.split(",");
        for( var i=0; i< 7; i++)
        {
          divObject=$(company_tags[i]);
          divObject.value= company_array[i];
        }
      },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
    for( var i=0; i< 7; i++)
    {
      divObject=$(company_tags[i]);
      divObject.value= "";
    }
  }
}

function product_select(selected_value,div_id)
{
  divObject=$("description_"+div_id);
  while(divObject.options.length > 1)
  {
    divObject.options[1] = null;
  }
  if(selected_value != "")
  {
    new Ajax.Request('/selected_product/'+selected_value,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        discription_array=response.split(",");
        divObject.disabled = false;
        var option_seq = 1;
        for( i=1; i < discription_array.length; i++)
        {
          divObject.options[option_seq] = new Option(discription_array[i], discription_array[i+1]);
          i++;
          option_seq++;
        }
      },
      onFailure: function(){ alert('Something went wrong...'); }
    });
  }
  else
  {
    try{
      divObject.disabled = true;
      obj_serial = $("serial_number_"+div_id);
      obj_serial.disabled = true;
      obj_quantity=$("product_quantity_"+div_id);
      obj_serial.disabled = false;
    }
    catch(err){}
  }
}

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
        if(pattern.test(rate) && pattern.test(quantity))
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
        order_date = Date.parse($("order_order_date").value);
        if(payment_date < order_date)
        {
          elementObject.setAttribute("class", "error_fields");
          return false;
        }
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
  if(elementValue.trim() != "")
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


function print_order(order_id)
{
  new Ajax.Request("/print_order",
  {
      method:'post',
      parameters : { "order_id" : order_id },
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End of functions for create order

// Start stock details
function ordered_stock(element)
{
  var order_by = "";
  var product_name = "";
  var descriptions = "";
  var page = 0;
  element_id = element.id;
  product_name = $("name").value;
  descriptions = $("description").value;
  div_name_element = document.getElementsByClassName("stock-detail-name-first");
  div_description_element = document.getElementsByClassName("stock-detail-description-first");
  div_quantity_element = document.getElementsByClassName("stock-detail-quantity-first");
  div_name_element[0].innerHTML = "Products/Parts";
  div_description_element[0].innerHTML = "Description";
  div_quantity_element[0].innerHTML = "Quantity";
  (element_id == "name" || element_id == "description") ? ordered_stock.order_by = "" : "" ;
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_stock.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_name_element[0].innerHTML = "Products/Parts &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_name_element[0].innerHTML = "Products/Parts &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "description asc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_description_element[0].innerHTML = "Description &#9660;";
    element.id = "description desc";
  }
  else if(element_id == "description desc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_description_element[0].innerHTML = "Description &#9650;";
    element.id = "description asc";
  }
  else if(element_id == "quantity asc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_quantity_element[0].innerHTML = "Quantity &#9660;";
    element.id = "quantity desc";
  }
  else if(element_id == "quantity desc")
  {
    order_by = element_id;
    ordered_stock.order_by = element_id;
    div_quantity_element[0].innerHTML = "Quantity &#9650;";
    element.id = "quantity asc";
  }

  new Ajax.Request("/ordered_stock",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : product_name, "description" : descriptions, "page" : page },
    onSuccess: function(transport){
      divObject=$("stock-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
      get_status_detail.appear = false;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function print_stock()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  product_rows = document.getElementsByClassName("stock-detail-names");
  description_rows = document.getElementsByClassName("stock-detail-description");
  quantity_rows = document.getElementsByClassName("stock-detail-quantity");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&products[]=" + product_rows[i].innerHTML);
    params += ("&descriptions[]=" + description_rows[i].innerHTML);
    params += ("&quantities[]=" + quantity_rows[i].innerHTML);
  }
  new Ajax.Request("/print_stock",
  {
    method:'post',
     parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End of stock details

// Start Company Balance Report
function ordered_order_balance_report(element)
{
  var order_by = "";
  var company_name = "";
  var page = 0;
  element_id = element.id;
  company_name = $("company_name").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  div_name_element = document.getElementsByClassName("order-balance-company-name-first");
  div_balance_element = document.getElementsByClassName("order-balance-company-balance-first");
  div_address_element = document.getElementsByClassName("order-balance-company-address-first");
  div_name_element[0].innerHTML = "Company Name";
  div_balance_element[0].innerHTML = "Balance";
  div_address_element[0].innerHTML = "Address";
  (element_id == "company_name" || element_id == "landmark" || element_id == "colony") ? ordered_order_balance_report.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_order_balance_report.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "balance asc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = element_id;
    div_balance_element[0].innerHTML = "Balance &#9660;";
    element.id = "balance desc";
  }
  else if(element_id == "balance desc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = element_id;
    div_balance_element[0].innerHTML = "Balance &#9650;";
    element.id = "balance asc";
  }
  else if(element_id == "address asc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = element_id;
    ordered_order_balance_report.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_order_balance",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : company_name, "colony" : colony, "landmark" : landmark, "page" : page },
    onSuccess: function(transport){
      divObject=$("order-balance-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
      get_status_detail.appear = false;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}

function print_order_balance()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  company_name = document.getElementsByClassName("order-balance-company-names");
  address = document.getElementsByClassName("order-balance-company-address");
  order_balance = document.getElementsByClassName("order-balance-balances");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&company[]=" + company_name[i].getElementsByTagName("a")[0].innerHTML);
    params += ("&address[]=" + address[i].innerHTML);
    params += ("&order_balance[]=" + order_balance[i].getElementsByTagName("div")[0].innerHTML);
  }
  new Ajax.Request("/print_order_balance",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}

function print_company_pay(payment_id)
{
  new Ajax.Request("/print_company_pay",
  {
    method:'post',
    parameters : { "payment_id" : payment_id },
    onSuccess: function(transport){
    var response = transport.responseText || "no response text";
    new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
    new_window.document.write(response);
    new_window.document.close();
  },
    onFailure: function(){  }
  });
}
// End of Company balance report

// Start of Service Register
function ordered_service_register(element)
{
  var order_by = "";
  var customer_name = "";
  var from_date = "";
  var to_date = "";
  var page = 0;
  var colony = "";
  var landmark = "";
  var amc_type = "";
  element_id = element.id;
  customer_name = $("name").value;
  to_date = $("to_date").value;
  from_date = $("from_date").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  amc_type = $("amc_type").options[$("amc_type").selectedIndex].value;
  div_name_element = document.getElementsByClassName("service-register-name-first");
  div_address_element = document.getElementsByClassName("service-register-address-first");
  div_date_element = document.getElementsByClassName("service-register-last-service-date-first");
  div_amc_type_element = document.getElementsByClassName("service-register-amc-type-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Last Service Date";
  div_amc_type_element[0].innerHTML = "AMC Type";
  to_date == "" ? to_date = from_date : "";
  amc_type == "all" ? amc_type = "" : "";
  (element_id == "name" || element_id == "from_date" || element_id == "to_date" || element_id == "colony" || element_id == "landmark" || element_id == "amc_type") ? ordered_service_register.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_service_register.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "date asc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_date_element[0].innerHTML = "Last Service Date &#9660;";
    element.id = "date desc";
  }
  else if(element_id == "date desc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_date_element[0].innerHTML = "Last Service Date &#9650;";
    element.id = "date asc";
  }
  else if(element_id == "amc_type asc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_amc_type_element[0].innerHTML = "AMC Type &#9660;";
    element.id = "amc_type desc";
  }
  else if(element_id == "amc_type desc")
  {
    order_by = element_id;
    ordered_service_register.order_by = element_id;
    div_amc_type_element[0].innerHTML = "AMC Type &#9650;";
    element.id = "amc_type asc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_service_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_service_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_service_register",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "from_date" : from_date, "to_date" : to_date, "colony" : colony, "landmark" : landmark, "amc_type" : amc_type, "page" : page },
    onSuccess: function(transport){
      divObject=$("service-register-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
      get_status_detail.appear = false;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}
// End Of service register

// Start of AMC NOT SERVICED
function ordered_amc_not_serviced(element)
{
  var page = 0;
  var order_by = "";
  element_id = element.id;
  customer_name = $("name").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  amc_type = $("amc_type").options[$("amc_type").selectedIndex].value;
  days = $("days").value;
  if(isNaN(days))
  {
    days = 60;
    $("days").value = 60;
  }
  div_name_element = document.getElementsByClassName("amc-not-serviced-name-first");
  div_address_element = document.getElementsByClassName("amc-not-serviced-address-first");
  div_date_element = document.getElementsByClassName("amc-not-serviced-last-service-date-first");
  div_amc_type_element = document.getElementsByClassName("amc-not-serviced-amc-type-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Last Service Date";
  div_amc_type_element[0].innerHTML = "AMC Type";
  amc_type == "all" ? amc_type = "with" : "";
  (element_id == "name" || element_id == "days" || element_id == "colony" || element_id == "landmark" || element_id == "amc_type") ? ordered_amc_not_serviced.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_amc_not_serviced.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "date asc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_date_element[0].innerHTML = "Last Service Date &#9660;";
    element.id = "date desc";
  }
  else if(element_id == "date desc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_date_element[0].innerHTML = "Last Service Date &#9650;";
    element.id = "date asc";
  }
  else if(element_id == "amc_type asc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_amc_type_element[0].innerHTML = "AMC Type &#9660;";
    element.id = "amc_type desc";
  }
  else if(element_id == "amc_type desc")
  {
    order_by = element_id;
    ordered_amc_not_serviced.order_by = element_id;
    div_amc_type_element[0].innerHTML = "AMC Type &#9650;";
    element.id = "amc_type asc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_amc_not_serviced.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_amc_not_serviced.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_amc_not_serviced",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "days" : days, "colony" : colony, "landmark" : landmark, "amc_type" : amc_type, "page" : page },
    onSuccess: function(transport){
      divObject=$("service-register-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function print_amc_expiry()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  customer_name = document.getElementsByClassName("amc-expiry-names");
  address = document.getElementsByClassName("amc-expiry-addresses");
  contact_numbers = document.getElementsByClassName("amc-expiry-contacts");
  expiry_date = document.getElementsByClassName("amc-expiry-expiries");
  remarks = document.getElementsByClassName("amc-expiry-remarks");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&customer[]=" + customer_name[i].innerHTML);
    params += ("&address[]=" + address[i].innerHTML);
    params += ("&contact_numbers[]=" + contact_numbers[i].innerHTML);
    params += ("&expiry_date[]=" + expiry_date[i].innerHTML);
    params += ("&remarks[]=" + remarks[i].innerHTML);
  }
  new Ajax.Request("/print_amc_expiry",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}

function create_complaint(customer_id)
{
  window.location = '/create_complaint/'+customer_id;
}
// End Of AMC NOT SERVICED

// Start of Customer Balance Report
function ordered_customer_balance_register(element)
{
  var order_by = "";
  var customer_name = "";
  var late_from_date = "";
  var late_to_date = "";
  var next_from_date = "";
  var next_to_date = "";
  var page = 0;
  var payment_for = "";
  element_id = element.id;
  customer_name = $("name").value;
  late_to_date = $("to_last_pay_date").value;
  late_from_date = $("from_last_pay_date").value;
  next_to_date = $("to_next_pay_date").value;
  next_from_date = $("from_next_pay_date").value;
  payment_for = $("payment_for").options[$("payment_for").selectedIndex].value;
  div_name_element = document.getElementsByClassName("customer-balance-name-first");
  div_balance_element = document.getElementsByClassName("customer-balance-remain-first");
  div_date_element = document.getElementsByClassName("customer-balance-payment-date-first");
  div_payment_for_element = document.getElementsByClassName("customer-balance-payment-for-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_balance_element[0].innerHTML = "Balance Remaining";
  div_date_element[0].innerHTML = "Last Payment Date";
  div_date_element[1].innerHTML = "Next Payment Date";
  div_payment_for_element[0].innerHTML = "Payment For";
  late_to_date == "" ? late_to_date = late_from_date : "";
  next_to_date == "" ? next_to_date = next_from_date : "";
  payment_for == "all" ? payment_for = "" : "";
  (element_id == "name" || element_id == "to_last_pay_date" || element_id == "from_last_pay_date" || element_id == "to_next_pay_date" || element_id == "from_next_pay_date" || element_id == "payment_for") ? ordered_customer_balance_register.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_customer_balance_register.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "last_pay asc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_date_element[0].innerHTML = "Last Payment Date &#9660;";
    element.id = "last_pay desc";
  }
  else if(element_id == "last_pay desc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_date_element[0].innerHTML = "Last Payment Date &#9650;";
    element.id = "last_pay asc";
  }
  else if(element_id == "remaining asc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_balance_element[0].innerHTML = "Balance Remaining &#9660;";
    element.id = "remaining desc";
  }
  else if(element_id == "remaining desc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = element_id;
    div_balance_element[0].innerHTML = "Balance Remaining &#9650;";
    element.id = "remaining asc";
  }
  else if(element_id == "next_pay asc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = order_by;
    div_date_element[1].innerHTML = "Next Payment Date &#9660;";
    element.id = "next_pay desc";
  }
  else if(element_id == "next_pay desc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = order_by;
    div_date_element[1].innerHTML = "Next Payment Date &#9650;";
    element.id = "next_pay asc";
  }
  else if(element_id == "payment_for asc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = order_by;
    div_payment_for_element[0].innerHTML = "Payment For &#9660;";
    element.id = "payment_for desc";
  }
  else if(element_id == "payment_for desc")
  {
    order_by = element_id;
    ordered_customer_balance_register.order_by = order_by;
    div_payment_for_element[0].innerHTML = "Payment For &#9650;";
    element.id = "payment_for asc";
  }

  new Ajax.Request("/ordered_balance_report",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "late_from_date" : late_from_date, "late_to_date" : late_to_date, "next_from_date" : next_from_date, "next_to_date" : next_to_date, "payment_for" : payment_for, "page" : page },
    onSuccess: function(transport){
      divObject=$("customer-balance-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
      get_status_detail.appear = false;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function print_customer_balance()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  payment_dates = document.getElementsByClassName("customer-balance-payment-dates");
  customer_name = document.getElementsByClassName("customer-balance-names");
  contact_numbers = document.getElementsByClassName("customer-balance-contacts");
  remain_balance = document.getElementsByClassName("customer-balance-remain");
  payment_for = document.getElementsByClassName("customer-balance-payment-for");
  params = "";
  date_counter = 0;
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&customer[]=" + customer_name[i].getElementsByTagName("a")[0].innerHTML);
    params += ("&payment_dates[]=" + payment_dates[date_counter].innerHTML);
    params += ("&contact_numbers[]=" + contact_numbers[i].innerHTML);
    params += ("&remain_balance[]=" + remain_balance[i].innerHTML);
    params += ("&next_payment_dates[]=" + payment_dates[date_counter + 1].innerHTML);
    params += ("&payment_for[]=" + payment_for[i].innerHTML);
    date_counter += 2;
  }
  new Ajax.Request("/print_customer_balance",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End Of Customer Balance Report

// Start of Show Company
function ordered_show_company(element)
{
  var order_by = "";
  var company_name = "";
  var page = 0;
  var colony = "";
  var landmark = "";
  element_id = element.id;
  company_name = $("name").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  div_name_element = document.getElementsByClassName("show-company-name-first");
  div_address_element = document.getElementsByClassName("show-company-address-first");
  div_name_element[0].innerHTML = "Company Name";
  div_address_element[0].innerHTML = "Address";
  (element_id == "name" || element_id == "colony" || element_id == "landmark") ? ordered_show_company.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_show_company.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_show_company.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_show_company.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_show_company.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_show_company.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_show",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : company_name, "colony" : colony, "landmark" : landmark, "page" : page },
    onSuccess: function(transport){
      divObject=$("company-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}

function print_company_list()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  company_name = document.getElementsByClassName("show-company-names");
  address_rows = document.getElementsByClassName("show-company-addresses");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&company[]=" + company_name[i].innerHTML);
    params += ("&address[]=" + address_rows[i].innerHTML);
  }
  new Ajax.Request("/print_company_list",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End Of Show Company

// Start of Sales Register
function ordered_sale_register(element)
{
  var order_by = "";
  var customer_name = "";
  var from_date = "";
  var to_date = "";
  var page = 0;
  var colony = "";
  var landmark = "";
  var customer_type = "";
  element_id = element.id;
  customer_name = $("name").value;
  to_date = $("to_date").value;
  from_date = $("from_date").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  customer_type = $("customer_type").options[$("customer_type").selectedIndex].value;
  div_name_element = document.getElementsByClassName("sales-reg-name-first");
  div_address_element = document.getElementsByClassName("sales-reg-address-first");
  div_date_element = document.getElementsByClassName("sales-reg-date-first");
  div_amount_element = document.getElementsByClassName("sales-reg-amount-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Date";
  div_date_element[1].innerHTML = "Customer Type";
  div_amount_element[0].innerHTML = "Amount";
  to_date == "" ? to_date = from_date : "";
  customer_type == "all" ? customer_type = "" : "";
  (element_id == "name" || element_id == "from_date" || element_id == "to_date" || element_id == "colony" || element_id == "landmark" || element_id == "customer_type") ? ordered_sale_register.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_sale_register.order_by;
  }

  if(element_id == "customer_name desc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "customer_name asc";
  }
  else if(element_id == "customer_name asc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "customer_name desc";
  }
  else if(element_id == "date asc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_date_element[0].innerHTML = "Date &#9660;";
    element.id = "date desc";
  }
  else if(element_id == "date desc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_date_element[0].innerHTML = "Date &#9650;";
    element.id = "date asc";
  }
  else if(element_id == "customer_type asc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_date_element[1].innerHTML = "Customer Type &#9660;";
    element.id = "customer_type desc";
  }
  else if(element_id == "customer_type desc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = element_id;
    div_date_element[1].innerHTML = "Customer Type &#9650;";
    element.id = "customer_type asc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_sale_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_sale_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }
  else if(element_id == "total_amount asc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = order_by;
    div_amount_element[0].innerHTML = "Amount &#9660;";
    element.id = "total_amount desc";
  }
  else if(element_id == "total_amount desc")
  {
    order_by = element_id;
    ordered_sale_register.order_by = order_by;
    div_amount_element[0].innerHTML = "Amount &#9650;";
    element.id = "total_amount asc";
  }

  new Ajax.Request("/ordered_sales_register",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "from_date" : from_date, "to_date" : to_date, "colony" : colony, "landmark" : landmark, "customer_type" : customer_type, "page" : page },
    onSuccess: function(transport){
      divObject=$("sale-reg-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
      get_status_detail.appear = false;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}


function print_sales_register()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  dates = document.getElementsByClassName("sales-reg-dates");
  customer_name = document.getElementsByClassName("sales-reg-names");
  contact_numbers = document.getElementsByClassName("sales-reg-contacts");
  balance = document.getElementsByClassName("sales-reg-amounts");
  address = document.getElementsByClassName("sales-reg-addresses");
  params = "";
  date_counter = 0;
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&customer[]=" + customer_name[i].innerHTML);
    params += ("&dates[]=" + dates[date_counter].innerHTML);
    params += ("&contact_numbers[]=" + contact_numbers[i].innerHTML);
    params += ("&balance[]=" + balance[i].innerHTML);
    params += ("&customer_type[]=" + dates[date_counter + 1].innerHTML);
    params += ("&address[]=" + address[i].innerHTML);
    date_counter += 2;
  }
  new Ajax.Request("/print_sales_register",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End Of sales register

//Start functions for Status details
function ordered_status(element)
{
  var order_by = "";
  var company_name = "";
  var from_date = "";
  var to_date = "";
  var page = 0;
  element_id = element.id;
  company_name = $("company_name").value;
  from_date = $("from_date").value;
  to_date = $("to_date").value;
  div_date_element = document.getElementsByClassName("order-date-first");
  div_name_element = document.getElementsByClassName("order-status-company-name-first");
  div_status_element = document.getElementsByClassName("order-status-first");
  div_date_element[0].innerHTML = "Order Date";
  div_name_element[0].innerHTML = "Company Name";
  div_status_element[0].innerHTML = "Status";
  to_date == "" ? to_date = from_date : "";
  (element_id == "company_name" || element_id == "from_date" || element_id == "to_date") ? ordered_status.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_status.order_by;
  }

  if(element_id == "order_date desc")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_date_element[0].innerHTML = "Order Date &#9650;";
    element.id = "order_date asc";
  }
  else if(element_id == "order_date asc")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_date_element[0].innerHTML = "Order Date &#9660;";
    element.id = "order_date desc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_name_element[0].innerHTML = "Company Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "incomplete")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_status_element[0].innerHTML = "Status &#9650;";
    element.id = "complete";
  }
  else if(element_id == "complete")
  {
    order_by = element_id;
    ordered_status.order_by = element_id;
    div_status_element[0].innerHTML = "Status &#9660;";
    element.id = "incomplete";
  }

  new Ajax.Request("/ordered_status",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : company_name, "from_date" : from_date, "to_date" : to_date, "page" : page },
    onSuccess: function(transport){
      divObject=$("status-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function get_status_detail(order_id)
{
  window.location = '/order/status_details/'+order_id;
}

function print_order_status()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  company_name = document.getElementsByClassName("company-names");
  order_dates = document.getElementsByClassName("order-dates");
  order_status = document.getElementsByClassName("order-status");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&company[]=" + company_name[i].innerHTML);
    params += ("&order_dates[]=" + order_dates[i].innerHTML);
    params += ("&order_status[]=" + (order_status[i].getElementsByTagName("a")[0].innerHTML));
  }
  new Ajax.Request("/print_order_status",
  {
      method:'post',
      parameters : params,
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}

function add_remaining_quantity(order_product_id, is_serial)
{
  divObject=$(order_product_id+"");
  if(divObject.innerHTML == "")
  {
    new Ajax.Request("/update_quantity/"+order_product_id,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        divObject.innerHTML = response;
        set_serial(is_serial);
      },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
    divObject.toggle();
  }
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
          div_lable_element.innerHTML = "S. No.";
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
function get_balance_detail(company_id, page_number)
{
  divObject=$(company_id+"");
  if(divObject.innerHTML == "")
  {
    new Ajax.Request('/order/balance_detail/'+company_id,
    {
      method:'get',
      parameters : { "page" : page_number},
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        divObject.innerHTML = response;
      },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
    divObject.toggle();
  }
}

function pay_balance(order_product_id)
{
  window.location = "/update_quantity/"+order_product_id;
}
// End of functions for Balance Details

// Start functions for Status Details
function customers_for_selected_type(customer_type)
{
  divObject=$('customer_identity');
  divObject.value= "";
  new Ajax.Request('/customer/information/'+customer_type,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$("customer_information");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function customer_select(id)
{
  var customer_tags=['customer_identity','customer_house_number','customer_street','customer_colony','customer_landmark','customer_city','customer_zipcode','customer_state','customer_mobile_number','customer_phone_number','customer_model_name'];
  if(id != "")
  {
    new Ajax.Request('/selected_customer/' + id,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        customer_array=response.split(",");
        for( var i=0; i< customer_tags.length; i++)
        {
          divObject=$(customer_tags[i]);
          divObject.value= customer_array[i];
        }
      },
      onFailure: function(){ alert('Something went wrong...'); }
    });
  }
  else
  {
    for( var i=0; i< customer_tags.length; i++)
    {
      divObject=$(customer_tags[i]);
      divObject.value= "";
    }
  }
}
// End of status details

// Start of complaint register
function ordered_complaint_register(element)
{
  var order_by = "";
  var customer_name = "";
  var from_date = "";
  var to_date = "";
  var page = 0;
  var colony = "";
  var landmark = "";
  element_id = element.id;
  customer_name = $("name").value;
  to_date = $("to_date").value;
  from_date = $("from_date").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  div_name_element = document.getElementsByClassName("complaint-reg-name-first");
  div_address_element = document.getElementsByClassName("complaint-reg-address-first");
  div_date_element = document.getElementsByClassName("complaint-reg-date-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Complaint Date";
  to_date == "" ? to_date = from_date : "";
  (element_id == "name" || element_id == "from_date" || element_id == "to_date" || element_id == "colony" || element_id == "landmark") ? ordered_complaint_register.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_complaint_register.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_complaint_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_complaint_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "date asc")
  {
    order_by = element_id;
    ordered_complaint_register.order_by = element_id;
    div_date_element[0].innerHTML = "Complaint Date &#9660;";
    element.id = "date desc";
  }
  else if(element_id == "date desc")
  {
    order_by = element_id;
    ordered_complaint_register.order_by = element_id;
    div_date_element[0].innerHTML = "Complaint Date &#9650;";
    element.id = "date asc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_complaint_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_complaint_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_complaint_register",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "from_date" : from_date, "to_date" : to_date, "colony" : colony, "landmark" : landmark, "page" : page },
    onSuccess: function(transport){
      divObject=$("complaint-reg-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}

function print_complaint_register()
{
  sr_rows = document.getElementsByClassName("serial-numbers");
  dates_rows = document.getElementsByClassName("complaint-reg-dates");
  names_rows = document.getElementsByClassName("complaint-reg-names");
  address_rows = document.getElementsByClassName("complaint-reg-addresses");
  contact_rows = document.getElementsByClassName("complaint-reg-contacts");
  model_name_rows = document.getElementsByClassName("complaint-reg-model-names");
  description_rows = document.getElementsByClassName("complaint-reg-descriptions");
  params = "";
  for(var i = 0; i < sr_rows.length; i++)
  {
    i == 0 ? params += ("serials[]=" + sr_rows[i].innerHTML) : params += ("&serials[]=" + sr_rows[i].innerHTML);
    params += ("&dates[]=" + dates_rows[i].innerHTML);
    params += ("&names[]=" + names_rows[i].getElementsByTagName("a")[0].innerHTML);
    params += ("&address[]=" + address_rows[i].innerHTML);
    params += ("&contacts[]=" + contact_rows[i].innerHTML);
    params += ("&model_names[]=" + model_name_rows[i].innerHTML);
    params += ("&descriptions[]=" + description_rows[i].innerHTML);
  }
  new Ajax.Request("/print_complaint_register",
  {
    method:'post',
    parameters : params,
    onSuccess: function(transport){
    var response = transport.responseText || "no response text";
    new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
    new_window.document.write(response);
    new_window.document.close();
  },
  onFailure: function(){  }
  });
}
// End of complaint register

// Start of AMC Expiry Report
function ordered_amc_expiry_register(element)
{
  var order_by = "";
  var customer_name = "";
  var from_date = "";
  var to_date = "";
  var page = 0;
  var colony = "";
  var landmark = "";
  element_id = element.id;
  customer_name = $("name").value;
  to_date = $("to_date").value;
  from_date = $("from_date").value;
  colony = $("colony").value;
  landmark = $("landmark").value;
  div_name_element = document.getElementsByClassName("amc-expiry-name-first");
  div_address_element = document.getElementsByClassName("amc-expiry-address-first");
  div_date_element = document.getElementsByClassName("amc-expiry-expiry-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Expiry Date";
  to_date == "" ? to_date = from_date : "";
  (element_id == "name" || element_id == "from_date" || element_id == "to_date" || element_id == "colony" || element_id == "landmark") ? ordered_amc_expiry_register.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_amc_expiry_register.order_by;
  }

  if(element_id == "name desc")
  {
    order_by = element_id;
    ordered_amc_expiry_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9650;";
    element.id = "name asc";
  }
  else if(element_id == "name asc")
  {
    order_by = element_id;
    ordered_amc_expiry_register.order_by = element_id;
    div_name_element[0].innerHTML = "Customer Name &#9660;";
    element.id = "name desc";
  }
  else if(element_id == "contract_date asc")
  {
    order_by = element_id;
    ordered_amc_expiry_register.order_by = element_id;
    div_date_element[0].innerHTML = "Expiry Date &#9660;";
    element.id = "contract_date desc";
  }
  else if(element_id == "contract_date desc")
  {
    order_by = element_id;
    ordered_amc_expiry_register.order_by = element_id;
    div_date_element[0].innerHTML = "Expiry Date &#9650;";
    element.id = "contract_date asc";
  }
  else if(element_id == "address asc")
  {
    order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
    ordered_amc_expiry_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9660;";
    element.id = "address desc";
  }
  else if(element_id == "address desc")
  {
    order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
    ordered_amc_expiry_register.order_by = order_by;
    div_address_element[0].innerHTML = "Address &#9650;";
    element.id = "address asc";
  }

  new Ajax.Request("/ordered_amc_expiry",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "from_date" : from_date, "to_date" : to_date, "colony" : colony, "landmark" : landmark, "page" : page },
    onSuccess: function(transport){
      divObject=$("amc-expiry-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}
// End of AMC Expiry Report

// Complaint form
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
  if(elementObject.value.trim() == "")
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
  if(city_object.value.trim() == "")
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
  if(house_no_object.value.trim() == "" && street_object.value.trim() == "" && colony_object.value.trim() == "" && landmark_object.value.trim() == "")
  {
    house_no_object.setAttribute("class", "error_fields");
    address_status = false;
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
function sales_add_row()
{
  typeof sales_add_row.counter == 'undefined' ? sales_add_row.counter = 0 : "";
  var count= ++sales_add_row.counter;
  new Ajax.Request('/sale_product_row/'+count,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$(count+"");
      var response = transport.responseText || "no response text";
      divObject.innerHTML += "<div class=clear></div><div class=dynamic-product-rows><div class=serial-numbers>"+(count)+"</div>"+response+"</div><div id="+(count+1)+"></div>";
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function description_select(selected_value, div_id)
{
  divObject=$("serial_number_"+div_id);
  quantity_field = $("product_quantity_"+div_id);
  while(divObject.options.length > 1)
  {
    divObject.options[1] = null; // remove the option
  }
  if(selected_value != "")
  {
    new Ajax.Request('/selected_description/'+selected_value,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        discription_array=response.split(",");
        if(discription_array.length>1)
        {
          divObject.disabled = false;
          quantity_field.disabled = true;
          quantity_field.value = 1;
          var option_seq = 1;
          for( i=1; i < discription_array.length; i++)
          {
            divObject.options[option_seq] = new Option(discription_array[i], discription_array[i+1]);
            i++;
            option_seq++;
          }
        }
        else
        {
          quantity_field.disabled = false;
          divObject.disabled = true;
        }
      },
      onFailure: function(){ alert('Something went wrong...'); }
    });
  }
  else
  {
    quantity_field.disabled = false;
    divObject.disabled = true;
  }
}

function check_sales_fields()
{
  var checking_status = true;
  reset_fields();
  check_name("sale_customer_name") ? "" : checking_status = false;
  check_sales_address() ? "" : checking_status = false;
  (!check_sales_dates($("sale_purchase_date")) || !check_sales_dates($("payments_next_pay_date")) || !check_sales_dates($("sale_installation_date"))) ? checking_status = false : "";
  (!contact_numbers("sale_mobile_number") || !contact_numbers("sale_phone_number")) ? checking_status = false : "" ;
  sales_rate_quantity() ? "" : checking_status = false;
  (!select_person("sale_delivery_person_id") || !select_person("sale_installation_person_id")) ? checking_status = false : "" ;
  check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
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
    if(elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        installation_date = Date.parse(elementValue);
        purchase_date = Date.parse($("sale_purchase_date").value);
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
  serial_number_selected = true;
  obj_serial.disabled && obj_serial.selectedIndex == 0 ? "" : serial_number_selected = false;
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
  if(city_object.value.trim() == "")
  {
    city_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  if(state_object.value.trim() == "")
  {
    state_object.setAttribute("class", "error_fields");
    address_status = false;
  }
  house_no_object = $("sale_house_number");
  street_object = $("sale_street");
  colony_object = $("sale_colony");
  landmark_object = $("sale_landmark");
  if(house_no_object.value.trim() == "" && street_object.value.trim() == "" && colony_object.value.trim() == "" && landmark_object.value.trim() == "")
  {
    house_no_object.setAttribute("class", "error_fields");
    address_status = false;
  }
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

function print_sales(sale_id)
{
  new Ajax.Request("/print_sales",
  {
      method:'post',
      parameters : { "sale_id" : sale_id },
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
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

function service_add_row()
{
  typeof service_add_row.counter == 'undefined' ? service_add_row.counter = 0 : "";
  var count= ++service_add_row.counter;
  new Ajax.Request('/customer/product_row/'+count,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$(count+"");
      var response = transport.responseText || "no response text";
      divObject.innerHTML += "<div class=clear></div><div class=dynamic-product-rows><div class=serial-numbers>"+(count)+"</div>"+response+"</div><div id="+(count+1)+"></div>";
    },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function check_service_fields()
{
  var checking_status = true;
  reset_fields();
  (!check_service_dates("service_service_date") || !check_service_dates("payments_next_pay_date")) ? checking_status = false : "";
  select_person("service_technician_id") ? "" : checking_status = false;
  add_service_charge() ? "" : checking_status = false;
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
    if(elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        next_pay_date = Date.parse(elementValue);
        service_date = Date.parse($("service_service_date").value);
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

function add_service_charge()
{
  elementObject = $("service_service_charge");
  elementValue = elementObject.value;
  var pattern=/^\d+$/;
  if(elementValue.trim() == "" || !pattern.test(elementValue))
  {
    elementObject.setAttribute("class", "error_fields");
    return false;
  }
  else
  {
    elementObject.setAttribute("class", "selectboxLength");
    amount_element = $("service_amount");
    amount_element.value = 0;
    service_rate_quantity();
    amount_element.value = parseInt(amount_element.value) + parseInt(elementValue);
    return true;
  }
}

function reprint_service_form(service_id)
{
  new Ajax.Request("/customer/reprint_service_form/"+service_id,
  {
    method:'post',
    onSuccess: function(transport){
    var response = transport.responseText || "no response text";
    new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
    new_window.document.write(response);
    new_window.document.close();
  },
    onFailure: function(){  }
  });
}
// End of service form

// Customer balance report
function customer_balance_detail(payment_id, page)
{
  divObject=$(payment_id+"");
  if(divObject.innerHTML == "")
  {
    new Ajax.Request('/customer/balance_detail/'+payment_id,
    {
      method:'get',
      parameters : { "page" : page },
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        divObject.innerHTML = response;
      },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
    divObject.toggle();
  }
}

function pay_installment(payment_id,from_action)
{
  pass_info = payment_id;
  pass_info += "&"+from_action;
  window.location = "/customer/pay_installment/"+pass_info;
}

function check_installment()
{
  var checking_status = true;
  reset_fields();
  (!check_installment_dates("payments_pay_date") || !check_installment_dates("payments_next_pay_date")) ? checking_status = false : "";
  check_paid_amount("payments_paid_amount") ? "" : checking_status = false;
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
    if(elementValue.trim() != "")
    {
      if(!date_check(elementObject))
      {
        elementObject.setAttribute("class", "error_fields");
        return false;
      }
      else
      {
        next_pay_date = Date.parse(elementValue);
        pay_date = Date.parse($("payments_pay_date").value);
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

function print_customer_installment_pay(payment_id)
{
  new Ajax.Request("/print_customer_installment",
  {
    method:'post',
    parameters : { "payment_id" : payment_id },
    onSuccess: function(transport){
    var response = transport.responseText || "no response text";
    new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
    new_window.document.write(response);
    new_window.document.close();
  },
    onFailure: function(){  }
  });
}
// End of customer balance report

// Service Details
function service_detail(customer_id)
{
  divObject=$(customer_id+"");
  if(divObject.innerHTML == "")
  {
    new Ajax.Request('/customer/service_detail/'+customer_id,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        divObject.innerHTML = response;
      },
      onFailure: function(){ alert('Something went wrong...'); }
    });
  }
  else
  {
    divObject.toggle();
  }
}
// End of Service Details

// AMC Expiry report
function renew_user(customer_id)
{
  divObject=$(customer_id+"");
  if(divObject.innerHTML == "")
  {
    new Ajax.Request('/customer/renew/'+customer_id,
    {
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
        divObject.innerHTML = response;
      },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
    divObject.toggle();
  }
}
// End of AMC Expiry report

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

function print_amc(customer_id)
{
  new Ajax.Request("/print_amc",
  {
      method:'post',
      parameters : { "customer_id" : customer_id },
      onSuccess: function(transport){
      var response = transport.responseText || "no response text";
      new_window = window.open('', 'popup', 'toolbar = no, status = no, height = 841, width = 625, left = '+(screen.width - 625)/2);
      new_window.document.write(response);
      new_window.document.close();
    },
    onFailure: function(){  }
  });
}
// End of AMC From checking