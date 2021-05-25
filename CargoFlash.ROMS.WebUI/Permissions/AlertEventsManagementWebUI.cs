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
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using CargoFlash.Cargo.WebUI;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Permissions
{
  public class AlertEventsManagementWebUI : BaseWebUISecureObject
  {
    public object GetRecordAlertEvents()
    {
      object AlertEvents = null;
      try
      {
        if (!DisplayMode.ToLower().Contains("NEW"))
        {
          if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
          {
            AlertEvents AlertEventsList = new AlertEvents();
            object obj = (object)AlertEventsList;
            IDictionary<string, string> qString = new Dictionary<string, string>();
            qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
            AlertEvents = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
            this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
          }
          else
          {
            //Error Messgae: Record not found.
          }
        }
      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
      }
      return AlertEvents;
    }

    public AlertEventsManagementWebUI()
    {

      try
      {
        this.MyPrimaryID = "SNo";
        this.MyModuleID = "Permissions";
        this.MyAppID = "AlertEvents";

      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        ErrorMessage = applicationWebUI.ErrorMessage;

      }
    }

    public AlertEventsManagementWebUI(Page PageContext)
    {
      try
      {
        if (this.SetCurrentPageContext(PageContext))
        {
          this.ErrorNumber = 0;
          this.ErrorMessage = "";
        }

        this.MyPrimaryID = "SNo";
        this.MyPageName = "Default.aspx";
        this.MyModuleID = "Permissions";
        this.MyAppID = "AlertEvents";
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
          StringBuilder strf = new StringBuilder();
          htmlFormAdapter.Ischildform = true;
          htmlFormAdapter.CurrentPage = this.CurrentPageContext;
          htmlFormAdapter.HeadingColumnName = "RefNo";
          switch (DisplayMode)
          {
            case DisplayModeReadView:
              htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
              htmlFormAdapter.objFormData = GetRecordAlertEvents();
              htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
              htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
              htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
              htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
              strf.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");
              htmlFormAdapter.Childform = strf.ToString();
              container.Append(htmlFormAdapter.InstantiateIn());


              //container.Append(htmlFormAdapter.InstantiateIn());
              //container.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");

              break;
            case DisplayModeDuplicate:
              htmlFormAdapter.DisplayMode = DisplayModeType.New;
              htmlFormAdapter.objFormData = GetRecordAlertEvents();
              htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

              strf.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");
              htmlFormAdapter.Childform = strf.ToString();
              container.Append(htmlFormAdapter.InstantiateIn());

              //container.Append(htmlFormAdapter.InstantiateIn());
              //container.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");

              break;
            case DisplayModeEdit:
              htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
              htmlFormAdapter.objFormData = GetRecordAlertEvents();
              htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
              strf.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");
              htmlFormAdapter.Childform = strf.ToString();
              container.Append(htmlFormAdapter.InstantiateIn());

              //container.Append(htmlFormAdapter.InstantiateIn());

              //  container.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");

              break;
            case DisplayModeNew:
              htmlFormAdapter.DisplayMode = DisplayModeType.New;
              htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
              strf.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");
              htmlFormAdapter.Childform = strf.ToString();
              container.Append(htmlFormAdapter.InstantiateIn());

              //  container.Append(htmlFormAdapter.InstantiateIn());
              //  container.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");

              break;
            case DisplayModeDelete:
              htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
              htmlFormAdapter.objFormData = GetRecordAlertEvents();
              htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

              strf.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");
              htmlFormAdapter.Childform = strf.ToString();
              container.Append(htmlFormAdapter.InstantiateIn());

              //  container.Append(htmlFormAdapter.InstantiateIn());
              //  container.Append("<div id='divAlertEventslab'><span id='spnAlertEventsSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAlertEventsSNo' name='hdnAlertEventsSNo' type='hidden' value='" + this.MyRecordID + "'/> <input id='hdnFormData' name='hdnFormData' type='hidden' value=''/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table></span></div>");

              break;
            default:
              break;
          }

          //    container.Append(@"<table id='tblRecipient' style='text-align: center'><div style=height:10px' /></table>");
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
          this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

          //Match the display Mode of the form.
          switch (this.DisplayMode)
          {
            case DisplayModeIndexView:
              CreateGrid(container);
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
            case DisplayModeDuplicate:
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
        ErrorMessage = applicationWebUI.ErrorMessage;

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
            SaveAlertEvents();
            if (string.IsNullOrEmpty(ErrorMessage))
              System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
            break;
          case DisplayModeUpdate:
            UpdateAlertEvents(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            if (string.IsNullOrEmpty(ErrorMessage))
              System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
            break;
          case DisplayModeSaveAndNew:
            SaveAlertEvents();
            if (string.IsNullOrEmpty(ErrorMessage))
              System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
            break;

          case DisplayModeDelete:
            DeleteAlertEvents(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            if (string.IsNullOrEmpty(ErrorMessage))
              System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
            break;
        }
      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        ErrorMessage = applicationWebUI.ErrorMessage;

      }
    }

    private StringBuilder CreateGrid(StringBuilder Container)
    {
      try
      {
        using (Grid g = new Grid())
        {
          g.CommandButtonNewText = "New Alert Event";
          g.FormCaptionText = "Alert Event";
          g.PrimaryID = this.MyPrimaryID;
          g.PageName = this.MyPageName;
          g.ModuleName = this.MyModuleID;
          g.AppsName = this.MyAppID;
          g.ServiceModuleName = this.MyModuleID;
          g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
          g.Column = new List<GridColumn>();

          g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
          g.Column.Add(new GridColumn { Field = "Text_OfficeSNo", Title = "Office Name", DataType = GridDataType.String.ToString() });
          g.Column.Add(new GridColumn { Field = "Text_AlertEventSNo", Title = "Alert Event", DataType = GridDataType.String.ToString() });
          g.InstantiateIn(Container);
        }
      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        ErrorMessage = applicationWebUI.ErrorMessage;
      }
      return Container;
    }

    private void SaveAlertEvents()
    {
      try
      {
        System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
        var FormElement = System.Web.HttpContext.Current.Request.Form;
        List<AlertEventsTrans> AppendGridData = js.Deserialize<List<AlertEventsTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));

        var formData = new AlertEventsPost
        {
          CitySNo = Convert.ToInt32(FormElement["CitySNo"] == "" ? "0" : FormElement["CitySNo"]),
          OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"] == "" ? "0" : FormElement["OfficeSNo"]),
          AirlineSNo = FormElement["AirlineSNo"],
          TransactionType = FormElement["TransactionType"],
          SPHCType = FormElement["SPHCType"],
          SPHCSNo = FormElement["SPHCCode"],
          SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"],
          AlertEventSNo = Convert.ToInt32(FormElement["AlertEventSNo"]),
          TriggerEventTypeSNo = Convert.ToInt32(FormElement["TriggerEventTypeSNo"]),  //Added By Shivam
          TriggerNameSNo = Convert.ToInt32(FormElement["TriggerNameSNo"]),
          Message = FormElement["Message"],
          Email = FormElement["Email"],
          CommoditySNo = FormElement["CommoditySNo"],
          UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
          IsActive = FormElement["IsActive"] == "0",
          TransData = AppendGridData,
        };

        object datalist = (object)formData;
        DataOperationService(DisplayModeSave, datalist, MyModuleID);
      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

      }

    }

    private void UpdateAlertEvents(string RecordID)
    {
      try
      {
        System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

        var FormElement = System.Web.HttpContext.Current.Request.Form;

        List<AlertEventsTrans> AppendGridData = js.Deserialize<List<AlertEventsTrans>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
        var formData = new AlertEventsPost
        {
          AlertSNo = Convert.ToInt32(RecordID),
          CitySNo = Convert.ToInt32(FormElement["CitySNo"] == "" ? "0" : FormElement["CitySNo"]),
          OfficeSNo = Convert.ToInt32(FormElement["OfficeSNo"] == "" ? "0" : FormElement["OfficeSNo"]),
          AirlineSNo = FormElement["AirlineSNo"],
          TransactionType = FormElement["TransactionType"],
          SPHCType = FormElement["SPHCType"],
          SPHCSNo = FormElement["SPHCCode"],
          SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"],
          AlertEventSNo = Convert.ToInt32(FormElement["AlertEventSNo"]),
          TriggerEventTypeSNo = Convert.ToInt32(FormElement["TriggerEventTypeSNo"]), //Added By Shivam
          TriggerNameSNo = Convert.ToInt32(FormElement["TriggerNameSNo"]),
          Message = FormElement["Message"],
          Email = FormElement["Email"],
          UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
          CommoditySNo = FormElement["CommoditySNo"],
          IsActive = FormElement["IsActive"] == "0",
          TransData = AppendGridData,
        };
        object datalist = (object)formData;
        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
      }
      catch (Exception ex)
      {
        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

      }
    }

    private void DeleteAlertEvents(string RecordID)
    {
      try
      {
        List<string> listID = new List<string>();
        listID.Add(RecordID);
        listID.Add(MyUserID.ToString());
        object recordID = (object)listID;
        DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        {
          //ErrorNumer
          //Error Message
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
