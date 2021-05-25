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
    #region AWB Swapping Class Description
    /*
	*****************************************************************************
	Class Name:		AWBSwappingManagementWebUI      
	Purpose:		This Class used to get Swap AWB 
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Karan Kumar
	Created On:		23 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
   public class AWBSwappingManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetFlightRecord()
        {
            object country = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    FlightGridData countryList = new FlightGridData();
                    object obj = (object)countryList;
                    country = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                  

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return country;
        }
        public AWBSwappingManagementWebUI()
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
        public AWBSwappingManagementWebUI(Page PageContext)
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
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "AWBSwapping";

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

            container.Append("<table class='WebFormTable'><tbody><tr><td class='formSection' colspan='4'>AWB Swapping</td></tr><tr><td  title='Slab Title' class='formlabel'><span id='spnSlabTitle'> Enter AWB No</span></td><td class='formInputcolumn'><input name='txtAwbNo' tabindex='1' class='k-input' id='txtAwbNo' style='width: 100px; text-transform: uppercase;' type='text' maxlength='20' value='123-11111111' data-role='number'  data-valid='required' controltype='uppercase' autocomplete='off'></td><td title='Airline' class='formlabel'><span id='spnAirlineName'> Swap AWB No</span></td><td class='formInputcolumn' ><input name='txtSwapAwbNo' tabindex='1' class='k-input' id='txtSwapAwbNo' style='width: 100px; text-transform: uppercase;' type='text' maxlength='20' value='123-33333333' data-role='number' data-valid-msg='Slab Title cannot be blank' data-valid='required' controltype='uppercase' autocomplete='off'><input name='btnSearch' id='btnSearch' class='btn btn-success' type='button' value='Search' onclick='BindAWBSwap();'></td></tr></tbody></table>");

            //--------------------------
            container.Append("<div id='divAwbHeaderDetail''> <table class='WebFormTable'><tbody><tr ><td class='formSection' colspan='4'></td></tr><tr><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle' style='margin-left:5px'><b> Agent Name</b></span> - <span id='AgentName' controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>AWB Date</b></span> - <span id='AwbDate' controltype='uppercase'></span></td><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle'><b>Swap Agent Name</b></span> - <span id='SwapAgentName' controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>Swap AWB Date</b></span> - <span id='SwapAwbDate' controltype='uppercase'></span></td></tr><tr><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle' style='margin-left:5px'><b>Origin</b></span> - <span id='Origin'controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn' align='left'><span id='spnAirlineName'><b>Destination</b></span> - <span id='Destination' controltype='uppercase'></span></td><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle'><b>Swap Origin</b></span> - <span id='SwapOrigin'controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn' align='left'><span id='spnAirlineName'><b>Swap Destination</b></span> - <span id='SwapDestination' controltype='uppercase'></span></td></tr><tr><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle' style='margin-left:5px'><b>Pieces</b></span> - <span id='Pieces' controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>Gross Wt.</b></span> - <span id='GrossWt' controltype='uppercase'></span></td><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle'><b>Swap Pieces</b></span> - <span id='SwapPieces' controltype='uppercase'></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>Swap Gross Wt.</b></span> - <span id='SwapGrossWt' controltype='uppercase'></span></td></tr><tr><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle' style='margin-left:5px'><b>Volume Wt.</b></span> - <span id='VolumeWt' controltype='uppercase'></span></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>AWB No</b></span> - <span id='AWBNo' controltype='uppercase'></span></span></td><td title='Slab Title' class='formInputcolumn'><span id='spnSlabTitle'><b>Swap Volume Wt.</b></span> - <span id='SwapVolumeWt' controltype='uppercase'></span></span></td><td title='Airline' class='formInputcolumn'  align='left'><span id='spnAirlineName'><b>Swap AWB No</b></span> - <span id='SwapAWBNo' controltype='uppercase'></span></span></td></tr><tr><td class='formSection' colspan='2'>AWB Flight Plan Detail</td><td class='formSection' colspan='2'></td></tr>");

             container.Append("<tr><td  colspan='2'><div class='k-content k-state-active' style='height: auto; overflow: visible; display: block; opacity: 1;'><span id='spnAWBDetail'></span></div></td>");

            container.Append("<td  colspan='2'><div class='k-content k-state-active' style='height: auto; overflow: visible; display: block; opacity: 1;'><span id='spnSwapAWBDetail'></span></div></td><td  colspan='2'></td>");

            container.Append("</tr><tr><td colspan='2'></td><td colspan='2'></td></tr><tr><td colspan='2'></td><td colspan='2'><input name='operation' class='btn btn-success' type='button' id='btnSwap'  value='Swap' onclick='SwapAWB();'> </td></tr></tbody></table></div>");

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
                    g.FormCaptionText = "AWBSwapping";
                    g.CommandButtonNewText = "AWBSwapping";
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
