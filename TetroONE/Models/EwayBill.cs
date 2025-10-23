namespace TetroONE.Models
{
    public class GetewayBillTokenRequest
    {
        public string email { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string ip_address { get; set; }
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string gstin { get; set; }
        public int SaleId { get; set; }
        public bool IsSale { get; set; }
        public long? EwayBillNumber { get; set; }
        public string? TransporterId { get; set; }
        public int? cancelRsnCode { get; set; }
        public string? cancelRmrk { get; set; }
        public string? GetDate { get; set; }

    }
    public class GetewayBillTokenResponse
    {
        public bool IsSuccess { get; set; }

    }
    public class GetewayBillResponse
    {
        public string? ewayBillNo { get; set; }
        public string? ewayBillDate { get; set; }
        public string? validUpto { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class UpdateVehicleRequest
    {
        public long? ewbNo { get; set; }
        public string? vehicleNo { get; set; }
        public string? fromPlace { get; set; }
        public int? fromState { get; set; }
        public string? reasonCode { get; set; }
        public string? reasonRem { get; set; }
        public string? transDocNo { get; set; }
        public string? transDocDate { get; set; }
        public string? transMode { get; set; }
    }
    public class UpdateVehicleResponse
    {
        public string? vehUpdDate { get; set; }
        public string? validUpto { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class CancelEWBRequest
    {
        public long? ewbNo { get; set; }
        public int? cancelRsnCode { get; set; }
        public string? cancelRmrk { get; set; }
    }
    public class CancelEWBResponse
    {
        public string? ewayBillNo { get; set; }
        public string? cancelDate { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class RejectEWBRequest
    {
        public long? ewbNo { get; set; }
    }
    public class RejectEWBResponse
    {
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class UpdateTransporterRequest
    {
        public long? ewbNo { get; set; }
        public string? transporterId { get; set; }
    }
    public class UpdateTransporterResponse
    {
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class ExtendValidityRequest
    {
        public long? ewbNo { get; set; }
        public string? vehicleNo { get; set; }
        public string? fromPlace { get; set; }
        public int? fromState { get; set; }
        public int? remainingDistance { get; set; }
        public string? transDocNo { get; set; }
        public string? transDocDate { get; set; }
        public string? transMode { get; set; }
        public int? extnRsnCode { get; set; }
        public string? extnRemarks { get; set; }
        public int? fromPincode { get; set; }
        public string? consignmentStatus { get; set; }
        public string? transitType { get; set; }
        public string? addressLine1 { get; set; }
        public string? addressLine2 { get; set; }
        public string? addressLine3 { get; set; }
    }

    public class ExtendValidityResponse
    {
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
    public class GetEWBRequest
    {
        public long? ewbNo { get; set; }
        public string? date { get; set; }
    }
    public class GetewayBillByDateResponse
    {
        public List<EwayBillDataList> Data { get; set; } = new List<EwayBillDataList>();
        public string StatusDescription { get; set; }
        public bool IsSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }

    public class EwayBillDataList
    {
        public long ewbNo { get; set; }
        public string ewbDate { get; set; }
        public string status { get; set; }
        public string genGstin { get; set; }
        public string docNo { get; set; }
        public string docDate { get; set; }
        public int delPinCode { get; set; }
        public int delStateCode { get; set; }
        public string delPlace { get; set; }
        public string validUpto { get; set; }
        public int extendedTimes { get; set; }
        public string rejectStatus { get; set; }
    }
}
