1. Simple usage:

Add nuget package Wcf.AttributeValidation.
Mark your incoming datacontract with validation attributes:

	[DataContract]
    public class CompositeType
    {

        [DataMember]
        [Required]
        public bool? BoolValue { get; set; }

        [DataMember]
        public string StringValue { get; set; }

        [DataMember]
        [NotEmptyEnumerable]
        public List<CollectionObjectType> CollectionValue { get; set; }
    }

Mark your service contract operations with FaultContract(typeof(ValidationError)) attribute:

		[OperationContract]
        [FaultContract(typeof(ValidationError))]
        CompositeType GetDataUsingDataContract(CompositeType composite);

Add in config endpointbehavior to service:

      <service name="Wcf.AttributeValidation.Example.ServiceExample">
        <endpoint behaviorConfiguration="ValidationEndpointBehavior" binding="basicHttpBinding" contract="Wcf.AttributeValidation.Example.IServiceExample" address="">
        </endpoint>
      </service>

Get profit of attribute validation in wcf.
