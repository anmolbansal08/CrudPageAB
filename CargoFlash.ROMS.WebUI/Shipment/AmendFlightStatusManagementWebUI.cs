using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Schedule;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    public class AmendFlightStatusManagementWebUI : BaseWebUISecureObject
    {
         int SNo = 0;

        public AmendFlightStatusManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "AmendFlightStatus";
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
                    htmlFormAdapter.HeadingColumnName = "CountryName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            break;
                        case DisplayModeDuplicate:
                            break;
                        case DisplayModeEdit:
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("NEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            break;
                        default:
                            break;
                    }

                    //<input type='button' name='btnReset' value='Reset' id='btnReset' tabindex='8' class='btn btn-success' title='Reset'> 
                    container.Append(@"<table class='WebFormTable'><tr><td class'formActiontitle' align='center'><input type='button' value='Search Flight' text='Generate' class='btn btn-success' onClick='SearchFlight()' id='btnGenerate'> </td></tr></table>" +
                     "<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/> " +
                                        "<input id='hdnFSNo' type='hidden'/>" +
                                        "<input id='hdnDFCreated' type='hidden'/>" +
                                        "<input id='hdnDFAlreadyCreated' type='hidden'/>" +
                    "<div id='divFlightDetails'>&nbsp;&nbsp;</div ><table id='tblFlightOpen'></table><div style=height:10px' /><div >&nbsp;&nbsp;</div><table id='tblFlightReOpen'></table><div style=height:50px' /><div style=height:20px' />" +
                    "<div id='divShowCreatedFile' style='display:none'><table width='100%'><tr><td><strong><span id='spnCreatedFileMsg'></span></strong></td></tr><tr><td><span id='spnAlreadyCreatedFileMsg'></span></td></tr></table><div>" +
                    "<div id='divShowExcelFile' style='display:none'><input type='button' value='Download Flight Summary Details' text='Generate' class='btn btn-success' onClick='DownloadExcel()' id='btnExcelDownload' /><div>");
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
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
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
    }
}
