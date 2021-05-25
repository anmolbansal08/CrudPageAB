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
  public class UWSPrintManagementWebUI: BaseWebUISecureObject
    { 
       
        //public object GetFlightTransfer1Record()
        //{
        //    object Flight = null;
        //    try
        //    {
        //        if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
        //        {
        //            CargoFlash.Cargo.Model.Shipment.FTGridData FTList = new CargoFlash.Cargo.Model.Shipment.FTGridData();
        //            object obj = (object)FTList;
        //            //retrieve Entity from Database according to the record
        //            Flight = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
        //            this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
        //        }
        //        else
        //        {
        //            //Error Messgae: Record not found.
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    return Flight;
        //}

        public UWSPrintManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "UwsPrint";
                this.MyPrimaryID = "FlightSNo";
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
                    htmlFormAdapter.HeadingColumnName = "UwsPrint";
                    switch (DisplayMode)
                    {                
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;                       
                        default:
                            break;
                    }
                   container.Append(@"<div id='divhtml'></div>");
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
                    case DisplayModeSaveAndNew:                      
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                   
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        //private StringBuilder CreateGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.FormCaptionText = "FlightTransfer";
        //            //g.CommandButtonNewText = "FlightTransfer";
        //            //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();

        //            g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "FlightDate", Title = "Flight Date", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ETD", Title = "ETD", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ETA", Title = "ETA", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Dest", Title = "Dest", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Atype", Title = "AType", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Route", Title = "Route", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "TCapacity", Title = "T Capacity", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ACapacity", Title = "A Capacity", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "UCapacity", Title = "U Capacity", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "FStatus", Title = "Status", DataType = GridDataType.String.ToString() });
        //            g.Action = new List<GridAction>();
        //            g.Action.Add(new GridAction { ButtonCaption = "Trans", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });

        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }
        //    return Container;
        //}
    }
}
