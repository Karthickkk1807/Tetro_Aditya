using System.Data;
using System.Diagnostics;

namespace TetroONE.Models
{
    public class GetUserAcces
    {
        public int LoginUserId { get; set; }
        public int PlantId { get; set; }
        public string Category { get; set; }
        public int Value { get; set; }
        public string? Search { get; set; }

    }

    public class GetReportValueUserAcces
    {
        public int LoginUserId { get; set; }
        public string ModuleName { get; set; }

    }

    public class UseraccessRequest
    {
        public int ModuleActionId { get; set; }
        public int UserGroupId { get; set; }
        public bool IsActive { get; set; }

    }
    public class UpdateUseraccess
    {
        public int LoginUserId { get; set; }
        public List<UserActionMappingDetails> userActionMappingDetails { get; set; }
        public DataTable TVP_UserActionMappingDetails { get; set; }
    }

    public class UserActionMappingDetails
    {
        public int? UserActionMappingId { get; set; }
        public int? UserId { get; set; }
        public int? ModuleActionId { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserAccess
    {
        public byte UserGroupId { get; set; }
        public byte ActionId { get; set; }
        public string Module { get; set; }
        public string ModuleAction { get; set; }
        public Int32 IsHasAccess { get; set; }
    }
    public class UserAccessOption
    {
        public bool Create { get; set; }
        public bool View { get; set; }
        public bool Update { get; set; }
        public bool Delete { get; set; }
    }

    public class UserScreen
    {
        public const string MyProfile = "MyProfile";
        public const string ManageUser = "ManageUser";
        public const string UserAccess = "UserAccess";
        public const string Settings = "Settings";

        public const string HumanResource = "HumanResource";
        public const string Recruitment = "Recruitment";
        public const string Employee = "Employee";
        public const string Shift = "Shift";
        public const string Attendance = "Attendance";
        public const string Leave = "Leave";

        public const string Permission = "Leave"; //---- Need to Add
        
        public const string Claim = "Claim"; 

        public const string PayRoll = "PayRoll";
        public const string ExitManagement = "Exit Management";
        public const string CompanyDocs = "Docs Info"; 

        public const string Contact = "Contact";
        public const string Vendor = "Vendor";
        public const string Clients = "Clients";
        public const string ServiceEngr = "Service Engr";
        public const string JobWorkers = "Job Workers";

        public const string Inventory = "Inventory";
        public const string Product = "Product(BOM)";
        public const string ManageStock = "ManageStock";
        public const string Transfer = "Transfer"; 

        public const string Purchase = "Purchase";
        public const string PurchaseReqRFQ = "Purchase Req/RFQ";
        public const string ProposalReqREP = "Proposal Req/REP";
        public const string PurchaseOrder = "Purchase Order";
        public const string PurchaseInvoice = "Purchase Invoice";
        public const string PurchaseReturn = "Purchase Return";

        public const string Sale = "Sale";
        public const string Quotation = "Quotation";
        public const string SaleOrder = "Sale Order";
        public const string TaxInvoice = "Tax Invoice";
        public const string SaleReturn = "Sale Return";
        public const string SecondarySales = "Secondary Sales";

        public const string Finance = "Finance";
        public const string GLPayment = "GL & Payment";
        public const string Expense = "Expense";
        public const string FinancialPlanning = "Financial Planning";
        public const string ProfitAnalysis = "Profit Analysis";

        public const string Productions = "Productions";
        public const string JobOrder = "Job Order";
        public const string Sample = "Sample"; 
        public const string ProductionPlan = "Production Plan";
        public const string Production = "Production";

        public const string QMS = "QMS";
        public const string InwardQC = "Inward QC";
        public const string InProcessQC = "In-Process QC";
        public const string FinalQC = "Final QC";

		public const string Logistics = "Logistics";
        public const string TargetvsActual = "Target vs Actual";
        public const string DeliveryPlan = "Delivery Plan";
        public const string Inward = "Inward";
        public const string OutWard = "OutWard";

        public const string Maintenance = "Maintenance";
        public const string MaintenancePlan = "Maintenance Plan";
        public const string MaintenanceLog = "Maintenance Log";
        public const string Service = "Service";
        public const string DowntimeTracking = "Downtime Tracking";

        public const string Asset = "Asset";
        public const string AssetInfo = "Asset Info";
        public const string QRGeneration = "QR Generation";
        public const string AssetMapRet = "Asset Map/Ret";
        public const string AssetTransfer = "Asset Transfer";
        public const string Auding = "Auding";
        public const string Scrap = "Scrap";

        public const string CRM = "CRM";
        public const string Enquiry = "Enquiry";
        public const string Visitor = "Visitor";
        public const string Ticketing = "Ticketing";
        public const string Campaigns = "Campaigns";
        public const string Surveys = "Surveys";

        public const string Reports = "Reports";
        public const string Dashboard = "Dashboard";

        public const string View = "View";


    }
}
