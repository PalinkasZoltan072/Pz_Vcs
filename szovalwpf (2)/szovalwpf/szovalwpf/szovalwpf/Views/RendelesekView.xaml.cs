using CipoBoltAdmin.Models;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace CipoBoltAdmin.Views
{
    public partial class RendelesekView : UserControl
    {
        public Rendeles? SelectedRendeles { get; set; }

        public ObservableCollection<Rendeles> Rendelesek { get; set; } = new ObservableCollection<Rendeles>();
        RendelesControl rendelescontrol;
        public RendelesekView()
        {
            InitializeComponent();
            DataContext = this;
            rendelescontrol = new RendelesControl();
            _ = LoadRendelesekAsync();
        }

        private async Task LoadRendelesekAsync()
        {
            var lista = await rendelescontrol.GetRendelesekAsync();

            Rendelesek.Clear();
            foreach (var r in lista)
                Rendelesek.Add(r);
        }


        private async void BtnModifyStatus_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedRendeles == null)
            {
                MessageBox.Show("Előbb válassz ki egy rendelést!");
                return;
            }

            if (SelectedRendeles.Allapot != "szállítás alatt")
            {
                MessageBox.Show(
                    "Csak 'szállítás alatt' állapotú rendelés módosítható!",
                    "Nem módosítható",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning
                );
                return;
            }

            var res = MessageBox.Show(
                "Biztosan kiszállítottra állítod?",
                "Állapot módosítása",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question
            );

            if (res != MessageBoxResult.Yes)
                return;

            bool ok = await rendelescontrol.UpdateAllapotAsync(
                SelectedRendeles.Id,
                "kiszállítva"
            );

            if (ok)
            {
                MessageBox.Show("Rendelés állapota frissítve!");
                await LoadRendelesekAsync();
            }
        }

        
        private async void BtnDeleteOrder_Click(object sender, RoutedEventArgs e)
        {
            if (SelectedRendeles == null)
            {
                MessageBox.Show("Előbb válassz ki egy rendelést!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var res = MessageBox.Show(
                $"Biztos törlöd ezt a rendelést?\n\nRendelés ID: {SelectedRendeles.Id}",
                "Törlés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (res != MessageBoxResult.Yes) return;

            bool ok = await rendelescontrol.DeleteRendelesAsync(SelectedRendeles.Id);

            if (ok)
            {
                MessageBox.Show("Rendelés törölve!", "OK",
                    MessageBoxButton.OK, MessageBoxImage.Information);

                SelectedRendeles = null;
                await LoadRendelesekAsync(); // nálad lehet LoadRendelesekAsync vagy LoadRendelesek
            }
        }

        




    }
}
