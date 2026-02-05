using CipoBoltAdmin.Views;
using System.Windows;

namespace CipoBoltAdmin
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            ShowDashboard();
        }

        private void ShowDashboard()
        {
            TxtPageTitle.Text = "Dashboard";
            MainContent.Content = null;
        }

        private void ShowCipok()
        {
            TxtPageTitle.Text = "Cipők";
            MainContent.Content = new CipokView();
        }

        private void BtnDashboard_Click(object sender, RoutedEventArgs e) => ShowDashboard();
        private void BtnCipok_Click(object sender, RoutedEventArgs e) => ShowCipok();

        private void BtnFelhasznalok_Click(object sender, RoutedEventArgs e)
        {
            TxtPageTitle.Text = "Felhasználók";
            MainContent.Content = new FelhasznalokView();
        }

        private void BtnRendelesek_Click(object sender, RoutedEventArgs e)
        {
            TxtPageTitle.Text = "Rendelések";
            MainContent.Content = new RendelesekView();
        }

        private void BtnLogout_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
        private void BtnSzures_Click(object sender, RoutedEventArgs e)
        {
            TxtPageTitle.Text = "Szűrés";
            MainContent.Content = new SzuresView();
        }





    }
}
