using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.WebUI;
using CargoFlash.Cargo.Model.Shipment;

namespace CargoFlash.Cargo.WebUI.Shipment
{ 
    #region ScheduleManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		BookingManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Anand
	Created On:		12 May 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
   public class BookingManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>

       public BookingManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "Booking";
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
       /// Get information of individual Booking from database according record id supplied
       /// </summary>
       /// <returns>object type of entity Booking found from database return null in case if touple not found</returns>
       public object GetRecordBooking()
       {
           object Booking = null;
           try
           {
               if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
               {
                   CargoFlash.Cargo.Model.Schedule.Schedule ScheduleList = new CargoFlash.Cargo.Model.Schedule.Schedule();
                   object obj = (object)ScheduleList;
                   //retrieve Entity from Database according to the record
                   Booking = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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
           return Booking;
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
                   htmlFormAdapter.HeadingColumnName = "BookingType";
                   switch (DisplayMode)
                   {
                       case DisplayModeReadView:
                           htmlFormAdapter.objFormData = GetRecordBooking();
                           htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                           htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                           htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                           container.Append(CreateBookingTab(htmlFormAdapter.InstantiateIn()));
                           break;
                       case DisplayModeDuplicate:
                           htmlFormAdapter.objFormData = GetRecordBooking();
                           htmlFormAdapter.DisplayMode = DisplayModeType.New;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           container.Append(CreateBookingTab(htmlFormAdapter.InstantiateIn()));
                           break;
                       case DisplayModeEdit:
                           htmlFormAdapter.objFormData = GetRecordBooking();
                           htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           container.Append(CreateBookingTab(htmlFormAdapter.InstantiateIn()));
                           //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnScheduleSno' name='hdnScheduleSno' type='hidden' value='" + this.MyRecordID + "'/><table id='tblScheduleTrans'></table>");
                           break;
                       case DisplayModeNew:
                           htmlFormAdapter.DisplayMode = DisplayModeType.New;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           container.Append(CreateBookingTab(htmlFormAdapter.InstantiateIn()));
                           break;
                       case DisplayModeDelete:
                           htmlFormAdapter.objFormData = GetRecordBooking();
                           htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                           htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           container.Append(CreateBookingTab(htmlFormAdapter.InstantiateIn()));
                           break;
                       default:
                           break;
                   }
                   //if (this.FormAction.ToString().ToUpper().Trim() != "NEW")
                   //container.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnBookingSno' name='hdnBookingSno' type='hidden' value='" + this.MyRecordID + "'/><table id='tblBookingPieceWiseDetail'></table><div id='divDimension' style='display:none'><table><tr><td colspan='8'>Dimension Information</td></tr><tr><td>Volume Weight :</td><td></td><td>Total Pcs :</td><td></td><td>Added :</td><td></td><td>Remaining :</td><td></td></tr><tr><td colspan='8'><table id='tblDimension'></table></td></tr></table></div>");
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
       /// 
       /// </summary>
       /// <param name="container"></param>
       /// <returns></returns>
       private StringBuilder CreateBookingTab(StringBuilder container)
       {
           StringBuilder strBuilder = new StringBuilder();

           strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liBooking' class='k-state-active'>Booking Information</li>
                <li id='liFlight'>Flight</li>
                <li id='liShipperConsignee'>Shipper / Consignee</li>
                <li id='liSPHC'>SPHC</li>
                <li id='liHandling'>Handling</li>
            </ul>
            <div id='divTab1'> 
                <span id='spnBookingInformation'>");
           strBuilder.Append(container);
           strBuilder.Append(@"<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + @"'/><input id='hdnBookingSno' name='hdnBookingSno' type='hidden' value='" + this.MyRecordID + @"'/><table id='tblBookingPieceWiseDetail'></table>
                    <div id='divBack' style='display:none;position:absolute;left:0px;top:0px;width:100%;height:100%;z-index:99;background-color:transparant'></div><div id='divDimension' title='Dimension Information'><table width='470px' cellpadding='5px' cellspacing='0px'><tr><td style='border-bottom:1px solid #000000;'>Volume Weight :</td><td style='border-bottom:1px solid #000000;'></td><td style='border-bottom:1px solid #000000;'>Total Pcs :</td><td style='border-bottom:1px solid #000000;'></td><td style='border-bottom:1px solid #000000;'>Added :</td><td style='border-bottom:1px solid #000000;'></td><td style='border-bottom:1px solid #000000;'>Remaining :</td><td style='border-bottom:1px solid #000000;'></td></tr><tr><td colspan='8'>Unit <input type='radio' id='rbtnUnitCMS' name='rbtnUnit' value='0'/>CMS <input type='radio' id='rbtnUnitInch' name='rbtnUnit' value='1'/> Inch <table id='tblDimension'></table></td></tr></table>
                    </div>
                </span> 
            </div>
            <div id='divTab2' ><span id='spnFlight'></span></div>
            <div id='divTab3' ><span id='spnShipperConsignee'>
                <table id='tblShiiperConsignee' width='100%'>
                <tr><td class='formSection'></td><td class='formSection'>Shipper</td><td class='formSection'>Consignee</td></tr>
                <tr title='AccountNo'><td class='formlabel'>Account No.</td><td class='formInputcolumn'><input type='text' id='Shipper_AccountNo' name='Shipper_AccountNo' controltype='alphanumericupper' maxlength='25' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_AccountNo' name='Consignee_AccountNo' controltype='alphanumericupper' maxlength='25' style='width:175px'/></td></tr>
                <tr title='Name'><td class='formlabel'>Name</td><td class='formInputcolumn'><input type='text' id='Shipper_Name' name='Shipper_Name' controltype='uppercase' maxlength='50' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_Name' name='Consignee_Name' controltype='uppercase' maxlength='50' style='width:175px'/></td></tr>
                <tr title='Address'><td class='formlabel'>Address</td><td class='formInputcolumn'><textarea id='Shipper_Address' name='Shipper_Address' controltype='alphanumericupper' maxlength='200'/></textarea></td><td class='formInputcolumn' ><textarea id='Consignee_Address' name='Consignee_Address' controltype='alphanumericupper' maxlength='200'/></textarea></td></tr>
                <tr title='City'><td class='formlabel'>City</td><td class='formInputcolumn'><input type='text' id='Shipper_City' name='Shipper_City' controltype='uppercase' maxlength='3' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_City' name='Consignee_City' controltype='uppercase' maxlength='3' style='width:175px'/></td></tr>
                <tr title='State'><td class='formlabel'>State</td><td class='formInputcolumn'><input type='text' id='Shipper_State' name='Shipper_State' controltype='uppercase' maxlength='25' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_State' name='Consignee_State' controltype='uppercase' maxlength='25' style='width:175px'/></td></tr>
                <tr title='Country'><td class='formlabel'>Country</td><td class='formInputcolumn'><input type='text' id='Shipper_Country' name='Shipper_Country' controltype='uppercase' maxlength='25' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_Country' name='Consignee_Country' controltype='uppercase' maxlength='25' style='width:175px'/></td></tr>
                <tr title='Postal Code'><td class='formlabel'>Postal Code</td><td class='formInputcolumn'><input type='text' id='Shipper_PostalCode' name='Shipper_PostalCode' controltype='number' maxlength='6' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_PostalCode' name='Consignee_PostalCode' controltype='number' maxlength='6' style='width:175px'/></td></tr>
                <tr title='Phone No.'><td class='formlabel'>Phone No.</td><td class='formInputcolumn'><input type='text' id='Shipper_PhoneNo' name='Shipper_PhoneNo' controltype='number' maxlength='10' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_PhoneNo' name='Consignee_PhoneNo' controltype='number' maxlength='10' style='width:175px'/></td></tr>
                <tr title='Fax'><td class='formlabel'>Fax</td><td class='formInputcolumn'><input type='text' id='Shipper_Fax' name='Shipper_Fax' controltype='number' maxlength='10' style='width:175px'/></td><td class='formInputcolumn'><input type='text' id='Consignee_Fax' name='Consignee_Fax' controltype='number' style='width:175px' maxlength='10'/></td></tr>
                <tr title='Email'><td class='formlabel'>Email</td><td class='formInputcolumn'><input type='text' id='Shipper_Email' name='Shipper_Email' controltype='alphanumericlower' allowchar='@.' maxlength='50' style='width:175px'/></td><td class='formInputcolumn' style='width:150px'><input type='text' id='Consignee_Email' name='Consignee_Email' controltype='alphanumericlower' allowchar='@.' maxlength='50' style='width:175px'/></td></tr>
                </table>
            </span></div>
            <div id='divTab4'><span id='spnSPHC'><table id='tblBookingSPHC'></table></span></div>
            <div id='divTab5' ><span id='spnHandling'></span></div>
</div> </div>");
           return strBuilder;

           //position:fixed;border: solid 1px black; left: 50%; top: 50%; background-color: white; z-index: 999999;


       }
       /// <summary>
       /// Generate Booking web page from XML
       /// e.g from ~/HtmlForm/WebFormDefinitionBooking.xml
       /// </summary>
       /// <param name="container"></param>
       public StringBuilder CreateWebForm(StringBuilder container)
       {
           StringBuilder strContent = new StringBuilder();
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
                   g.CommandButtonNewText = "New Booking";
                   g.FormCaptionText = "Booking";
                   g.PrimaryID = this.MyPrimaryID;
                   g.PageName = this.MyPageName;
                   g.ModuleName = this.MyModuleID;
                   g.AppsName = this.MyAppID;
                   g.ServiceModuleName = this.MyModuleID;
                   g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                   g.Column = new List<GridColumn>();
                   //g.Column.Add(new GridColumn { Field = "ScheduleTypeName", Title = "Schedule Type", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "Text_CarrierCode", Title = "Carrier", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "Text_Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "Text_Destination", Title = "Dest", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "Routing", Title = "Routing", DataType = GridDataType.String.ToString() });
                   //g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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
       /// Insert new Booking record into the database
       /// Retrieve information from webform and store the same into modal object 
       /// call webservice to save that data into the database
       /// </summary>
       private void SaveBooking()
       {
           try
           {
               int number = 0;
               List<CargoFlash.Cargo.Model.Shipment.Booking> listBooking = new List<CargoFlash.Cargo.Model.Shipment.Booking>();
               var FormElement = System.Web.HttpContext.Current.Request.Form;
               var Booking = new CargoFlash.Cargo.Model.Shipment.Booking
               {
                   ////SNo =  0,
                   //ScheduleType = Int32.TryParse(FormElement["ScheduleType"], out number) ? number : 0,
                   //AirlineSNo = Int32.TryParse(FormElement["CarrierCode"].Split('-')[0], out number) ? number : 0,
                   //AWBCode = FormElement["CarrierCode"].Split('-')[1],
                   //CarrierCode = FormElement["CarrierCode"].ToUpper(),// NOT NULL,
                   //Text_CarrierCode = FormElement["Text_CarrierCode"].ToUpper(),// NOT NULL,
                   //FlightNumber = FormElement["FlightNumber"],
                   //FlightNo = FormElement["Text_CarrierCode"].ToUpper() + "-" + FormElement["FlightNumber"],
                   //Origin = Int32.TryParse(FormElement["Origin"], out number) ? number : 0,
                   //Text_Origin = FormElement["Text_Origin"].ToUpper(),// NOT NULL,
                   //Destination = Int32.TryParse(FormElement["Destination"], out number) ? number : 0,
                   //Text_Destination = FormElement["Text_Destination"].ToUpper(),// NOT NULL,
                   //IsCAO = FormElement["IsCAO"] == "0",
                   //CAO = FormElement["IsCAO"] == "0" ? "Yes" : "No",
                   //IsActive = FormElement["IsActive"] == "0",
                   //Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                   //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                   //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
               };
               listBooking.Add(Booking);
               object datalist = (object)listBooking;
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
       /// Update Booking record into the database 
       /// Retrieve information from webform and store the same into modal 
       /// call webservice to update that data into the database
       /// </summary>
       /// <param name="SrNo">Key column/attribute value which touple has be updated</param>
       private void UpdateBooking(string SrNo)
       {
           try
           {
               int number = 0;
               List<CargoFlash.Cargo.Model.Shipment.Booking> listBooking = new List<CargoFlash.Cargo.Model.Shipment.Booking>();
               var FormElement = System.Web.HttpContext.Current.Request.Form;
               var Booking = new CargoFlash.Cargo.Model.Shipment.Booking
               {
                   //SNo = Int32.TryParse(SrNo, out number) ? number : 0,
                   //ScheduleType = Int32.TryParse(FormElement["ScheduleType"], out number) ? number : 0,
                   //AirlineSNo = Int32.TryParse(FormElement["CarrierCode"].Split('-')[0], out number) ? number : 0,
                   //AWBCode =FormElement["CarrierCode"].Split('-')[1],
                   //CarrierCode = FormElement["CarrierCode"].ToUpper(),// NOT NULL,
                   //Text_CarrierCode = FormElement["Text_CarrierCode"].ToUpper(),// NOT NULL,
                   //FlightNumber = FormElement["FlightNumber"],
                   //FlightNo = FormElement["Text_CarrierCode"].ToUpper() + "-" + FormElement["FlightNumber"],
                   //Origin = Int32.TryParse(FormElement["Origin"], out number) ? number : 0,
                   //Text_Origin = FormElement["Text_Origin"].ToUpper(),// NOT NULL,
                   //Destination = Int32.TryParse(FormElement["Destination"], out number) ? number : 0,
                   //Text_Destination = FormElement["Text_Destination"].ToUpper(),// NOT NULL,
                   //IsCAO = FormElement["IsCAO"] == "0",
                   //CAO = FormElement["IsCAO"] == "0" ? "Yes" : "No",
                   //IsActive = FormElement["IsActive"] == "0",
                   //Active = FormElement["IsActive"] == "0" ? "Yes" : "No",
                   //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                   //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
               };
               listBooking.Add(Booking);
               object datalist = (object)listBooking;
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
       /// Delete Booking record from the database 
       /// call webservice to update that data into the database
       /// </summary>
       /// <param name="SrNo"></param>
       private void DeleteBooking(string SrNo)
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
           try
           {

           this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
           switch (OperationMode)
           {
               case DisplayModeSave:
                   SaveBooking();
                   if (string.IsNullOrEmpty(ErrorMessage))
                       System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                   break;
               case DisplayModeSaveAndNew:
                   SaveBooking();
                   if (string.IsNullOrEmpty(ErrorMessage))
                       System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                   break;
               case DisplayModeUpdate:

                   UpdateBooking(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                   if (string.IsNullOrEmpty(ErrorMessage))
                       System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                   break;

               case DisplayModeDelete:
                   DeleteBooking(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                   if (string.IsNullOrEmpty(ErrorMessage))
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
    }
}
