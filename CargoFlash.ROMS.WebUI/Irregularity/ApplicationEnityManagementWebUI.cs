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
using CargoFlash.Cargo.Model.Master;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;
using CargoFlash.Cargo.Model.Irregularity;

namespace CargoFlash.Cargo.WebUI.Irregularity
{
    public class ApplicationEnityManagementWebUI:BaseWebUISecureObject
    {
        public ApplicationEnityManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Irregularity";
                this.MyAppID = "ApplicationEntity";
                this.MyPrimaryID = "SNo";
                this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public ApplicationEnityManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Irregularity";
                this.MyAppID = "ApplicationEntity";
                this.MyPrimaryID = "SNo";
                this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    switch (DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return container;
        }
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    //g.CommandButtonNewText = "New Industry Type";
                    g.FormCaptionText = "Application Entity";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    //g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ApplicationCode", Title = "Application Code", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Application Setting : <b>#=count#</b>" });
                    g.Column.Add(new GridColumn { Field = "ApplicationName", Title = "Application Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Remarks", Title = "Description", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Aggregate = new List<GridAggregate>();
                    g.Aggregate.Add(new GridAggregate { Field = "ApplicationCode", Aggregate = "count" });
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

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ApplicationName";// "Application Entity Value List";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetApplicationEntityRecord();
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divApplicationEntityValueList'><span id='spnApplicationEntity'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnApplicationEntitySNo' name='hdnApplicationSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblApplicationEntityValueList' style='text-align:center'></table></span></div>");
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetApplicationEntityRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divApplicationEntityValueList'><span id='spnApplicationEntity'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnApplicationEntitySNo' name='hdnApplicationSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblApplicationEntityValueList' style='text-align:center'></table></span></div>");
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
        private object GetApplicationEntityRecord()
        {
            object applicationentity = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ApplicationEntity ApplicationEntity = new ApplicationEntity();
                    object obj = (object)ApplicationEntity;
                    //retrieve Entity from Database according to the record
                    applicationentity = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Message: Record not found.
                }

            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return applicationentity;
        }


       
    }
}
