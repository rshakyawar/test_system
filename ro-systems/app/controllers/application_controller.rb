class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :is_admin
### Checking Authendcation
  def authenticate
    if session[:user_id].present?
      return true
    else
      redirect_to root_path
    end
  end

  def is_admin
    if session[:user_type]
      return true
    else
    flash[:notice] = "Only Admin can access this page"    
   redirect_to home_path
    end
  end

  def render_partial_pagination(partial_name, model_obj, page, retreive_name)
    per_page = 25
    start_index = page=="0" ? 0 : (Integer(page)-1)*per_page
    total_pages = (Float(model_obj.size)/per_page).ceil
    render :partial => partial_name, :locals => { retreive_name => model_obj[start_index,per_page], :total_pages => total_pages, :counter => start_index }
  end

  def service_access
    user = User.find(session[:user_id]) unless session[:user_id].blank?
    return true if (user.is_admin || user.user_type_id ==1 || user.user_type_id ==3 )
    flash[:notice] = "You don't have permission to access this page"
    return redirect_to home_path
  end

  def amc_access
     user = User.find(session[:user_id]) unless session[:user_id].blank?
     return true if (user.is_admin || user.user_type_id ==2 || user.user_type_id ==3 )
    flash[:notice] = "You don't have permission to access this page"
    return redirect_to home_path
   end

    def is_logged_in
      unless session[:user_id].blank?
        redirect_to home_path
      end
    end

end
