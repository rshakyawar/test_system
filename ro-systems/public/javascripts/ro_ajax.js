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
function edit_add_row(count, product_count)
{
    new Ajax.Request('/product_row/'+count,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$(count+"");
     $('counter').value = parseInt(count) +1 ;
      var response = transport.responseText || "no response text";
      divObject.innerHTML += "<div class=clear></div><div class=dynamic-product-rows><div class=serial-numbers>"+(count)+"</div>"+response+"</div><div id="+(parseInt(count)+1)+"></div>";
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
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = eval(transport.responseText)[0] || "no response text";
        response_length = response.length
        for( var i=0; i< company_tags.length; i++)
        {
          divObject=$(company_tags[i]);
          divObject.value= response[company_tags[i]];
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

function bill_book_series_select(id)
{
  if(id!=0)
  {
    new Ajax.Request('/selected_bill_book_series/'+id,
    {
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = transport.responseText || "no response text";
          divObject=$("bill_book_series_current_invoice_number");
          divObject.value= response;
          },
      onFailure: function(){ alert('Something went wrong...') }
    });
  }
  else
  {
      divObject=$("bill_book_series_current_invoice_number");
      divObject.value= "";
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
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = eval(transport.responseText) || "no response text";
        response_length = response.length
        divObject.disabled = false;
        if(response_length > 0)
        {
          for( i=0; i < response_length; i++)
          {
            divObject.options[i+1] = new Option(response[i].descriptions, response[i].id);
          }
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
  product_name = $F("name");
  descriptions = $F("description");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_stock.order_by = element_id;
                      div_name_element[0].innerHTML = "Products/Parts &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                      order_by = element_id;
                      ordered_stock.order_by = element_id;
                      div_name_element[0].innerHTML = "Products/Parts &#9660;";
                      element.id = "name desc";
                      break;
    case "description asc":
                            order_by = element_id;
                            ordered_stock.order_by = element_id;
                            div_description_element[0].innerHTML = "Description &#9660;";
                            element.id = "description desc";
                            break;
    case "description desc":
                            order_by = element_id;
                            ordered_stock.order_by = element_id;
                            div_description_element[0].innerHTML = "Description &#9650;";
                            element.id = "description asc";
                            break;
    case "quantity asc":
                        order_by = element_id;
                        ordered_stock.order_by = element_id;
                        div_quantity_element[0].innerHTML = "Quantity &#9660;";
                        element.id = "quantity desc";
                        break;
    case "quantity desc":
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
  company_name = $F("company_name");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_order_balance_report.order_by = element_id;
                      div_name_element[0].innerHTML = "Company Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_order_balance_report.order_by = element_id;
                    div_name_element[0].innerHTML = "Company Name &#9660;";
                    element.id = "name desc";
                    break;
    case "balance asc":
                        order_by = element_id;
                        ordered_order_balance_report.order_by = element_id;
                        div_balance_element[0].innerHTML = "Balance &#9660;";
                        element.id = "balance desc";
                        break;
    case "balance desc":
                        order_by = element_id;
                        ordered_order_balance_report.order_by = element_id;
                        div_balance_element[0].innerHTML = "Balance &#9650;";
                        element.id = "balance asc";
                        break;
    case "address asc":
                        order_by = element_id;
                        ordered_order_balance_report.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9660;";
                        element.id = "address desc";
                        break;
    case "address desc":
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
  customer_name = $F("name");
  to_date = $F("to_date");
  from_date = $F("from_date");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_service_register.order_by = element_id;
                      div_name_element[0].innerHTML = "Customer Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_service_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;
    case "date asc":
                    order_by = element_id;
                    ordered_service_register.order_by = element_id;
                    div_date_element[0].innerHTML = "Last Service Date &#9660;";
                    element.id = "date desc";
                    break;
    case "date desc":
                      order_by = element_id;
                      ordered_service_register.order_by = element_id;
                      div_date_element[0].innerHTML = "Last Service Date &#9650;";
                      element.id = "date asc";
                      break;
    case "amc_type asc":
                        order_by = element_id;
                        ordered_service_register.order_by = element_id;
                        div_amc_type_element[0].innerHTML = "AMC Type &#9660;";
                        element.id = "amc_type desc";
                        break;
    case "amc_type desc":
                          order_by = element_id;
                          ordered_service_register.order_by = element_id;
                          div_amc_type_element[0].innerHTML = "AMC Type &#9650;";
                          element.id = "amc_type asc";
                          break;
    case "address asc":
                        order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                        ordered_service_register.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9660;";
                        element.id = "address desc";
                        break;
    case "address desc":
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
  customer_name = $F("name");
  colony = $F("colony");
  landmark = $F("landmark");
  amc_type = $("amc_type").options[$("amc_type").selectedIndex].value;
  days = $F("days");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_amc_not_serviced.order_by = element_id;
                      div_name_element[0].innerHTML = "Customer Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_amc_not_serviced.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;
    case "date asc":
                    order_by = element_id;
                    ordered_amc_not_serviced.order_by = element_id;
                    div_date_element[0].innerHTML = "Last Service Date &#9660;";
                    element.id = "date desc";
                    break;
    case "date desc":
                      order_by = element_id;
                      ordered_amc_not_serviced.order_by = element_id;
                      div_date_element[0].innerHTML = "Last Service Date &#9650;";
                      element.id = "date asc";
                      break;
    case "amc_type asc":
                        order_by = element_id;
                        ordered_amc_not_serviced.order_by = element_id;
                        div_amc_type_element[0].innerHTML = "AMC Type &#9660;";
                        element.id = "amc_type desc";
                        break;
    case "amc_type desc":
                          order_by = element_id;
                          ordered_amc_not_serviced.order_by = element_id;
                          div_amc_type_element[0].innerHTML = "AMC Type &#9650;";
                          element.id = "amc_type asc";
                          break;
    case "address asc":
                        order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                        ordered_amc_not_serviced.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9660;";
                        element.id = "address desc";
                        break;
    case "address desc":
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
  customer_name = $F("name");
  late_to_date = $F("to_last_pay_date");
  late_from_date = $F("from_last_pay_date");
  next_to_date = $F("to_next_pay_date");
  next_from_date = $F("from_next_pay_date");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_customer_balance_register.order_by = element_id;
                      div_name_element[0].innerHTML = "Customer Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_customer_balance_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;
    case "last_pay asc":
                        order_by = element_id;
                        ordered_customer_balance_register.order_by = element_id;
                        div_date_element[0].innerHTML = "Last Payment Date &#9660;";
                        element.id = "last_pay desc";
                        break;
    case "last_pay desc":
                          order_by = element_id;
                          ordered_customer_balance_register.order_by = element_id;
                          div_date_element[0].innerHTML = "Last Payment Date &#9650;";
                          element.id = "last_pay asc";
                          break;
    case "remaining asc":
                          order_by = element_id;
                          ordered_customer_balance_register.order_by = element_id;
                          div_balance_element[0].innerHTML = "Balance Remaining &#9660;";
                          element.id = "remaining desc";
                          break;
    case "remaining desc":
                          order_by = element_id;
                          ordered_customer_balance_register.order_by = element_id;
                          div_balance_element[0].innerHTML = "Balance Remaining &#9650;";
                          element.id = "remaining asc";
                          break;
    case "next_pay asc":
                        order_by = element_id;
                        ordered_customer_balance_register.order_by = order_by;
                        div_date_element[1].innerHTML = "Next Payment Date &#9660;";
                        element.id = "next_pay desc";
                        break;
    case "next_pay desc":
                          order_by = element_id;
                          ordered_customer_balance_register.order_by = order_by;
                          div_date_element[1].innerHTML = "Next Payment Date &#9650;";
                          element.id = "next_pay asc";
                          break;
    case "payment_for asc":
                            order_by = element_id;
                            ordered_customer_balance_register.order_by = order_by;
                            div_payment_for_element[0].innerHTML = "Payment For &#9660;";
                            element.id = "payment_for desc";
                            break;
    case "payment_for desc":
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
  company_name = $F("name");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_show_company.order_by = element_id;
                      div_name_element[0].innerHTML = "Company Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_show_company.order_by = element_id;
                    div_name_element[0].innerHTML = "Company Name &#9660;";
                    element.id = "name desc";
                    break;
    case "address asc":
                        order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                        ordered_show_company.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9660;";
                        element.id = "address desc";
                        break;
    case "address desc":
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
  customer_name = $F("name");
  to_date = $F("to_date");
  from_date = $F("from_date");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "customer_name desc":
                              order_by = element_id;
                              ordered_sale_register.order_by = element_id;
                              div_name_element[0].innerHTML = "Customer Name &#9650;";
                              element.id = "customer_name asc";
                              break;
    case "customer_name asc":
                              order_by = element_id;
                              ordered_sale_register.order_by = element_id;
                              div_name_element[0].innerHTML = "Customer Name &#9660;";
                              element.id = "customer_name desc";
                              break;
    case "date asc":
                    order_by = element_id;
                    ordered_sale_register.order_by = element_id;
                    div_date_element[0].innerHTML = "Date &#9660;";
                    element.id = "date desc";
                    break;
    case "date desc":
                    order_by = element_id;
                    ordered_sale_register.order_by = element_id;
                    div_date_element[0].innerHTML = "Date &#9650;";
                    element.id = "date asc";
                    break;
    case "customer_type asc":
                            order_by = element_id;
                            ordered_sale_register.order_by = element_id;
                            div_date_element[1].innerHTML = "Customer Type &#9660;";
                            element.id = "customer_type desc";
                            break;
    case "customer_type desc":
                              order_by = element_id;
                              ordered_sale_register.order_by = element_id;
                              div_date_element[1].innerHTML = "Customer Type &#9650;";
                              element.id = "customer_type asc";
                              break;
    case "address asc":
                      order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                      ordered_sale_register.order_by = order_by;
                      div_address_element[0].innerHTML = "Address &#9660;";
                      element.id = "address desc";
                      break;
    case "address desc":
                        order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
                        ordered_sale_register.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9650;";
                        element.id = "address asc";
                        break;
    case "total_amount asc":
                            order_by = element_id;
                            ordered_sale_register.order_by = order_by;
                            div_amount_element[0].innerHTML = "Amount &#9660;";
                            element.id = "total_amount desc";
                            break;
    case "total_amount desc":
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
  company_name = $F("company_name");
  from_date = $F("from_date");
  to_date = $F("to_date");
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

  switch(element_id)
  {
    case "order_date desc":
                          order_by = element_id;
                          ordered_status.order_by = element_id;
                          div_date_element[0].innerHTML = "Order Date &#9650;";
                          element.id = "order_date asc";
                          break;
    case "order_date asc":
                          order_by = element_id;
                          ordered_status.order_by = element_id;
                          div_date_element[0].innerHTML = "Order Date &#9660;";
                          element.id = "order_date desc";
                          break;
    case "name asc":
                    order_by = element_id;
                    ordered_status.order_by = element_id;
                    div_name_element[0].innerHTML = "Company Name &#9660;";
                    element.id = "name desc";
                    break;
    case "name desc":
                    order_by = element_id;
                    ordered_status.order_by = element_id;
                    div_name_element[0].innerHTML = "Company Name &#9650;";
                    element.id = "name asc";
                    break;
    case "incomplete":
                      order_by = element_id;
                      ordered_status.order_by = element_id;
                      div_status_element[0].innerHTML = "Status &#9650;";
                      element.id = "complete";
                      break;
    case "complete":
                    order_by = element_id;
                    ordered_status.order_by = element_id;
                    div_status_element[0].innerHTML = "Status &#9660;";
                    element.id = "incomplete";
                       break;
    default :
                    element_id = "name asc";
                    order_by = element_id;
                    ordered_status.order_by = element_id;
                    div_name_element[0].innerHTML = "Company Name &#9660;";
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
// End of functions for Status Details

// Start Functions for Balance Details
function get_balance_detail(company_id, page_number)
{
  new Ajax.Request('/order/balance_detail/'+company_id,
  {
    method:'get',
    parameters : { "page" : page_number},
    onSuccess: function(transport){
      divObject=$(company_id+"");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
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
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = eval(transport.responseText)[0] || "no response text";
        response_length = response.length
        for( var i=0; i< customer_tags.length; i++)
        {
          divObject=$(customer_tags[i]);
          divObject.value= response[customer_tags[i]];
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
  customer_name = $F("name");
  to_date = $F("to_date");
  from_date = $F("from_date");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "name desc":
                    order_by = element_id;
                    ordered_complaint_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9650;";
                    element.id = "name asc";
                    break;
    case "name asc":
                    order_by = element_id;
                    ordered_complaint_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;
    case "date asc":
                    order_by = element_id;
                    ordered_complaint_register.order_by = element_id;
                    div_date_element[0].innerHTML = "Complaint Date &#9660;";
                    element.id = "date desc";
                    break;
    case "date desc":
                    order_by = element_id;
                    ordered_complaint_register.order_by = element_id;
                    div_date_element[0].innerHTML = "Complaint Date &#9650;";
                    element.id = "date asc";
                    break;
    case "address asc":
                      order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                      ordered_complaint_register.order_by = order_by;
                      div_address_element[0].innerHTML = "Address &#9660;";
                      element.id = "address desc";
                      break;
    case "address desc":
                        order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
                        ordered_complaint_register.order_by = order_by;
                        div_address_element[0].innerHTML = "Address &#9650;";
                        element.id = "address asc"
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
  customer_name = $F("name");
  to_date = $F("to_date");
  from_date = $F("from_date");
  colony = $F("colony");
  landmark = $F("landmark");
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

  switch(element_id)
  {
    case "name desc":
                    order_by = element_id;
                    ordered_amc_expiry_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9650;";
                    element.id = "name asc";
                    break;
    case "name asc":
                    order_by = element_id;
                    ordered_amc_expiry_register.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;
    case "contract_date asc":
                            order_by = element_id;
                            ordered_amc_expiry_register.order_by = element_id;
                            div_date_element[0].innerHTML = "Expiry Date &#9660;";
                            element.id = "contract_date desc";
                            break;
    case "contract_date desc":
                              order_by = element_id;
                              ordered_amc_expiry_register.order_by = element_id;
                              div_date_element[0].innerHTML = "Expiry Date &#9650;";
                              element.id = "contract_date asc";
                              break;
    case "address asc":
                      order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                      ordered_amc_expiry_register.order_by = order_by;
                      div_address_element[0].innerHTML = "Address &#9660;";
                      element.id = "address desc";
                      break;
    case "address desc":
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

// function for add  cheque in sales bill payment

function sales_add_payment_cheque()
{
  typeof sales_add_payment_cheque.counter == 'undefined' ? sales_add_payment_cheque.counter = 0 : "";
  var count= ++sales_add_payment_cheque.counter;
  new Ajax.Request('/sale_add_payment_cheque/'+count,
  {
    method:'get',
    onSuccess: function(transport){
      divObject=$('c'+count+"");
      var response = transport.responseText || "no response text";
     divObject.innerHTML += "<div class=clear></div><div id=c"+(count+1)+">"+response+"</div>";
      cheques.push(count);
      date_field(count);
          },
    onFailure: function(){ alert('Something went wrong...'); }
  });
}

function date_field(count) {
  
  Zapatec.Calendar.setup({
            inputField     :    "payment_post_date_"+count,     // id of the input field
            ifFormat       :    "%m/%d/%Y",     // format of the input field
            button         :    "post_date_"+count,  // What will trigger the popup of the calendar
            showsTime      :     false      //don't show time, only date
    });
}
    function sales_remove_payment_cheque(id){
          for(var i=0; i<cheques.length; i++){
                  if (cheques[i] == id){
                        cheques.splice(i,1);
                        $('cheque'+id).remove();
                        }
                if(cheques.length == 0){
                 if(!($("payment_is_cheque")== null)){ $("payment_is_cheque").checked =false;}
                 if(!($("payments_is_cheque")== null)){ $("payments_is_cheque").checked =false;}
                  $("cheque_div").hide();
                  }
            }
  }

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
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = eval(transport.responseText) || "no response text";
        response_length = response.length
        if(response_length > 0)
        {
          divObject.disabled = false;
          quantity_field.disabled = true;
          quantity_field.value = 1;
          for( i=0; i < response_length; i++)
          {
            divObject.options[i+1] = new Option(response[i].serial_number, response[i].id);
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


//start of show amc

function ordered_show_amc(element)
{
  var order_by = "";
  var page = 0;
  var colony = "";
 // var landmark = "";
  var from_date = "";
  var to_date = "";
  element_id = element.id;
  colony = $F("colony");
 // landmark = $F("landmark");
  customer_name = $F("name");
  to_date = $F("to_date")
  from_date = $F("from_date")
	amc_type = $F("amc_type");
	model_name = $F("model_name");
  div_name_element = document.getElementsByClassName("show-amc-name-first");
  div_address_element = document.getElementsByClassName("show-amc-address-first");
  div_date_element = document.getElementsByClassName("show-amc-date-first");
  div_model_name_element = document.getElementsByClassName("show-amc-model-name-first");
  div_amc_type_element = document.getElementsByClassName("show-amc-type-first");
  div_amount_element = document.getElementsByClassName("show-amc-amount-first");
//   div_address_element = document.getElementsByClassName("show-company-address-first");
  div_name_element[0].innerHTML = "Customer Name";
  div_address_element[0].innerHTML = "Address";
  div_date_element[0].innerHTML = "Contract Date";
  div_amc_type_element[0].innerHTML = "Amc Type";
  div_model_name_element[0].innerHTML = "Model Name";
  div_amount_element[0].innerHTML = "Amount";
  div_address_element[0].innerHTML = "Address";
  (element_id == "name" || element_id == "contract_date" || element_id == "from_date" || element_id == "to_date"  || element_id == "model_name" || element_id == "amc_type" || element_id =="contract_amount") ? ordered_show_amc.order_by = "" : "";
  if(!isNaN(element))
  {
    page = element;
    element_id = ordered_show_amc.order_by;
  }
  switch(element_id)
  {
    case "name desc":
                      order_by = element_id;
                      ordered_show_amc.order_by = element_id;
                      div_name_element[0].innerHTML = "Customer Name &#9650;";
                      element.id = "name asc";
                      break;
    case "name asc":
                    order_by = element_id;
                    ordered_show_amc.order_by = element_id;
                    div_name_element[0].innerHTML = "Customer Name &#9660;";
                    element.id = "name desc";
                    break;

    case "contract_date asc":
                    order_by = element_id;
                    ordered_show_amc.order_by = element_id;
                    div_date_element[0].innerHTML = "Contract Date &#9660;";
                    element.id = "contract_date desc";
                    break;
    case "contract_date desc":
                     order_by = element_id;
                     ordered_show_amc.order_by = element_id;
                     div_date_element[0].innerHTML = "Contract Date &#9650;";
                     element.id = "contract_date asc";
                     break;
    case "address asc":
                     order_by = "house_number desc,street desc,colony desc,landmark desc,city desc";
                     ordered_show_amc.order_by = order_by;
                     div_address_element[0].innerHTML = "Address &#9660;";
                     element.id = "address desc";
                     break;
    case "address desc":
                     order_by = "house_number asc,street asc,colony asc,landmark asc,city asc";
                     ordered_show_amc.order_by = order_by;
                     div_address_element[0].innerHTML = "Address &#9650;";
                     element.id = "address asc";
                     break;
    case "contract_amount asc":
                     order_by = element_id;
                     ordered_show_amc.order_by = order_by;
                     div_amount_element[0].innerHTML = "Amount &#9660;";
                     element.id = "contract_amount desc";
                     break;
    case "contract_amount desc":
                     order_by = element_id;
                     ordered_show_amc.order_by = order_by;
                     div_amount_element[0].innerHTML = "Amount &#9650;";
                     element.id = "contract_amount asc";
                     break;
    case "amc_type asc":
                      order_by = element_id;
                      ordered_show_amc.order_by = order_by;
                      div_amc_type_element[0].innerHTML = "Amc Type &#9660;";
                      element.id = "amc_type desc";
                      break;
    case "amc_type desc":
                        order_by = element_id;
                        ordered_show_amc.order_by = order_by;
                        div_amc_type_element[0].innerHTML = "Amc Type &#9650;";
                        element.id = "amc_type asc";
                        break;
   case "model_name asc":
                      order_by = element_id;
                      ordered_show_amc.order_by = order_by;
                      div_model_name_element[0].innerHTML = "Model Name &#9660;";
                      element.id = "model_name desc";
                      break;

    case "model_name desc":
                        order_by = element_id;
                        ordered_show_amc.order_by = order_by;
                        div_model_name_element[0].innerHTML = "Model Name &#9650;";
                        element.id = "model_name asc";
       }

  new Ajax.Request("/customer/ordered_show_amc",
  {
    method:'post',
    parameters : { "order_by" : order_by, "name" : customer_name, "from_date" : from_date, "to_date" : to_date, "colony" : colony, "page" : page ,"amc_type" : amc_type ,"model_name" : model_name},
    onSuccess: function(transport){
      divObject=$("amc-content");
      var response = transport.responseText || "no response text";
      divObject.innerHTML = response;
    },
    onFailure: function(){ alert('Something went wrong...') }
  });
}


//end of show AMC

//Form Create AMC

function citi_info_select(city_name)
{
  var customer_tags=['customer_city' , 'customer_zipcode' , 'customer_phone_number'];
  if(city_name != "")
  {
    new Ajax.Request('/selected_citi_info/' + city_name,
    {
      contentType:'application/json',
      method:'get',
      onSuccess: function(transport){
        var response = eval(transport.responseText)[0] || "no response text";
        response_length = response.length
        for( var i=0; i< customer_tags.length; i++)
        {
          divObject=$(customer_tags[i]);
          divObject.value= response[customer_tags[i]];
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

//End of create AMCfile:///home/RO-systems/ro-systems/public/javascripts/ro_ajax.js
