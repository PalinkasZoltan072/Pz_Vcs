using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using szovalwpf.Models;
using CipoBoltAdmin.Models;

namespace CipoBoltAdmin.Services
{
    public class CipoService
    {
        private HttpClient client = ApiClient.Client;

        private const string BASE_URL = "http://localhost:4000/cipok";
        private const string CIPO_URL = BASE_URL + "/";

        // ===== GET =====
        public async Task<List<Cipo>> GetCipokAsync()
        {
            try
            {
                var res = await client.GetAsync(BASE_URL);
                res.EnsureSuccessStatusCode();

                var json = await res.Content.ReadAsStringAsync();

                var lista = JsonSerializer.Deserialize<List<Cipo>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return lista ?? new List<Cipo>();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Nem sikerült betölteni a cipőket!\n" + ex.Message);
                return new List<Cipo>();
            }
        }


        // ===== CREATE CIPO =====
        // ===== MÓDOSÍTÁS: nincs többé méret =====

        public async Task<Cipo?> CreateCipoAsync(string nev, string marka, int ar, string tipus)
        {
            try
            {
                var json = JsonSerializer.Serialize(new
                {
                    nev,
                    marka,
                    ar,
                    tipus
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var res = await client.PostAsync(BASE_URL, content);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();

                    MessageBox.Show(
                        $"Nem sikerült létrehozni!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );

                    return null;
                }

                var responseJson = await res.Content.ReadAsStringAsync();

                var ujCipo = JsonSerializer.Deserialize<Cipo>(
                    responseJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return ujCipo;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return null;
            }
        }


        // ===== ÚJ: MÉRET HOZZÁADÁSA =====

        public async Task<bool> AddCipoMeretAsync(int cipoId, List<int> meret)
        {
            try
            {
                var json = JsonSerializer.Serialize(new
                {
                    meretek = meret   //  JAVÍTÁS
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var res = await client.PostAsync($"{BASE_URL}/{cipoId}/meretek", content);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();

                    MessageBox.Show(
                        $"Méret hozzáadás sikertelen!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );

                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }


        // ===== PATCH (ár módosítás) =====

        public async Task<bool> UpdateArAsync(int id, int ujAr)
        {
            try
            {
                var json = JsonSerializer.Serialize(new { ar = ujAr });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var req = new HttpRequestMessage(HttpMethod.Patch, $"{BASE_URL}/{id}")
                {
                    Content = content
                };

                var res = await client.SendAsync(req);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();

                    MessageBox.Show(
                        $"Nem sikerült módosítani!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );

                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }


        // ===== DELETE =====

        public async Task<bool> DeleteCipoAsync(int id)
        {
            try
            {
                var res = await client.DeleteAsync($"{BASE_URL}/{id}");

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();

                    MessageBox.Show(
                        $"Nem sikerült törölni!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );

                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }


        // ===== FILTERES GET =====

        public async Task<List<Cipo>> GetCipokFilteredAsync(CipoFilter filter)
        {
            try
            {
                var filterParams = new List<string>();

                if (!string.IsNullOrWhiteSpace(filter.Nev))
                    filterParams.Add("nev=" + Uri.EscapeDataString(filter.Nev.Trim()));

                if (!string.IsNullOrWhiteSpace(filter.Marka))
                    filterParams.Add("marka=" + Uri.EscapeDataString(filter.Marka.Trim()));

                if (!string.IsNullOrWhiteSpace(filter.Tipus))
                    filterParams.Add("tipus=" + Uri.EscapeDataString(filter.Tipus.Trim()));

                if (filter.Meretek != null && filter.Meretek.Count > 0)
                {
                    filterParams.Add("meret=" + string.Join(",", filter.Meretek));
                }

                if (filter.MinAr.HasValue)
                    filterParams.Add("minAr=" + filter.MinAr.Value);

                if (filter.MaxAr.HasValue)
                    filterParams.Add("maxAr=" + filter.MaxAr.Value);

                string url = CIPO_URL;

                if (filterParams.Count > 0)
                    url += "?" + string.Join("&", filterParams);

                var res = await client.GetAsync(url);

                res.EnsureSuccessStatusCode();

                var json = await res.Content.ReadAsStringAsync();

                var lista = JsonSerializer.Deserialize<List<Cipo>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                return lista ?? new List<Cipo>();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Szűrés sikertelen!\n" + ex.Message);
                return new List<Cipo>();
            }
        }


        // ===== KÉP HOZZÁADÁS =====

        public async Task<bool> AddCipoKepAsync(int cipoId, List<string> urls)
        {
            try
            {
                var json = JsonSerializer.Serialize(new
                {
                    urls
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var res = await client.PostAsync($"{BASE_URL}/{cipoId}/kepek", content);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();

                    MessageBox.Show(
                        $"Kép(ek) feltöltése sikertelen!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );

                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }
    }
}