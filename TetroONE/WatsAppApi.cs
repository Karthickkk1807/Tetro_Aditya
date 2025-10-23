using Newtonsoft.Json;
using System.Text;

namespace TetroONE
{
    public static class WatsAppApi
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        public static async Task<string> SendWatsAppMessageInventoryPDF(string mobile_number, string template_id, string header_document_url, Dictionary<string, object> dynamicVariables)
        {
            var requestData = new
            {
                mobile_number = mobile_number,
                variable = dynamicVariables,
                header_document_url = header_document_url,
                template_id = template_id
            };

            var jsonContent = JsonConvert.SerializeObject(requestData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            string apiUrl = "https://app.kwic.in/api/v1/push?api_key=6720ba5f01ad8d9bbf3dafe1&sms=1";

            try
            {
                var response = await _httpClient.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    return $"Failed to send API request. Status code: {(int)response.StatusCode}";
                }
            }
            catch (HttpRequestException ex)
            {
                return $"Internal server error: {ex.Message}";
            }
        }

        public static async Task<string> SendOTP(string mobileNumber, string otp, string template)
        {
            var requestData = new
            {
                mobile_number = mobileNumber,
                variable = new Dictionary<string, string>
                {
                    { "CurrentOTP", otp } // Use a dictionary to define the key-value pair
                },
                template_id = template
            };

            // Serialize JSON data
            var jsonContent = JsonConvert.SerializeObject(requestData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Define API URL
            string apiUrl = "https://app.kwic.in/api/v1/push?api_key=6720ba5f01ad8d9bbf3dafe1&sms=1"; // replace with your actual endpoint

            try
            {
                // Send POST request
                var response = await _httpClient.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    // Handle success
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    // Handle error
                    return $"Failed to send API request. Status code: {(int)response.StatusCode}";
                }
            }
            catch (HttpRequestException ex)
            {
                // Log or handle error as needed
                return $"Internal server error: {ex.Message}";
            }
        }

        // sample code

        //public static async Task<string> ResigisterSuccessUser(string whatsappNo, string name, string template)
        //{
        //    // Define your JSON data
        //    var requestData = new
        //    {
        //        mobile_number = whatsappNo,
        //        variable = new
        //        {
        //            customer_name = name,
        //        },
        //        template_id = template
        //    };

        //    // Serialize JSON data
        //    var jsonContent = JsonConvert.SerializeObject(requestData);
        //    var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        //    // Define API URL
        //    string apiUrl = "https://app.kwic.in/api/v1/push?api_key=6720ba5f01ad8d9bbf3dafe1&sms=1"; // replace with your actual endpoint

        //    try
        //    {
        //        // Send POST request
        //        var response = await _httpClient.PostAsync(apiUrl, content);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            // Handle success
        //            return await response.Content.ReadAsStringAsync();
        //        }
        //        else
        //        {
        //            // Handle error
        //            return $"Failed to send API request. Status code: {(int)response.StatusCode}";
        //        }
        //    }
        //    catch (HttpRequestException ex)
        //    {
        //        // Log or handle error as needed
        //        return $"Internal server error: {ex.Message}";
        //    }
        //}


    }
}
