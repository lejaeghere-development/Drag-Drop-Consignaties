-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 22, 2024 at 08:32 AM
-- Server version: 10.6.17-MariaDB-cll-lve
-- PHP Version: 8.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apex_exp`
--

-- --------------------------------------------------------

--
-- Table structure for table `deliveryves_count`
--

CREATE TABLE `deliveryves_count` (
  `id` int(11) NOT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `score` int(10) NOT NULL DEFAULT 0,
  `password` varchar(50) DEFAULT NULL,
  `combination` varchar(3000) DEFAULT NULL,
  `tempCode` varchar(50) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `vat` varchar(200) DEFAULT NULL,
  `rack1Visible` int(11) NOT NULL DEFAULT 0,
  `comments` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `deliveryves_count`
--

INSERT INTO `deliveryves_count` (`id`, `uid`, `created_date`, `username`, `email`, `mobile`, `score`, `password`, `combination`, `tempCode`, `address`, `vat`, `rack1Visible`, `comments`) VALUES
(12, '97406db7-8db9-4e73-a979-e2534725a17e', '2024-05-04 16:48:38', 'saiful haque', 'saifulkanneth@gmail.com', '1234567890', 480, '81dc9bdb52d04dc20036dbd8313ed055', '{&quot;rack1_left_1&quot;:null,&quot;rack1_right_1&quot;:null,&quot;rack1_left_2&quot;:null,&quot;rack1_right_2&quot;:null,&quot;rack1_left_3&quot;:null,&quot;rack1_right_3&quot;:null,&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:null,&quot;rack2_right_1&quot;:null,&quot;rack2_left_2&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_right_2&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_left_3&quot;:null,&quot;rack2_right_3&quot;:null,&quot;rack2_left_4&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;],&quot;rack2_right_4&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;]}', '79523', '66', '12345AMD', 1, 'ds'),
(18, 'f98e8fac-eb07-4d6d-99e4-f33319fca443', '2024-05-04 22:41:58', 'user2', 'user@gmail.com', '1234444', 480, '81dc9bdb52d04dc20036dbd8313ed055', '{&quot;rack1_left_1&quot;:null,&quot;rack1_right_1&quot;:null,&quot;rack1_left_2&quot;:null,&quot;rack1_right_2&quot;:null,&quot;rack1_left_3&quot;:null,&quot;rack1_right_3&quot;:null,&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;ALMDUDLER_group&quot;,&quot;ALMDUDLER_group&quot;],&quot;rack2_right_1&quot;:[&quot;ALMDUDLER_group&quot;,&quot;ALMDUDLER_group&quot;],&quot;rack2_left_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_right_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_left_3&quot;:null,&quot;rack2_right_3&quot;:null,&quot;rack2_left_4&quot;:null,&quot;rack2_right_4&quot;:null}', NULL, '1014/D, Sree sai nilaya, eswara', 'AMD3erd ADF', 1, NULL),
(19, '4f5a338e-1c58-4bf2-af08-357b8ba3d9db', '2024-05-06 09:18:14', 'Maxim Lejaeghere', 'mlejaeghere@gmail.com', '0485002716', 1680, '21232f297a57a5a743894a0e4a801fc3', '{&quot;rack1_left_1&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_right_1&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_left_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_right_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_left_3&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_right_3&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_right_1&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_left_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_right_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_left_3&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_right_3&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_left_4&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_right_4&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;]}', '12672', 'Kasteelstraat 52', 'BE0788826170', 1, 'qqqq'),
(20, '63e1204e-a0dd-4d26-bf2f-07b251cbe7cc', '2024-05-06 10:04:58', 'Maxim Lejaeghere 2', 'maxim@fit-it.be', '0485002716', 0, '21232f297a57a5a743894a0e4a801fc3', NULL, '98601', NULL, NULL, 1, NULL),
(21, '7aa4a4de-60d7-409a-994f-9bd0d78422b7', '2024-05-07 12:14:13', 'Yves Lejaeghere', 'yves@deliveryves.be', '0495527575', 1680, '21232f297a57a5a743894a0e4a801fc3', '{&quot;rack1_left_1&quot;:[&quot;COCA_COLA_SMALL_group&quot;,&quot;COCA_COLA_SMALL_group&quot;],&quot;rack1_right_1&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_left_2&quot;:[&quot;BRUGSE_ZOT_BLOND_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack1_right_2&quot;:[&quot;BRUGSE_ZOT_BLOND_group&quot;,&quot;CHIMAY_BLAUW_group&quot;],&quot;rack1_left_3&quot;:[&quot;LA_CHOUFFE_group&quot;,&quot;LA_CHOUFFE_group&quot;],&quot;rack1_right_3&quot;:[&quot;LA_CHOUFFE_group&quot;,&quot;LA_CHOUFFE_group&quot;],&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_right_1&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_left_2&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_right_2&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_left_3&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_right_3&quot;:[&quot;LOOZA_ACE_SMALL_group&quot;,&quot;LOOZA_ACE_SMALL_group&quot;],&quot;rack2_left_4&quot;:[&quot;COCA_COLA_SMALL_group&quot;,&quot;COCA_COLA_SMALL_group&quot;],&quot;rack2_right_4&quot;:[&quot;COCA_COLA_SMALL_group&quot;,&quot;COCA_COLA_SMALL_group&quot;]}', NULL, 'Lejaeghere Development', 'BE0788826170', 1, NULL),
(22, '15cd2698-4c27-4cb6-b67e-bb149c431225', '2024-05-13 07:18:29', 'Maxim Lejaeghere', 'katharina.titze22@gmail.com', '0485002716', 0, '21232f297a57a5a743894a0e4a801fc3', NULL, NULL, NULL, NULL, 1, NULL),
(23, '92bf052e-5afa-43ca-ae0d-9a3c11c85bc1', '2024-05-16 12:21:48', 'Maxim Lejaeghere', 'hello@deliveryves.be', '0485002716', 1560, '21232f297a57a5a743894a0e4a801fc3', '{&quot;rack1_left_1&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_right_1&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_left_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_right_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_left_3&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_right_3&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;COLA_ZERO_BIG_group&quot;],&quot;rack2_right_1&quot;:[&quot;COLA_ZERO_BIG_group&quot;],&quot;rack2_left_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_right_2&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_left_3&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_right_3&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_left_4&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;],&quot;rack2_right_4&quot;:[&quot;APPLETISER_group&quot;,&quot;APPLETISER_group&quot;]}', NULL, 'Lejaeghere Development', 'fsdfs', 1, NULL),
(24, '93de9aff-a42d-4b0d-bee5-87ad453fba75', '2024-05-19 08:20:48', NULL, NULL, NULL, 0, NULL, '{&quot;rack1_left_1&quot;:null,&quot;rack1_right_1&quot;:null,&quot;rack1_left_2&quot;:null,&quot;rack1_right_2&quot;:null,&quot;rack1_left_3&quot;:null,&quot;rack1_right_3&quot;:null,&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_right_1&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_left_2&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;],&quot;rack2_right_2&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;],&quot;rack2_left_3&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack2_right_3&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack2_left_4&quot;:[&quot;CRISTALINE_PLAT_group&quot;],&quot;rack2_right_4&quot;:[&quot;EVIAN_group&quot;]}', NULL, '[object HTMLInputElement]', '[object HTMLInputElement]', 1, 'comments'),
(25, 'e4237134-59a9-45bb-84fd-7f1581a27d37', '2024-05-19 08:24:48', NULL, NULL, NULL, 840, NULL, '{&quot;rack1_left_1&quot;:null,&quot;rack1_right_1&quot;:null,&quot;rack1_left_2&quot;:null,&quot;rack1_right_2&quot;:null,&quot;rack1_left_3&quot;:null,&quot;rack1_right_3&quot;:null,&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_right_1&quot;:[&quot;AQUARIUS_ORANGE_33_group&quot;,&quot;AQUARIUS_ORANGE_33_group&quot;],&quot;rack2_left_2&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;],&quot;rack2_right_2&quot;:[&quot;AQUARIUS_ORANGE_50_group&quot;,&quot;AQUARIUS_ORANGE_50_group&quot;],&quot;rack2_left_3&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack2_right_3&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack2_left_4&quot;:[&quot;CRISTALINE_PLAT_group&quot;],&quot;rack2_right_4&quot;:[&quot;EVIAN_group&quot;]}', NULL, 'address', 'vat', 1, 'comments'),
(26, '68e51d29-5ad5-4cae-8b3a-fcea9864f284', '2024-05-21 08:12:24', 'Pieter Van Mullem', 'pieter@deliveryves.be', '0485002716', 1680, '21232f297a57a5a743894a0e4a801fc3', '{&quot;rack1_left_1&quot;:[&quot;CHIMAY_BLAUW_group&quot;,&quot;CHIMAY_BLAUW_group&quot;],&quot;rack1_right_1&quot;:[&quot;CHIMAY_BLAUW_group&quot;,&quot;CHIMAY_BLAUW_group&quot;],&quot;rack1_left_2&quot;:[&quot;BRU_BRUIS_SMALL_25_group&quot;,&quot;BRU_BRUIS_SMALL_25_group&quot;],&quot;rack1_right_2&quot;:[&quot;BRU_BRUIS_SMALL_25_group&quot;,&quot;BRU_BRUIS_SMALL_25_group&quot;],&quot;rack1_left_3&quot;:[&quot;BRU_BRUIS_SMALL_25_group&quot;,&quot;BRU_BRUIS_SMALL_25_group&quot;],&quot;rack1_right_3&quot;:[&quot;BRU_BRUIS_SMALL_25_group&quot;,&quot;BRU_BRUIS_SMALL_25_group&quot;],&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_right_1&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_left_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_right_2&quot;:[&quot;APPELAERE_group&quot;,&quot;APPELAERE_group&quot;],&quot;rack2_left_3&quot;:[&quot;ALMDUDLER_group&quot;,&quot;ALMDUDLER_group&quot;],&quot;rack2_right_3&quot;:[&quot;ALMDUDLER_group&quot;,&quot;ALMDUDLER_group&quot;],&quot;rack2_left_4&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;],&quot;rack2_right_4&quot;:[&quot;BOON_OUDE_GEUZE_group&quot;,&quot;BOON_OUDE_GEUZE_group&quot;]}', NULL, NULL, NULL, 1, NULL),
(27, 'dd244cd1-7bb3-4588-885a-5016b414082c', '2024-05-21 12:40:07', 'yves lejaeghere', 'yves.lejaeghere@icloud.com', '0485002716', 1680, '21232f297a57a5a743894a0e4a801fc3', '{&quot;rack1_left_1&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_right_1&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_left_2&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_right_2&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_left_3&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_right_3&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack1_left_4&quot;:null,&quot;rack1_right_4&quot;:null,&quot;rack2_left_1&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_right_1&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_left_2&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_right_2&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_left_3&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_right_3&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_left_4&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;],&quot;rack2_right_4&quot;:[&quot;CANADA_DRY_group&quot;,&quot;CANADA_DRY_group&quot;]}', NULL, 'Kasteelstraat 52', 'BE0788826170', 1, 'aaaa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deliveryves_count`
--
ALTER TABLE `deliveryves_count`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deliveryves_count`
--
ALTER TABLE `deliveryves_count`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
