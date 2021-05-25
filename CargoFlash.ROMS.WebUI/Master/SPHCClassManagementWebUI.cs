using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Master;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    
    public  class SPHCClassManagementWebUI : BaseWebUISecureObject
    {

        

        public SPHCClassManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "SPHCClass";
                this.MyPrimaryID = "SNo";
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

            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
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
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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
                using (Grid p = new Grid())
                {

                    p.PageName = this.MyPageName;
                    p.PrimaryID = this.MyPrimaryID;
                    p.ModuleName = this.MyModuleID;
                    p.AppsName = this.MyAppID;
                    p.CommandButtonNewText = "New DG Class";
                    p.FormCaptionText = "DG Class";

                    p.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    p.ServiceModuleName = this.MyModuleID;
                    p.Column = new List<GridColumn>();
                    p.Column.Add(new GridColumn { Field = "ClassName", Title = "Class Name", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "ClassDescription", Title = "Class Description", DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ClassDescription #\">#= ClassDescription #</span>" });
                    p.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    p.InstantiateIn(Container);
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
                    htmlFormAdapter.HeadingColumnName = "ClassName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordSPHCClass();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnSPHCClassSNo' name='hdnSPHCClassSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblSPHCSubClass'></table>");
                            container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSPHCClass();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<input id='hdnSPHCClassSNo' name='hdnSPHCClassSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><div id='divErrorPlacement'><ul id='ulError'></ul></div><table id='tblSPHCClass'></table>");
                            container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordSPHCClass();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<input id='hdnSPHCClassSNo' name='hdnSPHCClassSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnSPHCClassMode' name='hdnSPHCClassMode' type='hidden' value='New'/><input id='hdnClassName' name='hdnClassName' type='hidden' value=''/><input id='hdnClassDescription' name='hdnClassDescription' type='hidden' value=''/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><div id='divErrorPlacement'><ul id='ulError'></ul></div><table id='tblSPHCClass'></table>");
                            container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordSPHCClass();
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


        public StringBuilder ReadSPHCSubClassPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='SPHCDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liSPHCClass' class='k-state-active'>DG Class</li>
                <li id='liSPHCSubClass' onclick='javascript:SPHCClassGrid();'>DG Sub Class</li>
            </ul>
            <div id='divTab1' > 
              <span id='SPHCInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnAccountTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnSPHCClassSNo' name='hdnSPHCClassSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblSPHCSubClass'></table></span></div></div></div>");


            return containerLocal;
        }

        public StringBuilder CreateSPHCSubClassPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
           containerLocal.Append(@"
    <div id='SPHCDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liSPHCClass' class='k-state-active'>DG Class</li>
                <li id='liSPHCSubClass' onclick='javascript:SPHCClassGrid();'>DG Sub Class</li>
            </ul>
            <div id='divTab1' > 
              <span id='SPHCInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnAccountTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnSPHCClassSNo' name='hdnSPHCClassSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden'  value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSPHCSubClass'></table></span></div></div></div>");


            return containerLocal;
        }


        public override void DoPostBack()
        {

            try
            {
                //this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveSPHCClass();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSPHCClass();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateSPHCClass(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteSpecialHandlingCode(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }


        public object GetRecordSPHCClass()
        {
            object SPHCClass = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SPHCClass SPHCClassList = new SPHCClass();
                    object obj = (object)SPHCClassList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    SPHCClass = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return SPHCClass;
        }



        private void SaveSPHCClass()
        {
            try
            {
                List<SPHCClass> listSPHCClass = new List<SPHCClass>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SPHCClass = new SPHCClass
                {
                    ClassName = FormElement["ClassName"].ToUpper(),
                    ClassDescription = FormElement["ClassDescription"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };


                listSPHCClass.Add(SPHCClass);
                object datalist = (object)listSPHCClass;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
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
        private void UpdateSPHCClass(int RecordID)
        {

            try
            {
                List<SPHCClass> listSPHCClass = new List<SPHCClass>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var SPHCClass = new SPHCClass
                {
                    SNo = Convert.ToInt32(RecordID),
                    ClassName = FormElement["ClassName"].ToUpper(),
                    ClassDescription = FormElement["ClassDescription"],
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listSPHCClass.Add(SPHCClass);
                object datalist = (object)listSPHCClass;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {

                    //ErrorNumer
                    //Error Message
                }
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }


        }
        private void DeleteSpecialHandlingCode(string RecordID)
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
