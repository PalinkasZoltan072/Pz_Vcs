using CipoBoltAdmin.Models;
using szovalwpf.Models;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin.Tests
{
    [TestFixture]
    public class CipoControlTests
    {
        private CipoService control;
        private AdminService admin;

        [SetUp]
        public async Task Setup()
        {
            // Token törlése a biztonság kedvéért
            ApiClient.ClearToken();

            admin = new AdminService();

            //  Megpróbálunk belépni a seedelt adminnal
            bool ok = await admin.LoginAsync("admin@gmail.com", "admin123");

            //  HA NINCS ILYEN ADMIN, a teszt automatikusan létrehozza!
            if (!ok)
            {
                await admin.RegisterAsync("admin", "admin@gmail.com", "admin123");
                // Újra megpróbálunk belépni
                ok = await admin.LoginAsync("admin@gmail.com", "admin123");
            }

            Assert.IsTrue(ok, "Admin login failed in test setup");

            //  Itt a control példányosítása fájlonként változik!
             control = new CipoService();
            
        }

       

        [Test]
        public async Task GetCipokAsync_ShouldReturnList()
        {
           
            var result = await control.GetCipokAsync();

            
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Cipo>>(result);
        }

        

        [Test]
        public async Task CreateCipoAsync_ValidData_ShouldReturnTrue()
        {
            
            var result = await control.CreateCipoAsync(
                "TesztCipo",
                "Nike",
                20000,
                "focicipõ"
            );

            
            Assert.IsNotNull(result);
            Assert.AreEqual("TesztCipo", result.Nev);

            
            bool isDeleted = await control.DeleteCipoAsync(result.Id);
            Assert.IsTrue(isDeleted, "A tesztcipõ törlése nem sikerült a teszt végén!");
        }

        
        [Test]
        public async Task CreateCipoAsync_InvalidData_ShouldReturnFalse()
        {
            var result = await control.CreateCipoAsync(
                "",
                "",
                -100,
                ""
            );

            
            Assert.IsNull(result);
        }

        

        [Test]
        public async Task UpdateArAsync_ExistingId_ShouldReturnTrue()
        {
            bool result = await control.UpdateArAsync(1, 25000);

            Assert.IsTrue(result);
        }

        
        [Test]
        public async Task UpdateArAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.UpdateArAsync(-1, 25000);

            Assert.IsFalse(result);
        }

        
        [Test]
        public async Task DeleteCipoAsync_ValidId_ShouldReturnTrue()
        {
            
            var createdCipo = await control.CreateCipoAsync(
                "DeleteTesztCipo",
                "Adidas",
                19000,
                "focicipõ"
            );

            Assert.IsNotNull(createdCipo);

            
            bool deleted = await control.DeleteCipoAsync(createdCipo.Id);

            
            Assert.IsTrue(deleted);
        }

     
        [Test]
        public async Task DeleteCipoAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.DeleteCipoAsync(-5);

            Assert.IsFalse(result);
        }

        
        

        [Test]
        public async Task GetCipokFilteredAsync_FilterByMarka_ShouldReturnList()
        {
            var filter = new CipoFilter
            {
                Marka = "Nike"
            };

            var result = await control.GetCipokFilteredAsync(filter);

            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Cipo>>(result);
        }

        
        [Test]
        public async Task GetCipokFilteredAsync_EmptyFilter_ShouldReturnList()
        {
            var filter = new CipoFilter();

            var result = await control.GetCipokFilteredAsync(filter);

            Assert.IsNotNull(result);
        }
    }
}