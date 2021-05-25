using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Master;
namespace CargoFlash.Cargo.WebUI.Master
{
    #region AirlineManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		CommodityGroupManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Anand
	Created On:		12 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class CommodityGroupManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public CommodityGroupManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "CommodityGroup";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// Get information of individual CommodityGroup from database according record id supplied
        /// </summary>
        /// <returns>object type of entity CommodityGroup found from database return null in case if touple not found</returns>
        public object GetRecordCommodityGroup()
        {
            object CommodityGroup = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CommodityGroup CommodityGroupList = new CommodityGroup();
                    object obj = (object)CommodityGroupList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    CommodityGroup = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            } return CommodityGroup;
        }
        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "GroupName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordCommodityGroup();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           // htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommodityGroupSno' name='hdnCommodityGroupSno' type='hidden' value='" + this.MyRecordID + "'/><table id='tblCommoditySubGroup'></table>");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordCommodityGroup();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordCommodityGroup();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommodityGroupSno' name='hdnCommodityGroupSno' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><table id='tblCommoditySubGroup'></table>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordCommodityGroup();
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
        /// <summary>
        /// Generate CommodityGroup web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionCommodityGroup.xml
        /// </summary>
        /// <param name="container"></param>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {


                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            strContent = BuildFormView(this.DisplayMode, container);
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
        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
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
                    g.FormCaptionText = "Commodity Group";
                    g.CommandButtonNewText = "New Commodity Group";
                    g.IsShowDelete = false;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "StartRange", Title = "Master Item Number (Start Range)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndRange", Title = "Master Item Number (End Range)", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "GroupName", Title = "Group Name", DataType = GridDataType.String.ToString() });
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
        /// <summary>
        /// Insert new CommodityGroup record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveCommodityGroup()
        {
            try
            {
                int number = 0;
                List<CommodityGroup> listCommodityGroup = new List<CommodityGroup>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var CommodityGroup = new CommodityGroup
                {
                    //SNo =  0,
                    StartRange = FormElement["StartRange"]==string.Empty?"0000":FormElement["StartRange"],//Int32.TryParse(FormElement["StartRange"], out number) ? number : 0,
                    EndRange = FormElement["EndRange"] == string.Empty ? "0000" : FormElement["EndRange"],//Int32.TryParse(FormElement["EndRange"], out number) ? number : 0,
                    GroupName = FormElement["GroupName"].ToUpper(),// NOT NULL,
                    IsActive = FormElement["IsActive"] == "0",
                    Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listCommodityGroup.Add(CommodityGroup);
                object datalist = (object)listCommodityGroup;
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
        /// <summary>
        /// Update CommodityGroup record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="SrNo">Key column/attribute value which touple has be updated</param>
        private void UpdateCommodityGroup(string SrNo)
        {
            try
            {
                int number = 0;
                List<CommodityGroup> listCommodityGroup = new List<CommodityGroup>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var CommodityGroup = new CommodityGroup
                {
                    SNo = Int32.TryParse(SrNo, out number) ? number : 0,
                    StartRange = FormElement["StartRange"] == string.Empty ? "0000" : FormElement["StartRange"],//Int32.TryParse(FormElement["StartRange"], out number) ? number : 0,
                    EndRange = FormElement["EndRange"] == string.Empty ? "0000" : FormElement["EndRange"],//Int32.TryParse(FormElement["EndRange"], out number) ? number : 0,
                    GroupName = FormElement["GroupName"].ToUpper(),// NOT NULL,
                    IsActive = FormElement["IsActive"] == "0",
                    Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listCommodityGroup.Add(CommodityGroup);
                object datalist = (object)listCommodityGroup;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
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
        /// <summary>
        /// Delete CommodityGroup record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="SrNo"></param>
        private void DeleteCommodityGroup(string SrNo)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(SrNo);
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
        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveCommodityGroup();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveCommodityGroup();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateCommodityGroup(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteCommodityGroup(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }
    }
}
