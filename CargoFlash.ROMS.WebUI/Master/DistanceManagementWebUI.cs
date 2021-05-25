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
    public class DistanceManagementWebUI : BaseWebUISecureObject
    {
         public DistanceManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Distance";
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


         public DistanceManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Distance";
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
                     htmlFormAdapter.HeadingColumnName = "RefNo";
                     switch (DisplayMode)
                     {
                         case DisplayModeReadView:
                             htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                             htmlFormAdapter.objFormData = GetDistanceRecord();
                             htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                             htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                             htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             //container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                             break;
                         case DisplayModeEdit:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                             htmlFormAdapter.objFormData = GetDistanceRecord();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());

                             //container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                             break;
                         case DisplayModeDuplicate:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.objFormData = GetDistanceRecord();
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
                             htmlFormAdapter.objFormData = GetDistanceRecord();
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
                     g.CommandButtonNewText = "New Airport Distance";
                     g.FormCaptionText = "Distance";
                     g.PrimaryID = this.MyPrimaryID;
                     g.PageName = this.MyPageName;
                     g.ModuleName = this.MyModuleID;
                     g.AppsName = this.MyAppID;
                     g.ServiceModuleName = this.MyModuleID;
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginAirportSNo", Title = "Origin Airport", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "DestinationAirportSNo", Title = "Destination Airport", DataType = GridDataType.String.ToString() });

                     g.Column.Add(new GridColumn { Field = "TDistance", Title = "Total Distance", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                     g.Aggregate = new List<GridAggregate>();
                     g.Aggregate.Add(new GridAggregate { Field = "OriginAirportSNo", Aggregate = "count" });
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


         public override void DoPostBack()
         {
             this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
             switch (OperationMode)
             {
                 case DisplayModeSave:
                     SaveDistance();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                     break;
                 case DisplayModeSaveAndNew:
                     SaveDistance();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                     break;
                 case DisplayModeUpdate:
                     UpdateDistance(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                     break;
                 case DisplayModeDelete:
                     DeleteDistance(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                     break;
             }
         }
         private object GetDistanceRecord()
         {
             object Distance = null;

             try
             {

                 if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                 {
                     Distance DistanceList = new Distance();
                     object obj = (object)DistanceList;
                     //retrieve Entity from Database according to the record
                     Distance = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

             } return Distance;
         }

         private void UpdateDistance(string RecordID)
         {


             List<Distance> listDistance = new List<Distance>();
             var FormElement = System.Web.HttpContext.Current.Request.Form;

             var Distance = new Distance
             {
                 SNo = Convert.ToInt32(RecordID),
                 OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"]),
                 DestinationAirportSNo = Convert.ToInt32((FormElement["DestinationAirportSNo"].ToString())),
                 TDistance =Convert.ToInt32(FormElement["TDistance"])

                 //Active = FormElement["Active"],
                 //IsActive = FormElement["IsActive"] == "0",
                 //UpdatedBy = Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),

             };
             listDistance.Add(Distance);
             object datalist = (object)listDistance;
             DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
         }


         private void SaveDistance()
         {


             List<Distance> listDistance = new List<Distance>();
             var FormElement = System.Web.HttpContext.Current.Request.Form;

             var Distance = new Distance
             {
                 //SNo = RecordID,
                 OriginAirportSNo=Convert.ToInt32(FormElement["OriginAirportSNo"]),
                 DestinationAirportSNo =Convert.ToInt32( FormElement["DestinationAirportSNo"]),
                 TDistance = Convert.ToInt32(FormElement["TDistance"])


                // CreatedBy = Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),


             };
             listDistance.Add(Distance);
             object datalist = (object)listDistance;
             DataOperationService(DisplayModeSave, datalist, MyModuleID);
         }




         private void DeleteDistance(string RecordID)
         {

             List<string> listID = new List<string>();
             listID.Add(RecordID.ToString());
             listID.Add(MyUserID.ToString());
             object recordID = (object)listID;
             DataOperationService(DisplayModeDelete, recordID, MyModuleID);
         }
    }
}
