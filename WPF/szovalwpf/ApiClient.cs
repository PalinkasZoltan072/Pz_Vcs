using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace CipoBoltAdmin
{
    public static class ApiClient
    {
        public static HttpClient Client { get; } = new HttpClient();
        
        public static void SetToken(string token)
        {
            Client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }

        public static void ClearToken()
        {
            Client.DefaultRequestHeaders.Authorization = null;
            
        }
    }
}
