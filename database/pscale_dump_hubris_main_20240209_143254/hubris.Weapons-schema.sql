CREATE TABLE `Weapons` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uses` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'str',
  `bonus` int DEFAULT NULL,
  `martial` tinyint(1) NOT NULL,
  `heavy` tinyint(1) NOT NULL,
  `equipped` tinyint(1) NOT NULL DEFAULT '0',
  `damage_typesId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Weapons_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
