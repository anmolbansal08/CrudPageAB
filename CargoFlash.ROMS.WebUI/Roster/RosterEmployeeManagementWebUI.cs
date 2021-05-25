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
using CargoFlash.Cargo.Model.Roster;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Roster
{
    #region RosterTeamID Class Description
    /*
	*****************************************************************************
	Class Name:		RosterEmployeeManagementWebUI      
	Purpose:		This Class used to get details of Employee save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Farogh Haider
	Created On:		02 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class RosterEmployeeManagementWebUI : BaseWebUISecureObject
    {
        public RosterEmployeeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Roster";
                this.MyAppID = "RosterEmployee";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object Getmployee()
        {
            object objEMP = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RosterEmployee emp = new RosterEmployee();
                    object obj = (object)emp;
                    objEMP = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Messgae: Record not found.
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return objEMP;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = Getmployee();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = Getmployee();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = Getmployee();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = Getmployee();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append("<input id='hdnCity' name='hdnCity' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString() + "'");
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return container;
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.CommandButtonNewText = "New Employee";
                    g.FormCaptionText = "Employee";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Employee Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StaffNumber", Title = "Staff Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DepartmentSNo", Title = "Department Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DesignationName", Title = "Designation Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "TeamName", Title = "Team Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ContactNo", Title = "Contact No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Address", Title = "Address", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return Container;
        }

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
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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
                ErrorMessage = applicationWebUI.ErrorMessage;
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
                        SaveRosterEmployee();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveRosterEmployee();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateRosterEmployee(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteRosterEmployee(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                    case DisplayModeDuplicate:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void SaveRosterEmployee()
        {
            try
            {
                List<RosterEmployee> lstRosterEmployee = new List<RosterEmployee>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var EmpData = new RosterEmployee
                {
                    Name = FormElement["Name"],
                    StaffNo = Convert.ToInt32(FormElement["StaffNo"]),
                    CityCode = FormElement["CityCode"],
                    AirlineSNo = FormElement["AirlineSNo"].ToString() == "" ? "0" : FormElement["AirlineSNo"].ToString(),
                    DesignationSNo = FormElement["DesignationSNo"].ToString() == "" ? "0" : FormElement["DesignationSNo"].ToString(),
                    //TeamIDSNo = FormElement["TeamIDSNo"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["TeamIDSNo"]),
                    MailID = FormElement["MailID"].ToString(),
                    ContactNo = FormElement["ContactNo"],
                    PhoneNo = FormElement["PhoneNo"],
                    Address = FormElement["Address"],
                    //SkillSNo = FormElement["SkillSNo"].ToString() == "" ? "0" : FormElement["SkillSNo"].ToString(),
                    JoiningDate =(FormElement["JoiningDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["JoiningDate"]),
                    ResignDate =(FormElement["ResignDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["ResignDate"]),
                    LWorkingDate =(FormElement["LWorkingDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["LWorkingDate"]),
                    IsActive = FormElement["IsActive"] == "0",
                    // IsEmployeeType = string.IsNullOrEmpty(FormElement["IsEmployeeType"].ToString()) == true ? (Int32?)null : Convert.ToInt32(FormElement["IsEmployeeType"].ToString()),
                    DepartmentSNo = FormElement["DepartmentSNo"].ToString() == "" ? "0" : FormElement["DepartmentSNo"].ToString(),
                    EmployeeTypeSNo = FormElement["EmployeeTypeSNo"].ToString() == "" ? "0" : FormElement["EmployeeTypeSNo"].ToString(),                 
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                  

                };
                lstRosterEmployee.Add(EmpData);
                object datalist = (object)lstRosterEmployee;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void UpdateRosterEmployee(string RecordID)
        {
            try
            {
                List<RosterEmployee> listRosterEmployee = new List<RosterEmployee>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;           
                 var EmpData = new RosterEmployee
                {
                    SNo = Convert.ToInt32(RecordID),
                    Name = FormElement["Name"],
                    StaffNo = Convert.ToInt32(FormElement["StaffNo"]),
                    CityCode = FormElement["CityCode"],
                    AirlineSNo = Convert.ToString(FormElement["AirlineSNo"]),
                    DesignationSNo = Convert.ToString(FormElement["DesignationSNo"]),

                    //TeamIDSNo = FormElement["TeamIDSNo"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["TeamIDSNo"]),
                    MailID = FormElement["MailID"].ToString(),
                    ContactNo = FormElement["ContactNo"],
                    PhoneNo = FormElement["PhoneNo"],
                    Address = FormElement["Address"],
                    //SkillSNo = FormElement["SkillSNo"].ToString() == "" ? "0" : FormElement["SkillSNo"].ToString(),
                    JoiningDate = (FormElement["JoiningDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["JoiningDate"]),
                    ResignDate = (FormElement["ResignDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["ResignDate"]),
                    LWorkingDate = (FormElement["LWorkingDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(FormElement["LWorkingDate"]),
                    //DepartmentSNo = Convert.ToInt32(FormElement["DepartmentSNo"]),

                    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsActive = FormElement["IsActive"] == "0",
                    DepartmentSNo = Convert.ToString(FormElement["DepartmentSNo"]),
                    EmployeeTypeSNo = FormElement["EmployeeTypeSNo"].ToString() == "" ? "0" : FormElement["EmployeeTypeSNo"].ToString()
                   // IsEmployeeType = string.IsNullOrEmpty(FormElement["IsEmployeeType"].ToString()) == true ? (Int32?)null : Convert.ToInt32(FormElement["IsEmployeeType"].ToString()),
                };
                listRosterEmployee.Add(EmpData);
                object datalist = (object)listRosterEmployee;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {

                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void DeleteRosterEmployee(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
    }
}
