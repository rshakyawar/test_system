class ProductsController < ApplicationController
  protect_from_forgery :except => [:destroy]
### Check Authendication before calling any function
  before_filter :authenticate
before_filter :is_admin

### Open Create Product Form
  def new_product
    @product = Product.new
  end

### Save Product Information to Database
  def create_product
    @product = Product.new(params[:product])
    if @product.save
      redirect_to product_stock_path
    else
      flash[:notice] = "Please enter correct Informations"
      render product_new_path
    end
  end

### Open Edit Product Form
  def edit_product
    begin
      @product = Product.find(params[:id])
    rescue
    end
  end

### Update Product Information to Database
  def update_product
    begin
      @product = Product.find(params[:id])
      if @product.update_attributes(params[:product])
        redirect_to product_stock_path
      else
        flash[:notice] = "Please enter correct Informations"
        render product_edit_path
      end
    rescue
    end
  end

### Delete Product Information from Database
  def destroy
    begin
      @product = Product.find(params[:id])
      @product.update_attribute(:is_enable, false)
    rescue
    end
    redirect_to product_stock_path
  end

### Get Stock details In Particular order
  def ordered_stock_detail
    stocks = Product.get_stock_detail(params)
    render_partial_pagination("stock_detail", stocks, params[:page], :stocks)
  end

### Print Stock Details
  def print_stock
    @quantity, @product, @description, @serial = params[:quantities], params[:products], params[:descriptions], params[:serials]
  end
end
