CREATE TABLE `Skills` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilitiesId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examples` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Skills_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
