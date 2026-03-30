using CipoBoltAdmin.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CipoBoltAdmin.Views
{
    /// <summary>
    /// Interaction logic for UserControl1.xaml
    /// </summary>
    public partial class AdminCreateView : UserControl
    {
        private AdminService adminControl = new AdminService();

        public AdminCreateView()
        {
            InitializeComponent();
        }

        private async void BtnCreateAdmin_Click(object sender, RoutedEventArgs e)
        {
            string user = TxtUser.Text.Trim();
            string email = TxtEmail.Text.Trim();
            string pass = TxtPassword.Password.Trim();

            if (string.IsNullOrWhiteSpace(user) ||
                string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(pass))
            {
                MessageBox.Show("Minden mezőt tölts ki!");
                return;
            }

            bool ok = await adminControl.RegisterAsync(user, email, pass);

            if (!ok)
            {
                MessageBox.Show("Nem sikerült létrehozni az admint.");
                return;
            }

            MessageBox.Show("Admin sikeresen létrehozva!");

            TxtUser.Text = "";
            TxtEmail.Text = "";
            TxtPassword.Password = "";
        }
    }
}
