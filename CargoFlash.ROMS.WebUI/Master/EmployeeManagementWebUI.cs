using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Master;
using System.Collections;



namespace CargoFlash.Cargo.WebUI.Master
{
    #region EmployeeManagement Class Description
    /*
	*****************************************************************************
	Class Name:		EmployeeManagementWebUI      
	Purpose:		This Class used to get details of Employee save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Krishan Kant Agarwal
	Created On:		19 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
  public  class EmployeeManagementWebUI : BaseWebUISecureObject
  {
      public StringBuilder CreateWebForm(StringBuilder container)
      {
          try
          {
              if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
              {
                  //Set the display Mode form the URL QuesyString.
                  this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                  //Match the display Mode of the form.
                  switch (this.DisplayMode)
                  {
                      case DisplayModeIndexView:
                          CreateGrid(container);
                          break;
                      case DisplayModeDuplicate:
                          BuildFormView(this.DisplayMode, container);
                          break;
                      case DisplayModeReadView:
                          BuildFormView(this.DisplayMode, container);
                          break;
                      case DisplayModeEdit:
                          BuildFormView(this.DisplayMode, container);
                          break;
                      case DisplayModeNew:
                          BuildFormView(this.DisplayMode, container);
                          break;
                      case DisplayModeDelete:
                          BuildFormView(this.DisplayMode, container);
                          break;
                      default:
                          break;
                  }
              }
          }
          catch (Exception ex)
          {
              ApplicationWebUI applicationWebUI = new ApplicationWebUI();
              applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

          }
          return container;
      }
      public override void DoPostBack()
      {
          try
          {
              this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
              switch (OperationMode)
              {
                  case DisplayModeSave:
                      SaveEmployee();
                      if (string.IsNullOrEmpty(ErrorMessage))
                          System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                      break;
                  case DisplayModeSaveAndNew:
                      SaveEmployee();
                      if (string.IsNullOrEmpty(ErrorMessage))
                          System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                      break;
                  case DisplayModeUpdate:
                      UpdateEmployee(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                      if (string.IsNullOrEmpty(ErrorMessage))
                          System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                      break;

                  case DisplayModeDelete:
                      DeleteEmployee(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                      if (string.IsNullOrEmpty(ErrorMessage))
                          System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                      break;
              }
          }
          catch (Exception ex)
          {
              ApplicationWebUI applicationWebUI = new ApplicationWebUI();
              applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

          }
      }

      private void DeleteEmployee(string p)
      {
          throw new NotImplementedException();
      }

      private void UpdateEmployee(string p)
      {
          throw new NotImplementedException();
      }
      private StringBuilder CreateGrid(StringBuilder container)
      {
          try
          {
              using (Grid g = new Grid())
              {
                  g.PrimaryID = this.MyPrimaryID;
                  g.PageName = this.MyPageName;
                  g.ModuleName = this.MyModuleID;
                  g.AppsName = this.MyAppID;
                  g.ServiceModuleName = this.MyModuleID;
                  g.FormCaptionText = "EmployeeTest";
                  g.CommandButtonNewText = "New Employee";
                  g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                  g.Column = new List<GridColumn>();
                  g.Column.Add(new GridColumn { Field = "EmployeeCode", Title = "Employee Code", DataType = GridDataType.String.ToString() });
                  g.Column.Add(new GridColumn { Field = "EmployeeName", Title = "Employee Name", DataType = GridDataType.String.ToString() });
                  g.Column.Add(new GridColumn { Field = "Email", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                  g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile", DataType = GridDataType.String.ToString() });

                  g.InstantiateIn(container);
              }
          }
          catch (Exception ex)
          {
              ApplicationWebUI applicationWebUI = new ApplicationWebUI();
              applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

          }
          return container;
      }

      private void SaveEmployee()
      {
          try
          {
              List<Employee> listEmployee = new List<Employee>();
              var FormElement = System.Web.HttpContext.Current.Request.Form;
              var employee = new Employee
              {
                  EmployeeCode = FormElement["EmployeeCode"].ToUpper(),
                  EmployeeName = FormElement["EmployeeName"].ToUpper(),
                  Mobile = Convert.ToInt32(FormElement["Mobile"]),
                  Email = FormElement["Text_CurrencyCode"].ToUpper(),
                  UpdateBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                  UpdatedAt = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
              };
              listEmployee.Add(employee);
              object datalist = (object)listEmployee;
              DataOperationService(DisplayModeSave, datalist, MyModuleID);
          }
          catch (Exception ex)
          {
              ApplicationWebUI applicationWebUI = new ApplicationWebUI();
              applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

          }

      }
    }
}
