using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace CipoBoltAdmin
{
    class FelhasznaloControl
        //szűrés kell  és az alapján kellenek Get-ek backendbe ugye specifikusan

        // és így ugye példányosítani fogjuk a xamlekben 
    { // irok egy függvényt ami az apin keresztul eléri az adatok és a modelben lévő osztályokat kihasznalva visszaadja az adatokat
        //using HttpClient client = new HttpClient(); így nem szabad  -> 50nél több adatnál már nem vagyis így rossz nekunk
        // csinalunk itt a control osztalyban egy httpclientet amit egyszer példányosítunk és azt az egy példányt használjuk minden meghívásnál
        // a "TAskos" delete, patcheket.... kiszervezni ide mert az a logika ahol httpclientet hasznalnank
        
        private HttpClient client = new HttpClient();

    public async Task<bool> DeleteFelhasznaloAsync(int id)
        {
            try
            {
                

                string url = $"http://localhost:4000/felhasznalok/{id}";
                var res = await client.DeleteAsync(url);

                if (!res.IsSuccessStatusCode)
                {
                    string err = await res.Content.ReadAsStringAsync();
                    MessageBox.Show($"Nem sikerült törölni!\nHTTP: {(int)res.StatusCode}\n{err}",
                        "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return false;
                }

                return true;
            }
            catch (System.Exception ex)
            {
                MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }
    }
}
