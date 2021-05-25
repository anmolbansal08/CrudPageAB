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

namespace CargoFlash.Cargo.WebUI.Schedule
{
    public class ViewEditFlightManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;
        public object ViewEditFlightRecord()
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

        public ViewEditFlightManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Schedule";
                this.MyAppID = "ViewEditFlight";
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
                    htmlFormAdapter.HeadingColumnName = "CountryName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            break;
                        case DisplayModeDuplicate:
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = ViewEditFlightRecord();
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
                            break;
                        default:
                            break;
                    }
                    container.Append(@"<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/> " +
                                        "<input id='FlightSearchValue' type='hidden' />"+
                                        "<input id='hdnFlightSumarySNo' type='hidden'/>"+
                                        "<input id='hdnDFSNo' type='hidden'/><input id='hdnDailyFlightAllotmentSNo' name='hdnDailyFlightAllotmentSNo' type='hidden' value='" + this.MyRecordID + "'/>" +


                    "</div><div id='divViewFlight' style='display:none width: 100%; height:400px; overflow: scroll;  '><table id='tblViewFlight' width='100%'><tr></tr></table></div><div style=height:10px' />" + "<div id='divEditFlight' style='display:none'> </div>");

                    container.Append(@"<div id='divappendgrid' style='width: 100%; overflow: scroll; display: none;'><table id='tblDailyFlightAllotment' ></table><input type='button' name='operation' value='Update All' class='btn btn-block btn-success btn-sm'><input type='button' class='btn btn-inverse' value='Cancel' onclick='CancelDetail()'></div>");
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
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            break;
                        case DisplayModeDuplicate:
                            break;
                        case DisplayModeReadView:
                            break;
                        case DisplayModeEdit:
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
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
                        break;
                    case DisplayModeSaveAndNew:
                        break;
                    case DisplayModeUpdate:
                        break;
                    case DisplayModeDelete:
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
