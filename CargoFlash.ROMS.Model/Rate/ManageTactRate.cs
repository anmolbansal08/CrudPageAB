using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Rate
{
    #region ManageTactRate Description
    /*
	*****************************************************************************
	Class Name:		ManageTactRate  
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahabz Akhtar
	Created On:		07 Feb 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ManageTactRate))]
    public class ManageTactRate
    {
        public int SNo { get; set; }
        public int OriginCountrySNo { get; set; }
        public int OriginSNo { get; set; }
        public string Text_OriginCountrySNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public int OriginNumeric { get; set; }

      
        public int DestinationCountrySNo { get; set; }
        public int DestinationSNo { get; set; }
        public string Text_DestinationCountrySNo { get; set; }
        public string Text_DestinationSNo { get; set; }

        public int DestinationNumeric { get; set; }

       

        public int Category { get; set; }

        public string Text_Category { get; set; }
        public int AreaSNo { get; set; }
        public string Text_AreaSNo { get; set; }
        public string Note { get; set; }

        public string CarrierCode { get; set; }

        public int RateTypeSNo { get; set; }
        public string Text_RateTypeSNo { get; set; }
        public int CommoditySNo { get; set; }
        public string Text_CommoditySNo { get; set; }
        public string ChangeIndicator { get; set; }

        public Nullable<DateTime> IntendedDate { get; set; }
        public Nullable<DateTime> ActualDate { get; set; }
        public Nullable<DateTime> ExpiryDate { get; set; }
        public int GovernmentStatus { get; set; }
        public string Text_GovernmentStatus { get; set; }

        public string OriginGateway { get; set; }
        public string DestinationGateway { get; set; }

        public string UniqueAreaCode { get; set; }
        public string SourceCode { get; set; }

        public int ActionCode { get; set; }
        public string Text_ActionCode { get; set; }

        public string ConstrunctionAllowed { get; set; }
        public string CategorySortIndicator { get; set; }
        public string IdentificationCode { get; set; }
        public int CurrencyCode { get; set; }
        public string Text_CurrencyCode { get; set; }
        public int DirectionCode { get; set; }
        public string Text_DirectionCode { get; set; }

        public int ProportionalCode { get; set; }
        public string Text_ProportionalCode { get; set; }

        public int DecimalPlace { get; set; }
        public string Text_DecimalPlace { get; set; }

        public decimal Rate { get; set; }


        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

      
        /// <summary>
        /// Slab information
        /// </summary>
        public decimal Minimum { get; set; }
        public decimal Normal { get; set; }
        public decimal SlabValue1 { get; set; }
        public decimal SlabValue2 { get; set; }
        public decimal SlabValue3 { get; set; }
        public decimal SlabValue4 { get; set; }
        public decimal SlabValue5 { get; set; }
        public decimal SlabValue6 { get; set; }

        public int ULDClass { get; set; }
        public string Text_ULDClass { get; set; }
        public decimal Text_ULDWeight { get; set; }
        public List<TactULDTrans> TactULDTrans { get; set; }
        public string RefNo { get; set; }
    }

    [KnownType(typeof(TactULDTrans))]
    public class TactULDTrans
    {
        public int ULDNo { get; set; }
        public string ULDCode { get; set; }
        public int ULDWeight { get; set; }
        public int ULDRate { get; set; }
        public bool ULDChk { get; set; }

    }
}
