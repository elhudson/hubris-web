CREATE TABLE `Tag_Features` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticks` int DEFAULT NULL,
  `tagsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tier` int NOT NULL,
  `xp` int NOT NULL,
  `charactersId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_Features_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
