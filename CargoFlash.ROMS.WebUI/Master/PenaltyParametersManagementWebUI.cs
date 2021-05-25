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
    public class PenaltyParametersManagementWebUI : BaseWebUISecureObject
    {
         public PenaltyParametersManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "PenaltyParameters";
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


         public PenaltyParametersManagementWebUI(Page PageContext)
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "PenaltyParameters";
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
                     StringBuilder strf = new StringBuilder();
                     htmlFormAdapter.Ischildform = true;
                     htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                     htmlFormAdapter.HeadingColumnName = "RefNo";
                     htmlFormAdapter.AuditLogColumn = "Text_PenaltyType,Text_CitySNo";
                     switch (DisplayMode)
                     {
                         case DisplayModeReadView:
                             htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                             htmlFormAdapter.objFormData = GetPenaltyParametersRecord();
                             htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                             htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                             htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             strf.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());
                         //    container.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                       //      container.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab'></table></span></div>");
                      
                             //container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                             break;
                         case DisplayModeEdit:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                             htmlFormAdapter.objFormData = GetPenaltyParametersRecord();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             strf.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeDuplicate:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.objFormData = GetPenaltyParametersRecord();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             strf.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeNew:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeDelete:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                             htmlFormAdapter.objFormData = GetPenaltyParametersRecord();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                              strf.Append("<div id='divPenaltyParametersSlab'><span id='spnPenaltyParametersSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnPenaltyParametersSlabSNo' name='hdnPenaltyParametersSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblPenaltyParametersSlab' Style='margin-top: 20px;'></table></span></div>");
                             htmlFormAdapter.Childform = strf.ToString();
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
                     g.CommandButtonNewText = "New Penalty Parameters";
                     g.FormCaptionText = "Penalty Parameters";
                     g.PrimaryID = this.MyPrimaryID;
                     g.PageName = this.MyPageName;
                     g.ModuleName = this.MyModuleID;
                     g.AppsName = this.MyAppID;
                     g.ServiceModuleName = this.MyModuleID;
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();
                     g.Column.Add(new GridColumn { Field = "PenaltyType", Title = "Penalty Type", DataType = GridDataType.String.ToString()});
                     g.Column.Add(new GridColumn { Field = "AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });

                  //   g.Column.Add(new GridColumn { Field = "CountrySNo", Title = "Country", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ProductSNo", Title = "Product", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Text_CountrySNo", Title = "Country", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Text_CitySNo", Title = "City", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Text_IsInternational", Title = "Applied On", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BasedOn", Title = "Based On", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MinimumCharge", Title = "Minimum charge", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "RefNo", Title = "Ref. No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                     g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                 
                    // g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    //  g.Aggregate = new List<GridAggregate>();
                    //  g.Aggregate.Add(new GridAggregate { Field = "PenaltyType", Aggregate = "count" });
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
                     SavePenaltyParameters();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                     break;
                 case DisplayModeSaveAndNew:
                     SavePenaltyParameters();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                     break;
                 case DisplayModeUpdate:
                     UpdatePenaltyParameters(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);

                     break;
                 case DisplayModeDelete:
                     DeletePenaltyParameters(Convert.ToString(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                     break;
             }
         }


         private object GetPenaltyParametersRecord()
         {
             object PenaltyParameters = null;

             try
             {

                 if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                 {
                     PenaltyParameters PenaltyParametersList = new PenaltyParameters();
                     object obj = (object)PenaltyParametersList;
                     //retrieve Entity from Database according to the record
                     PenaltyParameters = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

             } return PenaltyParameters;
         }

         private void UpdatePenaltyParameters(string RecordID)
         {


             var FormElement = System.Web.HttpContext.Current.Request.Form;
             List<PenaltyParametersSlab> listPenaltyParametersSlab = new List<PenaltyParametersSlab>();
             List<PenaltyParameters> listPenaltyParameters = new List<PenaltyParameters>();
             string[] values = FormElement["tblPenaltyParametersSlab_rowOrder"].ToString().Split(',');

             for (int count = 0; count < Convert.ToInt32(FormElement["tblPenaltyParametersSlab_rowOrder"].ToString().Split(',').Length); count++)
             {
                 //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                 listPenaltyParametersSlab.Add(new PenaltyParametersSlab()
                 {
                     SNo = 1,
                     PenaltyParameterSNo = 1,
                    // StartWeight = Convert.ToDecimal(FormElement["tblCommissionSlab_StartWeight_" + values[count]])
                     StartRange = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_StartRange_" + values[count]]),
                     EndRange = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_EndRange_" + values[count]]),
                     HdnBasedOn = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnBasedOn_" + values[count]]),
                     PenaltyCharge = Convert.ToDecimal(FormElement["tblPenaltyParametersSlab_PenaltyCharge_" + values[count]]),
                     HdnChargeBasis = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnChargeBasis_" + values[count]]),
                     HdnAppliedOn = FormElement["tblPenaltyParametersSlab_HdnAppliedOn_" + values[count]] == "" ? 255 : Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnAppliedOn_" + values[count]]),

                 }
                 );

             }

             var PenaltyParameters = new PenaltyParameters
             {
                 SNo= Convert.ToInt32(RecordID),

                 PenaltyType = FormElement["PenaltyType"] == "" ? 0 : Convert.ToInt32(FormElement["PenaltyType"]),
                 IsInternational = Convert.ToInt32(FormElement["IsInternational"]),
                 AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                 //   CountrySNo = FormElement["CountrySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CountrySNo"]),
                 ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                 AppliedOn = Convert.ToInt32(FormElement["AppliedOn"]),
                 ApplicableWeight = Convert.ToDecimal(FormElement["ApplicableWeight"]),
                 LocationBasis = FormElement["LocationBasis"] == "" ? 255 : Convert.ToInt32(FormElement["LocationBasis"]),
                 LocationBasisSNo = FormElement["LocationBasisSNo"] == "" ? 0 : Convert.ToInt32(FormElement["LocationBasisSNo"]),
                 //  ChargeBase = Convert.ToInt32(FormElement["ChargeBase"]),
                 //  PenaltyCharge = Convert.ToDecimal(FormElement["PenaltyCharge"]),
                 IsExceludeSHC = FormElement["IsExceludeSHC"] == "0" ? false : true,
                 //  IsExcludeAirport = FormElement["IsExcludeAirport"] == "0" ? false : true,
                 IsExcludeAgent = FormElement["IsExcludeAgent"] == "0" ? false : true,
                 SHCSNo = Convert.ToString(FormElement["SHCSNo"]),
                 //  AirportSNo = Convert.ToString(FormElement["AirportSNo"]),
                 AccountSNo = Convert.ToString(FormElement["AccountSNo"]),
                 CitySNo = FormElement["CitySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CitySNo"]),
                 CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
                 MinimumCharge = Convert.ToInt32(FormElement["MinimumCharge"]),
                 TaxOnPenalty = FormElement["TaxOnPenalty"] == "" ? 0 : Convert.ToInt32(FormElement["TaxOnPenalty"]),
                 ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                 ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),

                 IsActive = FormElement["IsActive"] == "1" ? true : false,
             

               //  CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                 PenaltyParametersSlab=listPenaltyParametersSlab,
                 UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                  CurrencySNo = FormElement["CurrencySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CurrencySNo"]),
                 Commodity = FormElement["Commodity"] == "" ? "" : Convert.ToString(FormElement["Commodity"]),
                 OtherAirlineSNo = FormElement["OtherAirlineSNo"] == "" ? "" : Convert.ToString(FormElement["OtherAirlineSNo"]),

                 // CreatedBy = Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),


             };
             listPenaltyParameters.Add(PenaltyParameters);
             object datalist = (object)listPenaltyParameters;
             DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
         }


         private void SavePenaltyParameters()
         {
             var FormElement = System.Web.HttpContext.Current.Request.Form;
             List<PenaltyParametersSlab> listPenaltyParametersSlab = new List<PenaltyParametersSlab>();
             List<PenaltyParameters> listPenaltyParameters = new List<PenaltyParameters>();
             string[] values = FormElement["tblPenaltyParametersSlab_rowOrder"].ToString().Split(',');
             for (int count = 0; count < Convert.ToInt32(FormElement["tblPenaltyParametersSlab_rowOrder"].ToString().Split(',').Length); count++)
             {
                 //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                 listPenaltyParametersSlab.Add(new PenaltyParametersSlab()
                 {
                     SNo = 1,
                     PenaltyParameterSNo=1,
                     StartRange = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_StartRange_" + values[count]]),
                     EndRange = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_EndRange_" + values[count]]),
                     HdnBasedOn = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnBasedOn_" + values[count]]),
                     PenaltyCharge = Convert.ToDecimal(FormElement["tblPenaltyParametersSlab_PenaltyCharge_" + values[count]]),
                     HdnChargeBasis = Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnChargeBasis_" + values[count]]),
                     HdnAppliedOn = FormElement["tblPenaltyParametersSlab_HdnAppliedOn_" + values[count]] == "" ? 255 : Convert.ToInt32(FormElement["tblPenaltyParametersSlab_HdnAppliedOn_" + values[count]]),

                    
                 }
                 );

             }
            

             var PenaltyParameters = new PenaltyParameters
             {
                 //SNo = RecordID,

                 PenaltyType = FormElement["PenaltyType"] == "" ? 0 : Convert.ToInt32(FormElement["PenaltyType"]),
                 IsInternational = Convert.ToInt32(FormElement["IsInternational"]),
                // AirlineSNo = FormElement["AirlineSNo"]==""? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                 AirlineSNo = FormElement["AirlineSNo"] == "" ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                 //   CountrySNo = FormElement["CountrySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CountrySNo"]),
                 ProductSNo = FormElement["ProductSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ProductSNo"]),
                 AppliedOn = Convert.ToInt32(FormElement["AppliedOn"]),
                 ApplicableWeight= Convert.ToDecimal(FormElement["ApplicableWeight"]),
                 LocationBasis = FormElement["LocationBasis"] == "" ? 255 : Convert.ToInt32(FormElement["LocationBasis"]),
                 LocationBasisSNo = FormElement["LocationBasisSNo"] == "" ? 0 : Convert.ToInt32(FormElement["LocationBasisSNo"]),
                 //ChargeBase = Convert.ToInt32(FormElement["ChargeBase"]),
               //  PenaltyCharge = Convert.ToDecimal(FormElement["PenaltyCharge"]),
                 IsExceludeSHC = FormElement["IsExceludeSHC"] == "0" ? false : true,
              //   IsExcludeAirport = FormElement["IsExcludeAirport"] == "0" ? false : true,
                 IsExcludeAgent = FormElement["IsExcludeAgent"] == "0" ? false : true,
                 SHCSNo= Convert.ToString(FormElement["SHCSNo"]),
               //  AirportSNo = Convert.ToString(FormElement["AirportSNo"]),
                 AccountSNo = Convert.ToString(FormElement["AccountSNo"]),
                 CitySNo = FormElement["CitySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CitySNo"]),
                 CountrySNo= Convert.ToInt32(FormElement["CountrySNo"]),
                MinimumCharge= Convert.ToInt32(FormElement["MinimumCharge"]),
                TaxOnPenalty = FormElement["TaxOnPenalty"] == "" ? 0 : Convert.ToInt32(FormElement["TaxOnPenalty"]),
                ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                 CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                 CurrencySNo = FormElement["CurrencySNo"] == "" ? 0 : Convert.ToInt32(FormElement["CurrencySNo"]),
                 Commodity = FormElement["Commodity"] == "" ? "" : Convert.ToString(FormElement["Commodity"]),
                 OtherAirlineSNo = FormElement["OtherAirlineSNo"] == "" ? "" : Convert.ToString(FormElement["OtherAirlineSNo"]),
                 PenaltyParametersSlab =listPenaltyParametersSlab

             };
             listPenaltyParameters.Add(PenaltyParameters);
             object datalist = (object)listPenaltyParameters;
             DataOperationService(DisplayModeSave, datalist, MyModuleID);
         }




         private void DeletePenaltyParameters(string RecordID)
         {

             List<string> listID = new List<string>();
             listID.Add(RecordID.ToString());
             listID.Add(MyUserID.ToString());
             object recordID = (object)listID;
             DataOperationService(DisplayModeDelete, recordID, MyModuleID);
         }
    }
}
