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
using CargoFlash.Cargo.Model.Shipment;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    #region UNK Booking Class Description
    /*
	*****************************************************************************
	Class Name:		UNKBookingManagementWebUI      
	Purpose:		This Class used to Manage UNK Booking 
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Karan Kumar
	Created On:		16 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class UNKBookingManagementWebUI : BaseWebUISecureObject
    {
         int SNo = 0;

        //public object GetFlightRecord()
        //{
        //    object country = null;
        //    try
        //    {
        //        if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
        //        {
        //            FlightGridData countryList = new FlightGridData();
        //            object obj = (object)countryList;
        //            country = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
        //            this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                  

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    } return country;
        //}
        public UNKBookingManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "AWBSwapping";
                this.MyPrimaryID = "FlightNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public UNKBookingManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Shipment";
                this.MyAppID = "UNKBooking";
                this.MyPrimaryID = "UNKNo";
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
                    htmlFormAdapter.HeadingColumnName = "UNKBooking";

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
                            //htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            //htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
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
                          //  CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                           // BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            //BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                         //   CreateGrid(container);
                          
                            
                            break;
                        case DisplayModeNew:
                           // BuildFormView(this.DisplayMode, container);
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

            container.Append("<table class='WebFormTable'><tbody><tr><td class='formSection' colspan='4'>UNK Booking</td></tr></tbody></table>");

            //--------------------------
            container.Append("<div id='divAwbHeaderDetail''> <table class='appendGrid ui-widget' id='tblAWBDetail'><thead class='ui-widget-header'><tr><td class='ui-widget-header'>UNK Number</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>Dest</td><td class='ui-widget-header'>Pieces</td><td class='ui-widget-header'>Gr. Wt.</td><td class='ui-widget-header'>Vol. Wt.</td><td class='ui-widget-header'>CBM</td><td class='ui-widget-header'>Commodity</td><td class='ui-widget-header'>SHC</td><td class='ui-widget-header'>Booked Date/Time</td><td class='ui-widget-header'>AutoRelease Date/Time</td><td class='ui-widget-header'></td><td class='ui-widget-header'></td></tr></thead><tbody class='ui-widget-content'><tr id='tblSPHCSubClass_Row_4'><td class='ui-widget-content' colspan='1'><a href='#' onclick='getUNKDetail(1)'>D7-1234</a></td><td class='ui-widget-content' colspan='1'>15 Oct 2015</td><td class='ui-widget-content' colspan='1'>DEL</td><td class='ui-widget-content' colspan='1'>KUL</td><td class='ui-widget-content' colspan='1'>12</td><td class='ui-widget-content' colspan='1'>111.00</td><td class='ui-widget-content' colspan='1'>166.66</td><td class='ui-widget-content' colspan='1'>UU</td><td class='ui-widget-content' colspan='1'>GCR</td><td class='ui-widget-content' colspan='1'>GCR</td><td class='ui-widget-content' colspan='1'>GCR</td><td class='ui-widget-content' colspan='1'><input name='operation' class='btn btn-success' type='button' id='btnassign'  value='ASSIGN' onclick='getAssignAWB(1)'></td><td class='ui-widget-content' colspan='1'><input name='operation' class='btn btn-success' type='button' id='btndel'  value='DELETE UNK' onclick=''></td></tr></tbody></table></div>");

            container.Append("<div id='divUNKDetail' style='display: none;' style='width:100%'><table class='appendGrid ui-widget' id='tblAWBDetail'><thead class='ui-widget-header'><tr><td class='ui-widget-header'>Flight No</td><td class='ui-widget-header'>A/C Type</td><td class='ui-widget-header'>Origin</td><td class='ui-widget-header'>Dest</td><td class='ui-widget-header'>Flight No</td><td class='ui-widget-header'>ETD</td><td class='ui-widget-header'>ETA</td><td class='ui-widget-header'>PCS</td><td class='ui-widget-header'>Status</td></tr></thead><tbody class='ui-widget-content'><tr id='tblSPHCSubClass_Row_4'><td class='ui-widget-content' colspan='1'>SG-1234</td><td class='ui-widget-content' colspan='1'>A-330</td><td class='ui-widget-content' colspan='1'>DEL</td><td class='ui-widget-content' colspan='1'>SIN</td><td class='ui-widget-content' colspan='1'>20-Jun-15</td><td class='ui-widget-content' colspan='1'>1030</td><td class='ui-widget-content' colspan='1'>2020</td><td class='ui-widget-content' colspan='1'>40</td><td class='ui-widget-content' colspan='1'>KK</td></tr><tr id='tblSPHCSubClass_Row_5'><td class='ui-widget-content' colspan='1'>SG-1234</td><td class='ui-widget-content' colspan='1'>A-330</td><td class='ui-widget-content' colspan='1'>DEL</td><td class='ui-widget-content' colspan='1'>SIN</td><td class='ui-widget-content' colspan='1'>20-Jun-15</td><td class='ui-widget-content' colspan='1'>1030</td><td class='ui-widget-content' colspan='1'>2020</td><td class='ui-widget-content' colspan='1'>40</td><td class='ui-widget-content' colspan='1'>KK</td></tr></tbody></table></div>");


            container.Append("<div id='divAssignAWB' style='display: none;' style='width:500px'>AWB Number:- <input type='textbox' id='txtawb'><input name='operation' class='btn btn-success' type='button' id='btnsave'  value='Save' onclick=''></div>");

            //container.Append("<td  colspan='2'><div class='k-content k-state-active' style='height: auto; overflow: visible; display: block; opacity: 1;'><span id='spnSwapAWBDetail'></span></div></td><td  colspan='2'></td>");

            //container.Append("</tr><tr><td colspan='2'></td><td colspan='2'></td></tr><tr><td colspan='2'></td><td colspan='2'><input name='operation' class='btn btn-success' type='button' id='btnSwap'  value='Swap' onclick='SwapAWB();'> </td></tr></tbody></table></div>");

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
                    g.FormCaptionText = "UNK Booking";
                    g.CommandButtonNewText = "UNKBooking";
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ETDETA", Title = "ETDETA", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Dest", Title = "Dest", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AType", Title = "AType", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Route", Title = "Route", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TCapacity", Title = "Total Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ACapacity", Title = "Available Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UCapacity", Title = "Used Capacity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FStatus", Title = "Flight Status", DataType = GridDataType.String.ToString() });                 
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

    }
}
