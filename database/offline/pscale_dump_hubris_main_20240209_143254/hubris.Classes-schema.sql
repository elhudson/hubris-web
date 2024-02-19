CREATE TABLE `Classes` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `weaponry` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hit_DiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `armory` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'None',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Classes_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
