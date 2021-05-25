using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    #region AircraftDimensionMatrix interface Description
    /*
	*****************************************************************************
	interface Name:		IAircraftDimensionMatrixService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Laxmikanta Pradhan
	Created On:		    3rd Jan 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

     [ServiceContract]
    public interface IAircraftDimensionMatrixService
    {
         [OperationContract]
         [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

         //[OperationContract]
         //[WebGet(UriTemplate = "DataGrid?skip={skip}&take={take}&page={page}&pageSize={pageSize}&sort={sort}&filter={filter}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         //DataSourceResult DataGrid(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/SaveAircraftDimensionMatrix",BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        
         string SaveAircraftDimensionMatrix(List<AircraftDimensionMatrix> AircraftDimensionMatrix, List<AircraftMatrixTransVal> AircraftMatrixTransVal, List<AircraftMatrixTrans> AircraftMatrixTrans);

         [OperationContract]
         [WebGet(UriTemplate = "GetAircraftDimensionMatrixRecord?RecordID={RecordID}&UserSNo={UserSNo}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         //AircraftMatrixRead GetRecordAircraftDimensionMatrix(string recordID, string UserSNo);
         string GetAircraftDimensionMatrixRecord(string RecordID, string UserSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/UpdateAircraftDimensionMatrix", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string UpdateAircraftDimensionMatrix(List<AircraftDimensionMatrix> AircraftDimensionMatrix, List<AircraftMatrixTransVal> AircraftMatrixTransVal, List<AircraftMatrixTrans> AircraftMatrixTrans);
         //int AircraftSNo

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/DeleteAircraftDimensionMatrix")]
         List<string> DeleteAircraftDimension(List<string> listID);
    }
}
