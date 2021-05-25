using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Master
{
    #region AirCraft Description
    /*
	*****************************************************************************
	Class Name:		AirCraft   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 Apr 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(AirCraft))]
    public class AirCraft
    {
        public int SNo { get; set; }
        public string AircraftType { get; set; }
        public Decimal VolumeWeight { get; set; }
        public int VolumeWeightType { get; set; }
        public string strVolumeWeightType { get; set; }
        public int StructuralCapacity { get; set; }
        public Decimal GrossWeight { get; set; }
        public int GrossWeightType { get; set; }
        public string strGrossWeightType { get; set; }
        public Decimal MaxGrossWtPiece { get; set; }
        public Decimal MaxVolumePiece { get; set; }
        public bool BodyType { get; set; }
        public string strBodyType { get; set; }
        public Nullable<int> CargoClassification { get; set; }
        public string strCargoClassification { get; set; }
        public string AircraftVersion { get; set; }
        public string LowerDeckPalletQty { get; set; }
        public string UpperDeckPalletQty { get; set; }
        public string LowerDeckContainerQty { get; set; }
        public string Position { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string ABBRCodeSNo { get; set; }
        public string Text_ABBRCodeSNo { get; set; }

        public int AirlineSNo { get; set; }

        public string Text_AirlineSNo { get; set; }
        //#region Aircraft Inventory
        public int AirCraftInventorySNo { get; set; }
        //public int AirCraftInventoryAirCraftSNo { get; set; }
        //public string AirCraftInventoryRegistrationNo { get; set; }
        //public bool AirCraftInventoryIsActive { get; set; }
        //public string AirCraftInventoryActive { get; set; }
        //#endregion

        //#region AirCraft Inventory Pax Factor
        //public int AirCraftInventoryPaxFactorSNo { get; set; }
        //public int AirCraftInventoryPaxFactorAirCraftInventorySNo { get; set; }
        //public int AirCraftInventoryPaxFactorPaxStart { get; set; }
        //public int AirCraftInventoryPaxFactorPaxEnd { get; set; }
        //public Nullable<Decimal> AirCraftInventoryPaxFactorIncreaseFactor { get; set; }
        //public bool AirCraftInventoryPaxFactorIsActive { get; set; }
        //public string AirCraftInventoryPaxFactorActive { get; set; }
        //#endregion
    }

    [KnownType(typeof(AirCraftInventory))]
    public class AirCraftInventory
    {
        public int SNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string RegistrationNo { get; set; }
        public int IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(AirCraftInventoryPaxFactor))]
    public class AirCraftInventoryPaxFactor
    {
        public int SNo { get; set; }
        public string AirCraftInventorySNo { get; set; }
        public int PaxStart { get; set; }
        public int PaxEnd { get; set; }
        public string IncreaseFactor { get; set; }
        public int IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string HdnAirCraftInventorySNo { get; set; }
    }

    [KnownType(typeof(AirCraftDoor))]
    public class AirCraftDoor
    {
        public int SNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string DoorName { get; set; }
        public int UnitType { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string strUnitType { get; set; }
        public decimal Length { get; set; } // by arman date : 18-05-2017  for length as given in tabletype
    }


    [KnownType(typeof(AirCraftULD))]
    public class AirCraftULD
    {
        public int SNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string ULDTypeSNo { get; set; }
        public string ContourType { get; set; }
        public string HdnContourType { get; set; }
        public string DeckType { get; set; }
        public int Unit { get; set; }
        public string VolumeWeight { get; set; }
        public string GrossWeight { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string strDeckType { get; set; }
        public String HdnULDTypeSNo { get; set; }
    }

    [KnownType(typeof(AirCraftSPHC))]
    public class AirCraftSPHC
    {
        public string HdnSPHCSNo { get; set; }
        public string SPHCSNo { get; set; }
        public int SNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string IsCompatible { get; set; }
        public string Compatible { get; set; }
        public string AFT { get; set; }
        public string FWD { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }


    }

    [KnownType(typeof(AirCraftCapacity))]
    public class AirCraftCapacity
    {
        public int SNo { get; set; }
        public string AirCraftSNo { get; set; }
        public string AirCraftInventorySNo { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationSNo { get; set; }
        public string FlyingMinutesStart { get; set; }
        public string FlyingMinuteEnd { get; set; }
        public string VolumeWeight { get; set; }
        public string VolumeWeightType { get; set; }
        public string GrossWeight { get; set; }
        public string GrossWeightType { get; set; }
        public string MaxGrossWtPiece { get; set; }
        public string ReportGrossWeight { get; set; }
        public string AlertVolumeWeight { get; set; }
        public string AlertGrossWeight { get; set; }
        public string LeverageGrossWeight { get; set; }
        public string LeverageVolumeWeight { get; set; }
        public string LeverageAlertGrossWeight { get; set; }
        public string LeverageAlertVolumeWeight { get; set; }
        public string LowerDeckPalletQty { get; set; }
        public string UpperDeckPalletQty { get; set; }
        public string LowerDeckContainerQty { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string strVolumeWeightType { get; set; }
        public string strGrossWeightType { get; set; }
        public string Text_AirCraftSNo { get; set; }
        public string Text_AirCraftInventorySNo { get; set; }
        public string Text_OriginSNo { get; set; }
        public string Text_DestinationSNo { get; set; }

        public int AirlineSNo { get; set; }

        public string Text_AirlineSNo { get; set; }

        //public int SNo { get; set; }
        //public int AirCraftSNo { get; set; }
        //public int AirCraftInventorySNo { get; set; }
        //public int OriginSNo { get; set; }
        //public int DestinationSNo { get; set; }
        //public Nullable<int> FlyingMinutesStart { get; set; }
        //public Nullable<int> FlyingMinuteEnd { get; set; }
        //public Decimal VolumeWeight { get; set; }
        //public int VolumeWeightType { get; set; }
        //public Decimal GrossWeight { get; set; }
        //public int GrossWeightType { get; set; }
        //public Nullable<Decimal> MaxGrossWtPiece { get; set; }
        //public Nullable<Decimal> ReportGrossWeight { get; set; }
        //public Nullable<Decimal> AlertVolumeWeight { get; set; }
        //public Nullable<Decimal> AlertGrossWeight { get; set; }
        //public Nullable<Decimal> LeverageGrossWeight { get; set; }
        //public Nullable<Decimal> LeverageVolumeWeight { get; set; }
        //public Nullable<Decimal> LeverageAlertGrossWeight { get; set; }
        //public Nullable<Decimal> LeverageAlertVolumeWeight { get; set; }
        //public Nullable<int> LowerDeckPalletQty { get; set; }
        //public Nullable<int> UpperDeckPalletQty { get; set; }
        //public Nullable<int> LowerDeckContainerQty { get; set; }
        //public bool IsActive { get; set; }
        //public string CreatedBy { get; set; }
        //public string UpdatedBy { get; set; }
        //public string Active { get; set; }
        //public string strVolumeWeightType { get; set; }
        //public string strGrossWeightType { get; set; }
        //public string Text_AirCraftSNo { get; set; }
        //public string Text_AirCraftInventorySNo { get; set; }
        //public string Text_OriginSNo { get; set; }
        //public string Text_DestinationSNo { get; set; }
    }

    [KnownType(typeof(AirCraftCapacityDoor))]
    public class AirCraftCapacityDoor
    {
        public int SNo { get; set; }
        public int AirCraftCapacitySNo { get; set; }
        public string DoorName { get; set; }
        public int UnitType { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string strUnitType { get; set; }
    }

    [KnownType(typeof(AirCraftCapacityULD))]
    public class AirCraftCapacityULD
    {
        public int SNo { get; set; }
        public int AirCraftCapacitySNo { get; set; }
        public string ULDTypeSNo { get; set; }
        public string ContourType { get; set; }
        public string HdnContourType { get; set; }
        public string DeckType { get; set; }
        public int Unit { get; set; }
        public string VolumeWeight { get; set; }
        public string GrossWeight { get; set; }
        public int IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Active { get; set; }
        public string strDeckType { get; set; }
        public String HdnULDTypeSNo { get; set; }
    }

    [KnownType(typeof(AirCraftCapacitySPHC))]
    public class AirCraftCapacitySPHC
    {
        //public int SNo { get; set; }
        //public int AirCraftCapacitySNo { get; set; }
        //public string HdnSPHCSNo { get; set; }
        //public string SPHCSNo { get; set; }
        //public int CreatedBy { get; set; }
        //public int UpdatedBy { get; set; }
        public int SNo { get; set; }
        public int AirCraftCapacitySNo { get; set; }
        public string HdnSPHCSNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string Compatible { get; set; }
        public string AFT { get; set; }
        public string FWD { get; set; }
        public string IsCompatible { get; set; }
        public string SPHCSNo { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }

    }

    [KnownType(typeof(AircraftFWD_AFT))]
    public class AircraftFWD_AFT
    {
        public int SNo { get; set; }
        public int AirCraftSNo { get; set; }
        public string HoldType { get; set; }
        public string Unit { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }

    }
    [KnownType(typeof(AirCraftSectorWiseCapacity))]
    public class AirCraftSectorWiseCapacity
    {
        public int SNo { get; set; }
        public string AirCraftSNo { get; set; }
        public string Text_AirCraftSNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string HdnOrigin { get; set; }
        public string HdnDestination { get; set; }
        public string VolumeWeight { get; set; }
        public string VolumeWeightUnit { get; set; }
        public string Text_VolumeWeightUnit { get; set; }
        public string GrossWeight { get; set; }
        public string GrossWeightUnit { get; set; }
        public string Text_GrossWeightUnit { get; set; }
        public string Active { get; set; }
        public string MaxGrossWtPiece { get; set; }
        public string MaxVolumePerPiece { get; set; }
        public string StructuralCapacity { get; set; }
        public int IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        
   
       
      
     

       

        
    }
}
