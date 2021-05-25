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
using System.Configuration;


namespace CargoFlash.Cargo.WebUI.ULD
{
    public class CityWiseULDAllocationManagementWebUI : BaseWebUISecureObject
    {
        public object GetCityWiseULDAllocationRecord()
        {
            object Charges = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CityWiseULDAllocation ChargesList = new CityWiseULDAllocation();
                    object obj = (object)ChargesList;
                    Charges = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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
            }
            return Charges;
        }

        private DataTable GetCityWiseULDAllocationTransRecord()
        {
            object tariffforwardrateTrans = null;
            DataTable dtCreateTariffForwardRateTransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<CityWiseULDAllocationTrans> tariffforwardTransList = new List<CityWiseULDAllocationTrans>();
                object obj = (object)tariffforwardTransList;

                tariffforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "CityWiseULDAllocationTrans");
                dtCreateTariffForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<CityWiseULDAllocationTrans>)tariffforwardrateTrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateTariffForwardRateTransRecord;
        }

        public CityWiseULDAllocationManagementWebUI(Page PageContext)
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
                this.MyAppID = "CityWiseULDAllocation";
                this.MyPrimaryID = "ULDAllocationSNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public CityWiseULDAllocationManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "CityWiseULDAllocation";
                this.MyPrimaryID = "ULDAllocationSNo";
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
                    htmlFormAdapter.HeadingColumnName = "Text_Airport";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetCityWiseULDAllocationRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDAllocationTrans'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDAllocationTrans'></table></span></div>");
                            container.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
                           

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetCityWiseULDAllocationRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetCityWiseULDAllocationRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDAllocationTrans'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDAllocationTrans'></table></span></div>");
                            container.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divULDAllocationTrans'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnofficSNo' name='hdnofficSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDAllocationTrans'></table></span></div>");
                            container.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetCityWiseULDAllocationRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetCityWiseULDAllocationTransRecord();

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
            StringBuilder strContent = new StringBuilder();
            try
            {
                //Set the display Mode form the URL QuesyString.
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                //Match the display Mode of the form.
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                        strContent = CreateGrid(container);
                        break;
                    case DisplayModeDuplicate:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeEdit:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeNew:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeDelete:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
            return strContent;
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New";
                    g.FormCaptionText = "City Wise ULD Allocation";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowDelete = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDCode", Title = "ULD Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ContainerType", Title = "ULD Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CurrentStock", Title = "Current Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MinAllocation", Title = "Min Required", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MaxAllocation", Title = "Max Required", DataType = GridDataType.String.ToString() });

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

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveCityWiseULDAllocationTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCityWiseULDAllocationTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCityWiseULDAllocationTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteCityWiseULDAllocation(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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


        private void SaveCityWiseULDAllocationTrans()
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                List<CityWiseULDAllocationTrans> e = js.Deserialize<List<CityWiseULDAllocationTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                var formData = new CityWiseULDAllocationTransSave
                {
                    SNo = Convert.ToString(FormElement["SNo"] == "" ? "0" : FormElement["SNo"]),
                    Airline = Convert.ToInt32(FormElement["Airline"]),
                    Airport = Convert.ToString(FormElement["Airport"]),
                    Text_Airline = Convert.ToString(FormElement["Text_Airline"]),
                    Text_Airport = Convert.ToString(FormElement["Text_Airport"]),
                    EmailAddress = Convert.ToString(FormElement["EmailAddress"]),
                    EventTransData = e
                };
                object datalist = (object)formData;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }


        private void UpdateCityWiseULDAllocationTrans()
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                

                List<CityWiseULDAllocationTrans> e = js.Deserialize<List<CityWiseULDAllocationTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                
                //List<CityWiseULDAllocationTrans> e1 = e.ToList();
                var formData = new CityWiseULDAllocationTransSave
                {
                    SNo = System.Web.HttpContext.Current.Request.QueryString["RecID"],
                    Airline = Convert.ToInt32(FormElement["Airline"]),
                    Airport = Convert.ToString(FormElement["Airport"]),
                    Text_Airline = Convert.ToString(FormElement["Text_Airline"]),
                    Text_Airport = Convert.ToString(FormElement["Text_Airport"]),
                    EmailAddress = Convert.ToString(FormElement["EmailAddress"]),
                    EventTransData=e.ToList()
                };
                
                object datalist = (object)formData;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }


        private void DeleteCityWiseULDAllocation(string RecordID)
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

//        private StringBuilder TabNew()
//        {

//            StringBuilder strBuilder = new StringBuilder();
//            // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
//            strBuilder.Append(@"          
//            <div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='10'/><table class='WebFormTable'>");

//            if (FormAction != "READ")
//                strBuilder.Append(@"<div></div> <br></br><tr></tr>");
//            strBuilder.Append(@"<tr><td><table id='tblOfficeAirlineTrans' width='100%'></table></td></table></div>");
//            return strBuilder;
//        }
    }
}
