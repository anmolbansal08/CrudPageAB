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

namespace CargoFlash.Cargo.WebUI.Master
{
    public class RouteManagementWebUI : BaseWebUISecureObject
    {
          public RouteManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Route";
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


          public RouteManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Route";
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
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
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
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


        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Routing";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRouteRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRouteRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            //container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRouteRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRouteRecord();
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

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Route";
                    g.FormCaptionText = "Route";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Routing", Title = "Routing", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Routing : <b>#=count#</b>" });
                    g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin Airport", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination Airport", DataType = GridDataType.String.ToString() });
                  //  g.Column.Add(new GridColumn { Field = "RoutePriority", Title = "RoutePriority", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "Direct", Title = "Direct", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Aggregate = new List<GridAggregate>();
                    g.Aggregate.Add(new GridAggregate { Field = "Routing", Aggregate = "count" });
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

      

        private object GetRouteRecord()
        {
            object Route = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Route RouteList = new Route();
                    object obj = (object)RouteList;
                    //retrieve Entity from Database according to the record
                    Route = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return Route;
        }
        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveRoute();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveRoute();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateRoute(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;
                case DisplayModeDelete:
                    DeleteRoute(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }


        private void DeleteRoute(int RecordID)
        {

            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }


        private void UpdateRoute(string RecordID)
        {

            string str = System.Web.HttpContext.Current.Request.Form["Routing"].ToString();
            string[] words = str.Split('-');
            List<string> list = new List<string>();
            string RouteMap = string.Empty;
            //foreach (string word in list)
            //{
            //   // list.AddRange(word.Split(new char[] { '-' }, 2));
            //}
            for (int i = 0; i < words.Length - 1; i++)
            {
                //for (int j = i; j < i + 1; j++)
                //{
                RouteMap = RouteMap + words[i] + "-" + words[i + 1] + "-" + (i + 1) + ",";
                //}
            }
            List<Route> listRoute = new List<Route>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;

            var Route = new Route
            {
                SNo = RecordID,
                Routing = FormElement["Routing"].ToString(),
                OriginAirportSNo = FormElement["OriginAirportSNo"].ToUpper(),
                DestinationAirportSNo = FormElement["DestinationAirportSNo"] != string.Empty ? FormElement["DestinationAirportSNo"].ToUpper() : string.Empty,
                RoutePriority = Convert.ToString(FormElement["Routing"].Length < 8 ? "1" : "2"),
                IsDirect = FormElement["Routing"].Length < 8 ? "1" : "0",
                IsActive = FormElement["IsActive"] == "0",
                //CreatedBy = 1,
                //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                 RouteMap = RouteMap.Remove(RouteMap.LastIndexOf(",")),
            };
            listRoute.Add(Route);
            object datalist = (object)listRoute;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }


        private void SaveRoute()
        {
            string str = System.Web.HttpContext.Current.Request.Form["Routing"].ToString();
            string[] words = str.Split('-');
            List<string> list = new List<string>();
            string RouteMap = string.Empty;
            //foreach (string word in list)
            //{
            //   // list.AddRange(word.Split(new char[] { '-' }, 2));
            //}
            for (int i = 0; i < words.Length - 1; i++)
            {
                //for (int j = i; j < i + 1; j++)
                //{
                RouteMap = RouteMap + words[i] + "-" + words[i + 1] + "-" + (i + 1) + ",";
                //}
            }
          //  RouteMap = RouteMap.Remove(RouteMap.LastIndexOf(","));

            List<Route> RouteList = new List<Route>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;


            var Route = new Route

            {

                Routing = FormElement["Routing"].ToString(),
                OriginAirportSNo = FormElement["OriginAirportSNo"].ToUpper(),
                DestinationAirportSNo = FormElement["DestinationAirportSNo"] != string.Empty ? FormElement["DestinationAirportSNo"].ToUpper() : string.Empty,
                RoutePriority =Convert.ToString(FormElement["Routing"].Length < 8 ? "1" : "2"),
                //IsDirect = Convert.ToString((FormElement["IsDirect"])),
                // IsDirect= FormElement["Text_Leg"].ToString() == "" ? "1" :"0",
                IsDirect = FormElement["Routing"].Length < 8 ? "1" : "0",
                IsActive = FormElement["IsActive"] == "0",
                //  IsDeleted = FormElement["IsDeleted"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
               // UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                RouteMap = RouteMap.Remove(RouteMap.LastIndexOf(",")),



            };
            RouteList.Add(Route);
            object datalist = (object)RouteList;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }


        private void DeleteRoute(string RecordID)
        {

            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }






    }
}
