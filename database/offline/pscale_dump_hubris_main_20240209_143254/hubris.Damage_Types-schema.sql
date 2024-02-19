CREATE TABLE `Damage_Types` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `damage_class` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Damage_Types_id_key` (`id`),
  UNIQUE KEY `Damage_Types_tagsId_key` (`tagsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
