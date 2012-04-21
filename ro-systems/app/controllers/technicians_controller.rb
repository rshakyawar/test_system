class TechniciansController < ApplicationController

### Check Authendication before calling any function
  before_filter :authenticate
before_filter :is_admin

### Show Technicians List
  def show
    @technician = Technician.all
  end

### Create Technicians
  def new_technician
    @technician = Technician.new
  end

### Save Technicians information to database
  def create_technician
    @technician = Technician.new(params[:technician])
    if @technician.save
      redirect_to technician_show_path
    else
      flash[:notice] = "Please enter Technician Name"
      render technician_new_path
    end
  end

### Edit Technicians form
  def edit_technician
    begin
      @technician = Technician.find(params[:id])
    rescue
    end
  end

### Upadate Technicians
  def update_technician
    begin
      @technician = Technician.find(params[:id])
      if @technician.update_attributes(params[:technician])
        redirect_to technician_show_path
      else
        flash[:notice] = "Please enter Technician Name"
        render technician_edit_path(@technician)
      end
    rescue
      render technician_edit_path(@technician)
    end
  end

### Delete Technicians
  def destroy
    begin
      @technician = Technician.find(params[:id])
      @technician.destroy
    rescue
    end
    redirect_to technician_show_path
  end

end
