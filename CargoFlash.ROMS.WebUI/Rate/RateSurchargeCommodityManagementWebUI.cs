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
using CargoFlash.Cargo.Model.Tariff;
using System.Collections;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.WebUI;


namespace CargoFlash.Cargo.WebUI.Rate
{
    #region RateSurchargeCommodityManagementWebUI Description
    /*
	*****************************************************************************
	Class Name:		RateSurchargeCommodityManagementWebUI   
	Purpose:		This Class used to get details of RateSurchargeCommodityManagementWebUI save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Parvez Khan
	Created On:		7 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
   public class RateSurchargeCommodityManagementWebUI : BaseWebUISecureObject
    {
        public object GetRateSurchargeCommodity()
        {
            object RateSurchargeCommodity = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateSurchargeCommodity RateSurchargeCommodityList = new RateSurchargeCommodity();
                    object obj = (object)RateSurchargeCommodityList;
                    RateSurchargeCommodity = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return RateSurchargeCommodity;
        }
        public RateSurchargeCommodityManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "RateSurchargeCommodity";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public RateSurchargeCommodityManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateSurchargeCommodity";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "SurChargeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRateSurchargeCommodity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRateSurchargeCommodity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRateSurchargeCommodity();
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
                            htmlFormAdapter.objFormData = GetRateSurchargeCommodity();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
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
                    g.FormCaptionText = "Commodity Rate Surcharge ";
                    g.CommandButtonNewText = "New Commodity Rate Surcharge";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SurChargeName", Title = "Surcharge Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CommoditySubGroupSNo", Title = "Sub Group", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_CommoditySNo", Title = "Commodity Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartWeight", Title = "Start Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndWeight", Title = "End Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ValueType", Title = "Value Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Value", Title = "Value", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Editable", Title = "Editable", DataType = GridDataType.String.ToString() });
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
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveRateSurchargeCommodity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveRateSurchargeCommodity();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateRateSurchargeCommodity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteRateSurchargeCommodity(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveRateSurchargeCommodity()
        {
            try
            {
                List<RateSurchargeCommodity> listRateSurchargeCommodity = new List<RateSurchargeCommodity>();
                int number = 0;
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateSurchargeCommodity = new RateSurchargeCommodity
                {

                    SurChargeName = FormElement["SurChargeName"].ToUpper(),
                    CommoditySNo = Int32.TryParse(FormElement["CommoditySNo"], out number) ? number : 0,
                    CommoditySubGroupSNo = Int32.TryParse(FormElement["CommoditySubGroupSNo"], out number) ? number : 0,
                    StartWeight = Convert.ToDecimal(FormElement["StartWeight"] == "" ? "0" : FormElement["StartWeight"]),
                    EndWeight = Convert.ToDecimal(FormElement["EndWeight"] == "" ? "0" : FormElement["EndWeight"]),
                    ValueType = Int32.TryParse(FormElement["ValueType"], out number) ? number : 0,
                    Value = Convert.ToDecimal(FormElement["Value"] == "" ? "0" : FormElement["Value"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    IsInternational =FormElement["IsInternational"]=="0" ,
                    IsActive = FormElement["IsActive"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listRateSurchargeCommodity.Add(RateSurchargeCommodity);
                object datalist = (object)listRateSurchargeCommodity;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void UpdateRateSurchargeCommodity(string RecordID)
        {
            try
            {
                int number = 0;
                List<RateSurchargeCommodity> listRateSurchargeCommodity = new List<RateSurchargeCommodity>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateSurchargeCommodity = new RateSurchargeCommodity
                {
                    SNo = Convert.ToInt32(RecordID),
                    SurChargeName = FormElement["SurChargeName"].ToUpper(),
                    CommoditySNo = Int32.TryParse(FormElement["CommoditySNo"], out number) ? number : 0,
                    CommoditySubGroupSNo = Int32.TryParse(FormElement["CommoditySubGroupSNo"], out number) ? number : 0,
                    StartWeight = Convert.ToDecimal(FormElement["StartWeight"] == "" ? "0" : FormElement["StartWeight"]),
                    EndWeight = Convert.ToDecimal(FormElement["EndWeight"] == "" ? "0" : FormElement["EndWeight"]),
                    ValueType = Int32.TryParse(FormElement["ValueType"], out number) ? number : 0,
                    Value = Convert.ToDecimal(FormElement["Value"] == "" ? "0" : FormElement["Value"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    IsInternational = FormElement["IsInternational"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listRateSurchargeCommodity.Add(RateSurchargeCommodity);
                object datalist = (object)listRateSurchargeCommodity;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteRateSurchargeCommodity(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
    }
}
