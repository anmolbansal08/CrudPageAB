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
using System.Web;

namespace CargoFlash.Cargo.WebUI.ULD
{
    public class UldStackManagementWebUI : BaseWebUISecureObject
    {
        UldStackCombined uldStackCombined;
        public UldStackManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "UldStackSNo";
                this.MyModuleID = "Uld";
                this.MyAppID = "ULDStack";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public UldStackManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }

                this.MyPrimaryID = "UldStackSNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Uld";
                this.MyAppID = "UldStack";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Get Record from ManageTariff
        /// </summary>
        /// <returns></returns>
        public object GetRecordUldStack()
        {
            object UldStack = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        UldStack uldStackList = new UldStack();
                        object obj = (object)uldStackList;

                        UldStack = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
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
            return UldStack;
        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "BaseUldNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordUldStack();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("Delete", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", false);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divUldStack'><span id='spnUldStack'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnUldStackSNo' name='hdnUldStackSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table class='appendGrid ui-widget' id='tblUldStack'></table><table id='tblConsumable'></table><table  id=FlightDetails></table></div>"); ;
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordUldStack();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divUldStack'><span id='spnUldStack'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnUldSNo' name='hdnUldSNo' type='hidden'/><input id='hdnUldStackSNo' name='hdnUldStackSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table class='appendGrid ui-widget' id='tblUldStack'></table><table id='tblConsumable'></table><table  id=FlightDetails></table></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divUldStack'><span id='spnUldStack'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnUldSNo' name='hdnUldSNo' type='hidden'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table class='appendGrid ui-widget' id='tblUldStack'></table><table id='tblConsumable'></table><table  id=FlightDetails></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordUldStack();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divUldStack'><span id='spnUldStack'><input id='hdnUldSNo' name='hdnUldSNo' type='hidden'/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnUldStackSNo' name='hdnUldStackSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table class='appendGrid ui-widget' id='tblUldStack'></table><table id='tblConsumable'></table><table  id=FlightDetails></table></div>");
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

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
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
                        case DisplayModeDuplicate:
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New ULD Stack";
                    g.FormCaptionText = "ULD Stack";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    // g.IsProcessPart = true;
                    g.IsActionRequired = true;
                    //  g.IsSaveChanges = false;
                    g.SuccessGrid = "OnSuccessGrid";


                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "UldStackSNo", Title = "UldStackSNo", DataType = GridDataType.Number.ToString(), IsHidden = true });
                    //g.Column.Add(new GridColumn { Field = "UldStackSNo", Title = "Uld Stack SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "BaseUldNo", Title = "Base ULD", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CountOfStack", Template = "<a onclick=\"showChildUldStack(this)\" id=\"CountOfStack\" style=\"cursor:pointer;color:blue\">#=CountOfStack#</a>", Title = "Count Of Stack", DataType = GridDataType.Number.ToString() });
                    g.Column.Add(new GridColumn { Field = "ScaleWeight", Title = "Scale Weight (Kgs)", DataType = GridDataType.Decimal.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.DateTime.ToString() });

                    //g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.DateTime.ToString(), Template = "# if(CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });


                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.DateTime.ToString(), Template = "# if( CreatedOn==null) {# # } else {# #= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });




                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.DateTime.ToString() });


                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });


                    //g.Column.Add(new GridColumn { Field = "Status", Title = "Action", Template = "# if( Status==\"Details\") {#<a class=\"details label label-info\" title=\"Details\"><i class=\"fa fa-edit\"></i></a># } else {#<a class=\"closed label label-danger\" title=\"Closed\"><i class=\"fa fa-lock\"></i></a># } # <a class=\"removed label label-danger\" title=\"Remove\"><i class=\"fa fa-trash-o\"></i></a>", DataType = GridDataType.String.ToString(), Width = 55 });

                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString(), Template = "# if( FlightNo==\"\") {#<a onclick=\"assignFlightdateNFlightNo(this)\" id=\"ancFlightNo\" style=\"cursor:pointer;color:blue\">Assign</a># } else {#<a onclick=\"assignFlightdateNFlightNo(this)\" id=\"ancFlightNo1\" style=\"cursor:pointer;color:blue\">#=FlightNo#</a>#}#" });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.Date.ToString() });
 
                 // g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.DateTime.ToString(), Template = "# if(FlightDate==null) {# # } else {# #= kendo.toString(new Date(data.FlightDate.getTime() + data.FlightDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    //  g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString(), Template = "# if( FlightDate==\"\") {#<a onclick=\"assignFlightdateNFlightNo(this)\" id=\"ancFlightDate\" style=\"cursor:pointer;color:blue\">Assign</a># } else {#<a onclick=\"assignFlightdateNFlightNo(this)\" id=\"ancFlightDate1\" style=\"cursor:pointer;color:blue\">#=FlightDate#</a>#}#" });

                    //g.Column.Add(new GridColumn { Field = "Save", Title = "Save", DataType = GridDataType.String.ToString(), Width = 30, Template = "<input type=\"button\" class=\"btn btn-block btn-success btn-sm\" style=\"cursor:pointer\" value=\"Save\" onclick=\"SaveULDDetails(this)\" />" });

                    //#=AWBNo#

                    //g.Column.Add(new GridColumn { Field = "Y", Title = "Y", Template = "# if( Y==1) {#<input type=\"radio\" id=\"rbtnY\" value=\"Y\" onclick=\"MarkSelected(this);\"/># } else if(Y==2){#<input type=\"radio\" id=\"rbtnY\" value=\"Y\"  checked=\"1\" onclick=\"MarkSelected(this);\"/># } else {#<input type=\"radio\" id=\"rbtnY\" value=\"Y\" onclick=\"MarkSelected(this);\"/># } #", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "AirlineSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "Route", Title = "Route", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Column.Add(new GridColumn { Field = "OffPoint", Title = "OffPoint", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }
        //private StringBuilder CreateBaseUldStackGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //           // g.Height = 300;
        //           // g.PageName = this.MyPageName;
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.IsDisplayOnly = true;
        //           // g.DefaultPageSize = 100;
        //            g.IsAutoHeight = true;
        //            g.DataSoruceUrl = "Services/Uld/UldStackService.svc/BaseUldStackGrid";
        //            g.FormCaptionText = "ULD Stack Tare Weight";
        //           // g.PrimaryID = this.MyPrimaryID;
        //           // g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            //g.IsShowDelete = false;
        //            //g.IsShowEdit = false;
        //            g.IsPager = false;
        //            g.IsPagable = false;
        //            g.IsPagable = false;
        //            g.IsActionRequired = false;
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();
        //            g.Column.Add(new GridColumn { Field = "UldNo", Title = "UldNo", DataType = GridDataType.Number.ToString() });
        //            g.Column.Add(new GridColumn { Field = "TareWeight", Title = "Tare Weight", DataType = GridDataType.Decimal.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Owner", Title = "Owner", DataType = GridDataType.Number.ToString() });
        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //    return Container;
        //}
       
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                if (OperationMode.Contains("UPDATE"))
                    OperationMode = OperationMode.Replace("UPDATE", "EDIT");
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeEdit:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteUldStack(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
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

        /// <summary>
        /// Delete ManageTariff record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteUldStack(string RecordID)
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
    }
}
