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
using System.Collections;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{


    public class DetailsManagementWebUI : BaseWebUISecureObject

    {
        public DetailsManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "Details";
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

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "DETAILS";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetDetailsRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetDetailsRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetDetailsRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetDetailsRecord();
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

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
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
        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveDetailsDetail();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveDetailsDetail();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
               /* case DisplayModeUpdate:
                    UpdateDetails(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                    break;*/
                case DisplayModeDelete:
                    DeleteDetails(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Detail";
                    g.FormCaptionText = "Details";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Sno", Title = "Sno", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Full Name", DataType = GridDataType.String.ToString() });
                    
                    g.Column.Add(new GridColumn { Field = "PhoneNo", Title = "Phone Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DOB", Title = "Date Of Birth", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Gender", Title = "Gender", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Address", Title = "Address", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CitySno", Title = "City SNo", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmailId", Title = "Email", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                        //g.Column.Add(new GridColumn { Field = "CityCode", Title = "CityCode", DataType = GridDataType.String.ToString() });

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





        /* private void CreateGrid(StringBuilder Container)
         {
             using (Grid g = new Grid())
             {
                 g.Height = 400;
                 g.PageName = this.MyPageName;
                 g.PrimaryID = this.MyPrimaryID;
                 g.ModuleName = this.MyModuleID;
                 g.AppsName = this.MyAppID;
                 g.ServiceModuleName = MyModuleID;
                 g.UserID = this.MyUserID;
                 g.IsAllowedGrouping = true;
                 g.CommandButtonNewText = "New Detail";
                 g.FormCaptionText = "Details";
                 g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                 g.Column = new List<GridColumn>();
                 g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile Number", DataType = GridDataType.String.ToString() });
                 g.Column.Add(new GridColumn { Field = "DriverName", Title = "Driver Name", DataType = GridDataType.String.ToString() });
                 g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                 g.Column.Add(new GridColumn { Field = "LicenceNo", Title = "Licence No.", DataType = GridDataType.String.ToString() });
                 g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                 g.Action = new List<GridAction>();
                 g.Action.Add(new GridAction { ActionName = "READ", AppsName = this.MyAppID, CssClassName = "read", ModuleName = "Master" });
                 g.Action.Add(new GridAction { ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "edit", ModuleName = "Master" });
                 g.Action.Add(new GridAction { ActionName = "DELETE", AppsName = this.MyAppID, CssClassName = "trash", ModuleName = "Master" });
                 g.InstantiateIn(Container);
             }
         }*/


        private void SaveDetailsDetail()
        {
            try
            {
                List<Details> listDetails = new List<Details>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Details = new Details
                {
                    //SNo = Convert.ToInt32(FormElement["SNo"]),
                    // SNo=0,
                    Name = FormElement["Name"].ToString(),
                    PhoneNo = Convert.ToInt32(FormElement["PhoneNo"]),
                    DOB = Convert.ToDateTime(FormElement["DOB"]),
                    Gender = FormElement["Gender"] == "0" ? true : false,// Convert.ToBoolean(FormElement["Gender"]),
                    Address = FormElement["Address"].ToString(),
                    CitySno = Convert.ToInt32(FormElement["CitySno"]),
                    EmailId = FormElement["EmailId"].ToString(),
                    CityName = FormElement["CityName"].ToString(),
                    //CityCode = FormElement["CityCode"].ToString(),

                };
                listDetails.Add(Details);
                object datalist = (object)listDetails;
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










        /*  private void SaveDetails()
          {
              List<Details> listDetails = new List<Details>();
              //var FormElement = System.Web.HttpContext.Current.Request.Form;
              var Details = new Details
              {
                  //SNo = 0,
                  CitySno  = System.Web.HttpContext.Current.Request.Form["CitySno"],
                  Name = System.Web.HttpContext.Current.Request.Form["Name"].ToUpper(),
                  DOB=System.Web.HttpContext.Current.Request.Form["DOB"],
                  Gender= System.Web.HttpContext.Current.Request.Form["Gender"] == null ? true : System.Web.HttpContext.Current.Request.Form["Gender"] == "0",
                  EmailId = System.Web.HttpContext.Current.Request.Form["EmailId"].ToUpper(),
                  PhoneNo = System.Web.HttpContext.Current.Request.Form["PhoneNo"],
                  Address = System.Web.HttpContext.Current.Request.Form["Address"].ToUpper(),


                  //   IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == null ? true : System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                  //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                  // = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

              };
              listDetails.Add(Details);
              object datalist = (object)listDetails;
              DataOperationService(DisplayModeSave, datalist, MyModuleID);
          }
  */
        /* private void UpdateDetails(int RecordID)
         {
             List<DetailsSave> listDetailsUpdate = new List<DetailsSave>();
             var DetailsUpdate = new DetailsSave
             {
                 SNo = RecordID,
                 CitySNo = System.Web.HttpContext.Current.Request.Form["CitySNo"] == "" ? 0 : Convert.ToInt32(System.Web.HttpContext.Current.Request.Form["CitySNo"]),
                 Name = System.Web.HttpContext.Current.Request.Form["Name"].ToUpper(),

                 EMailID = System.Web.HttpContext.Current.Request.Form["EMailID"].ToUpper(),
                 Mobile = System.Web.HttpContext.Current.Request.Form["Mobile"],
                 Address = System.Web.HttpContext.Current.Request.Form["Address"].ToUpper(),
                 //Doubt 2 DOB and Gender

                 IsActive = System.Web.HttpContext.Current.Request.Form["IsActive"] == null ? true : System.Web.HttpContext.Current.Request.Form["IsActive"] == "0",
                 CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                 UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,

             };
             listDetailsUpdate.Add(DetailsUpdate);
             object datalist = (object)listDetailsUpdate;
             DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
         }*/
        /// <summary>
        /// Delete Details as per given recordid
        /// Created By : 
        /// Created On : 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteDetails(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        }


        public object GetDetailsRecord()
        {
            object Details = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Details DetailsList = new Details();
                    object obj = (object)DetailsList;
                    //retrieve Entity from Database according to the record
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    Details = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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

            }
            return Details;
        }











        /*  private object GetDetailsRecord()
          {
              object dp = null;
              if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
              {
                  Details dpList = new Details();
                  object obj = (object)dpList;

                  dp = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                  this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
              }
              else
              {
                  //Error Messgae: Record not found.
              }
              return dp;
          }*/
    }
}
