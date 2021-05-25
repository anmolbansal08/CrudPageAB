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

namespace CargoFlash.Cargo.WebUI.Shipment
{
    #region ULD Breakdown Class Description
    /*
	*****************************************************************************
	Class Name:		ULDBreakdownManagementWebUI      
	Purpose:		This Class used to get details of ULD Breakdown save update Search and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		23 oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    public class ULDBreakdownManagementWebUI : BaseWebUISecureObject
    {
        public object GetULDBreakdownRecord()
        {
            object ULDBreakdown = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULDBreakdown ULDBreakdownList = new ULDBreakdown();
                    object obj = (object)ULDBreakdownList;
                    ULDBreakdown = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return ULDBreakdown;
        }

        public ULDBreakdownManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "ULDBreakdown";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ULDBreakdownManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDBreakdown";
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
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(CreateULDBreakdownTable(htmlFormAdapter.InstantiateIn()));
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append("<div id='divULDBreakdown'></div><div id='divULDBreakdownAction'></div><div id='divULDBreakdownPopUp'  style='width:100%;top:0px;margin-top:0px;'></div><table id='tblULDBreakdownGrid' class='appendGrid ui-widget'></table><input id='hdncreatedBy' name='hdncreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input type='hidden' id='hdnULDSNo'/><input type='hidden' id='hdnIsCart'/>");
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
                            CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
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
                    g.FormCaptionText = "ULDBreakdown";
                    g.CommandButtonNewText = "New ULDBreakdown";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CountryName", Title = "Country Name", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Continent", Title = "Continent", DataType = GridDataType.String.ToString() });

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

        private StringBuilder CreateULDBreakdownTable(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append(@"<div id='divTab1'>
            <span id='spnULDBreakdown'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><div id='div'> "); strBuilder.Append(container); strBuilder.Append(@"</div><table id='tblULDBreakdown'></table></span></div> <div id='divOverview'></div> ");

            return strBuilder;
        }
    }
}
