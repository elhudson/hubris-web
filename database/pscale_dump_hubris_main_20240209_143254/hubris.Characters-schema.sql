CREATE TABLE `Characters` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `biography` json NOT NULL,
  `xp_earned` int NOT NULL,
  `xp_spent` int NOT NULL,
  `str` int NOT NULL,
  `dex` int NOT NULL,
  `con` int NOT NULL,
  `wis` int NOT NULL,
  `int` int NOT NULL,
  `cha` int NOT NULL,
  `usersId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `portrait` mediumtext COLLATE utf8mb4_unicode_ci,
  `burn` int NOT NULL DEFAULT '0',
  `campaignId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Characters_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
