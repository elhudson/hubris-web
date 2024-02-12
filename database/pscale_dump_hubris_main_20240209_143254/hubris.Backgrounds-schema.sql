CREATE TABLE `Backgrounds` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `skillsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abilitiesId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `settingsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questions` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Backgrounds_id_key` (`id`),
  UNIQUE KEY `Backgrounds_skillsId_key` (`skillsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
