using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
namespace CargoFlash.Cargo.WebUI.Master
{
    public class HoldTypeManagementWebUI : BaseWebUISecureObject
     {
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

     public object GetRecordHoldType()
     {
         object HoldType = null;
         try
         {
             if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
             {
                 HoldType type = new HoldType();
                 object obj = (object)type;
                 //retrieve Entity from Database according to the record
                 IDictionary<string, string> qString = new Dictionary<string, string>();
                 qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                 HoldType = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

         } return HoldType;
     }

        public HoldTypeManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "HoldType";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public HoldTypeManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Master";
                this.MyAppID = "HoldType";
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
                    htmlFormAdapter.HeadingColumnName = "Hold_Type";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordHoldType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CreateHoldTypeTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordHoldType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateHoldTypeTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordHoldType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateHoldTypeTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateHoldTypeTransPage(htmlFormAdapter.InstantiateIn()));
                           
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordHoldType();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateHoldTypeTransPageUpdate(htmlFormAdapter.InstantiateIn()));
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

        public StringBuilder CreateHoldTypeTransPageUpdate(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            containerLocal.Append("<div id='div2'>");
            containerLocal.Append("<table class='WebFormTable' id='tblHoldTypeTrans'> <tbody>");
            containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("</div>");
            return containerLocal;
        }
        public StringBuilder CreateHoldTypeTransPage(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            containerLocal.Append("<div id='div2'>");
            containerLocal.Append("<table class='WebFormTable' id='tblHoldTypeTrans'> <tbody>");
            containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("</div>");
            return containerLocal;
        }
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Hold Type";
                    g.FormCaptionText = "Hold Type";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.DataSoruceUrl = "Services/Master/HoldTypeService.svc/GetGridData";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Hold_Type", Title = "Hold Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HoldTypeCode", Title = "Hold Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AutoHold", Title = "Auto Hold", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsAutoUnhold", Title = "Auto Unhold", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "HoldMessage", Title = "Hold Message", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UnHoldMessage", Title = "Un Hold Message", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RestrictChangeFinalization", Title = "Restrict Charges Finalization", DataType = GridDataType.String.ToString() });
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

        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveHoldType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveHoldType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateHoldType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteHoldType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private void SaveHoldType()
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<HoldType> listHoldType = new List<HoldType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                List<HoldTypeGridAppendGrid> e = js.Deserialize<List<HoldTypeGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                var HoldTypeTransSave = new HoldTypeTransSave
                {
                    Hold_Type = FormElement["Hold_Type"],
                    HoldTypeCode = FormElement["HoldTypeCode"],
                    HoldMessage = FormElement["HoldMessage"],
                    UnHoldMessage = FormElement["UnHoldMessage"],
                    IsAutoHold = FormElement["IsAutoHold"] == "0",
                    IsRestrictChangeFinalization = FormElement["IsRestrictChangeFinalization"] == "0",
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsAutoUnhold = FormElement["IsAutoUnHold"] == "0",
                    HoldTypeTransData = e,
                    ExcludeProduct = FormElement["ExcludeProduct"] == "" ? "" : (FormElement["ExcludeProduct"]).ToString(),
                    Airline = FormElement["Airline"] == "" ? "" : (FormElement["Airline"]).ToString()
                };

                object datalist = (object)HoldTypeTransSave;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }


        private void UpdateHoldType(string RecordID)
        {
            try
            {
                List<HoldType> listHoldType = new List<HoldType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<HoldTypeGridAppendGrid> e = js.Deserialize<List<HoldTypeGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));

                var HoldTypeTransSave = new HoldTypeTransSave
                {
                    SNo = Convert.ToInt32(RecordID),
                    Hold_Type = FormElement["Hold_Type"],
                    HoldTypeCode = FormElement["HoldTypeCode"],                     
                    HoldMessage = FormElement["HoldMessage"],
                    UnHoldMessage = FormElement["UnHoldMessage"],
                    IsAutoHold = FormElement["IsAutoHold"] == "0",
                    IsRestrictChangeFinalization = FormElement["IsRestrictChangeFinalization"] == "0",  
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsAutoUnhold = FormElement["IsAutoUnHold"] == "0",
                    HoldTypeTransData = e,
                    ExcludeProduct = FormElement["ExcludeProduct"] == "" ? "" : (FormElement["ExcludeProduct"]).ToString(),
                    Airline = FormElement["Airline"] == "" ? "" : (FormElement["Airline"]).ToString()
                };
                object datalist = (object)HoldTypeTransSave;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }

        private void DeleteHoldType(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

//        private StringBuilder CreateHoldTypeTab(StringBuilder container)
//        {
//            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
//            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
//            StringBuilder strBuilder = new StringBuilder();

//            strBuilder.Append(@"
//        <div id='MainDiv'>
//        <div id='ApplicationTabs'>
//            <ul>
//                <li  id='liAirCraft' onclick='javascript:AirCraftInventoryGrid();' class='k-state-active'>Aircraft Information</li>
//                <li id='liAirCraftInventoryPaxFactor' onclick='javascript:AirCraftInventoryPaxFactorGrid();'>Pax Factor Information</li>
//                <li id='liAirCraftDoor' onclick='javascript:AirCraftDoorTableGrid();'>Door Information</li>
//                <li id='liAirCraftULD' onclick='javascript:AirCraftULDGrid();'>ULD Information</li>
//                <li id='liAirCraftSPHC' onclick='javascript:AirCraftSPHCGrid();'>SHC Information</li>
//                <li id='liAirCraftPassengerCapacity' onclick='javascript:AirCraftPassengerCapacity();'>Passenger Capacity</li>
//              
//            </ul>
//            <div id='divTab1'> 
//              <span id='spnAirCraftInformation'>");
//            strBuilder.Append(container);
//            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventory'></table>");
//            strBuilder.Append(@"</span> 
//            </div>
//            <div id='divTab2' >
//            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div></div>");
//            return strBuilder;

//        }

//        private StringBuilder ViewHoldTypeTab(StringBuilder container)
//        {
//            //<li id='liAirCraftCapacity' onclick='javascript:AirCraftCapacityGrid();'>AirCraft Capacity Information</li>
//            //    <div id='divTab5'><table id='tblAirCraftCapacity'></table></div>
//            StringBuilder strBuilder = new StringBuilder();

//            strBuilder.Append(@"
//        <div id='MainDiv'>
//        <div id='ApplicationTabs'>
//            <ul>
//                <li  id='liAirCraft' onclick='javascript:AirCraftInventoryGrid();' class='k-state-active'>Aircraft Information</li>
//                <li id='liAirCraftInventoryPaxFactor' onclick='javascript:AirCraftInventoryPaxFactorGrid();'>Pax Factor Information</li>
//                <li id='liAirCraftDoor' onclick='javascript:AirCraftDoorTableGrid();'>Door Information</li>
//                <li id='liAirCraftULD' onclick='javascript:AirCraftULDGrid();'>ULD Information</li>
//                <li id='liAirCraftSPHC' onclick='javascript:AirCraftSPHCGrid();'>SHC Information</li>
//                <li id='liAirCraftPassengerCapacity' onclick='javascript:AirCraftPassengerCapacity();'>Passenger Capacity</li>
//              
//            </ul>
//            <div id='divTab1'> 
//              <span id='spnAirCraftInformation'>");
//            strBuilder.Append(container);
//            strBuilder.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventory'></table>");
//            strBuilder.Append(@"</span> 
//            </div>
//            <div id='divTab2' >
//            <span id='spnAirCraftInventoryPaxFactor'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnAirCraftSNo' name='hdnAirCraftSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='View'/><table id='tblAirCraftInventoryPaxFactor'></table></span></div><div id='divTab3'><table id='tblAirCraftDoor'></table></div><div id='divTab4'><table id='tblAirCraftULD'></table></div><div id='divTab5'><table id='tblAirCraftSPHC'></table></div><div id='divTab6'><div id='divAirCraftPassengerCapacity'></div><table id='tblAirCraftPassengerCapacity'></table></div>");
//            return strBuilder;

//        }
    }
}
