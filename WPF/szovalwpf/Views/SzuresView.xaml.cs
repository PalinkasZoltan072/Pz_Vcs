using CipoBoltAdmin.Models;
using CipoBoltAdmin.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using System.Windows.Threading;
using szovalwpf.Models;

namespace CipoBoltAdmin.Views
{
    /// <summary>
    /// Interaction logic for SzuresView.xaml
    /// </summary>
    public partial class SzuresView : UserControl
    {
        public ObservableCollection<Cipo> TalalatokCipo { get; set; } = new();
        public ObservableCollection<Felhasznalo> TalalatokFelhasznalo { get; set; } = new();
        public ObservableCollection<Rendeles> TalalatokRendeles { get; set; } = new();

        private readonly CipoService _cipoControl = new();
        private readonly FelhasznaloService _felhasznaloControl = new();
        private readonly RendelesService _rendelesControl = new();

        private readonly DispatcherTimer _debounceTimer;

        public SzuresView()
        {
            InitializeComponent();
            DataContext = this;

            _debounceTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromMilliseconds(350)
            };
            _debounceTimer.Tick += async (_, _) =>
            {
                _debounceTimer.Stop();
                await ApplyCurrentFilterAsync();
            };

            SetPanelsAndGrids();
            _ = ApplyCurrentFilterAsync();
        }

        private string SelectedType =>
            (CmbFilterType.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "Cipők";

        private void CmbFilterType_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (!IsLoaded) return;
            SetPanelsAndGrids();
            ClearCurrentInputs();
            _ = ApplyCurrentFilterAsync();
        }

        private void SetPanelsAndGrids()
        {
            PanelCipo.Visibility = Visibility.Collapsed;
            PanelFelhasznalo.Visibility = Visibility.Collapsed;
            PanelRendeles.Visibility = Visibility.Collapsed;

            GridCipo.Visibility = Visibility.Collapsed;
            GridFelhasznalo.Visibility = Visibility.Collapsed;
            GridRendeles.Visibility = Visibility.Collapsed;

            if (SelectedType == "Cipők")
            {
                PanelCipo.Visibility = Visibility.Visible;
                GridCipo.Visibility = Visibility.Visible;
            }
            else if (SelectedType == "Felhasználók")
            {
                PanelFelhasznalo.Visibility = Visibility.Visible;
                GridFelhasznalo.Visibility = Visibility.Visible;
            }
            else
            {
                PanelRendeles.Visibility = Visibility.Visible;
                GridRendeles.Visibility = Visibility.Visible;
            }
        }

        private void Filter_TextChanged(object sender, TextChangedEventArgs e)
        {
            _debounceTimer.Stop();
            _debounceTimer.Start();
        }

        private async void BtnClear_Click(object sender, RoutedEventArgs e)
        {
            ClearCurrentInputs();
            await ApplyCurrentFilterAsync();
        }
        private void Filter_TextChanged(object sender, RoutedEventArgs e)
        {
            _debounceTimer.Stop();
            _debounceTimer.Start();
        }

        private void ClearCurrentInputs()
        {
            if (SelectedType == "Cipők")
            {
                TxtNev.Text = TxtMarka.Text  = TxtTipus.Text = TxtMinAr.Text = TxtMaxAr.Text = "";
                foreach (var cb in PanelMeretek.Children.OfType<CheckBox>())
                {
                    cb.IsChecked = false;
                }
            }
            else if (SelectedType == "Felhasználók")
            {
                TxtFelhasznalonev.Text = TxtEmail.Text = TxtTelepules.Text = TxtIranyitoszam.Text = "";
            }
            else
            {
                TxtAllapot.Text = TxtFizetes.Text = TxtMinMennyiseg.Text =
                TxtMaxMennyiseg.Text = TxtCipoId.Text = TxtFelhasznaloId.Text = "";
            }
        }

        private async Task ApplyCurrentFilterAsync()
        {
            if (SelectedType == "Cipők")
                await ApplyCipoFilterAsync();
            else if (SelectedType == "Felhasználók")
                await ApplyFelhasznaloFilterAsync();
            else
                await ApplyRendelesFilterAsync();
        }

        private async Task ApplyCipoFilterAsync()
        {
            var meretek = PanelMeretek.Children
            .OfType<CheckBox>()
            .Where(c => c.IsChecked == true)
            .Select(c => int.Parse(c.Tag.ToString()))
            .ToList();
            var filter = new CipoFilter
            {
                Nev = TxtNev.Text,
                Marka = TxtMarka.Text,
                Tipus = TxtTipus.Text,
                Meretek = meretek
            };
            

           
            if (int.TryParse(TxtMinAr.Text, out int minAr)) filter.MinAr = minAr;
            if (int.TryParse(TxtMaxAr.Text, out int maxAr)) filter.MaxAr = maxAr;

            var lista = await _cipoControl.GetCipokFilteredAsync(filter);
            TalalatokCipo.Clear();
            foreach (var c in lista) TalalatokCipo.Add(c);
            TxtInfo.Text = $"Találatok: {lista.Count}";
        }

        private async Task ApplyFelhasznaloFilterAsync()
        {

            var filter = new FelhasznaloFilter
            {
                Felhasznalonev = TxtFelhasznalonev.Text,
                Email = TxtEmail.Text,
                Telepules = TxtTelepules.Text
            };

            if (int.TryParse(TxtIranyitoszam.Text, out int irsz)) filter.Iranyitoszam = irsz;

            var lista = await _felhasznaloControl.GetFelhasznalokFilteredAsync(filter);
            TalalatokFelhasznalo.Clear();
            foreach (var f in lista) TalalatokFelhasznalo.Add(f);
            TxtInfo.Text = $"Találatok: {lista.Count}";
        }

        private async Task ApplyRendelesFilterAsync()
        {
            var filter = new RendelesFilter
            {
                Allapot = TxtAllapot.Text,
                Fizetes = TxtFizetes.Text
            };

            if (int.TryParse(TxtMinMennyiseg.Text, out int minM)) filter.MinMennyiseg = minM;
            if (int.TryParse(TxtMaxMennyiseg.Text, out int maxM)) filter.MaxMennyiseg = maxM;
            if (int.TryParse(TxtCipoId.Text, out int cipoId)) filter.CipoId = cipoId;
            if (int.TryParse(TxtFelhasznaloId.Text, out int felhId)) filter.FelhasznaloId = felhId;

            var lista = await _rendelesControl.GetRendelesekFilteredAsync(filter);
            TalalatokRendeles.Clear();
            foreach (var r in lista) TalalatokRendeles.Add(r);
            TxtInfo.Text = $"Találatok: {lista.Count}";
        }

        
    
    }
}