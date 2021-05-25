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
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.WebUI;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Rate
{
    #region RateSurchargeManagementWebUI Description
    /*
	*****************************************************************************
	Class Name:		RateSurchargeManagementWebUI   
	Purpose:		This Class used to get details of RateSurcharge save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Parvez Khan
	Created On:		5 APR 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class RateSurchargeManagementWebUI : BaseWebUISecureObject
    {
        public object GetRateSurcharge()
        {
            object RateSurcharge = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateSurcharge RateSurchargeList = new RateSurcharge();
                    object obj = (object)RateSurchargeList;
                    RateSurcharge = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return RateSurcharge;
        }
        public RateSurchargeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "RateSurcharge";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public RateSurchargeManagementWebUI(Page PageContext)
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
                this.MyAppID = "RateSurcharge";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Get Record from RateSurcharge
        /// </summary>
        /// <returns></returns>
        public object GetRecordRateSurcharge()
        {
            object rateSurcharge = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        RateSurcharge rateSurchargeList = new RateSurcharge();
                        object obj = (object)rateSurchargeList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        rateSurcharge = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //rateSurcharge = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        //this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return rateSurcharge;
        }


        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "SurchargeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRateSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateSurchargeSlab'><span id='spnRateSurchargeSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSurchargeSlabSNo' name='hdnRateSurchargeSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateSurchargeSlab'></table></span></div>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRateSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateSurchargeSlab'><span id='spnRateSurchargeSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSurchargeSlabSNo' name='hdnRateSurchargeSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateSurchargeSlab'></table></span></div>");
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRateSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateSurchargeSlab'><span id='spnRateSurchargeSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSurchargeSlabSNo' name='hdnRateSurchargeSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateSurchargeSlab'></table></span></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateSurchargeSlab'><span id='spnRateSurchargeSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSurchargSlabSNo' name='hdnRateSurchargeSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateSurchargeSlab'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRateSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateSurchargeSlab'><span id='spnRateSurchargeSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSurchargSlabSNo' name='hdnRateSurchargeSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateSurchargeSlab'></table></span></div>");
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
                    g.FormCaptionText = "Rate Surcharge";
                    g.CommandButtonNewText = "New Rate Surcharge";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SurchargeName", Title = "Surcharge Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_SurchargeTypeSNo", Title = "Surcharge Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OriginSNo", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ProductSNo", Title = "Product", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Text_ValidFrom", Title = "Valid From", DataType = GridDataType.DateTime.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Text_ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                    //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Editable", Title = "Editable", DataType = GridDataType.String.ToString() });
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
                        //SaveRateSurcharge();
                        SaveAndUpdateRateSurcharge(0);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        //else
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        //SaveRateSurcharge();
                        SaveAndUpdateRateSurcharge(0);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        //else
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        SaveAndUpdateRateSurcharge(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                  
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
      
        private void DeleteRateSurcharge(string RecordID)
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


        /// <summary>
        /// Save RateSurcharge record  
        /// call webservice to save that data in database
        /// </summary>
        private void SaveAndUpdateRateSurcharge(int RecordID)
        {
            try
            {
                //
                List<RateSurcharge> listRateSurcharge = new List<RateSurcharge>();
                List<RateSurchargeSlab> listRateSurchargeSlab = new List<RateSurchargeSlab>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblRateSurchargeSlab_rowOrder"].ToString().Split(',');

                for (int count = 0; count < Convert.ToInt32(FormElement["tblRateSurchargeSlab_rowOrder"].ToString().Split(',').Length); count++)
                {
                    listRateSurchargeSlab.Add(new RateSurchargeSlab()
                    {
                        SNo = 1,
                        StartWeight = Convert.ToDecimal(FormElement["tblRateSurchargeSlab_StartWeight_" + values[count]]),
                        EndWeight = Convert.ToDecimal(FormElement["tblRateSurchargeSlab_EndWeight_" + values[count]]),
                        BasedOn = Convert.ToInt32(FormElement["tblRateSurchargeSlab_BasedOn_" + values[count]]),
                        Amount = Convert.ToDecimal(FormElement["tblRateSurchargeSlab_Amount_" + values[count]]),
                        BasedONSNo = Convert.ToInt32(FormElement["tblRateSurchargeSlab_BasedOn_" + values[count]]),
                        
                    }
                    );

                }
                var rateSurcharge = new RateSurcharge
                {
                    SNo = RecordID == 0 ? 0 : RecordID,
                    SurchargeName = FormElement["SurchargeName"] == "" ? null : FormElement["SurchargeName"],
                    SurchargeTypeSNo = Convert.ToInt32(FormElement["SurchargeTypeSNo"]),
                    ProductSNo = Convert.ToInt32(FormElement["ProductSNo"] == "" ? "0" : FormElement["ProductSNo"]),
                    OriginSNo = Convert.ToInt32(FormElement["OriginSNo"]),
                    CommoditySNo = (FormElement["CommoditySNo"] == "" ? "0" : FormElement["CommoditySNo"]),
                    SHCSNo = (FormElement["SHCSNo"] == "" ? "0" : FormElement["SHCSNo"]),
                    IsActive = (FormElement["IsActive"]=="0"),  
                    Active="True",
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo =Convert.ToDateTime(FormElement["ValidTo"]),
                    RateSurchargeSlab = listRateSurchargeSlab,
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    ActionType =  this.FormAction.ToString().ToUpper().Trim(),
                    
                };
                listRateSurcharge.Add(rateSurcharge);
                object datalist = (object)listRateSurcharge;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
                {
                    
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
