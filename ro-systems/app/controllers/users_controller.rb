class UsersController < ApplicationController

### Check Authendication before calling any function except check_login and login
    before_filter :authenticate, :except => [ :check_login, :login ]
    before_filter :is_admin, :only => [ :show, :destroy, :new, :create ]
    ##before_filter :is_logged_in, :only => [ :login ]
    #     before_filter :service_access

### Generate New User form
  def new
    @user = User.new
  end

    def home
    end
### Insert Citi Info
  def insert_citi_info
     @city_info = CitiInfo.new(params[:citi_info])
     if @city_info.save
       redirect_to user_citi_info_path
     else
       flash[:notice] = "Please fill the all entries"
       redirect_to user_new_path
     end
   end
### Create User
  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to user_show_path
    else
      flash[:notice] = "Please fill the all entries"
      redirect_to user_new_path
    end
  end

  def login
  end

### Perform Login check
  def check_login
    @user = User.find(:first, :conditions => ["user_name = ? AND password = ?", params[:user_name], params[:password]])
    if !@user.nil?
      session[:user_id] = @user.id
          session[:user_type] = @user.is_admin
          redirect_to home_path
  else
      flash[:notice] = "Please enter correct username or password"
      redirect_to root_path
    end
  end

### logout user
  def logout
    reset_session
          session[:user_id] = nil
          session[:user_type] = nil
    redirect_to root_path
  end

### Generate Form for changing Password
  def change_password
    @user = User.new
  end

### Set New password to database
  def set_password
    @user = User.find(session[:user_id])
    if @user.password == params[:old_password]
      if @user.update_attributes(params[:user])
        redirect_to user_new_path
      else
        flash[:notice] = "Please enter correct passwords"
        render user_change_password_path
      end
    else
      flash[:notice] = "Please enter your correct passwords"
      redirect_to user_change_password_path
    end
  end

### Show Users List
  def show
    @user = User.find(:all, :conditions => ["is_admin = 'FALSE'"])
  end

### Delete User
  def destroy
    begin
      user = User.find(params[:id])
      user.destroy
    rescue
    end
    redirect_to user_show_path
  end


end
