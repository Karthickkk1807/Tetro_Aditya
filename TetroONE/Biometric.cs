using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.IO.Compression;
using System.Text;
using TetroONE.Models;

namespace TetroONE
{
	public static class Biometric
	{
	
		public static async Task<ActionResult> BlockUnblockEmployeeToBiomatric(string employeeCode, string employeeName, string serialNumber, string isBlock, string userName, string userPassword, string WebAddress)
		{
			var soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
			<soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
			  <soap:Body>
			    <BlockUnblockUser xmlns=""http://tempuri.org/"">
			      <APIKey>11</APIKey>
			      <EmployeeCode>{employeeCode}</EmployeeCode>
			      <EmployeeName>{employeeName}</EmployeeName>
			      <SerialNumber>{serialNumber}</SerialNumber>
			      <IsBlock>{isBlock}</IsBlock>
			      <UserName>{userName}</UserName>
			      <UserPassword>{userPassword}</UserPassword>
			      <CommandId>123</CommandId>
			    </BlockUnblockUser>
			  </soap:Body>
			</soap:Envelope>";

			using (var client = new HttpClient())
			{
				client.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
				client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.39.0");
				client.DefaultRequestHeaders.Add("Accept", "*/*");
				client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
				client.DefaultRequestHeaders.Add("Connection", "keep-alive");

				var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
				var webLink = $"{WebAddress}WebAPIService.asmx?op=BlockUnblockUser";

				var response = await client.PostAsync(webLink, content);

				var responseContent = await ReadResponseContentAsync(response);

				return null;
			}
		}
	

		private static async Task<string> ReadResponseContentAsync(HttpResponseMessage response)
		{
			var responseContent = string.Empty;

			if (response.Content.Headers.ContentEncoding.Contains("gzip"))
			{
				using (var responseStream = await response.Content.ReadAsStreamAsync())
				using (var decompressedStream = new GZipStream(responseStream, CompressionMode.Decompress))
				using (var streamReader = new StreamReader(decompressedStream))
				{
					responseContent = await streamReader.ReadToEndAsync();
				}
			}
			else
			{
				responseContent = await response.Content.ReadAsStringAsync();
			}

			return responseContent;
		}

		
		public static async Task<ActionResult> AddEmployeeToBiomatric(string employeeCode, string employeeName, string cardNumber, string serialNumber, string userName, string userPassword, string WebAddress)
		{
			var soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
        <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
          <soap:Body>
            <AddEmployee xmlns=""http://tempuri.org/"">
              <APIKey>11</APIKey>
              <EmployeeCode>{employeeCode}</EmployeeCode> 
              <EmployeeName>{employeeName}</EmployeeName>
              <CardNumber>{cardNumber}</CardNumber> 
              <SerialNumber>{serialNumber}</SerialNumber>
              <UserName>{userName}</UserName>
              <UserPassword>{userPassword}</UserPassword>
              <CommandId>123</CommandId> 
            </AddEmployee>
          </soap:Body>
        </soap:Envelope>";


			using (var client = new HttpClient())
			{
				client.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
				client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.39.0");
				client.DefaultRequestHeaders.Add("Accept", "*/*");
				client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
				client.DefaultRequestHeaders.Add("Connection", "keep-alive");

				var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
				var webLink = $"{WebAddress}webapiservice.asmx?op=AddEmployee";
				
				var response = await client.PostAsync(webLink, content);
				
				var responseContent = await ReadResponseContentAsync(response);

				return null;
			}
		}

		public static  async Task<ActionResult> DeleteEmployeeToBiomatric(string employeeCode, string serialNumber, string userName, string userPassword, string WebAddress)
		{
			var soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
			<soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
			  <soap:Body>
			    <DeleteUser xmlns=""http://tempuri.org/"">
			      <APIKey>11</APIKey>
			      <EmployeeCode>{employeeCode}</EmployeeCode>
			      <SerialNumber>{serialNumber}</SerialNumber>
			      <UserName>{userName}</UserName>
			      <UserPassword>{userPassword}</UserPassword>
			      <CommandId>123</CommandId>
			    </DeleteUser>
			  </soap:Body>
			</soap:Envelope>";

			using (var client = new HttpClient())
			{
				client.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
				client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
				client.DefaultRequestHeaders.Add("Connection", "keep-alive");

				var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
				var webLink = $"{WebAddress}WebAPIService.asmx?op=DeleteUser";
				
				var response = await client.PostAsync(webLink, content);
				
				var responseContent = await ReadResponseContentAsync(response);

				return null;
			}
		}





	}
}
