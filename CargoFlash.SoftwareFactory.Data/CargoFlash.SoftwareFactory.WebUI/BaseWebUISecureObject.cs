using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Xml;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using System.Net;
using System.Runtime.Serialization;
using System.Collections;
using System.Web;
using System.Text.RegularExpressions;
using System.Web.UI.HtmlControls;
using System.ServiceModel;
using System.Linq;
using System.ComponentModel;
using System.Reflection;
using System.Globalization;
using Excel = Microsoft.Office.Interop.Excel;
using System.Runtime.InteropServices;
using System.IO;
using Newtonsoft.Json;
using System.Runtime.Serialization.Formatters.Binary;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;

namespace CargoFlash.SoftwareFactory.WebUI
{
    #region BaseWebUISecureObject Class Description

    /*
	*****************************************************************************
	Class Name:		BaseWebUISecureObject      
	Purpose:		This is abstract class, provides common WebUI Functionality and Attributes.
                    that is use in implemented WebUIs Classes.
                    its contains  virtual methods and private methods
                    implements in the diffrent WebUI object.					
	Company:		CargoFlash 
	Author:			Manish Kumar
	Created On:		09 Dec 2008
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    /// <summary>
    /// This is abstract class, provides common WebUI Functionality and Attributes.
    /// that is use in implemented WebUIs Classes.
    /// its contains public, virtual methods and private methods
    /// implements in the diffrent WebUI object.
    /// </summary>
    public abstract class BaseWebUISecureObject : IDisposable
    {
        #region Constant Variables
        //***********************************************************************       
        //Constant variables related the webUI class object.
        protected const string DisplayModeReadView = "FORMACTION.READ";//Store the DisplayModeReadOnly variable
        protected const string DisplayModeIndexView = "FORMACTION.INDEXVIEW";//Store the DisplayModeIndexView variable
        protected const string DisplayModeEdit = "FORMACTION.EDIT";//Request Only.. Store the DisplayModeEdit variable
        protected const string DisplayModeNew = "FORMACTION.NEW";//Request Only.. Store the DisplayModeNew variable      
        protected const string DisplayModeUpdate = "FORMACTION.UPDATE";//Postback Only.. Store the DisplayModeUpdate variable
        protected const string DisplayModeDelete = "FORMACTION.DELETE";//Postback Only. Store the DisplayModeDelete variable
        protected const string DisplayModeIndexViewDelete = "FORMACTION.INDEXVIEWDELETE";//Postback Only.. Store the DisplayModeIndexViewDelete variable
        protected const string DisplayModeDetailViewDelete = "FORMACTION.DETAILVIEWDELETE";//Postback Only.. Store the DisplayModeDelete variable
        protected const string DisplayModeSave = "FORMACTION.SAVE";//Postback Only.. Store the DisplayModeSave variable
        protected const string DisplayModeCancel = "FORMACTION.CANCEL";//Postback Only.. Store the DisplayModeCancel variable 
        protected const string DisplayModeDuplicate = "FORMACTION.DUPLICATE";//Request Only.. Store the DisplayModeDuplicate variable 
        protected const string DisplayModeSaveAndNew = "FORMACTION.SAVE & NEW";//Postback Only.. Store the DisplayModeDuplicate variable 
        protected const string DisplayModePrint = "FORMACTION.PRINT";//Store the DisplayModeReadOnly variable
        protected const string DisplayModeOpen = "FORMACTION.OPEN";//Request Only.. Store the DisplayModeNew variable      
        protected const string DisplayModeUploadDocument = "FORMACTION.UPLOAD DOCUMENT";//Postback Only.. Store the DisplayModeUploadDocument variable 
        protected const string DisplayModeDownload = "FORMACTION.DOWNLOAD";//Postback Only.. Store the DisplayModeDownload variable 
        protected string CurrentDisplayMode = string.Empty;//Store the CurrentDisplayMode
        protected const string DisplayModeSearch = "FORMACTION.SEARCH";//Request Only.. Store the DisplayModeNew variable    
        //***********************************************************************
        #endregion

        #region Properties Related Variables
        //***********************************************************************       
        //Local Internal Properties Variables
        public string DisplayMode = "";
        public string OperationMode = "";
        private string _ErrorMessage;//Store _ErrorMessage Properties
        private int _ErrorNumber = 0;//Store _ErrorNumber Properties
        private string _DefaultErrorMessage;//Store _DefaultErrorMessage Properties
        private string _LoginPage = string.Empty;//Store _LoginPage Properties
        private string _MyConnectionString = string.Empty;//Store _MyConnectionString Properties
        private string _MyDateFormat = "";//Store _MyDateFormat Properties
        private string _MyDateFormatText = "";//Store _MyDateFormatText Properties
        private Page _CurrentPageContext = null;//Store _CurrentPageContext Properties
        private string _MyPageName = "Default.aspx";//Store the current page name		
        //***********************************************************************       
        private string _NewCommandText = "New";//Store the current _NewCommandText
        private string _NewServiceCommandText = "New Service";//Store the current _NewCommandText 
        private string _CustomeFormAction = string.Empty;
        private string _CustomColumnName = "";
        private string _CaptionGridRowCssClass = "CaptionGridRow";


        private string _RequestColumnName = string.Empty;//Store the current _RequestColumnName
        private string _RequestURL = string.Empty;//Store the current _RequestURL
        private string _ChildWhereString = string.Empty;//Store the current _ChildWhereString
        private string _ExtendControl = "EXT_";//Store the current _ExtendControl
        private string _MyParentClassID = "";//Store the current _MyParentClassID
        private bool _IsChildApplication = false;//Store the current _IsChildApplication
        private bool _IsLookupSearch = false;//Store the current _IsLookupSearch
        private bool _IsClientIDRequire = true;//Store the current _IsClientIDRequire
        private string _TotalPageSize = "";//Store the current _TotalPageSize
        private string _RelatedObjectName = string.Empty;//Store the current _RelatedObjectName    
        private bool _IsNewButtonAllow = true;
        private bool _IsCheckBoxAllow = true;
        private bool _IsNewServiceButton = false;
        private bool _IsHyperLinkAllow = true;
        private bool _IsPrintButton = false;
        private string _PrintURL = "";
        private string _PrintText = "Print";
        private string _GridViewActionCssClass = "100px";
        public string FormAction { get; set; }
        //***********************************************************************       
        #endregion

        #region Local Variables
        //***********************************************************************       
        //Local Variables			
        protected string MyClassName = "";//Store the MyClassName
        protected string MyModuleID = "";//Store the Current ModuleID
        protected string MyAppID = "";//Store the Current ApplicationID
        protected string MyFormName = "";//Store the current Form Name	
        protected string MyRecordID = "";	//Store the RecordID

        protected Int64 MyChildRecordID = 0;	//Store the RecordID 
        protected bool IsWorkSpaceActive = false;//Set the IsWorkspaceActive is false
        protected char DelimiterCharactor = '-';//Store the split charactor 
        protected string WhereCondition = string.Empty;//Prepare the wherecondition
        protected string ErrorDescription = string.Empty;//Store the ErrorDescription
        protected string MySessionID = string.Empty;//Store the current sessionID
        protected Int64 MyClientID;//Store the current clientID
        protected Int64 MyUserID;//Store the current clientID
        protected string MyRemoteIP = string.Empty;//Store the RemoteID from the ClientMachine
        protected string MyRemoteCookie = string.Empty;//Store the Cookie form the client Machine
        protected Int32 Success = 0;//Store Success
        protected Int32 Failed = 1;//Store Failed      
        protected DateTime Date;//
        //***********************************************************************       
        //Variables used to store values from Page.Request object which are part of querystring
        private string RequestModuleID = string.Empty;//Store the RequestModule
        private string RequestAppID = string.Empty;//Store the RequestApp
        private string RequestSessionID = string.Empty;//Store the RequestSession
        private string RequestClientID = string.Empty;//Store the RequestClientID
        private string RequestRemoteIP = string.Empty;//Store the RequestRemoteIP
        private string RequestRemoteCookie = string.Empty;//Store the RequestRemoteCookie
        private Int64 _RequestRecordID = 0;//Store the RequestRecordID
        //***********************************************************************       
        //Index view Variables
        protected string MyEntityName = string.Empty;//Store the MyEntityName
        protected string MyResultField = string.Empty;//Store the MyResultField
        protected string MyPrimaryID = "SNo";//Store the MyPrimaryID
        protected string MyHyperTextName = string.Empty;//Store the MyHyperTextName
        protected string MyOrderbyColumnName = string.Empty;//Store the MyOrderbyColumnName
        protected string MyGridTitle = string.Empty;//Store the MyGridTitle
        private StringBuilder _MyCustomButton = null;
        private string _MyLiteralColumnName = string.Empty;
        private string _MyImageColumnName = string.Empty;
        private string _NewButtonCssClass = "button";
        private int _NewButtonwidth = 0;
        //Current Internal Object from framework.        
        private Int64 RecordID = 0;	//Store the RcordID
        public StringBuilder MyPageForm = new StringBuilder();

        private string _ServiceUrl = "";
        private string _ServiceName = "";
        private string _ServiceMethod = "POST";
        private string _ContentType = "application/XML";

        //***********************************************************************       
        #endregion

        #region Properties variables
        //***********************************************************************       
        //Properties variables
        /// <summary>
        /// Property related RelatedObjectName
        /// </summary>
        /// 

        public string ServiceName
        {
            get { return _ServiceName; }
            set { _ServiceName = value; }
        }

        public string PrintURL
        {
            get { return _PrintURL; }
            set { _PrintURL = value; }
        }

        public string GridViewActionCssClass
        {
            get { return _GridViewActionCssClass; }
            set { _GridViewActionCssClass = value; }
        }
        public string PrintText
        {
            get { return _PrintText; }
            set { _PrintText = value; }
        }

        public bool IsPrintButton
        {
            get { return _IsPrintButton; }
            set { _IsPrintButton = value; }
        }
        public bool IsHyperLinkAllow
        {
            get { return _IsHyperLinkAllow; }
            set { _IsHyperLinkAllow = value; }
        }
        public int NewButtonwidth
        {
            get { return _NewButtonwidth; }
            set { _NewButtonwidth = value; }
        }
        public bool IsNewServiceButton
        {
            get { return _IsNewServiceButton; }
            set { _IsNewServiceButton = value; }
        }

        public string CustomeFormAction
        {
            get { return _CustomeFormAction; }
            set { _CustomeFormAction = value; }
        }

        public string NewServiceCommandText
        {
            get { return _NewServiceCommandText; }
            set { _NewServiceCommandText = value; }
        }
        public bool IsCheckBoxAllow
        {
            get { return _IsCheckBoxAllow; }
            set { _IsCheckBoxAllow = value; }
        }

        public bool IsNewButtonAllow
        {
            get { return _IsNewButtonAllow; }
            set { _IsNewButtonAllow = value; }
        }
        private bool _IsMassDeleteButtonAllow = true;

        public bool IsMassDeleteButtonAllow
        {
            get { return _IsMassDeleteButtonAllow; }
            set { _IsMassDeleteButtonAllow = value; }
        }
        private bool _IsDeleteLinkAllow = true;

        public bool IsDeleteLinkAllow
        {
            get { return _IsDeleteLinkAllow; }
            set { _IsDeleteLinkAllow = value; }
        }
        private bool _IsEditLinkAllow = true;

        public bool IsEditLinkAllow
        {
            get { return _IsEditLinkAllow; }
            set { _IsEditLinkAllow = value; }
        }

        private bool _AllowChangePasswordButton = false;
        private string _ChangePasswordButtonClientClick = "";
        private string _ChangePasswordButtonTooltip = "";
        private string _ChangePasswordButtonText = "";
        private string _ChangePasswordButtonID = "";

        public bool AllowChangePasswordButton
        {
            get { return _AllowChangePasswordButton; }
            set { _AllowChangePasswordButton = value; }
        }

        public string ChangePasswordButtonID
        {
            get { return _ChangePasswordButtonID; }
            set { _ChangePasswordButtonID = value; }
        }

        public string ChangePasswordButtonText
        {
            get { return _ChangePasswordButtonText; }
            set { _ChangePasswordButtonText = value; }
        }

        public string ChangePasswordButtonTooltip
        {
            get { return _ChangePasswordButtonTooltip; }
            set { _ChangePasswordButtonTooltip = value; }
        }

        public string ChangePasswordButtonClientClick
        {
            get { return _ChangePasswordButtonClientClick; }
            set { _ChangePasswordButtonClientClick = value; }
        }

        public string CaptionGridRowCssClass
        {
            get { return _CaptionGridRowCssClass; }
            set { _CaptionGridRowCssClass = value; }
        }
        public string CustomColumnName
        {
            get { return _CustomColumnName; }
            set { _CustomColumnName = value; }
        }
        private Int16 _CustomColumnNameLength = 0;

        public Int16 CustomColumnNameLength
        {
            get { return _CustomColumnNameLength; }
            set { _CustomColumnNameLength = value; }
        }
        public string NewButtonCssClass
        {
            get { return _NewButtonCssClass; }
            set { _NewButtonCssClass = value; }
        }
        public string MyImageColumnName
        {
            get { return _MyImageColumnName; }
            set { _MyImageColumnName = value; }
        }
        public string MyLiteralColumnName
        {
            get { return _MyLiteralColumnName; }
            set { _MyLiteralColumnName = value; }
        }
        public StringBuilder MyCustomButton
        {
            get { return _MyCustomButton; }
            set { _MyCustomButton = value; }
        }

        public string RelatedObjectName
        {
            get { return _RelatedObjectName; }
            set { _RelatedObjectName = value; }
        }
        /// <summary>
        /// Property related TotalPageSize
        /// </summary>	
        public string TotalPageSize
        {
            get { return _TotalPageSize; }
            set { _TotalPageSize = value; }
        }
        /// <summary>
        /// Property related RequestRecordID
        /// </summary>
        public Int64 RequestRecordID
        {
            get { return _RequestRecordID; }
            set { _RequestRecordID = value; }
        }
        /// <summary>
        /// Property related IsClientIDRequire
        /// </summary>	
        public bool IsClientIDRequire
        {
            get { return _IsClientIDRequire; }
            set { _IsClientIDRequire = value; }
        }
        /// <summary>
        /// Property related IsLookupSearch
        /// </summary>	
        public bool IsLookupSearch
        {
            get { return _IsLookupSearch; }
            set { _IsLookupSearch = value; }
        }

        /// <summary>
        /// Property related IsChildApplication
        /// </summary>	
        public bool IsChildApplication
        {
            get { return _IsChildApplication; }
            set { _IsChildApplication = value; }
        }
        /// <summary>
        /// Property related MyParentClassID
        /// </summary>	
        public string MyParentClassID
        {
            get { return _MyParentClassID; }
            set { _MyParentClassID = value; }
        }
        /// <summary>
        /// Property related ExtendControl
        /// </summary>	
        public string ExtendControl
        {
            get { return _ExtendControl; }
            set { _ExtendControl = value; }
        }
        /// <summary>
        /// Property related ChildWhereString
        /// </summary>	
        public string ChildWhereString
        {
            get { return _ChildWhereString; }
            set { _ChildWhereString = value; }
        }
        /// <summary>
        /// Property related RequestColumnName
        /// </summary>	
        public string RequestColumnName
        {
            get { return _RequestColumnName; }
            set { _RequestColumnName = value; }
        }
        /// <summary>
        /// Property related RequestURL
        /// </summary>	
        public string RequestURL
        {
            get { return _RequestURL; }
            set { _RequestURL = value; }
        }
        /// <summary>
        /// Property related NewCommandText
        /// </summary>	
        public string NewCommandText
        {
            get { return _NewCommandText; }
            set { _NewCommandText = value; }
        }
        /// <summary>
        /// Property related MyPageName
        /// </summary>	
        public string MyPageName
        {
            get { return _MyPageName; }
            set { _MyPageName = value; }
        }
        /// <summary>
        /// Property related CurrentPageContext
        /// </summary>	
        public Page CurrentPageContext
        {
            get { return _CurrentPageContext; }
            set { _CurrentPageContext = value; }
        }
        //public System.Web.HttpContext CurrentPageContext
        //{
        //    get { return _CurrentPageContext; }
        //    set { _CurrentPageContext = value; }
        //}
        /// <summary>
        /// Property related ErrorMessage
        /// </summary>	

        public string ErrorMessage
        {
            get { return _ErrorMessage; }
            set { _ErrorMessage = value; }
        }
        /// <summary>
        /// Property related ErrorNumber
        /// </summary>
        public int ErrorNumber
        {
            get { return _ErrorNumber; }
            set { _ErrorNumber = value; }
        }
        /// <summary>
        /// Property related DefaultErrorMessage
        /// </summary>
        public string DefaultErrorMessage
        {
            get { return _DefaultErrorMessage; }
            set { _DefaultErrorMessage = value; }
        }

        /// <summary>
        /// Property related MyDateFormat
        /// </summary>
        public string MyDateFormat
        {
            get { return _MyDateFormat; }
            set { _MyDateFormat = value; }
        }
        /// <summary>
        /// Property related MyDateFormatText
        /// </summary>
        public string MyDateFormatText
        {
            get { return _MyDateFormatText; }
            set { _MyDateFormatText = value; }
        }
        /// <summary>
        /// Property related MyConnectionString
        /// </summary>
        public string MyConnectionString
        {
            get { return _MyConnectionString; }
            set { _MyConnectionString = value; }
        }

        /// <summary>
        /// Property related LoginPage
        /// </summary>
        public string LoginPage
        {
            get { return _LoginPage; }
            set { _LoginPage = value; }
        }

        public string ServiceMethod
        {
            get { return _ServiceMethod; }
            set { _LoginPage = value; }
        }

        public string ContentType
        {
            get { return _ContentType; }
            set { _ContentType = value; }
        }
        private string _validationErrorMessage;
        public string ValidationErrorMessage
        {
            get { return _validationErrorMessage; }
            set { _validationErrorMessage = value; }
        }
        private List<string> _errorMessageList;
        public List<string> ErrorMessageList
        {
            get { return _errorMessageList == null ? new List<string>() : _errorMessageList; }
            set { _errorMessageList = (value == null ? new List<string>() : value); }
        }

        private DataSet _outputDataSet;
        public DataSet OutputDataSet
        {
            get { return _outputDataSet == null ? new DataSet() : _outputDataSet; }
            set { _outputDataSet = (value == null ? new DataSet() : value); }
        }
        //***********************************************************************
        #endregion

        #region Dispose Method
        /// <summary>
        /// Dispose all objects of BaseWebUISecureObject class.  
        /// Cleanup Enviroments object.
        /// </summary>
        public virtual void Dispose()
        {
            /*
            *****************************************************************************
            Class Name:    BaseWebUISecureObject
            Purpose:       Dispose all objects of BaseWebUISecureObject class. 
            Company:       CargoFlash.
            Author:        Manish Kumar
            Created On:    5 Feb 2013
            *****************************************************************************
            */



            //GC Suuperess Finalize object of the class object.
            GC.SuppressFinalize(this);
        }//End of method.
        #endregion

        #region IsNumericValue
        /// <summary>
        /// This method used for convert the input value in the intger value.
        /// </summary>
        /// <param name="ValueToCheck">ValueToCheck is input variable from the current user.</param>
        /// <returns>Its return the bool value true or false.</returns>
        public bool IsNumericValue(string ValueToCheck)
        {
            /*
               *****************************************************************************
               Class Name:    BaseWebUISecureObject
               Purpose:       This method used for convert the input value in the intger value.
               Company:       CargoFlash.
               Author:        Manish Kumar
               Created On:    5 Feb 2013
               *****************************************************************************
           */

            try
            {
                //Local Value.
                Int64 Value = 0;
                //Parse input value into integer values.
                Value = Int64.Parse(ValueToCheck);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }//End of method.
        #endregion

        #region SetCurrentPageContext

        /// <summary>
        /// This method used for set current page level variable from the 
        /// current query string. of the page.
        /// </summary>
        /// <param name="CurrentPage">CurrentPage contains the current page object.</param>
        /// <returns>Its return the true or false.</returns>
        public bool SetCurrentPageContext(Page CurrentPage)
        {
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This method used for set current page level variable from the 
                            current query string. of the page.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
           */
            //Set the current page object to the property.
            this.CurrentPageContext = CurrentPage;
            this.MyUserID = 1;
            //Check if current page is null then raise error number and error message.
            if (CurrentPageContext == null)
            {
                this.ErrorNumber = 90001;
                this.ErrorMessage = "Page Context unknown:Reference to Page is not valid.";
                return false;
            }
            else
            {
                //Set the current Module from the query string.
                this.RequestModuleID = System.Web.HttpContext.Current.Request.QueryString["Module"] == null ? "" : System.Web.HttpContext.Current.Request.QueryString["Module"].ToString();

                //Set the current app from the query string.
                this.RequestAppID = System.Web.HttpContext.Current.Request.QueryString["App"] == null ? "" : System.Web.HttpContext.Current.Request.QueryString["App"].ToString();

                return true;
            }



        }//End of method.

        #endregion

        #region InitializeMe

        /// <summary>
        /// This Method used for Initialize the current page.
        /// set all default variable of the page.
        /// </summary>
        /// <returns>Its return true or false.</returns>
        private bool InitializeMe()
        {
            /*
               *****************************************************************************
               Class Name:    BaseWebUISecureObject
               Purpose:       This Method used for Initialize the current page.
                              set all default variable of the page.
               Company:       CargoFlash.
               Author:        Manish Kumar
               Created On:    5 Feb 2013
               *****************************************************************************
             */

            //Check If MyDateFormat is empty then reflect error message.
            if (this.MyDateFormat.ToString().Length == 0)
            {
                this.ErrorNumber = 90001;
                this.ErrorMessage = this.MyClassName + ":Empty DateFormat! DateFormat is required.";
                return false;
            }
            return true;
        }//End of method.

        #endregion

        #region CreateWebForm
        /// <summary>
        /// This virtual method Create user interface of the Application.
        /// its use for createing cuurent pages accourding to formAction.
        /// </summary>
        /// <param name="Container">Container contains the PlaceHolder.</param>
        public virtual void CreateWebForm(out StringBuilder Container)
        {
            Container = new StringBuilder();
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This virtual method Create user interface of the Application.
		                    its use for createing cuurent pages accourding to formAction.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
           */

        }//End of method.
        public virtual void CreateWebForm(StringBuilder Container)
        {

            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This virtual method Create user interface of the Application.
                            its use for createing cuurent pages accourding to formAction.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
           */

        }//End
        #endregion

        #region BuildFormView

        /// <summary>
        /// This virtual method is used to Build the Form view.
        /// this method use for intract with database.
        /// </summary>
        /// <param name="DisplayMode">DisplayMode contains current display mode of the page.</param>
        /// <returns>Its return the Control object.</returns>
        public virtual void BuildFormView(string DisplayMode, StringBuilder Container)
        {
            /*
            *****************************************************************************
            Class Name:    BaseWebUISecureObject
            Purpose:       This virtual method is used to Build the Form view.
                           this method use for intract with database.
            Company:       CargoFlash.
            Author:        Manish Kumar
            Created On:    5 Feb 2013
            *****************************************************************************
          */
        }//End of method.
        #endregion

        #region DoPostBack

        /// <summary>
        /// This virtual method used for DML action of the current page.
        /// inherite this class and implement this method in WebUIs        
        /// </summary>
        public virtual void DoPostBack()
        {
            /*
            *****************************************************************************
            Class Name:    BaseWebUISecureObject
            Purpose:       This virtual method used for DML action of the current page.
                           inherite this class and implement this method in WebUIs  
            Company:       CargoFlash.
            Author:        Manish Kumar
            Created On:    5 Feb 2013
            *****************************************************************************
          */
        }//End of method.
        #endregion

        #region GetErrorMessage
        /// <summary>
        /// This Method used for get Error Message and error number
        /// from Database and set into related property variables.
        /// </summary>
        /// <param name="CurrentErrorDescription">CurrentErrorDescription contains current error message description.</param>
        public void GetErrorMessage(String CurrentErrorDescription)
        {
            /*
               *****************************************************************************
               Class Name:    BaseWebUISecureObject
               Purpose:       This Method used for get Error Message and error number
                              from Database and set into related property variables.
               Company:       CargoFlash.
               Author:        Manish Kumar
               Created On:    5 Feb 2013
               *****************************************************************************
           */
            //Create a instance of DBMSAdapter
            //using (DBMSAdapter MyDBMSAdapter = new DBMSAdapter(this.MyDBMSClient))
            //{
            //    //Create a instance of Cunnection Instance
            //    using (IDbConnection MyConnection = MyDBMSAdapter.GetConnectionObject())
            //    {
            //        //Set the current connection string to the current connection object.
            //        MyConnection.ConnectionString = this.MyConnectionString;

            //        //Create a new instance of StoreProcedure
            //        using (StoredProcedure MyStoredProcedure = new StoredProcedure(MyDBMSAdapter, MyConnection))
            //        {
            //            try
            //            {
            //                //Call GetError API to get the error message.
            //                MyStoredProcedure.GetError(CurrentErrorDescription);

            //                //Set the MyStoredProcedure error number to the current object error number property.
            //                this.ErrorNumber = MyStoredProcedure.ErrorNumber;

            //                //Set the MyStoredProcedure Error Message to the current object Error Message property.
            //                this.ErrorMessage = MyStoredProcedure.ErrorMessage;

            //                //Check Error message for null or blank,If null or Blank then reflect default error message and error number
            //                if (string.IsNullOrEmpty(this.ErrorMessage))
            //                {
            //                    this.ErrorMessage = this.DefaultErrorMessage;
            //                    this.ErrorNumber = 61502;
            //                }
            //            }
            //            catch (Exception)
            //            {
            //                //Set the MyStoredProcedure error number from the database.
            //                this.ErrorNumber = MyStoredProcedure.ErrorNumber;
            //                this.ErrorMessage = this.MyClassName + ":" + MyStoredProcedure.ErrorMessage;
            //            }
            //            finally
            //            {
            //                //Call CloseConnection() method to close the connection explicitly
            //                if (CloseConnection(MyConnection) == 1)
            //                {
            //                    this.ErrorDescription = this.MyClassName + ":GetErrorMessage:Null connection object";
            //                    //this.ErrorNumber = 9999;
            //                    this.ErrorMessage = this.MyClassName + ":Null connection object";
            //                }
            //            }
            //        }
            //    }
            //}
        }//End of method.
        #endregion

        #region GetWebURLString
        /// <summary>
        /// This Method used to formate the current Url of the page.
        /// Its use to manipulate the current url of the page.
        /// </summary>
        /// <param name="PostBackFormAction">PostBackFormAction contains form action string object.</param>
        /// <param name="IncludeRecordID">IncludeRecordID contains bool object.</param>
        /// <returns>Its return the manipulated Url string.</returns>
        public String GetWebURLString(String PostBackFormAction, Boolean IncludeRecordID)
        {

            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This Method used to formate the current Url of the page.
                            Its use to manipulate the current url of the page.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
            */

            try
            {

                this.ChildWhereString = "";


                //Check if Bool Record is true then inclued the recordID in the query string.
                if (IncludeRecordID)
                    return "Module=" + this.MyModuleID + "&Apps=" + this.MyAppID + "&FormAction=" + PostBackFormAction + "&RecID=" + this.MyRecordID;
                else
                    return "Module=" + this.MyModuleID + "&Apps=" + this.MyAppID + "&FormAction=" + PostBackFormAction;

            }
            catch
            {
                return null;
            }
            finally
            {

            }
        }//End of method.

        public String GetWebURLString(String PostBackFormAction, Boolean IncludeRecordID, int MsgKey = 0, string ErrorMsg = "", string SuccessMsg = "")
        {

            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This Method used to formate the current Url of the page in case of Postback.
             Company:       CargoFlash.
             Author:        Dhiraj Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
            */

            try
            {
                HttpContext.Current.Session["ErrorMsg"] = (ErrorMsg == "" ? null : ErrorMsg);
                HttpContext.Current.Session["SuccessMsg"] = (SuccessMsg == "" ? null : SuccessMsg);
                if (MsgKey > 0)
                    HttpContext.Current.Session["MsgKey"] = MsgKey;

                this.ChildWhereString = "";
                //Check if Bool Record is true then inclued the recordID in the query string.
                if (IncludeRecordID)
                    return "Module=" + this.MyModuleID + "&Apps=" + this.MyAppID + "&FormAction=" + PostBackFormAction + "&RecID=" + this.MyRecordID;
                else
                    return "Module=" + this.MyModuleID + "&Apps=" + this.MyAppID + "&FormAction=" + PostBackFormAction;

            }
            catch
            {
                return null;
            }
            finally
            {

            }
        }//End of method.

        #endregion

        #region GetWebURLFromDataBase
        /// <summary>
        /// This method used for Get URL from the data base of the current request of the user.
        /// </summary>
        /// <returns>Its return data table object that contains current requsted url of the page.</returns>
        public DataTable GetWebURLFromDataBase()
        {
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This method used for Get URL from the data base of the current request of the user.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
           */
            ////Create a instance of DBMSAdapter
            //using (DBMSAdapter MyDBMSAdapter = new DBMSAdapter(this.MyDBMSClient))
            //{
            //    //Create a instance of Cunnection Instance
            //    using (IDbConnection MyConnection = MyDBMSAdapter.GetConnectionObject())
            //    {
            //        //Set the current connection string to the current connection object.
            //        MyConnection.ConnectionString = this.MyConnectionString;

            //        //Create a new instance of StoreProcedure
            //        using (StoredProcedure MyStoredProcedure = new StoredProcedure(MyDBMSAdapter, MyConnection))
            //        {
            //            try
            //            {
            //                // Form the where Condition for fetch the record from the data base related sessionID and variable name.
            //                this.WhereCondition = "SESSION_ID='" + this.MySessionID + "' AND VARIABLE_NAME LIKE '" + this.MyClassName + "%' ORDER BY VARIABLE_VALUE2";

            //                //Call API GetList for fetch the data from the data base.
            //                DataTable dt = MyStoredProcedure.GetList("sec_session_data", "VARIABLE_NAME,VARIABLE_VALUE", this.WhereCondition);

            //                //Retrun the data table.
            //                return dt;
            //            }
            //            catch (Exception)
            //            {
            //                //Set the MyStoredProcedure error number from the database.
            //                this.ErrorNumber = MyStoredProcedure.ErrorNumber;
            //                this.ErrorMessage = this.MyClassName + ":" + MyStoredProcedure.ErrorMessage;
            //                return null;
            //            }
            //            finally
            //            {
            //                //Set the WhereCondition as NUll string.
            //                this.WhereCondition = "";

            //                //Call CloseConnection() method to close the connection explicitly
            //                if (CloseConnection(MyConnection) == 1)
            //                {
            //                    this.ErrorDescription = this.MyClassName + ":GetErrorMessage:Null connection object";
            //                    //this.ErrorNumber = 9999;
            //                    this.ErrorMessage = this.MyClassName + ":Null connection object";
            //                }
            //            }
            //        }
            //    }
            //}
            return null;
        }//End of method.
        #endregion

        #region GetWebFormDefinition
        /// <summary>
        /// This Method used for get Dataset as per pass parameters.
        /// </summary>
        /// <param name="DisplayMode">DisplayMode contains current display mode.</param>
        /// <returns>Its retrun the data set object.</returns>
        public DataSet GetWebFormDefinition(String DisplayMode)
        {
            /*
            *****************************************************************************
            Class Name:    BaseWebUISecureObject
            Purpose:       This Method used for get Dataset as per pass parameters.
            Company:       CargoFlash.
            Author:        Manish Kumar
            Created On:    5 Feb 2013
            *****************************************************************************
          */
            ////Create a instance of DBMSAdapter
            //using (DBMSAdapter MyDBMSAdapter = new DBMSAdapter(this.MyDBMSClient))
            //{
            //    //Create a instance of Cunnection Instance
            //    using (IDbConnection MyConnection = MyDBMSAdapter.GetConnectionObject())
            //    {
            //        //Set the Current connection string to the current connectin object.
            //        MyConnection.ConnectionString = this.MyConnectionString;

            //        //Create a new instance of SystemStoredProcedure
            //        using (SystemStoredProcedure MySystemStoredProcedure = new SystemStoredProcedure(MyDBMSAdapter, MyConnection))
            //        {
            //            try
            //            {
            //                //Check the display mode of the current mode.
            //                if (DisplayMode == "FORMACTION.UPDATE") DisplayMode = "FORMACTION.EDIT";
            //                if (DisplayMode == "FORMACTION.SAVE") DisplayMode = "FORMACTION.NEW";

            //                //Set the Dataset object as NULL.
            //                DataSet MyFormBuilderDefinition = null;

            //                //Call API GetWebFormAdapterData to get the data tables from the data base.
            //                MyFormBuilderDefinition = MySystemStoredProcedure.GetWebFormAdapterData(this.MyFormName, this.MyAppID, DisplayMode);

            //                //Check if MyFormBuilderDefinition is null then reflect error number and error message
            //                if (MyFormBuilderDefinition == null)
            //                {
            //                    this.ErrorNumber = MySystemStoredProcedure.ErrorNumber;
            //                    this.ErrorMessage = this.MyClassName + ":" + MySystemStoredProcedure.ErrorMessage;
            //                    throw new Exception(this.MyClassName + ":Form Data Definition is null!, Data Definition is required");
            //                }
            //                return MyFormBuilderDefinition;
            //            }
            //            catch (Exception)
            //            {
            //                this.ErrorNumber = MySystemStoredProcedure.ErrorNumber;
            //                this.ErrorMessage = this.MyClassName + ":" + MySystemStoredProcedure.ErrorMessage;
            //                //Clear all object
            //                return null;
            //            }
            //            finally
            //            {
            //                //Call CloseConnection() method to close the connection explicitly
            //                if (CloseConnection(MyConnection) == 1)
            //                {
            //                    this.ErrorDescription = this.MyClassName + ":GetWebFormDefinition:Null connection object";
            //                    //this.ErrorNumber = 9999;
            //                    this.ErrorMessage = this.MyClassName + ":Null connection object";
            //                }
            //            }
            //        }
            //    }
            //}
            return null;
        }//End of method.
        #endregion

        #region SetFormPermission
        /// <summary>
        /// This Method define permission for application.
        /// //Create a instance of DBMSAdapter
        /// </summary>
        /// <param name="MyFormBuilder"></param>
        public void SetFormPermission(HtmlFormAdapter MyFormBuilder, Button NewButton)
        {
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This Method define permission for application.
                            Create a instance of DBMSAdapter
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
            */


            if (MyFormBuilder != null)
            {
                //Set Default visible is false to ToolBar
                MyFormBuilder.CommandDeleteVisible = false;
                MyFormBuilder.CommandEditVisible = false;
                MyFormBuilder.CommandNewVisible = false;
                MyFormBuilder.CommandSaveVisible = false;
                MyFormBuilder.CommandUpdateVisible = false;

                ////Check if IsAllowed to Access then check inner Permission
                //if (this.MyUserPermission.IsAllowed == true)
                //{
                //    //Check if Permission is allow to Create then define toolbar
                //    if (this.MyUserPermission.Create)
                //    {
                //        MyFormBuilder.CommandNewVisible = true;
                //        MyFormBuilder.CommandSaveVisible = true;
                //    }
                //    //Check if Permission is allow to Delete then define toolbar
                //    if (this.MyUserPermission.Delete)
                //    {

                //        MyFormBuilder.CommandDeleteVisible = true;
                //    }
                //    //Check if Permission is allow to Update then define toolbar
                //    if (this.MyUserPermission.Update)
                //    {
                //        MyFormBuilder.CommandEditVisible = true;
                //        MyFormBuilder.CommandUpdateVisible = true;
                //    }
                //}
            }
        }//End of method.
        #endregion

        #region SetFormPermission
        /// <summary>
        /// This Method define permission for application.
        /// //Create a instance of DBMSAdapter
        /// </summary>
        /// <param name="MyFormBuilder"></param>
        public void SetFormPermission(HtmlFormAdapter MyFormBuilder, Button NewButton, Button EditButton)
        {
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This Method define permission for application.
                            Create a instance of DBMSAdapter
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
            */


            if (MyFormBuilder != null)
            {
                //Set Default visible is false to ToolBar
                MyFormBuilder.CommandDeleteVisible = false;
                MyFormBuilder.CommandEditVisible = false;
                MyFormBuilder.CommandNewVisible = false;
                MyFormBuilder.CommandSaveVisible = false;
                MyFormBuilder.CommandUpdateVisible = false;

                ////Check if IsAllowed to Access then check inner Permission
                //if (this.MyUserPermission.IsAllowed == true)
                //{
                //    //Check if Permission is allow to Create then define toolbar
                //    if (this.MyUserPermission.Create)
                //    {
                //        MyFormBuilder.CommandNewVisible = true;
                //        MyFormBuilder.CommandSaveVisible = true;
                //    }
                //    //Check if Permission is allow to Delete then define toolbar
                //    if (this.MyUserPermission.Delete)
                //    {

                //        MyFormBuilder.CommandDeleteVisible = true;
                //    }
                //    //Check if Permission is allow to Update then define toolbar
                //    if (this.MyUserPermission.Update)
                //    {
                //        MyFormBuilder.CommandEditVisible = true;
                //        MyFormBuilder.CommandUpdateVisible = true;
                //    }
                //}
            }
        }//End of method.
        #endregion

        #region GetContainerASPClientID
        /// <summary>
        /// This Method Return ContainerString as per Condition and Set ContainerID Mode.
        /// </summary>
        /// <param name="ContainerID">ContainerID contains current Place HOlder.</param>
        /// <returns>Its return the current string.</returns>
        public String GetContainerASPClientID(String ContainerID)
        {
            /*
             *****************************************************************************
             Class Name:    BaseWebUISecureObject
             Purpose:       This Method Return ContainerString as per Condition and Set ContainerID Mode.
             Company:       CargoFlash.
             Author:        Manish Kumar
             Created On:    5 Feb 2013
             *****************************************************************************
            */
            //Check if ContainerID is null then rasise error.
            if (ContainerID == null)
                throw new Exception(this.MyClassName + ":Empty Container Object! ContainerID is required.");

            HiddenField FormCotainer = (HiddenField)this.CurrentPageContext.Form.FindControl(ContainerID);
            return FormCotainer.Value.ToString();
        }
        #endregion

        #region ReplaceSpacialCharactor
        /// <summary>
        /// This method used for replace spacial charactor from the input string.
        /// </summary>
        /// <param name="Controlvalue">Controlvalue</param>
        /// <returns>Its return the manipulated string input.</returns>
        public static string ReplaceSpacialCharactor(string Controlvalue)
        {
            /*
            *****************************************************************************
            Class Name:    BaseWebUISecureObject
            Purpose:       This method used for replace spacial charactor from the input string.
            Company:       CargoFlash.
            Author:        Manish Kumar
            Created On:    5 Feb 2013
            *****************************************************************************
           */
            //Check if Controlvalue in null or empty then return orignal string value.
            if (string.IsNullOrEmpty(Controlvalue))
                return Controlvalue;

            return Controlvalue.Replace("'", "''").Replace("’", "''").Replace("\\", "\\\\").Replace("‘", "''");
        }
        #endregion



        /// <summary>
        /// Added By:Dhiraj Kumar
        /// Purpose: Common DataOperation(Create/Update/Delete) Service Initialisation and request handling.
        /// </summary>
        /// <param name="OperatioMode">Update/Delete/Save</param>
        /// <param name="dataList">Object consisting of generic list of paticular class</param>
        /// <returns> true/false(if response status is ok:true,else false</returns>
        public void DataOperationService(string OperatioMode, object dataList, string ModuleName = "", string AppsName = "")
        {

            try
            {
                if (AppsName == "")
                    AppsName = System.Web.HttpContext.Current.Request.QueryString["Apps"];
                string[] str = OperatioMode.Split('.');
                string mode = string.Empty;
                if (str.Length > 0)
                    mode = str[1];
                if (string.IsNullOrEmpty(ServiceName))
                    ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + AppsName + "Service.svc/" + SentenceCase(mode) + AppsName;
                var url = new Uri(ConfigurationManager.AppSettings["ServiceURL"] + "/" + ServiceName);
                var request = (HttpWebRequest)WebRequest.Create(url);

                request.Method = ServiceMethod;
                request.ContentType = ContentType;
                Type typeList = dataList.GetType();
                DataContractSerializer groupSerializer = new DataContractSerializer(typeList);
                using (var requestStream = request.GetRequestStream())
                    groupSerializer.WriteObject(requestStream, dataList);
                var response = (HttpWebResponse)request.GetResponse();
                DataContractSerializer obj = new DataContractSerializer(typeof(List<string>));
                object gp = null;
                using (var responsestream = response.GetResponseStream())
                {
                    gp = (object)obj.ReadObject(responsestream);
                    ErrorMessageList = (List<string>)gp;
                }
                

            }
            catch (Exception ex)
            {

                ErrorMessageList = new List<string> { (ex.Message) };


            }

            if (ErrorMessageList.Count > 0)
            {
                if(ErrorMessageList[0].Contains("SAVE~~SAVE") == false)
                    ErrorMessage = ValidationMessages(ErrorMessageList);
            }


        }
        /// <summary>
        /// Added By:Dhiraj Kumar
        /// Purpose: Common DataOperation(Create/Update/Delete)with API Initialisation and request handling.
        /// </summary>
        /// <param name="OperatioMode">Update/Delete/Save</param>
        /// <param name="dataList">Object consisting of generic list of paticular class</param>
        /// <returns> true/false(if response status is ok:true,else false</returns>
        public void DataOperationAPI(string OperatioMode, object dataList, string ModuleName = "", string AppsName = "")
        {
            try
            {
                if (AppsName == "")
                    AppsName = System.Web.HttpContext.Current.Request.QueryString["Apps"];
                string[] str = OperatioMode.Split('.');
                string mode = string.Empty;
                if (str.Length > 0)
                    mode = str[1];
                if (string.IsNullOrEmpty(ServiceName))
                    ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + AppsName + "/" + SentenceCase(mode) + AppsName;
                var url = new Uri(ConfigurationManager.AppSettings["apiURL"] + "/" + ServiceName);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("api_key", "OperationAPI");
                    var content = new ObjectContent(dataList.GetType(), dataList, new JsonMediaTypeFormatter());
                    var result = client.PostAsync(url, content).Result;
                }

            }
            catch (Exception ex)
            {

                ErrorMessageList = new List<string> { (ex.Message) };


            }
            if (ErrorMessageList.Count > 0)
                ErrorMessage = ValidationMessages(ErrorMessageList);


        }

        /// <summary>
        /// Added By:Suman Kumar
        /// Purpose: Any DataOperation(FormAction.Delete/FormAction.Validate) Service Initialisation and request handling.
        /// </summary>
        /// <param name="OperatioMode">Update/Delete/Save</param>
        /// <param name="dataList">Object consisting of generic list of paticular class</param>
        /// <returns> true/false(if response status is ok:true,else false</returns>
        public void DataOperationDataSetService(string OperatioMode, object dataList, string ModuleName = "", string AppsName = "")
        {
            try
            {
                if (AppsName == "")
                    AppsName = System.Web.HttpContext.Current.Request.QueryString["Apps"];
                string[] str = OperatioMode.Split('.');
                string mode = string.Empty;
                if (str.Length > 0)
                    mode = str[1];
                if (string.IsNullOrEmpty(ServiceName))
                    ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + AppsName + "Service.svc/" + SentenceCase(mode) + AppsName;
                var url = new Uri(ConfigurationManager.AppSettings["ServiceURL"] + "/" + ServiceName);
                var request = (HttpWebRequest)WebRequest.Create(url);

                request.Method = ServiceMethod;
                request.ContentType = ContentType;
                Type typeList = dataList.GetType();
                DataContractSerializer groupSerializer = new DataContractSerializer(typeList);
                using (var requestStream = request.GetRequestStream())
                    groupSerializer.WriteObject(requestStream, dataList);
                var response = (HttpWebResponse)request.GetResponse();

                DataContractSerializer obj = new DataContractSerializer(typeof(List<string>));
                object gp = null;
                DataContractSerializer objTable = new DataContractSerializer(typeof(DataSet));
                object gpTable = null;
                using (var responsestream = response.GetResponseStream())
                {
                    gpTable = (object)objTable.ReadObject(responsestream);
                    OutputDataSet = (DataSet)gpTable;
                }

            }
            catch (Exception ex)
            {
                ErrorMessageList = new List<string> { (ex.Message) };


            }
            if (ErrorMessageList.Count > 0)
                ErrorMessage = ValidationMessages(ErrorMessageList);


        }
        public object DataGetRecordService(string recordID, object classType, string ModuleName = "", string AppsName = "", string ServiceName = "")
        {
            try
            {               
                string Apps = ServiceName == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"] : ServiceName;
                object gp = null;
                //if (string.IsNullOrEmpty(ServiceName))
                ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + Apps + "Service.svc/Get" + (AppsName == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"] : AppsName) + "Record?recid=" + recordID.ToString() + "&UserID=" + this.MyUserID;
                var url = new Uri(ConfigurationManager.AppSettings["ServiceURL"] + "/" + ServiceName);
                var request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                request.ContentType = ContentType;
                var response = (HttpWebResponse)request.GetResponse();
                Type type = classType.GetType();
                DataContractSerializer obj = new DataContractSerializer(type);
                using (var responsestream = response.GetResponseStream())
                {
                    gp = (object)obj.ReadObject(responsestream);
                }
                return gp;
            }
            catch
            {
                ErrorNumber = 1;
                ErrorMessage = System.Web.HttpContext.Current.Request.QueryString["Apps"] + " Service has identified invalid operation in getting record.Please rectify.";
                return null;
            }
        }
        /// <summary>
        /// Added By :Dhiraj Kumar
        /// Added On :12 Feb 2014
        /// Purpose  :Mehtod to be called Dynamically(For all Model classes) for all Get record operations like Edit/View etc. 
        /// </summary>
        /// <param name="recordID"></param>
        /// <param name="classType"></param>
        /// <param name="ModuleName"></param>
        /// <param name="AppsName"></param>
        /// <param name="ServiceName"></param>
        /// <returns></returns>
        public object DataGetRecordApi(string recordID, object classType, string ModuleName = "", string AppsName = "", string ServiceName = "")
        {
            try
            {
                string Apps = ServiceName == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"] : ServiceName;
                object gp = null;
                ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + Apps + "/Get" + (AppsName == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"] : AppsName) + "Record?recordid=" + recordID.ToString() + "&UserID=" + this.MyUserID;
                var url = new Uri(ConfigurationManager.AppSettings["apiURL"] + "/" + ServiceName);
                WebClient client = new WebClient();
                JsonSerializer jsonSerializer = new JsonSerializer();
                JsonTextReader reader = new JsonTextReader(new StringReader(client.DownloadString(url)));
                gp = jsonSerializer.Deserialize(reader, classType.GetType());
                return gp;
            }
            catch
            {
                ErrorNumber = 1;
                ErrorMessage = System.Web.HttpContext.Current.Request.QueryString["Apps"] + " Service has identified invalid operation in getting record.Please rectify.";
                return null;
            }
        }

        public DataTable DataGetRecordService(string recordID, string ModuleName = "", string AppsName = "")
        {
            try
            {
                //ServiceHost host = new ServiceHost(typeof(Service));
                //ServiceEndpoint endpoint = host.AddServiceEndpoint(typeof(IService), new WebHttpBinding(), "http://...");

                //WebHttpBehavior behavior = new WebHttpBehavior();
                //endpoint.Behaviors.Add(behavior);          

                DataTable gp = null;
                //if (string.IsNullOrEmpty(ServiceName))
                ServiceName = (ModuleName == "" ? "" : ModuleName + "/") + System.Web.HttpContext.Current.Request.QueryString["Apps"] + "Service.svc/Get" + (AppsName == "" ? System.Web.HttpContext.Current.Request.QueryString["Apps"] : AppsName) + "Record?recid=" + recordID.ToString() + "&UserID=" + this.MyUserID;
                var url = new Uri(ConfigurationManager.AppSettings["ServiceURL"] + "/" + ServiceName);
                var request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                var response = (HttpWebResponse)request.GetResponse();
                //Type type = classType.GetType();
                DataContractSerializer obj = new DataContractSerializer(typeof(DataTable));
                using (var responsestream = response.GetResponseStream())
                {
                    gp = (DataTable)obj.ReadObject(responsestream);
                }
                return gp;
            }
            catch
            {
                ErrorNumber = 1;
                ErrorMessage = System.Web.HttpContext.Current.Request.QueryString["Apps"] + " Service has identified invalid operation in getting record.Please rectify.";
                return null;
            }
        }

        /// <summary>
        /// Added By:Dhiraj Kumar
        /// Purpose: To convert methods prefix in Sentencecase.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string SentenceCase(string input)
        {
            if (input.Length < 1)
                return input;

            string sentence = input.ToLower();
            return sentence[0].ToString().ToUpper() +
               sentence.Substring(1);
        }

        public static DataTable ConvertToDataTable<T>(IList<T> list, string excludeColumns = "")
        {
            excludeColumns = (excludeColumns == "" ? "Errors,ErrorValue,ErrorMessage,CreatedUser,UpdatedUser" : "Errors,ErrorValue,ErrorMessage,CreatedUser,UpdatedUser," + excludeColumns);
            DataTable table = CreateTable<T>(excludeColumns);
            Type entityType = typeof(T);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);
            if (list != null)
                foreach (T item in list)
                {
                    DataRow row = table.NewRow();
                    string[] excludeColumn = excludeColumns.Split(',');
                    foreach (PropertyDescriptor prop in properties)
                    {
                        if (!excludeColumn.Contains(prop.Name))
                            row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                    }

                    table.Rows.Add(row);
                }

            return table;
        }

        public static DataTable CreateTable<T>(string excludeColumns)
        {
            string[] excludeColumn = excludeColumns.Split(',');
            Type entityType = typeof(T);
            DataTable table = new DataTable(entityType.Name);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (PropertyDescriptor prop in properties)
            {
                if (!excludeColumn.Contains(prop.Name))
                {
                    if (prop.PropertyType.UnderlyingSystemType.Name.IndexOf("Nullable") < 0)
                        table.Columns.Add(prop.Name, prop.PropertyType);
                    else
                        table.Columns.Add(prop.Name, ((System.ComponentModel.NullableConverter)(prop.Converter)).UnderlyingType);
                }

            }

            return table;
        }

        public static DateTime ConvertToDateTime(string ConvertToDateTime)
        {
            DateTimeFormatInfo dtfi = new DateTimeFormatInfo();
            DateTime ConvertDate = Convert.ToDateTime(ConvertToDateTime, dtfi);
            return ConvertDate;
        }

        public string ValidationMessages(List<string> MessageList)
        {
            StringBuilder errorHTML = new StringBuilder();
            if (MessageList.Count > 1)
            {
                errorHTML.Append("<ul>");
                foreach (var s in MessageList)
                    errorHTML.Append("<li>" + s + "</li>");
                errorHTML.Append("</ul>");
                return errorHTML.ToString();
            }
            else
                return MessageList[0].ToString();

        }

        /// <summary>
        /// Save Excel file in base directory
        /// Added By : Suman Kumar
        /// Dated On : 19-NOV-2013
        /// this function call GetExcelColumnName function internally.
        /// </summary>
        /// <param name="dataTable"></param>
        /// <param name="FileName"></param>
        public void SaveExcelFileName(DataTable dataTable, string FileName)
        {
            Excel.Application application = new Excel.Application();
            Excel.Workbook workbook = application.Workbooks.Add();
            Excel.Worksheet worksheet = workbook.Sheets[1];


            var columns = dataTable.Columns.Count;
            var rows = dataTable.Rows.Count;

            Excel.Range range = worksheet.Range["A1", String.Format("{0}{1}", GetExcelColumnName(columns), rows)];

            object[,] data = new object[rows, columns];

            for (int rowNumber = 0; rowNumber < rows; rowNumber++)
            {
                for (int columnNumber = 0; columnNumber < columns; columnNumber++)
                {
                    data[rowNumber, columnNumber] = dataTable.Rows[rowNumber][columnNumber].ToString();
                }
            }

            range.Value = data;
            string BaseDirectory = System.Web.HttpContext.Current.Server.MapPath("~/");
            string path = BaseDirectory + "FileUpload\\";
            workbook.SaveAs(Path.Combine(path, FileName));
            workbook.Close();

            Marshal.ReleaseComObject(application);
        }

        /// <summary>
        /// GetExcelColumnName
        /// Added By : Suman Kumar
        /// Dated On : 19-NOV-2013
        /// </summary>
        /// <param name="columnNumber"></param>
        /// <returns></returns>
        private static string GetExcelColumnName(int columnNumber)
        {
            int dividend = columnNumber;
            string columnName = String.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }

            return columnName;
        }

        /// <summary>
        /// Download saved Excel file from base directory
        /// Added By : Suman Kumar
        /// Dated On : 19-NOV-2013
        /// </summary>
        /// <param name="UploadedFileName"></param>
        public void DownloadExcelFileFromBaseDirectory(string UploadedFileName)
        {
            try
            {
                string XlsPath = System.Web.HttpContext.Current.Server.MapPath("FileUpload\\" + UploadedFileName);
                FileInfo fileDet = new System.IO.FileInfo(XlsPath);
                System.Web.HttpContext.Current.Response.Clear();
                System.Web.HttpContext.Current.Response.Charset = "UTF-8";
                System.Web.HttpContext.Current.Response.ContentEncoding = Encoding.UTF8;
                System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + System.Web.HttpContext.Current.Server.UrlEncode(fileDet.Name));
                System.Web.HttpContext.Current.Response.AddHeader("Content-Length", fileDet.Length.ToString());
                System.Web.HttpContext.Current.Response.ContentType = "application/ms-excel";
                System.Web.HttpContext.Current.Response.WriteFile(fileDet.FullName);
                System.Web.HttpContext.Current.Response.End();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string LexEncryptString(string decryptString)
        {
            decryptString = decryptString.ToUpper();
            StringBuilder inSb = new StringBuilder(decryptString);
            StringBuilder outSb = new StringBuilder(decryptString.Length);
            char c;
            for (int i = 0; i < decryptString.Length; i++)
            {
                c = inSb[i];
                c = (char)(c ^ 25); /// remember to use the same XORkey value you used in javascript
                outSb.Append(c == '\'' ? '~' : c);
                if (c == '\\')
                {
                    c = inSb[i];
                    c = (char)(c ^ 25); /// remember to use the same XORkey value you used in javascript
                    outSb.Append(c == '\'' ? '~' : c);
                }
            }
            return outSb.ToString();
        }
    }//End of Class.
    public sealed class UIDateTimeFormat
    {
        private static string _uiDateFormatString;
        private static string _uiTimeFormatString;
        private static string _dateFormatString;

        public static string UIDateFormatString { set { _uiDateFormatString = value; } get { return (string.IsNullOrEmpty(_uiDateFormatString) ? "dd-MMM-yyyy" : _uiDateFormatString); } }
        public static string UITimeFormatString { set { _uiTimeFormatString = value; } get { return (string.IsNullOrEmpty(_uiTimeFormatString) ? "HH:mm" : _uiTimeFormatString); } }
        public static string DateFormatString { set { _dateFormatString = value; } get { return (string.IsNullOrEmpty(_dateFormatString) ? "yyyy-MM-dd" : _dateFormatString); } }
    }
    public sealed class FTPConnection
    {
        private static string _ftpServer;
        private static string _ftpUserId;
        private static string _ftpPassword;

        public static string FTPServer { set { _ftpServer = value; } get { return (string.IsNullOrEmpty(_ftpServer) ? "" : _ftpServer); } }
        public static string FTPUserId { set { _ftpUserId = value; } get { return (string.IsNullOrEmpty(_ftpUserId) ? "" : _ftpUserId); ; } }
        public static string FTPPassword { set { _ftpPassword = value; } get { return (string.IsNullOrEmpty(_ftpPassword) ? "" : _ftpPassword); ; } }
    }
    public sealed class GlobalSetting
    {

        private static string _currentVersion;
        private static bool _ssl;
        private static string _urlType;
        private static string _eCargoServiceURL;
        private static string _eCargoClientURL;
        private static string _serviceURL;
        private static string _gridServiceURL;
        private static string _commonClientServiceURL;
        private static string _applicationMessage;
        private static string _grossWtVariance;
        private static string _weightRoundLimit;


        public static string CurrentVersion { set { _currentVersion = value; } get { return (string.IsNullOrEmpty(_currentVersion) ? "0.0.0.0.0" : _currentVersion); } }
        public static bool SSL { set { _ssl = Convert.ToBoolean(value.ToString().ToLower()); } get { return (_ssl == null ? false : Convert.ToBoolean(_ssl.ToString().ToLower())); } }
        public static string URLType { set { _urlType = value; } get { return (string.IsNullOrEmpty(_urlType) ? "--(DEFAULT)" : _urlType); } }
        public static string eCargoServiceURL { set { _eCargoServiceURL = value; } get { return (string.IsNullOrEmpty(_eCargoServiceURL) ? "" : _eCargoServiceURL); } }
        public static string eCargoClientURL { set { _eCargoClientURL = value; } get { return (string.IsNullOrEmpty(_eCargoClientURL) ? "" : _eCargoClientURL); } }
        public static string ServiceURL { set { _serviceURL = value; } get { return (string.IsNullOrEmpty(_serviceURL) ? "" : _serviceURL); } }
        public static string GridServiceURL { set { _gridServiceURL = value; } get { return (string.IsNullOrEmpty(_gridServiceURL) ? "" : _gridServiceURL.Replace("Services", "")); } }
        public static string CommonClientServiceURL { set { _commonClientServiceURL = value; } get { return (string.IsNullOrEmpty(_commonClientServiceURL) ? "" : _commonClientServiceURL); } }
        public static string ApplicationMessage { set { _applicationMessage = value; } get { return (string.IsNullOrEmpty(_applicationMessage) ? "Please Contact to System Administrator" : _applicationMessage); } }
        public static string GrossWtVariance { set { _grossWtVariance = value; } get { return (string.IsNullOrEmpty(_grossWtVariance) ? "0" : _grossWtVariance); } }
        public static string WeightRoundLimit { set { _weightRoundLimit = value; } get { return (string.IsNullOrEmpty(_weightRoundLimit) ? "0.5" : _weightRoundLimit); } }
    }
}//End of CargoFlash.SoftwareFactory.WebUI

