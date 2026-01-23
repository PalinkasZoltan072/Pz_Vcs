using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;

namespace CipoBoltAdmin
{
    public partial class Regisztracio : Window
    {
        public Regisztracio()
        {
            InitializeComponent();
        }

        private async void BtnRegister_Click(object sender, RoutedEventArgs e)
        {
            string user = TxtUser.Text.Trim();
            string email = TxtEmail.Text.Trim();
            string pass1 = TxtPass1.Password.Trim();
            string pass2 = TxtPass2.Password.Trim();

            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(pass1))
            {
                MessageBox.Show("Minden mezőt tölts ki!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!email.Contains("@") || !email.Contains("."))
            {
                MessageBox.Show("Az email formátuma nem jó!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (pass1 != pass2)
            {
                MessageBox.Show("A két jelszó nem egyezik!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            bool ok = await RegisterAsync(user, email, pass1);

            if (!ok)
            {
                MessageBox.Show("Nem sikerült regisztrálni (lehet már létezik).", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            MessageBox.Show("Sikeres regisztráció! Most jelentkezz be.", "OK",
                MessageBoxButton.OK, MessageBoxImage.Information);

            new Login().Show();
            Close();
        }

        private void GoLogin_Click(object sender, RoutedEventArgs e)
        {
            new Login().Show();
            Close();
        }

        private async System.Threading.Tasks.Task<bool> RegisterAsync(string user, string email, string pass)
        {
            try
            {
                using HttpClient client = new HttpClient();

                var body = new
                {
                    felhasznalonev = user,
                    email = email,
                    jelszo = pass
                };

                string json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Új admin létrehozása -> DB adja az ID-t
                string url = "http://localhost:4000/adminok";
                var res = await client.PostAsync(url, content);

                return res.IsSuccessStatusCode;
            }
            catch
            {
                MessageBox.Show("Nem érem el a szervert (backend).", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }
    }
}
