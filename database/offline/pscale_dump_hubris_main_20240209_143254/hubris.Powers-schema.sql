CREATE TABLE `Powers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creatorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flavortext` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Powers_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
