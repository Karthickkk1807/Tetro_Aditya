namespace TetroONE.Models
{
	public class CommonDrop
	{
		public int LoginUserId { get; set; }
		public int? MasterInfoId { get; set; }
		public string ModuleName { get; set; }
	}

    public class GetInventoryStatusDetails
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleId { get; set; }
    }
    public class GetAutoGenerate
	{
		public int LoginUserId { get; set; }
		public string ModuleName { get; set; }
        public int? FranchiseId { get; set; }
    }
    public class GetBillingAddress
    {
        public int LoginUserId { get; set; }
        public int? ModuleId { get; set; }
        public string? ModuleName { get; set; }
    }
    public class GetEmailDetails
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int ModuleId { get; set; }
       
    }

    public class GetInventoryWhatsappDetails
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }
        public int ModuleId { get; set; }
    }
    public class GetVendorDetails
    {
        public int LoginUserId { get; set; }

        public int? VendorId { get; set; }
    }

    public class BillFromDetails_BillFromId
    {
        public int LoginUserId { get; set; }

        public int? ModuleId { get; set; }
        public string ModuleName { get; set; }
    }

    public class DistributorDetailsByDistributorId
    {
        public int LoginUserId { get; set; }

        public int? DistributorId { get; set; }
    }
    public class GetClientDetails
    {
        public int LoginUserId { get; set; }

        public int? ClientId { get; set; }
    }
    public class GetPreview
	{
		public int LoginUserId { get; set; }
		public int ModuleId { get; set; }
		public string ModuleName { get; set; }
	}

	public class GetTAModel
	{
		public int LoginUserId { get; set; }
		public string ModuleName { get; set; }
		public int ModuleId { get; set; }
	}

	public class InsertTimeAndAction
	{
		public int LoginUserId { get; set; }
		public string ModuleName { get; set; }
		public int ModuleId { get; set; }
		public string ProcessName { get; set; }
		public string SampleTAActivityName { get; set; }
		public string TimeAndActionValue { get; set; }


	}


	public class GetNotification
	{
		public int LoginUserId { get; set; }
		public int? NotificationId { get; set; }
	}
    public class AttachmentTable
    {
        public int? AttachmentId { get; set; }
        public string ModuleName { get; set; }
        public int? ModuleRefId { get; set; }
        public string AttachmentFileName { get; set; }
        public string AttachmentFilePath { get; set; }
        public string AttachmentExactFileName { get; set; }

    }

}
