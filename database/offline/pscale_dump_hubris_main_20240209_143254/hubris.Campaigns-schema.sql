CREATE TABLE `Campaigns` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Untitled Campaign',
  `description` mediumtext COLLATE utf8mb4_unicode_ci,
  `dmId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessionCount` int NOT NULL DEFAULT '0',
  `creatorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Campaigns_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
