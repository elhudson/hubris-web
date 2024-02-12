CREATE TABLE `Background_Features` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `backgroundsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticks` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Background_Features_id_key` (`id`),
  UNIQUE KEY `Background_Features_backgroundsId_key` (`backgroundsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
