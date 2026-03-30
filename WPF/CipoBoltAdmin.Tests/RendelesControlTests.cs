using CipoBoltAdmin.Models;
using NUnit.Framework;
using System;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Linq;
using CipoBoltAdmin.Services;

namespace CipoBoltAdmin.Tests
{
    [TestFixture]
    public class RendelesControlTests
    {
        private RendelesService control;
        private AdminService admin;
        private const string BASE_URL = "http://localhost:4000/rendelesek";

        [SetUp]
        public async Task Setup()
        {
            ApiClient.ClearToken();
            admin = new AdminService();

            bool ok = await admin.LoginAsync("admin@gmail.com", "admin123");
            if (!ok)
            {
                await admin.RegisterAsync("admin", "admin@gmail.com", "admin123");
                ok = await admin.LoginAsync("admin@gmail.com", "admin123");
            }

            Assert.IsTrue(ok, "Admin login failed in test setup");
            control = new RendelesService();
        }

        async Task UserLogin()
        {
            ApiClient.ClearToken();
            var body = JsonSerializer.Serialize(new { email = "user@gmail.com", jelszo = "user123" });
            var content = new StringContent(body, Encoding.UTF8, "application/json");
            var res = await ApiClient.Client.PostAsync("http://localhost:4000/felhasznalok/login", content);

            Assert.IsTrue(res.IsSuccessStatusCode, "User login failed");
            var json = await res.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            string token = doc.RootElement.GetProperty("token").GetString();
            ApiClient.SetToken(token);
        }

        [Test]
        public async Task GetRendelesekAsync_ShouldReturnList()
        {
            var result = await control.GetRendelesekAsync();
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<List<Rendeles>>(result);
        }

        [Test]
        public async Task CreateRendeles_ShouldReturnCreated()
        {
            await UserLogin();
            int randomMeret = new Random().Next(30, 56);

            var body = JsonSerializer.Serialize(new
            {
                mennyiseg = 1,
                fizetes = "kártyával",
                meret = randomMeret,
                cipoId = 1
            });

            var content = new StringContent(body, Encoding.UTF8, "application/json");
            var res = await ApiClient.Client.PostAsync(BASE_URL, content);

            Assert.AreEqual(HttpStatusCode.Created, res.StatusCode);
        }

        [Test]
        public async Task UpdateRendeles_Allapot_ShouldReturnTrue()
        {
            // 1. Létrehozunk egy rendelést egyedi mérettel
            await UserLogin();
            int randomMeret = new Random().Next(38, 47);

            var createBody = JsonSerializer.Serialize(new
            {
                mennyiseg = 1,
                fizetes = "kártyával",
                meret = randomMeret,
                cipoId = 1
            });

            var createRes = await ApiClient.Client.PostAsync(BASE_URL, new StringContent(createBody, Encoding.UTF8, "application/json"));
            var responseString = await createRes.Content.ReadAsStringAsync();
            Assert.IsTrue(createRes.IsSuccessStatusCode, $"Hiba a rendelés létrehozásakor! A backend válasza: {responseString}");
            using var doc = JsonDocument.Parse(responseString);
            int createdId = doc.RootElement.GetProperty("id").GetInt32();

            // 2. Admin belépés és módosítás
            ApiClient.ClearToken();
            await admin.LoginAsync("admin@gmail.com", "admin123");

            bool result = await control.UpdateAllapotAsync(createdId, "kiszállítva");
            Assert.IsTrue(result);
        }

        [Test]
        public async Task DeleteRendeles_ExistingId_ShouldReturnTrue()
        {
            // 1. Létrehozunk egy rendelést törléshez
            await UserLogin();
            int randomMeret = new Random().Next(38, 47);

            var createBody = JsonSerializer.Serialize(new
            {
                mennyiseg = 1,
                fizetes = "kártyával",
                meret = randomMeret,
                cipoId = 1
            });

            var createRes = await ApiClient.Client.PostAsync(BASE_URL, new StringContent(createBody, Encoding.UTF8, "application/json"));
            var responseString = await createRes.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);
            int createdId = doc.RootElement.GetProperty("id").GetInt32();

            // 2. Admin belépés és törlés
            ApiClient.ClearToken();
            await admin.LoginAsync("admin@gmail.com", "admin123");

            bool result = await control.DeleteRendelesAsync(createdId);
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateAllapotAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.UpdateAllapotAsync(-1, "teszt");
            Assert.IsFalse(result);
        }

        [Test]
        public async Task DeleteRendelesAsync_InvalidId_ShouldReturnFalse()
        {
            bool result = await control.DeleteRendelesAsync(-5);
            Assert.IsFalse(result);
        }

        [Test]
        public async Task GetRendelesekFilteredAsync_FilterByAllapot_ShouldReturnList()
        {
            var filter = new RendelesFilter { Allapot = "szállítás alatt" };
            var result = await control.GetRendelesekFilteredAsync(filter);
            Assert.IsNotNull(result);
        }
    }
}