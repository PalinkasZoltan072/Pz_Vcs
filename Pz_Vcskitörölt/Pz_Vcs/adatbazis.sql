-- Cipok tabla
CREATE TABLE cipok (
    id INT PRIMARY KEY,
    marka VARCHAR(50) NOT NULL,
    meret DECIMAL(4,1) NOT NULL,
    ar DECIMAL(10,2) NOT NULL
);

-- Felhasznalok tabla
CREATE TABLE felhasznalok (
    felhasznalonev VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    jelszo_hash VARCHAR(255) NOT NULL
);

-- Rendelesek tabla
CREATE TABLE rendelesek (
    id CHAR(1) PRIMARY KEY,
    felhasznalonev VARCHAR(50) NOT NULL,
    cipo_id INT NOT NULL,
    mennyiseg INT NOT NULL,
    osszeg DECIMAL(10,2) NOT NULL,
    telepules VARCHAR(50) NOT NULL,
    utca VARCHAR(100) NOT NULL,
    iranyitoszam VARCHAR(10) NOT NULL,
    kartyatulajdonos_neve VARCHAR(100) NOT NULL,
    kartyaszam VARCHAR(20) NOT NULL,
    cvc VARCHAR(5) NOT NULL,
    rendelesi_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (felhasznalonev) REFERENCES felhasznalok(felhasznalonev),
    FOREIGN KEY (cipo_id) REFERENCES cipok(id)
);

-- Kosar tabla
CREATE TABLE kosar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalonev VARCHAR(50) NOT NULL,
    cipo_id INT NOT NULL,
    mennyiseg INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (felhasznalonev) REFERENCES felhasznalok(felhasznalonev),
    FOREIGN KEY (cipo_id) REFERENCES cipok(id)
);

-- Cipok beszurasa
INSERT INTO cipok (id, marka, meret, ar) VALUES
(1, 'Nike', 42.5, 39999.0),
(2, 'Adidas', 40, 34999.0),
(3, 'Puma', 41, 29999.0),
(4, 'Reebok', 43, 27999.0),
(5, 'New Balance', 42, 31999.0),
(6, 'Converse', 39, 19999.0),
(7, 'Vans', 41.5, 20999.0),
(8, 'Under Armour', 44, 35999.0),
(9, 'Asics', 42.5, 32999.0),
(10, 'Skechers', 40.5, 23999.0),
(11, 'Fila', 43.5, 28999.0),
(12, 'Brooks', 41, 34999.0),
(13, 'Mizuno', 42, 36999.0);

-- Felhasznalok beszurasa
INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash) VALUES
('johndoe', 'john@example.com', 'hashedpassword123'),
('janedoe', 'jane@example.com', 'hashedpassword456'),
('peter89', 'peter89@example.com', 'hashedpassword789'),
('anna_s', 'anna.s@example.com', 'hashedpassword101'),
('tomi77', 'tomi77@example.com', 'hashedpassword102'),
('zsuzsi22', 'zsuzsi22@example.com', 'hashedpassword103'),
('balazs_b', 'balazs_b@example.com', 'hashedpassword104'),
('krisztina_k', 'krisztina_k@example.com', 'hashedpassword105'),
('marton_m', 'marton_m@example.com', 'hashedpassword106'),
('lilla_l', 'lilla_l@example.com', 'hashedpassword107'),
('adam_a', 'adam_a@example.com', 'hashedpassword108'),
('eva_e', 'eva_e@example.com', 'hashedpassword109'),
('gabor_g', 'gabor_g@example.com', 'hashedpassword110');

-- Rendelesek beszurasa
INSERT INTO rendelesek (id, felhasznalonev, cipo_id, mennyiseg, osszeg, telepules, utca, iranyitoszam, kartyatulajdonos_neve, kartyaszam, cvc, rendelesi_status) VALUES
('A', 'johndoe', 1, 1, 39999.0, 'Budapest', 'Fő utca 1', '1011', 'John Doe', '1111222233334444', '123', 'created'),
('B', 'janedoe', 2, 2, 69998.0, 'Debrecen', 'Kossuth utca 5', '4020', 'Jane Doe', '5555666677778888', '456', 'created'),
('C', 'peter89', 3, 1, 29999.0, 'Szeged', 'Petőfi utca 12', '6720', 'Peter Kovács', '1234432112344321', '789', 'created'),
('D', 'anna_s', 4, 2, 55998.0, 'Pécs', 'Jókai tér 3', '7621', 'Anna Szabó', '9876543210123456', '321', 'created'),
('E', 'tomi77', 5, 1, 31999.0, 'Győr', 'Kazinczy utca 6', '9021', 'Tomi Nagy', '5555888877776666', '654', 'created'),
('F', 'zsuzsi22', 6, 3, 59997.0, 'Sopron', 'Várkerület 1', '9400', 'Zsuzsi Farkas', '1111222233334444', '111', 'created'),
('G', 'balazs_b', 7, 1, 20999.0, 'Miskolc', 'Szinva utca 2', '3525', 'Balázs B.', '2222333344445555', '222', 'created'),
('H', 'krisztina_k', 8, 2, 71998.0, 'Nyíregyháza', 'Kossuth utca 12', '4400', 'Krisztina Kiss', '3333444455556666', '333', 'created'),
('I', 'marton_m', 9, 1, 32999.0, 'Székesfehérvár', 'Fő utca 7', '8000', 'Márton M.', '4444555566667777', '444', 'created'),
('J', 'lilla_l', 10, 2, 47998.0, 'Kecskemét', 'Petőfi utca 9', '6000', 'Lilla L.', '5555666677778888', '555', 'created'),
('K', 'adam_a', 11, 1, 28999.0, 'Eger', 'Dobó tér 1', '3300', 'Ádám A.', '6666777788889999', '666', 'created'),
('L', 'eva_e', 12, 1, 34999.0, 'Szolnok', 'Kossuth tér 3', '5000', 'Éva E.', '7777888899990000', '777', 'created'),
('M', 'gabor_g', 13, 2, 73998.0, 'Veszprém', 'Jókai utca 5', '8200', 'Gábor G.', '8888999900001111', '888', 'created');

-- Kosar beszúrás példa
INSERT INTO kosar (felhasznalonev, cipo_id, mennyiseg) VALUES
('johndoe', 1, 2),
('janedoe', 3, 1),
('peter89', 5, 1);