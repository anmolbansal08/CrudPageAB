using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
	#region IrregularityDamage interface Description
	/*
	*****************************************************************************
	interface Name:		IApplicationEntityService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Mahendra singh.
	Created On:		    12 4 2017
	Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
	#endregion
	[ServiceContract]
	public interface IApplicationEntityService
	{
		[OperationContract]
		[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
		DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

		[OperationContract]
		[WebGet(UriTemplate = "GetApplicationEntityRecord?recid={RecordID}&UserID={UserID}")]
		ApplicationEntity GetApplicationEntityRecord(string recordID, string UserID);
	}
}
