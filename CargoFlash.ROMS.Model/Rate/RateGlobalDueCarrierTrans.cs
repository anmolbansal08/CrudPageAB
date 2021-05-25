using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    #region RateGlobalDueCarrier
    /*
	*****************************************************************************
	Class Name:		RateGlobalDueCarrierTrans   
	Purpose:		This class used to handle Rate Airlin eMaster
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Amit Kumar Gupta
	Created On:		06 MAY 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(RateGlobalDueCarrierTrans))]
    public class RateGlobalDueCarrierTrans
    {
        public int SNo { get; set; }

        public int RateGlobalDuecarrierSNo { get; set; }

        
        public string DueCarrierSNo { get; set; }

        public string HdnDueCarrierSNo { get; set; }

        
        public string CommoditySNo { get; set; }

        public string HdnCommoditySNo { get; set; }


        public string SPHCSNo { get; set; }

        public string HdnSPHCSNo { get; set; }


        public string ProductSNo { get; set; }

        public string HdnProductSNo { get; set; }


        public string CurrencySNo { get; set; }

        public string HdnCurrencySNo { get; set; }

     

        public decimal Value { get; set; }

        public decimal MinimumValue { get; set; }

        public decimal OriginalValue { get; set; }

        public Boolean IsChargeableWeight { get; set; }

        public string ChargeableWeight { get; set; }

        //public Nullable<DateTime> ValidFrom { get; set; }

        //public Nullable<DateTime> ValidTo { get; set; }

        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }



        public bool IsActive { get; set; }

        public string Active { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

      

  }
}
