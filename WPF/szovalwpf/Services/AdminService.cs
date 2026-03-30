using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;

namespace CipoBoltAdmin.Services
{
    public class AdminService
    {
        private HttpClient client = ApiClient.Client;
        private const string BASE_URL = "http://localhost:4000/adminok";

        public async Task<bool> LoginAsync(string email, string jelszo)
        {
            try
            {
                var body = new
                {
                    email,
                    jelszo
                };

                string json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var res = await client.PostAsync(BASE_URL + "/login", content);

                if (!res.IsSuccessStatusCode)
                {
                    MessageBox.Show(
                        "Sikertelen bejelentkezés!",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning
                    );
                    return false;
                }

                var responseJson = await res.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(responseJson);
                string token = doc.RootElement.GetProperty("token").GetString();

                ApiClient.SetToken(token);

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Kapcsolódási hiba:\n\n{ex.Message}",
                    "Hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );

                return false;
            }
        }
        public async Task<bool> RegisterAsync(string user, string email, string pass)
        {
            var body = new
            {
                felhasznalonev = user,
                email,
                jelszo = pass
            };

            string json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var res = await client.PostAsync(BASE_URL, content);

            return res.IsSuccessStatusCode;
        }
    }
}
