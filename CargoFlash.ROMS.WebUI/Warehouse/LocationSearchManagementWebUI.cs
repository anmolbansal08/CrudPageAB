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
using CargoFlash.Cargo.Model.Warehouse;
using System.Collections;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Warehouse
{
    public class LocationSearchManagementWebUI : BaseWebUISecureObject
    {
        public object GetWarehouseLocation()
        {
            object WarehouseLocation = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    WarehouseLocation typeist = new WarehouseLocation();
                    object obj = (object)typeist;
                    WarehouseLocation = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return WarehouseLocation;
        }
        public LocationSearchManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Warehouse";
                this.MyAppID = "WarehouseLocation";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public LocationSearchManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Warehouse";
                this.MyAppID = "WarehouseLocation";
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
                    htmlFormAdapter.HeadingColumnName = "WarehouseLocation";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetWarehouseLocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetWarehouseLocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetWarehouseLocation();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(BindPage());
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetWarehouseLocation();
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

        private StringBuilder BindPage()
        {
            StringBuilder container = new StringBuilder();
            container.Append(@"

<style type='text/css'>
    body {
        font-size: 11px;
    }
</style>

<div>
    <table width='100%' validateonsubmit='true' class='WebFormTable'>
        <tr>

            <td class='formlabel'>

                Terminal
            </td>
            <td>
                <input type='hidden' name='Terminal_Search' id='Terminal_Search' value=''>
                <input type='text' class='' name='Text_Terminal_Search' id='Text_Terminal_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                Airline
            </td>
            <td>
                <input type='hidden' name='Airline_Search' id='Airline_Search' value=''>
                <input type='text' class='' name='Text_Airline_Search' id='Text_Airline_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                SHC
            </td>
            <td>
                <input type='hidden' name='SHC_Search' id='SHC_Search' value=''>
                <input type='text' class='' name='Text_SHC_Search' id='Text_SHC_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
        </tr>
        <tr>

            <td class='formlabel'>
                Dest Country
            </td>
            <td>
                <input type='hidden' name='DestCountry_Search' id='DestCountry_Search' value=''>
                <input type='text' class='' name='Text_DestCountry_Search' id='Text_DestCountry_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                Dest City
            </td>
            <td>
                <input type='hidden' name='DestCity_Search' id='DestCity_Search' value=''>
                <input type='text' class='' name='Text_DestCity_Search' id='Text_DestCity_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                Agent/Forwarder

            </td>
            <td>
                <input type='hidden' name='AgentForwarder_Search' id='AgentForwarder_Search' value=''>
                <input type='text' class='' name='Text_AgentForwarder_Search' id='Text_AgentForwarder_Search' style='width:150px;' controltype='autocomplete' value=''>
            </td>
        </tr>
        <tr>
            <td class='formlabel'>
                Type of Location
            </td>
            <td>
                <input type='hidden' name='Location_Search' id='Location_Search' value=''>
                <input type='text' class='' name='Text_Location_Search' id='Text_Location_Search' data-valid='required' data-valid-msg='Enter Location' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                Search by
            </td>
            <td>
                <input type='hidden' name='Search' id='Search' value=''>
                <input type='text' class='' name='Text_Search' id='Text_Search' data-valid='required' data-valid-msg='Enter Location' style='width:150px;' controltype='autocomplete' value=''>
            </td>
            <td class='formlabel'>
                Search Text
            </td>
            <td>
                <input type='text' id='Text_SearchBy' name='Text_SearchBy' />

            </td>
        </tr>
        <tr>
            <td class='formlabel'></td>
            <td>
                <input type='button' style='font-size: 10px;' id='btnSearch' value='Excel Download' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' onclick='SearchData_Excel()' />
            </td>
            <td class='formlabel'></td>
            <td>" +
                //<input type='button' style='font-size: 10px;' id='btnSearch' value='Find Location' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' onclick='FindLocation()' />
           @" </td>
            <td class='formlabel'></td>
            <td><input type='button' style='font-size: 10px;' id='btnSearch' value='Search' class='ui-button ui-widget ui-state-default ui-corner-all ui-state-hover' onclick='SearchData_Data()' ></input></td>
        </tr>
        <tr>
            <td colspan='6'>
                <div id='divData'>
                    <table id='tblLocationSearch'></table>
                </div>
            </td>
        </tr>
    </table>
</div>
<div id='divSearchLocationUpdate'></div>
");
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
                        
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
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
                    g.CommandButtonNewText = "New Warehouse Location";
                    g.FormCaptionText = "Warehouse Location";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "LocationNo", Title = "Location No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Destination City", DataType = GridDataType.String.ToString() });
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
    }
}
