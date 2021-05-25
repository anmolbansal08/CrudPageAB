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
using System.Collections;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.SpaceControl;

namespace CargoFlash.Cargo.WebUI.SpaceControl
{
    public class FlightPlanManagementWebUI : BaseWebUISecureObject
    {
         public object GetRecordFlightPlan()
        {
            object FlightPlan = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    FlightPlan FlightPlanList = new FlightPlan();
                    object obj = (object)FlightPlanList;
                    FlightPlan = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return FlightPlan;
        }
         public FlightPlanManagementWebUI()
        {
            try
            {
                this.MyModuleID = "SpaceControl";
                this.MyAppID = "FlightPlan";
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
                    htmlFormAdapter.HeadingColumnName = "AWBNo";
                    switch (DisplayMode)
                    {
                        
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordFlightPlan();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
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
                        
                        case DisplayModeEdit:
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
                    g.FormCaptionText = "Flight Plan";
                    //g.CommandButtonNewText = "New Allocation";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AircraftType", Title = "Aircraft", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AllocationCode", Title = "Allocation Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OrginAirportName", Title = "OrginAirport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationAirportName", Title = "DestinationAirport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartDate", Title = "Start Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndDate", Title = "End Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNumber", Title = "Flight No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.Boolean.ToString() });
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
                    
                    case DisplayModeUpdate:
                        //UpdateFlightPlan(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
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
