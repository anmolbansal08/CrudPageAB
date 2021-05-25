using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Shipment;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    #region Flight Transfer Class Description
    /*
	*****************************************************************************
	Class Name:		FlightTransferManagementWebUI      
	Purpose:		This Class used to get details Dailyflight 
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Purushottam Kumar
	Created On:		19 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class FlightTransferManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetFlightRecord()
        {
            object Flight = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CargoFlash.Cargo.Model.Shipment.FlightGridData FTList = new CargoFlash.Cargo.Model.Shipment.FlightGridData();
                    object obj = (object)FTList;
                    //retrieve Entity from Database according to the record
                    Flight = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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
            return Flight;
        }

        public object GetFlightTransfer1Record()
        {
            object Flight = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CargoFlash.Cargo.Model.Shipment.FTGridData FTList = new CargoFlash.Cargo.Model.Shipment.FTGridData();
                    object obj = (object)FTList;
                    //retrieve Entity from Database according to the record
                    Flight = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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
            return Flight;
        }


        public FlightTransferManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "FlightTransfer";
                this.MyPrimaryID = "FlightSNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        //public FlightTransferManagementWebUI(Page PageContext)
        //{
        //    try
        //    {
        //        if (this.SetCurrentPageContext(PageContext))
        //        {
        //            this.ErrorNumber = 0;
        //            this.ErrorMessage = "";
        //        }
        //        this.MyPageName = "Default.aspx";
        //        this.MyModuleID = "Shipment";
        //        this.MyAppID = "FlightTransfer";
        //        this.MyPrimaryID = "FlightNo";
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //}
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "CountryName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            //htmlFormAdapter.objFormData = GetFlightRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            //htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            //htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<table id='xyz'><tr><td></td></tr></table>");
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnCountryVatSno' name='hdnCountryVatSno' type='hidden' value='" + ((CargoFlash.Cargo.Model.Master.Country)(htmlFormAdapter.objFormData)).SNo + "'/><table id='tblCountryVat'></table>");
                            break;
                        case DisplayModeDuplicate:
                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetFlightRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = GetFlightRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                           
                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<table id='xyz'><tr><td></td></tr></table>");
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCountryVatSno' name='hdnCountryVatSno' type='hidden' value='" + ((CargoFlash.Cargo.Model.Master.Country)(htmlFormAdapter.objFormData)).SNo + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblCountryVat'></table>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = GetCountryRecord();
                            //htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append(@"<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/> " +
                                        "<input id='FlightSearchValue' type='hidden' />"+
                                        "<input id='hdnFlightSumarySNo' type='hidden'/>"+
                                        "<input id='hdnDFSNo' type='hidden'/>" +
                                        "<input id='hdnSameFlightSNo' type='hidden' value=''/>" +
                    "<div >&nbsp;&nbsp;</div><table id='tblFlightSearch'><div style=height:10px' /></table><div >&nbsp;&nbsp;</div>"+
                    "<div >&nbsp;&nbsp;</div><table  class='WebFormTable' id='tblFilter'><tr><td class='formlabel'>Filter Flight</td><td class='formInputcolumn'><select id='FilterSort' style='text-transform: uppercase;' onChange='FlightTransferGrid();' >  <option value='1'>FIFO</option><option value='2'>SPHC</option><option value='3'>YIELD</option><option value='4'>Transit</option></select></td><td  class='formlabel'>Keep Same Flight</td><td class='formInputcolumn'><input id='sameflight' type='checkbox' onClick='BindSameDropDownList()' /></td></tr></table>" +
                    "<table id='tblFlightTransfer1'></table><div id='divFlightSummary' style='display:none'><table id='tblFlightSummary'></table>");
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
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                           //strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                           // BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            //BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                           // BuildFormView(this.DisplayMode, container);
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
            return strContent;
        }
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                      
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        //UpdateCountry(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        //DeleteCountry(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
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
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "FlightTransfer";
                    //g.CommandButtonNewText = "FlightTransfer";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ETD", Title = "ETD", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Dest", Title = "Dest", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Atype", Title = "AType", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Route", Title = "Route", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TCapacity", Title = "T Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ACapacity", Title = "A Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UCapacity", Title = "U Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FStatus", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "Trans", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });

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

        //public StringBuilder FlightTransferDetailsPage(StringBuilder container)
        //{
        //    //StringBuilder containerLocal = new StringBuilder();

        //    return containerLocal;
        //}
      
    }
}
