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
using CargoFlash.Cargo.Model.Roster;
using System.Collections;
using System.Web;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Roster
{
    public class RosterResourceAllocationManagementWebUI : BaseWebUISecureObject
    {
        public RosterResourceAllocationManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Roster";
                this.MyAppID = "RosterAllocation";
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
                    htmlFormAdapter.HeadingColumnName = "Employee";
                    switch (DisplayMode)
                    {
                        //case DisplayModeReadView:
                        //    htmlFormAdapter.objFormData = Getmployee();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        //    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        //    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        //    //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        //case DisplayModeDuplicate:
                        //    htmlFormAdapter.objFormData = Getmployee();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        //case DisplayModeEdit:
                        //    htmlFormAdapter.objFormData = Getmployee();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateHTML());
                            break;
                        case DisplayModeDelete:
                            //htmlFormAdapter.objFormData = Getmployee();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    //container.Append("<input id='hdnCity' name='hdnCity' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString() + "'");
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return container;
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
        //            g.CommandButtonNewText = "New Employee";
        //            g.FormCaptionText = "Employee";
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();
        //            g.Column.Add(new GridColumn { Field = "Name", Title = "Employee Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "DepartmentName", Title = "Department Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "DesignationName", Title = "Designation Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "TeamName", Title = "Team Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ContactNo", Title = "Contact No", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Address", Title = "Address", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });

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
                            //CreateGrid(container);
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

        public string CreateHTML()
        {
            string _html = string.Empty;
            _html = "<div id=\"scheduler\"></div>";
            return _html;
        }
    }
}
