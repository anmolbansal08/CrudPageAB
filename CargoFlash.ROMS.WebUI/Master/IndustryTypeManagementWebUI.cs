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
    public class IndustryTypeManagementWebUI : BaseWebUISecureObject
    {

        public IndustryTypeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "IndustryType";
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


        public IndustryTypeManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "IndustryType";
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
                  htmlFormAdapter.HeadingColumnName = "IndustryTypeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetIndustryTypeRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetIndustryTypeRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            //container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetIndustryTypeRecord();
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
                            htmlFormAdapter.objFormData = GetIndustryTypeRecord();
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
                    g.CommandButtonNewText = "New Industry Type";
                    g.FormCaptionText = "Industry Type";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "IndustryTypeName", Title = "Industry Name", DataType = GridDataType.String.ToString(), IsGroupable = false, FooterTemplate = "Total Industry : <b>#=count#</b>" });
                    //g.Column.Add(new GridColumn { Field = "IndustryTypeName", Title = "IndustryTypeName", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IndustryTypeDesc", Title = "Description", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Aggregate = new List<GridAggregate>();
                    g.Aggregate.Add(new GridAggregate { Field = "IndustryTypeName", Aggregate = "count" });
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
                    SaveIndustryType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveIndustryType();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateIndustryType(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    
                    break;
                case DisplayModeDelete:
                    DeleteIndustryType(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private object GetIndustryTypeRecord()
        {
            object IndustryType = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    IndustryType IndustryTypeList = new IndustryType();
                    object obj = (object)IndustryTypeList;
                    //retrieve Entity from Database according to the record
                    IndustryType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return IndustryType;
        }



        private void DeleteIndustryType(int RecordID)
        {

            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }


        private void UpdateIndustryType(int RecordID)
        {
            List<IndustryType> listTravel = new List<IndustryType>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            var IndustryType = new IndustryType
            {
                SNo = RecordID,
                IndustryTypeName = FormElement["IndustryTypeName"],
                IndustryTypeDesc = FormElement["IndustryTypeDesc"] != string.Empty ? FormElement["IndustryTypeDesc"] : string.Empty,

                IsActive = FormElement["IsActive"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo

            };
            listTravel.Add(IndustryType);
            object datalist = (object)listTravel;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }


        private void SaveIndustryType()
        {

             List<IndustryType> TravelList = new List<IndustryType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
              var IndustryType = new IndustryType
        
            {
               
                IndustryTypeName = FormElement["IndustryTypeName"],
                IndustryTypeDesc = FormElement["IndustryTypeDesc"],


                IsActive = FormElement["IsActive"] == "0",
                IsDeleted = FormElement["IsDeleted"] == "0",
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
               

            };
            TravelList.Add(IndustryType);
            object datalist = (object)TravelList;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }

    }
}
