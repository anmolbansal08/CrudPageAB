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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.ULD
{
    #region ULDType Class Description
    /*
    *****************************************************************************
    Class Name:		ULDTypeManagementWebUI      
    Purpose:		This Class used to get details of ULDType save update and delete
    Company:		CargoFlash Infotech Pvt Ltd.
    Author:			Swati Rastogi.
    Created On:		19 Nov 2015
    Updated By:    
    Updated On:	
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    public class ULDTypeManagementWebUI : BaseWebUISecureObject
    {
        public object GetULDType()
        {
            object ULDType = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULDType typeist = new ULDType();
                    object obj = (object)typeist;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    ULDType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return ULDType;
        }
        public ULDTypeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDType";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ULDTypeManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDType";
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
                    htmlFormAdapter.HeadingColumnName = "ULDCode";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetULDType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetULDType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetULDType();
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
                            htmlFormAdapter.objFormData = GetULDType();
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
                        SaveULDType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveULDType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateULDType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteULDType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                    g.CommandButtonNewText = "New ULD Code";
                    g.FormCaptionText = "ULD Code";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ULDCode", Title = "ULD Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULdPalletType", Title = "ULD Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight (Kgs)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PivotWeight", Title = "Pivot Weight (Kgs)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight (Kgs)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight (Kgs)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Units", Title = "Measurement Unit", DataType = GridDataType.String.ToString() });
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
        private void SaveULDType()
        {
            try
            {
                List<ULDType> listtype = new List<ULDType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ULDType = new ULDType
                {
                    ULDCode = FormElement["ULDCode"],
                    ULDTypeSno = 0,//FormElement["ULDTypeSno"].ToString()==""?0:Convert.ToInt32(FormElement["ULDTypeSno"]),
                    RateClassSno = Convert.ToInt32(FormElement["RateClassSno"]),
                    GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"]),
                    Length = Convert.ToDecimal(FormElement["Length"]),
                    Width = Convert.ToDecimal(FormElement["Width"]),
                    Height = FormElement["Height"],
                    Unit = Convert.ToInt32(FormElement["Unit"]) == 0 ? 1 : 0,

                    EmptyWeight = FormElement["EmptyWeight"] == "" ? 0 : Convert.ToDecimal(FormElement["EmptyWeight"]),
                    PivotWeight = FormElement["PivotWeight"] == "" ? 0 : Convert.ToDecimal(FormElement["PivotWeight"]),

                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CommonDesignation = "",//FormElement["CommonDesignation"],
                    ULDdescription = FormElement["ULDdescription"],

                    ULdtype = Convert.ToInt32(FormElement["ULdType"]),
                    AirlineSno = Convert.ToInt32(FormElement["AirlineSno"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),

                };
                listtype.Add(ULDType);
                object datalist = (object)listtype;
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
        private void UpdateULDType(string RecordID)
        {
            try
            {
                List<ULDType> listtype = new List<ULDType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ULDType = new ULDType
                {
                    SNo = Convert.ToInt32(RecordID),
                    ULDCode = FormElement["ULDCode"],
                    GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"]),
                    VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"]),
                    Length = Convert.ToDecimal(FormElement["Length"]),
                    Width = Convert.ToDecimal(FormElement["Width"]),
                    Height = FormElement["Height"],
                    Unit = Convert.ToInt32(FormElement["Unit"]) == 0 ? 1 : 0,
                    EmptyWeight = Convert.ToDecimal(FormElement["EmptyWeight"]),
                    PivotWeight = Convert.ToDecimal(FormElement["PivotWeight"]),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    ULdtype = Convert.ToInt32(FormElement["IsULdtype"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CommonDesignation = "",//FormElement["CommonDesignation"],
                    AirlineSno = Convert.ToInt32(FormElement["AirlineSno"]),
                    ULDTypeSno = 0, //FormElement["ULDTypeSno"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["ULDTypeSno"]),
                    RateClassSno = Convert.ToInt32(FormElement["RateClassSno"]),
                    ULDdescription = FormElement["ULDdescription"],


                };
                listtype.Add(ULDType);
                object datalist = (object)listtype;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void DeleteULDType(string RecordID)
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
